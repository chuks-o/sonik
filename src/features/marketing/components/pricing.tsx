import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { getPricingTiers, type PricingTier } from "@/lib/polar-products";
import { SectionHeading } from "@/features/marketing/components/section-heading";
import { Reveal } from "@/features/marketing/components/reveal";
import { CheckoutButton } from "@/features/billing/components/checkout-button";
import { AuthLink } from "@/features/marketing/components/auth-link";
import { BUTTON_PRIMARY, BUTTON_SECONDARY } from "@/features/marketing/lib/ui";

const SEGMENTS = 20;

function formatPrice(tier: PricingTier): string {
  if (tier.priceAmount === null) return "Custom";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: tier.priceCurrency.toUpperCase(),
    minimumFractionDigits: tier.priceAmount % 100 === 0 ? 0 : 2,
  }).format(tier.priceAmount / 100);
}

/**
 * Segments lit for an allowance, on a log scale from `floor` to `ceiling`.
 *
 * Logarithmic for the same reason a studio meter is: the allowances span two
 * orders of magnitude, and a linear scale would flatten the smaller plans
 * into slivers. The exact number sits beside the meter.
 */
function litSegments(units: number, floor: number, ceiling: number): number {
  if (units <= 0 || ceiling <= floor) return SEGMENTS;
  const ratio =
    (Math.log(units) - Math.log(floor)) / (Math.log(ceiling) - Math.log(floor));
  return Math.max(1, Math.round(SEGMENTS * ratio));
}

function TierCard({
  tier,
  previousName,
  floor,
  ceiling,
}: {
  tier: PricingTier;
  previousName: string | null;
  floor: number;
  ceiling: number;
}) {
  const units = tier.includedUnits ?? 0;
  const lit = litSegments(units, floor, ceiling);

  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-[20px] border bg-white p-7",
        tier.featured
          ? "mk-lift border-mk-border-strong"
          : "mk-float border-mk-border",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[19px] font-semibold tracking-tight text-mk-fg">
          {tier.name}
        </h3>
        {tier.featured && (
          <span className="rounded-full bg-mk-fill px-2.5 py-1 text-[12px] font-medium text-mk-fg">
            Recommended
          </span>
        )}
      </div>
      <p className="mt-1.5 text-[14.5px] leading-snug text-mk-muted lg:min-h-[2.6rem]">
        {tier.audience}
      </p>

      {/* The one number that separates the plans. */}
      <div className="mt-6 rounded-xl bg-mk-fill-faint p-3.5">
        <div aria-hidden="true" className="flex gap-[3px]">
          {Array.from({ length: SEGMENTS }, (_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                i < lit ? "bg-mk-accent" : "bg-mk-track",
              )}
            />
          ))}
        </div>
        <p className="mt-2.5 text-[14px] text-mk-fg">
          <span className="font-semibold tabular-nums">
            {new Intl.NumberFormat("en-US").format(units)}
          </span>{" "}
          <span className="text-mk-muted">characters a month</span>
        </p>
      </div>

      <div className="mt-6 flex-1">
        {previousName && (
          <p className="text-[13.5px] text-mk-faint">
            Everything in {previousName}, plus
          </p>
        )}
        <ul className={cn("space-y-3", previousName && "mt-3")}>
          {tier.includes.map((item) => (
            <li key={item} className="flex gap-2.5 text-[14.5px] text-mk-fg">
              <Check
                aria-hidden="true"
                className="mt-[3px] size-4 shrink-0 text-mk-muted"
                strokeWidth={2.25}
              />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Price and action sit at the foot of every card, so the three
          buttons share one line regardless of how long each list is. */}
      <div className="mt-8 border-t border-mk-border pt-6">
        <p className="flex items-baseline gap-1.5">
          <span className="text-[2rem] leading-none font-semibold tracking-[-0.03em] text-mk-fg">
            {formatPrice(tier)}
          </span>
          {tier.recurringInterval && (
            <span className="text-[14px] text-mk-faint">/ {tier.recurringInterval}</span>
          )}
        </p>
        <CheckoutButton
          productId={tier.productId}
          planSlug={tier.slug}
          label={tier.ctaLabel}
          requiresCheckout={tier.requiresCheckout}
          className={cn(BUTTON_PRIMARY, "mt-5 w-full cursor-pointer")}
        />
      </div>
    </div>
  );
}

/**
 * Paid plans. Prices and allowances come from Polar; copy comes from
 * features/billing/data/plans. The free allowance is not a card: every
 * workspace has it automatically, so it is stated beneath the plans rather
 * than offered as something to choose.
 */
export async function Pricing({ heading = true }: { heading?: boolean }) {
  const all = await getPricingTiers();
  const paid = all.filter((tier) => tier.requiresCheckout);
  const free = all.find((tier) => !tier.requiresCheckout);

  // The meter starts at the free allowance: the baseline every workspace
  // already has, and the thing each plan is measured against.
  const allowances = all.map((t) => t.includedUnits ?? 0).filter((n) => n > 0);
  const floor = allowances.length ? Math.min(...allowances) : 1;
  const ceiling = allowances.length ? Math.max(...allowances) : 1;
  const freeUnits = free?.includedUnits ?? floor;

  return (
    <section id="pricing" className="scroll-mt-24 pt-24 pb-12 sm:pt-32 sm:pb-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {heading && (
          <Reveal>
            <SectionHeading
              title="Choose a plan when you need more"
              body="Every plan includes every voice. What changes is how much you can generate each month, and whether you can clone your own."
            />
          </Reveal>
        )}

        <div
          className={cn(
            "mx-auto grid max-w-5xl gap-5 lg:grid-cols-3",
            heading && "mt-14",
          )}
        >
          {paid.map((tier, i) => (
            <Reveal key={tier.productId} delay={i * 90} className="h-full">
              <TierCard
                tier={tier}
                previousName={i > 0 ? paid[i - 1].name : null}
                floor={floor}
                ceiling={ceiling}
              />
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="mx-auto mt-8 flex max-w-5xl flex-col items-center justify-between gap-4 rounded-[20px] bg-mk-surface px-6 py-5 text-center sm:flex-row sm:text-left">
          <p className="text-[15px] text-mk-fg">
            <span className="font-semibold">Just exploring?</span>{" "}
            <span className="text-mk-muted">
              Every workspace gets{" "}
              {new Intl.NumberFormat("en-US").format(freeUnits)} characters a
              month free. No card required.
            </span>
          </p>
          <AuthLink href="/sign-up" className={cn(BUTTON_SECONDARY, "shrink-0")}>
            Start free
          </AuthLink>
        </Reveal>

        <p className="mt-6 text-center text-[13.5px] text-mk-faint">
          Generation pauses when your allowance runs out. There is no overage,
          so you never pay more than your plan price.
        </p>
      </div>
    </section>
  );
}
