import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { PRICING } from "@/features/marketing/data/site";
import { SectionHeading } from "@/features/marketing/components/section-heading";

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading eyebrow="Pricing"
          title="Priced by what you ship"
          body="Start on the free tier with real voices and real controls. Move up only when the character count says you should."
        />

        <div className="mt-14 grid grid-cols-1 gap-3 lg:grid-cols-3">
          {PRICING.map((tier) => (
            <div key={tier.name}>
              <div
                className={cn(
                  "mk-hairline relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-colors duration-500 sm:p-7",
                  tier.featured
                    ? "border-mk-accent/45 bg-mk-elevated"
                    : "border-mk-border bg-mk-elevated/45 hover:border-mk-border-strong",
                )}
              >
                {tier.featured && (
                  <>
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-28 left-1/2 size-64 -translate-x-1/2 rounded-full bg-mk-accent/18 blur-3xl"
                    />
                    <span className="absolute top-6 right-6 rounded-full border border-mk-accent/40 bg-mk-accent/12 px-2.5 py-1 text-[11px] text-mk-accent-soft">
                      Most popular
                    </span>
                  </>
                )}

                <div className="relative">
                  <h3 className="text-[15px] font-medium tracking-tight">
                    {tier.name}
                  </h3>
                  <p className="mt-1 text-[13px] text-mk-muted">{tier.blurb}</p>

                  <p className="mt-6 flex items-baseline gap-1.5">
                    <span className="text-4xl font-semibold tracking-[-0.03em]">
                      {tier.price}
                    </span>
                    <span className="text-[13px] text-mk-faint">
                      {tier.cadence}
                    </span>
                  </p>

                  <a
                    href={tier.name === "Label" ? "mailto:hello@sonic.app" : "/sign-up"}
                    className={cn(
                      "mt-6 block rounded-xl px-4 py-3 text-center text-[14px] font-medium transition-transform duration-200 hover:scale-[1.02] active:scale-95",
                      tier.featured
                        ? "bg-gradient-to-br from-mk-accent-soft to-mk-accent-deep text-white"
                        : "border border-mk-border bg-mk-fill text-mk-fg hover:bg-mk-fill-strong",
                    )}
                  >
                    {tier.cta}
                  </a>

                  <ul className="mt-7 space-y-3 border-t border-mk-border pt-6">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-2.5 text-[13px] text-mk-muted">
                        <Check className="mt-0.5 size-4 shrink-0 text-mk-faint" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
