/**
 * Button treatments shared across the marketing page. Kept as class strings
 * rather than a component because they are applied to <a>, <AuthLink>,
 * <Link> and <button> alike.
 *
 * Corners match the product's buttons rather than going full pill, so the
 * page and the app feel like the same hand drew them.
 */

const BASE =
  "inline-flex h-11 items-center justify-center gap-2 rounded-[10px] px-5 text-[14.5px] font-medium transition-colors duration-200 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mk-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white " +
  "disabled:pointer-events-none disabled:opacity-60";

/** Clerk's button black, so "Start free" matches the button on the page it opens. */
export const BUTTON_PRIMARY = `${BASE} mk-press bg-mk-action text-white hover:bg-mk-action/88`;

export const BUTTON_SECONDARY = `${BASE} border border-mk-border bg-white text-mk-fg hover:border-mk-border-strong hover:bg-mk-fill-faint`;
