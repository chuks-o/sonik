import "server-only";

import { cache } from "react";
import * as Sentry from "@sentry/nextjs";
import { ResourceNotFound } from "@polar-sh/sdk/models/errors/resourcenotfound.js";
import { AlreadyActiveSubscriptionError } from "@polar-sh/sdk/models/errors/alreadyactivesubscriptionerror.js";
import type { CustomerState } from "@polar-sh/sdk/models/components/customerstate.js";

import { env } from "@/lib/env";
import { polar } from "@/lib/polar";
import { BillingError } from "@/features/billing/lib/errors";
import { PLANS, planSlugForProductId, type PlanSlug } from "../data/plans";

/**
 * What the org is allowed to do right now.
 *
 * Polar is the only store of record — there is no local mirror — so this is
 * read live and every caller goes through here rather than reaching for
 * `customers.getStateExternal` itself.
 */
export interface Entitlement {
  tier: PlanSlug | null;
  /** Polar product name, for display. Falls back to the slug. */
  planName: string;
  subscriptionId: string | null;
  /** Characters granted for the current cycle. */
  includedUnits: number;
  consumedUnits: number;
  /** Characters left. Never negative: every tier hard-stops at zero. */
  balance: number;
  /** When the allowance resets — one month from activation, per plan. */
  periodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}

/**
 * In-flight free-tier provisions, keyed by org.
 *
 * Two requests arriving together for a brand-new org would otherwise each see
 * "no subscription" and each create one. This collapses them within a single
 * server instance; across instances the `AlreadyActiveSubscriptionError`
 * catch below is the backstop.
 */
const provisioning = new Map<string, Promise<void>>();

function readTtsMeter(state: CustomerState) {
  // `activeMeters` holds both the TTS and voice-creation meters, so this has
  // to match on ID rather than taking the first entry.
  return state.activeMeters.find(
    (meter) => meter.meterId === env.POLAR_METER_TTS_ID,
  );
}

function activeSubscription(state: CustomerState) {
  // Trialing counts as active for entitlement purposes; Polar only lists
  // subscriptions that are active or trialing here.
  return state.activeSubscriptions[0] ?? null;
}

async function fetchState(orgId: string): Promise<CustomerState | null> {
  try {
    return await polar.customers.getStateExternal({ externalId: orgId });
  } catch (error) {
    // No Polar customer yet — expected for an org that has never generated.
    if (error instanceof ResourceNotFound) return null;
    throw error;
  }
}

/**
 * Grants the free tier to an org that has no subscription.
 *
 * Done lazily on first read rather than from a Clerk `organization.created`
 * webhook: it needs no webhook infrastructure, it self-heals if a grant was
 * ever missed, and it covers the orgs that already existed before billing.
 */
async function grantFreeTier(orgId: string): Promise<void> {
  const existing = provisioning.get(orgId);
  if (existing) return existing;

  const run = (async () => {
    try {
      await polar.subscriptions.create({
        productId: PLANS.free.productId,
        externalCustomerId: orgId,
      });
      Sentry.logger.info("Free tier granted", { orgId });
    } catch (error) {
      // Another instance won the race. Not an error: the org ends up with
      // exactly the subscription we wanted.
      if (error instanceof AlreadyActiveSubscriptionError) return;
      throw error;
    } finally {
      provisioning.delete(orgId);
    }
  })();

  provisioning.set(orgId, run);
  return run;
}

function toEntitlement(state: CustomerState): Entitlement {
  const subscription = activeSubscription(state);
  const meter = readTtsMeter(state);
  const tier = subscription ? planSlugForProductId(subscription.productId) : null;

  return {
    tier,
    planName: tier ? tier[0].toUpperCase() + tier.slice(1) : "No plan",
    subscriptionId: subscription?.id ?? null,
    includedUnits: meter?.creditedUnits ?? 0,
    consumedUnits: meter?.consumedUnits ?? 0,
    // Polar lets the balance go negative when a product has a metered overage
    // price. Every tier here hard-stops instead, so a negative balance is
    // clamped rather than shown to the user as "-2,300 left".
    balance: Math.max(0, meter?.balance ?? 0),
    periodEnd: subscription?.currentPeriodEnd ?? null,
    cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd ?? false,
  };
}

/**
 * Reads the org's entitlement, provisioning the free tier if it has none.
 *
 * `cache` dedupes this within a request — the generation mutation and
 * anything else on the same request share one Polar round trip.
 *
 * Throws `BillingError("BILLING_UNAVAILABLE")` when Polar cannot be reached.
 * Callers fail closed on that: blocking during an outage is the deliberate
 * choice, since the alternative is unmetered free generation.
 */
export const getEntitlement = cache(
  async (orgId: string): Promise<Entitlement> => {
    try {
      let state = await fetchState(orgId);

      if (!state || state.activeSubscriptions.length === 0) {
        await grantFreeTier(orgId);
        state = await fetchState(orgId);
      }

      if (!state) {
        throw new BillingError({ code: "BILLING_UNAVAILABLE" });
      }

      return toEntitlement(state);
    } catch (error) {
      if (error instanceof BillingError) throw error;

      Sentry.captureException(error, { tags: { scope: "billing.entitlement" } });
      throw new BillingError({ code: "BILLING_UNAVAILABLE" });
    }
  },
);

/**
 * Asserts the org can spend `units` characters, and returns the entitlement.
 *
 * Hard stop at zero on every tier, free and paid alike — there is no overage.
 *
 * This is a check, not a reservation: with no local ledger there is nothing to
 * decrement atomically, so two concurrent generations can both pass against
 * the same balance and overspend by up to one request each. Accepted
 * deliberately; the exposure is bounded by concurrency.
 */
export async function assertCanSpend(
  orgId: string,
  units: number,
): Promise<Entitlement> {
  const entitlement = await getEntitlement(orgId);

  if (entitlement.balance <= 0) {
    throw new BillingError({
      code: "QUOTA_EXHAUSTED",
      balance: entitlement.balance,
      required: units,
    });
  }

  if (entitlement.balance < units) {
    throw new BillingError({
      code: "REQUEST_EXCEEDS_BALANCE",
      balance: entitlement.balance,
      required: units,
    });
  }

  return entitlement;
}

/**
 * Asserts the org's plan includes voice cloning.
 *
 * Not a balance check: the voice-creation meter counts events but has no
 * credit benefit attached to any product, so cloning is gated on the tier
 * rather than on remaining units.
 */
export async function assertCanCloneVoice(
  orgId: string,
): Promise<Entitlement> {
  const entitlement = await getEntitlement(orgId);
  const plan = entitlement.tier ? PLANS[entitlement.tier] : null;

  if (!plan?.allowsVoiceCloning) {
    throw new BillingError({ code: "PLAN_UPGRADE_REQUIRED" });
  }

  return entitlement;
}
