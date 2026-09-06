import { cn } from "@/lib/utils";

interface PlatformSectionProps {
  id: string;
  label: string;
  title: string;
  body: string;
  points: { title: string; body: string }[];
  visual: React.ReactNode;
  /** Puts the visual on the right instead of the left. */
  flip?: boolean;
  footnote?: string;
}

/**
 * The layout each headline capability gets: copy on one side, a working-looking
 * mockup on the other, alternating direction down the page so six sections do
 * not read as one repeated block.
 */
export function PlatformSection({
  id,
  label,
  title,
  body,
  points,
  visual,
  flip,
  footnote,
}: PlatformSectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-20 border-t border-mk-border py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div
          className={cn(
            "grid min-w-0 items-center gap-10 lg:grid-cols-2 lg:gap-16",
            flip && "lg:[&>*:first-child]:order-2",
          )}
        >
          <div className="min-w-0">
            <p className="mk-eyebrow">{label}</p>

            <h2 className="mt-4 text-[1.75rem] leading-[1.08] font-semibold tracking-[-0.03em] text-balance sm:text-[2.25rem]">
              {title}
            </h2>

            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-pretty text-mk-muted">
              {body}
            </p>

            <dl className="mt-8 space-y-5 border-t border-mk-border pt-7">
              {points.map((point) => (
                <div key={point.title} className="grid gap-1">
                  <dt className="text-[14px] font-medium tracking-tight text-mk-fg">
                    {point.title}
                  </dt>
                  <dd className="max-w-md text-[13.5px] leading-relaxed text-pretty text-mk-muted">
                    {point.body}
                  </dd>
                </div>
              ))}
            </dl>

            {footnote && (
              <p className="mt-7 text-[12.5px] text-mk-faint">{footnote}</p>
            )}
          </div>

          <div className="min-w-0">
            <div className="mk-hairline relative overflow-hidden rounded-2xl border border-mk-border bg-mk-elevated/50 p-5 sm:p-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-32 -right-24 size-72 rounded-full opacity-60 blur-3xl"
                style={{ background: "var(--mk-glow)" }}
              />
              <div className="relative">{visual}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
