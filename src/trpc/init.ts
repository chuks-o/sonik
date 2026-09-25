import * as Sentry from "@sentry/node";
import { auth } from '@clerk/nextjs/server';
import { initTRPC, TRPCError } from '@trpc/server';
import { cache } from 'react';
import superjson from "superjson";
import { BillingError } from "@/features/billing/lib/errors";
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return {};
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
  /**
   * Billing failures carry structured detail to the client.
   *
   * Without this the UI has only `error.message` to go on, which is how three
   * separate components ended up comparing it against the literal string
   * "SUBSCRIPTION_REQUIRED" — and why none of them could tell an exhausted
   * quota apart from a Polar outage.
   */
  errorFormatter({ shape, error }) {
    const cause = error.cause;

    if (cause instanceof BillingError) {
      return {
        ...shape,
        data: { ...shape.data, billing: cause.detail },
      };
    }

    return shape;
  },
});

const sentryMiddleware = t.middleware(
  Sentry.trpcMiddleware({
    attachRpcInput: true,
  }),
);

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure.use(sentryMiddleware);

// Authenticated procedure - calls auth() only when needed
export const authProcedure = baseProcedure.use(async ({ next }) => {
  const { userId } = await auth();

  if (!userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: { userId },
  });
});

// Organization procedure - requires userId and orgId
export const orgProcedure = baseProcedure.use(async ({ next }) => {
  const { userId, orgId, orgRole } = await auth();

  if (!userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (!orgId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Organization required",
    });
  }

  return next({ ctx: { userId, orgId, orgRole } });
});

/**
 * Organization procedure restricted to admins.
 *
 * Anything that spends money or changes what the org is billed belongs here.
 * `orgProcedure` only proves the caller is *in* an organization, which would
 * let any member upgrade, downgrade or cancel the workspace's plan.
 */
export const orgAdminProcedure = orgProcedure.use(async ({ ctx, next }) => {
  if (ctx.orgRole !== "org:admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "ADMIN_REQUIRED",
    });
  }

  return next({ ctx });
});