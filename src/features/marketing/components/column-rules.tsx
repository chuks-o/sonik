/**
 * Two hairlines marking the edges of the content column, with corner ticks.
 * Purely architectural: it gives long scrolls a spine and makes the page read
 * as a laid-out document rather than a stack of centred blocks.
 */
export function ColumnRules() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 left-1/2 z-0 hidden w-full max-w-6xl -translate-x-1/2 lg:block"
    >
      <div className="relative h-full">
        <span className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-mk-border to-transparent" />
        <span className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-mk-border to-transparent" />
      </div>
    </div>
  );
}
