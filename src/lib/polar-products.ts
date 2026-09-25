import "server-only";

import { cache } from "react";
import type { Product } from "@polar-sh/sdk/models/components/product.js";

import { env } from "./env";
import { polar } from "./polar";
import {
  PLANS,
  PLAN_ORDER,
  planSlugForProductId,
  type PlanSlug,
} from "@/features/billing/data/plans";

/**
 * A tier as the UI consumes it: the Polar product flattened against the local
 * copy overlay, with the price and benefit unions already resolved so no
 * component has to narrow an SDK type.
 */
export interface PricingTier {
  slug: PlanSlug;
  productId: string;
  name: string;
  description: string | null;
  /** Base price in minor units. `null` when the tier is priced on request. */
  priceAmount: number | null;
  priceCurrency: string;
  /** "month" | "year" | … — `null` for a one-time product. */
  recurringInterval: string | null;
  /** Characters included per cycle, read from the meter-credit benefit. */
  includedUnits: number | null;
  isFree: boolean;
  audience: string;
  /** What this tier adds over the one below it. */
  includes: string[];
  featured: boolean;
  ctaLabel: string;
  requiresCheckout: boolean;
}

type ProductPriceEntry = Product["prices"][number];

function isLive(price: ProductPriceEntry): boolean {
  return !("isArchived" in price && price.isArchived);
}

/**
 * Picks the headline price. A tier can carry both a flat subscription price
 * and a metered overage price on the same product, so they are resolved
 * separately rather than taking `prices[0]`.
 */
function resolvePrice(prices: Product["prices"]) {
  let priceAmount: number | null = null;
  let priceCurrency = "usd";
  let isCustom = false;

  for (const price of prices) {
    if (!isLive(price)) continue;

    if (price.amountType === "fixed") {
      priceAmount = price.priceAmount;
      priceCurrency = price.priceCurrency;
    } else if (price.amountType === "metered_unit") {
      // Deliberately ignored. Every tier hard-stops at zero balance, so no
      // overage is ever billed and advertising a per-unit rate would be a
      // promise the app does not keep. These prices should be removed from
      // the products in Polar.
      priceCurrency = price.priceCurrency;
    } else if (price.amountType === "custom") {
      isCustom = true;
      priceCurrency = price.priceCurrency;
    }
  }

  return {
    priceAmount: isCustom && priceAmount === null ? null : (priceAmount ?? 0),
    priceCurrency,
  };
}

/**
 * Included allowance comes from the meter-credit benefit attached to the
 * product, so changing a tier's character allowance is a Polar dashboard edit
 * rather than a deploy.
 *
 * Filtered to the TTS meter specifically. There are two meters in the
 * organization, and a credit benefit for either would otherwise be summed
 * into the character count shown on the pricing card.
 */
function resolveIncludedUnits(benefits: Product["benefits"]): number | null {
  let total: number | null = null;

  for (const benefit of benefits) {
    if (benefit.type !== "meter_credit") continue;
    if (benefit.properties.meterId !== env.POLAR_METER_TTS_ID) continue;
    total = (total ?? 0) + benefit.properties.units;
  }

  return total;
}

function toPricingTier(product: Product, slug: PlanSlug): PricingTier {
  const content = PLANS[slug];
  const { priceAmount, priceCurrency } = resolvePrice(product.prices);

  return {
    slug,
    productId: product.id,
    name: product.name,
    description: product.description,
    priceAmount,
    priceCurrency,
    recurringInterval: product.recurringInterval,
    includedUnits: resolveIncludedUnits(product.benefits),
    isFree: priceAmount === 0,
    audience: content.audience,
    includes: content.includes,
    featured: content.featured,
    ctaLabel: content.ctaLabel,
    requiresCheckout: content.requiresCheckout,
  };
}

/**
 * Polar is the source of truth for pricing. `cache` dedupes this within a
 * render; the pages that call it set `revalidate` so the result is reused
 * across requests rather than hitting Polar on every visit.
 */
export const getPricingTiers = cache(async (): Promise<PricingTier[]> => {
  const { result } = await polar.products.list({
    isArchived: false,
    limit: 100,
  });

  const byId = new Map(result.items.map((product) => [product.id, product]));
  const tiers: PricingTier[] = [];

  // Driven by PLAN_ORDER rather than Polar's ordering, so the grid reads
  // cheapest-first and an unrelated product added in Polar never appears here.
  for (const slug of PLAN_ORDER) {
    const product = byId.get(PLANS[slug].productId);
    if (!product) continue;
    tiers.push(toPricingTier(product, slug));
  }

  return tiers;
});

export { planSlugForProductId };
