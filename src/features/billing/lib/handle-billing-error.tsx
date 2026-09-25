"use client";

import { toast } from "sonner";
import type { TRPCClientErrorLike } from "@trpc/client";

import {
  billingErrorMessage,
  isBillingErrorDetail,
  type BillingErrorDetail,
} from "./errors";

/**
 * Pulls the billing detail off a tRPC error, if it is one.
 *
 * The server attaches it via the `errorFormatter` in trpc/init; anything else
 * returns null and is handled as an ordinary error by the caller.
 */
export function billingDetailFrom(error: unknown): BillingErrorDetail | null {
  const data = (error as TRPCClientErrorLike<never>)?.data as
    | { billing?: unknown }
    | undefined;

  return isBillingErrorDetail(data?.billing) ? data.billing : null;
}

/** Same, for the voice-create route handler, which returns JSON not tRPC. */
export function billingDetailFromResponse(
  body: unknown,
): BillingErrorDetail | null {
  const billing = (body as { billing?: unknown })?.billing;
  return isBillingErrorDetail(billing) ? billing : null;
}

/**
 * Shows the right thing for a billing failure and returns whether it handled
 * the error. An outage deliberately gets no upgrade action — pushing someone
 * toward a purchase because our own dependency is down is the wrong move.
 */
export function toastBillingError(
  detail: BillingErrorDetail,
  onUpgrade?: () => void,
): void {
  const { title, description } = billingErrorMessage(detail);

  toast.error(title, {
    description,
    action:
      onUpgrade && detail.code !== "BILLING_UNAVAILABLE"
        ? { label: "View plans", onClick: onUpgrade }
        : undefined,
  });
}
