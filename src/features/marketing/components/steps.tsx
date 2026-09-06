import { STEPS } from "@/features/marketing/data/site";
import { SectionHeading } from "@/features/marketing/components/section-heading";

export function Steps() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading eyebrow="How it works"
          title="Script in, finished audio out"
          body="Three steps from a blank page to a file you can ship, whether that is a single ad read or a back catalogue of audiobooks."
        />

        <div className="relative mt-14 grid grid-cols-1 gap-3 md:grid-cols-3">
          {/* Connecting hairline, desktop only. */}
          <div
            aria-hidden="true"
            className="absolute top-[70px] right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-transparent via-mk-border-strong to-transparent md:block"
          />
          {STEPS.map((step) => (
            <div key={step.label}>
              <div className="relative h-full rounded-2xl border border-mk-border bg-mk-elevated/40 p-6">
                <span className="flex size-11 items-center justify-center rounded-full border border-mk-border bg-mk-bg font-mono text-[12px] text-mk-faint">
                  {step.label}
                </span>
                <h3 className="mt-5 text-[15px] font-medium tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-pretty text-mk-muted">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
