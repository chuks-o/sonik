import { SAFETY } from "@/features/marketing/data/site";
import { SectionHeading } from "@/features/marketing/components/section-heading";

/** Line-art marks. Abstract on purpose — they set tone without illustrating. */
const MARKS = [
  // Consent: two forms meeting at a single agreed point.
  <>
    <ellipse cx="46" cy="60" rx="20" ry="34" />
    <ellipse cx="86" cy="60" rx="20" ry="34" />
    <path d="M66 26v68" strokeDasharray="3 5" />
    <circle cx="66" cy="60" r="3.5" />
  </>,
  // Provenance: a signal traced back through its own history.
  <>
    {[0, 1, 2, 3, 4].map((i) => (
      <circle key={i} cx={58 + i * 7} cy="60" r={30 - i * 4} />
    ))}
    <path d="M22 60h96" strokeDasharray="3 5" />
  </>,
  // Accountability: a record that stays structured under inspection.
  <>
    <rect x="30" y="30" width="60" height="60" />
    <path d="M30 50h60M30 70h60M50 30v60M70 30v60" />
    <path d="M30 30l60 60M90 30l-60 60" strokeDasharray="3 5" />
  </>,
];

export function Safety() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading eyebrow="Responsibility"
          title="Safety, built in"
          body="Synthetic voice is only useful if people can trust what they are hearing. These are commitments we design against, not features bolted on afterwards."
        />

        <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-3">
          {SAFETY.map((pillar, i) => (
            <div key={pillar.title}>
              <div className="mk-hairline flex h-full flex-col overflow-hidden rounded-2xl border border-mk-border bg-mk-elevated/45 p-6">
                <svg
                  viewBox="0 0 132 120"
                  aria-hidden="true"
                  className="mx-auto h-32 w-full max-w-[180px] text-mk-faint"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.9"
                >
                  {MARKS[i]}
                </svg>
                <h3 className="mt-6 text-[14px] font-medium tracking-tight text-mk-fg">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-pretty text-mk-muted">
                  {pillar.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
