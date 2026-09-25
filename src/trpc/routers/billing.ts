import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { polar } from "@/lib/polar";
import { env } from "@/lib/env";
import {
  CHECKOUT_PRODUCT_IDS,
  PLANS,
  PLAN_ORDER,
  planSlugForProductId,
} from "@/features/billing/data/plans";
import { getEntitlement } from "@/features/billing/server/entitlement";
import { createTRPCRouter, orgProcedure, orgAdminProcedure } from "../init";

/** Orders shown in the billing history table. */
const ORDER_PAGE_SIZE = 10;

export const billingRouter = createTRPCRouter({
  /**
   * Everything the UI needs to show a quota meter and decide whether the
   * Generate button should offer an upgrade instead.
   */
  getEntitlement: orgProcedure.query(async ({ ctx }) => {
    const entitlement = await getEntitlement(ctx.orgId);

    return {
      tier: entitlement.tier,
      planName: entitlement.planName,
      includedUnits: entitlement.includedUnits,
      consumedUnits: entitlement.consumedUnits,
      balance: entitlement.balance,
      periodEnd: entitlement.periodEnd,
      cancelAtPeriodEnd: entitlement.cancelAtPeriodEnd,
      canCloneVoices: entitlement.tier
        ? PLANS[entitlement.tier].allowsVoiceCloning
        : false,
      // Billing mutations are admin-only, so the UI must not offer them to
      // members who would only get a FORBIDDEN back.
      isAdmin: ctx.orgRole === "org:admin",
    };
  }),

  /**
   * The billing page in one round trip: plan, every meter, and recent orders.
   *
   * Meters come from `customerMeters.list` rather than the customer state
   * because it embeds the meter itself — the labels are then Polar's names
   * rather than strings hardcoded here, which matters now there is more than
   * one meter.
   */
  getOverview: orgProcedure.query(async ({ ctx }) => {
    const entitlement = await getEntitlement(ctx.orgId);

    const [meters, orders] = await Promise.all([
      polar.customerMeters.list({
        externalCustomerId: ctx.orgId,
        limit: 20,
      }),
      polar.orders.list({
        externalCustomerId: ctx.orgId,
        limit: ORDER_PAGE_SIZE,
      }),
    ]);

    return {
      plan: {
        tier: entitlement.tier,
        planName: entitlement.planName,
        periodEnd: entitlement.periodEnd,
        cancelAtPeriodEnd: entitlement.cancelAtPeriodEnd,
        isAdmin: ctx.orgRole === "org:admin",
      },
      meters: meters.result.items.map((item) => ({
        id: item.id,
        name: item.meter.name,
        creditedUnits: item.creditedUnits,
        consumedUnits: item.consumedUnits,
        balance: Math.max(0, item.balance),
        isPrimary: item.meterId === env.POLAR_METER_TTS_ID,
      })),
      orders: orders.result.items.map((order) => ({
        id: order.id,
        createdAt: order.createdAt,
        status: order.status,
        paid: order.paid,
        totalAmount: order.totalAmount,
        currency: order.currency,
        invoiceNumber: order.invoiceNumber,
      })),
    };
  }),

  createCheckout: orgAdminProcedure
    .input(z.object({ productId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      // Never hand a client-supplied product ID to Polar unchecked: every
      // product in the organization would otherwise be purchasable, including
      // ones priced at zero for testing.
      if (!CHECKOUT_PRODUCT_IDS.includes(input.productId)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unknown product",
        });
      }

      const entitlement = await getEntitlement(ctx.orgId);

      // An org that already pays for a tier must change its subscription
      // rather than buy a second one. A checkout here would leave them with
      // two active subscriptions and two charges.
      if (
        entitlement.subscriptionId &&
        entitlement.tier &&
        PLANS[entitlement.tier].requiresCheckout
      ) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "ALREADY_SUBSCRIBED",
        });
      }

      const result = await polar.checkouts.create({
        products: [input.productId],
        // The Clerk org is the billing identity; Polar creates the customer on
        // first checkout if this external ID is new.
        externalCustomerId: ctx.orgId,
        // {CHECKOUT_ID} is a placeholder Polar substitutes on redirect — it
        // must reach them un-interpolated.
        successUrl: `${env.APP_URL}/app?checkout_id={CHECKOUT_ID}`,
        metadata: { orgId: ctx.orgId, userId: ctx.userId },
      });

      if (!result.url) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }

      return { checkoutUrl: result.url };
    }),

  /**
   * Moves an existing paid subscription to a different tier.
   *
   * Upgrades bill immediately; downgrades take effect at the end of the
   * period. That asymmetry is deliberate under a hard-stop quota: applying a
   * downgrade mid-cycle would cut the allowance below what has already been
   * consumed and zero out an org that had headroom a moment earlier.
   */
  changePlan: orgAdminProcedure
    .input(z.object({ productId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      if (!CHECKOUT_PRODUCT_IDS.includes(input.productId)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Unknown product" });
      }

      const entitlement = await getEntitlement(ctx.orgId);

      if (!entitlement.subscriptionId) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "NO_ACTIVE_SUBSCRIPTION",
        });
      }

      const targetSlug = planSlugForProductId(input.productId);

      if (!targetSlug) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Unknown product" });
      }

      if (targetSlug === entitlement.tier) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "ALREADY_ON_PLAN" });
      }

      const isUpgrade =
        PLAN_ORDER.indexOf(targetSlug) >
        PLAN_ORDER.indexOf(entitlement.tier ?? "free");

      await polar.subscriptions.update({
        id: entitlement.subscriptionId,
        subscriptionUpdate: {
          productId: input.productId,
          prorationBehavior: isUpgrade ? "invoice" : "next_period",
        },
      });

      return { tier: targetSlug, appliedImmediately: isUpgrade };
    }),

  createPortalSession: orgAdminProcedure.mutation(async ({ ctx }) => {
    const result = await polar.customerSessions.create({
      externalCustomerId: ctx.orgId,
    });

    if (!result.customerPortalUrl) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create customer portal session",
      });
    }

    return { portalUrl: result.customerPortalUrl };
  }),
});
