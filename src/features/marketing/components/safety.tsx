import { Fingerprint, Handshake, History, type LucideIcon } from "lucide-react";

import { SAFETY } from "@/features/marketing/data/site";
import { SectionHeading } from "@/features/marketing/components/section-heading";
import { Reveal } from "@/features/marketing/components/reveal";

const ICONS: Record<string, LucideIcon> = {
  Consent: Handshake,
  Provenance: Fingerprint,
  Accountability: History,
};

export function Safety() {
  return (
    <section className="px-3 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-[36px] bg-mk-surface px-5 py-20 sm:px-8 sm:py-24">
        <Reveal>
          <SectionHeading
            title="Built to be used responsibly"
            body="Voices belong to people. Sonic is designed so every voice has permission behind it, and every file can be traced back to the generation that made it."
          />
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-5xl gap-10 md:grid-cols-3 md:gap-8">
          {SAFETY.map((pillar, i) => {
            const Icon = ICONS[pillar.title] ?? Handshake;
            return (
              <Reveal key={pillar.title} delay={i * 80}>
                <span className="flex size-11 items-center justify-center rounded-xl border border-mk-border bg-white text-mk-fg">
                  <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 text-[18px] font-semibold tracking-tight text-mk-fg">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-pretty text-mk-muted">
                  {pillar.body}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
