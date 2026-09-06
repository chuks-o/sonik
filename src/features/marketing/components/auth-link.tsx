interface AuthLinkProps extends React.ComponentProps<"a"> {
  href: string;
}

/**
 * Links out of the marketing site into the Clerk-rendered auth pages.
 *
 * These are plain anchors on purpose. Clerk's middleware stamps
 * `x-middleware-rewrite` onto the RSC response for /sign-in and /sign-up, and
 * the App Router silently discards the soft navigation — the click is
 * preventDefault-ed by <Link> and the route never changes, so the button
 * appears dead. A full page load is also the right semantics here: auth lives
 * outside the marketing shell and shares none of its layout.
 *
 * Centralised so the reasoning is stated once rather than at every call site.
 */
export function AuthLink({ href, children, ...props }: AuthLinkProps) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
