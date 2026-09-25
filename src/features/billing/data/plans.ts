import "server-only";

import { env } from "@/lib/env";

/**
 * Tier definitions.
 *
 * Everything numeric — price, currency, billing interval, included character
 * allowance — comes from Polar at request time and is deliberately absent
 * here. This file holds only what Polar has no field for: marketing copy,
 * ordering, and which tier we badge as recommended.
 *
 * Server-only because the product IDs come from `env`. Client components
 * receive the product ID they need as a prop instead of importing this.
 */

export const PLAN_SLUGS = ["free", "starter", "creator", "pro"] as const;

export type PlanSlug = (typeof PLAN_SLUGS)[number];

export interface PlanContent {
  slug: PlanSlug;
  productId: string;
  /** Who the tier is for, in one line. */
  audience: string;
  /**
   * What the tier adds over the one below it. Cards after the first show
   * "Everything in <previous>, plus" above this list, so it stays a delta
   * rather than repeating the tiers beneath it.
   */
  includes: string[];
  featured: boolean;
  ctaLabel: string;
  /**
   * The free tier is granted server-side when an org is created, so its CTA
   * points at sign-up and never opens a Polar checkout.
   */
  requiresCheckout: boolean;
  /**
   * Voice cloning is a plan capability rather than a metered allowance: the
   * voice-creation meter counts events but carries no credit benefit, so
   * there is no balance to check against.
   */
  allowsVoiceCloning: boolean;
}

export const PLANS: Record<PlanSlug, PlanContent> = {
  free: {
    slug: "free",
    productId: env.POLAR_FREE_TIER_ID,
    audience: "For trying every voice before you commit",
    includes: ["The full voice library", "Generation history", "Standard queue"],
    featured: false,
    ctaLabel: "Start free",
    requiresCheckout: false,
    allowsVoiceCloning: false,
  },
  starter: {
    slug: "starter",
    productId: env.POLAR_STARTER_TIER_ID,
    audience: "For solo creators publishing every week",
    includes: [
      "Voice cloning from a single take",
      "Priority generation queue",
      "Commercial usage rights",
    ],
    featured: false,
    ctaLabel: "Choose Starter",
    requiresCheckout: true,
    allowsVoiceCloning: true,
  },
  creator: {
    slug: "creator",
    productId: env.POLAR_CREATOR_TIER_ID,
    audience: "For teams and studios shipping audio daily",
    includes: [
      "Unlimited cloned voices",
      "Shared team workspace and history",
      "API access",
    ],
    featured: true,
    ctaLabel: "Choose Creator",
    requiresCheckout: true,
    allowsVoiceCloning: true,
  },
  pro: {
    slug: "pro",
    productId: env.POLAR_PRO_TIER_ID,
    audience: "For products that generate speech at scale",
    includes: ["Dedicated throughput", "Priority support"],
    featured: false,
    ctaLabel: "Choose Pro",
    requiresCheckout: true,
    allowsVoiceCloning: true,
  },
};

/** Display order for the pricing grid, cheapest first. */
export const PLAN_ORDER: readonly PlanSlug[] = PLAN_SLUGS;

/**
 * The allowlist `billing.createCheckout` validates against. Without it a
 * client could pass any product ID in the Polar organization — including ones
 * priced for testing — and check out against it.
 */
export const CHECKOUT_PRODUCT_IDS: readonly string[] = PLAN_ORDER.filter(
  (slug) => PLANS[slug].requiresCheckout,
).map((slug) => PLANS[slug].productId);

const SLUG_BY_PRODUCT_ID = new Map<string, PlanSlug>(
  PLAN_ORDER.map((slug) => [PLANS[slug].productId, slug]),
);

export function planSlugForProductId(productId: string): PlanSlug | null {
  return SLUG_BY_PRODUCT_ID.get(productId) ?? null;
}

export function isPlanSlug(value: string): value is PlanSlug {
  return (PLAN_SLUGS as readonly string[]).includes(value);
}
