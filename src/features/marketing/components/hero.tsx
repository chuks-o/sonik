
import { USE_CASES } from "@/features/marketing/data/site";
import { DotField } from "@/features/marketing/components/dot-field";
import { DemoStudio } from "@/features/marketing/components/demo-studio";
import { CapabilityRail } from "@/features/marketing/components/capability-rail";
import { AuthLink } from "@/features/marketing/components/auth-link";
import { Reveal } from "@/features/marketing/components/reveal";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-14 sm:pt-28 sm:pb-20">
      {/* Sits high enough to ripple behind the headline, not just the studio. */}
      <DotField className="top-[16%] bottom-auto h-[74%]" />

      <div
        aria-hidden="true"
        className="mk-drift pointer-events-none absolute -top-56 left-1/2 h-[540px] w-[820px] -translate-x-1/2 rounded-full opacity-70 blur-[110px]"
        style={{ background: "var(--mk-bloom)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-mk-bg"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal y={12} className="mx-auto max-w-3xl text-center">
          {/* Marker: names the category before the headline makes its claim,
              and starts the eyebrow sequence the rest of the page follows. */}
          <p className="mk-eyebrow">Text to speech, cloning and dubbing</p>

          <h1 className="mt-5 text-[2.35rem] leading-[1.05] font-semibold tracking-[-0.035em] text-balance text-mk-fg sm:text-[3.25rem] sm:leading-[1.02] lg:text-[4rem]">
            Text that sounds like someone meant it.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-[15.5px] leading-relaxed text-pretty text-mk-muted sm:text-[17px]">
            Most tools hand you a voice and a play button. Sonic gives you the
            sampling controls behind the model, so you direct the read instead
            of regenerating and hoping.
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:mt-9 sm:flex-row sm:items-center sm:justify-center">
            <AuthLink
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-mk-fg px-5 py-3.5 text-[14px] font-medium text-mk-bg transition-transform duration-200 hover:scale-[1.02] active:scale-95"
            >
              Start generating free
            </AuthLink>
            <a
              href="#demo"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-mk-border bg-mk-fill px-5 py-3.5 text-[14px] text-mk-fg backdrop-blur-sm transition-colors duration-200 hover:border-mk-border-strong hover:bg-mk-fill-strong"
            >
              Hear it first
            </a>
          </div>

          <p className="mt-5 text-[12px] text-mk-faint">
            10,000 characters free. No card needed.
          </p>
        </Reveal>

        <Reveal delay={12} y={12} className="mt-12 sm:mt-16">
          <div id="demo" className="scroll-mt-24">
            <DemoStudio />
          </div>
        </Reveal>

        <Reveal delay={12} y={12} className="mt-5">
          <CapabilityRail />
        </Reveal>

        {/* Audience reads as a quiet closing note under the demo. */}
        <Reveal y={12} delay={12} className="mt-12 border-t border-mk-border pt-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-[13px] text-mk-faint">
              For everyone who would rather talk than type
            </p>
            <ul className="flex flex-wrap justify-center gap-2">
              {USE_CASES.slice(0, 6).map((label) => (
                <li
                  key={label}
                  className="rounded-full border border-mk-border px-3 py-1.5 text-[12.5px] text-mk-muted"
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
