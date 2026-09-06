"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { FAQS } from "@/features/marketing/data/site";
import { SectionHeading } from "@/features/marketing/components/section-heading";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading eyebrow="Questions"
          title="Before you sign up"
          body="The things people ask us most often, answered without the marketing gloss."
        />

        <div className="mt-14 max-w-3xl divide-y divide-mk-border border-y border-mk-border">
          {FAQS.map((faq, i) => {
            const expanded = open === i;
            return (
              <div key={faq.q}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : i)}
                    aria-expanded={expanded}
                    aria-controls={`faq-panel-${i}`}
                    className="flex w-full items-start justify-between gap-6 py-5 text-left transition-colors hover:text-mk-fg focus-visible:outline-none"
                  >
                    <span
                      className={cn(
                        "text-[15px] font-medium tracking-tight transition-colors",
                        expanded ? "text-mk-fg" : "text-mk-muted",
                      )}
                    >
                      {faq.q}
                    </span>
                    <Plus
                      aria-hidden="true"
                      className={cn(
                        "mt-0.5 size-4 shrink-0 text-mk-faint transition-transform duration-400",
                        expanded && "rotate-45 text-mk-accent-soft",
                      )}
                    />
                  </button>
                </h3>
                {/* grid-rows trick animates to auto height without measuring. */}
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  className={cn(
                    "grid transition-all duration-400 ease-out",
                    expanded
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="pb-5 text-[14px] leading-relaxed text-pretty text-mk-muted">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
