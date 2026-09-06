import {
  History,
  SlidersHorizontal,
  Terminal,
  Users,
  type LucideIcon,
} from "lucide-react";

import { FEATURES } from "@/features/marketing/data/site";

const ICONS: Record<string, LucideIcon> = {
  SlidersHorizontal,
  History,
  Users,
  Terminal,
};

/**
 * A quiet band of platform properties between the two heavy sections. Kept
 * deliberately flat so it reads as connective tissue, not another feature grid.
 */
export function FeatureRow() {
  return (
    <section id="features" className="scroll-mt-20 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 border-y border-mk-border py-10 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => {
            const Icon = ICONS[feature.icon] ?? Terminal;
            return (
              <div key={feature.title}>
                <div className="flex h-full flex-col">
                  <Icon className="size-4 text-mk-faint" />
                  <h3 className="mt-4 text-[14px] font-medium tracking-tight text-mk-fg">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-pretty text-mk-muted">
                    {feature.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
