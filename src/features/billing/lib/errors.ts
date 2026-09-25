/**
 * Billing failures the UI has to tell apart.
 *
 * These travel to the client as structured data on the tRPC error (see the
 * `errorFormatter` in trpc/init), because the three call sites that used to
 * compare `error.message === "SUBSCRIPTION_REQUIRED"` could not distinguish
 * "you are out of characters" from "this one request is too long" from
 * "Polar is down" — and each needs a different thing said to the user.
 */
export const BILLING_ERROR_CODES = [
  /** Balance is zero or negative. Only an upgrade or a renewal fixes it. */
  "QUOTA_EXHAUSTED",
  /** Some balance left, but not enough for this text. Trimming also fixes it. */
  "REQUEST_EXCEEDS_BALANCE",
  /** The plan does not include this feature at all. Upgrading is the fix. */
  "PLAN_UPGRADE_REQUIRED",
  /** Polar could not be reached. Not the customer's fault; do not upsell. */
  "BILLING_UNAVAILABLE",
] as const;

export type BillingErrorCode = (typeof BILLING_ERROR_CODES)[number];

export interface BillingErrorDetail {
  code: BillingErrorCode;
  /** Characters remaining. Omitted when the balance could not be read. */
  balance?: number;
  /** Characters this request needed. */
  required?: number;
}

export class BillingError extends Error {
  readonly detail: BillingErrorDetail;

  constructor(detail: BillingErrorDetail) {
    super(detail.code);
    this.name = "BillingError";
    this.detail = detail;
  }
}

export function isBillingErrorDetail(
  value: unknown,
): value is BillingErrorDetail {
  if (typeof value !== "object" || value === null) return false;
  const code = (value as { code?: unknown }).code;
  return (
    typeof code === "string" &&
    (BILLING_ERROR_CODES as readonly string[]).includes(code)
  );
}

/** Copy for each failure, kept in one place so the three surfaces agree. */
export function billingErrorMessage(detail: BillingErrorDetail): {
  title: string;
  description?: string;
} {
  switch (detail.code) {
    case "QUOTA_EXHAUSTED":
      return {
        title: "You're out of characters",
        description: "Upgrade your plan or wait for your next billing period.",
      };
    case "REQUEST_EXCEEDS_BALANCE":
      return {
        title: "Not enough characters left",
        description:
          detail.balance !== undefined && detail.required !== undefined
            ? `This needs ${detail.required.toLocaleString()} but you have ${detail.balance.toLocaleString()} left. Shorten the text or upgrade.`
            : "Shorten the text or upgrade your plan.",
      };
    case "PLAN_UPGRADE_REQUIRED":
      return {
        title: "Not included on your plan",
        description: "Upgrade to unlock voice cloning.",
      };
    case "BILLING_UNAVAILABLE":
      return {
        title: "Billing is temporarily unavailable",
        description: "We couldn't check your balance. Please try again shortly.",
      };
  }
}
