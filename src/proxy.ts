import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

const isOrgSelectionRoute = createRouteMatcher(["/org-selection(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Return early *without* calling auth(). Resolving the session on a public
  // page makes Clerk attempt a token refresh it cannot complete there, which
  // ends in "Refreshing the session token resulted in an infinite redirect
  // loop" and leaves the marketing page unable to navigate anywhere.
  if (isPublicRoute(req)) return;

  const { userId, orgId } = await auth();

  // Returning nothing lets Clerk build the response itself, including the
  // handshake headers it needs to set the session cookie. Handing back a bare
  // NextResponse.next() drops them.
  if (!userId) {
    await auth.protect();
    return;
  }

  if (isOrgSelectionRoute(req)) return;

  if (!orgId) {
    return NextResponse.redirect(new URL("/org-selection", req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|mp3|m4a|wav|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Always run for Clerk-specific frontend API routes
    '/__clerk/(.*)',
  ],
}
