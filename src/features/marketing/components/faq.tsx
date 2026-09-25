"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { FAQS } from "@/features/marketing/data/site";
import { SectionHeading } from "@/features/marketing/components/section-heading";
import { Reveal } from "@/features/marketing/components/reveal";

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="scroll-mt-24 pt-16 pb-24 sm:pt-20 sm:pb-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            title="Questions, answered"
            body="The things people ask most before they sign up."
          />
        </Reveal>

        <Reveal delay={100} className="mx-auto mt-12 max-w-2xl space-y-3">
          {FAQS.map((faq, i) => {
            const expanded = open === i;
            return (
              <div key={faq.q} className="rounded-2xl bg-mk-surface">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : i)}
                    aria-expanded={expanded}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-trigger-${i}`}
                    className="flex w-full cursor-pointer items-center justify-between gap-6 rounded-2xl px-6 py-5 text-left focus-visible:ring-2 focus-visible:ring-mk-accent focus-visible:outline-none"
                  >
                    <span className="text-[15.5px] font-medium tracking-tight text-mk-fg">
                      {faq.q}
                    </span>
                    <Plus
                      aria-hidden="true"
                      className={cn(
                        "size-[18px] shrink-0 text-mk-muted transition-transform duration-300",
                        expanded && "rotate-45",
                      )}
                    />
                  </button>
                </h3>
                {/* grid-rows animates to the content's height without measuring. */}
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out",
                    expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="px-6 pb-6 text-[15px] leading-relaxed text-pretty text-mk-muted">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
