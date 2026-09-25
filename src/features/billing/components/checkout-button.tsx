"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";
import { useCheckout } from "@/features/billing/hooks/use-checkout";
import { AuthLink } from "@/features/marketing/components/auth-link";

interface CheckoutButtonProps {
  productId: string;
  /** Carried through sign-up so the tier survives the auth detour. */
  planSlug: string;
  label: string;
  requiresCheckout: boolean;
  className?: string;
}

/**
 * The one interactive element on the pricing page.
 *
 * A visitor can be in five states by the time they click, and the right call
 * differs in each. In particular an org that already pays must *change* its
 * subscription rather than open a second checkout, which would leave it with
 * two active subscriptions and two charges.
 *
 * AuthLink rather than <Link> for the auth routes, for the reason documented
 * on that component.
 */
export function CheckoutButton({
  productId,
  planSlug,
  label,
  requiresCheckout,
  className,
}: CheckoutButtonProps) {
  const { isLoaded, isSignedIn, orgId } = useAuth();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { checkout, isPending: isCheckoutPending } = useCheckout();

  // Only asked for once the viewer is actually in an org; signed-out visitors
  // on the marketing page never issue this.
  const { data: entitlement } = useQuery({
    ...trpc.billing.getEntitlement.queryOptions(),
    enabled: Boolean(isLoaded && isSignedIn && orgId),
  });

  const changePlanMutation = useMutation(
    trpc.billing.changePlan.mutationOptions({}),
  );

  const onChangePlan = useCallback(() => {
    changePlanMutation.mutate(
      { productId },
      {
        onSuccess: (result) => {
          toast.success(
            result.appliedImmediately
              ? "Your plan has been upgraded"
              : "Your plan changes at the end of this billing period",
          );
          queryClient.invalidateQueries({
            queryKey: trpc.billing.getEntitlement.queryKey(),
          });
          queryClient.invalidateQueries({
            queryKey: trpc.billing.getOverview.queryKey(),
          });
        },
        onError: (error) =>
          toast.error(
            error.message === "ADMIN_REQUIRED"
              ? "Only organization admins can change the plan"
              : "Could not change your plan. Please try again.",
          ),
      },
    );
  }, [changePlanMutation, productId, queryClient, trpc]);

  // The free tier is granted when the org is created, so it never checks out.
  if (!requiresCheckout) {
    return (
      <AuthLink href="/sign-up" className={className}>
        {label}
      </AuthLink>
    );
  }

  // Render the signed-out affordance until Clerk resolves. Guessing the other
  // way would flash a checkout button at visitors who cannot use it.
  if (!isLoaded || !isSignedIn) {
    return (
      <AuthLink href={`/sign-up?plan=${planSlug}`} className={className}>
        {label}
      </AuthLink>
    );
  }

  if (!orgId) {
    return (
      <AuthLink href={`/org-selection?plan=${planSlug}`} className={className}>
        {label}
      </AuthLink>
    );
  }

  const isCurrentPlan = entitlement?.tier === planSlug;
  // A free org has a Polar subscription too, but no paid one — it still needs
  // a checkout rather than a plan change.
  const hasPaidPlan = Boolean(entitlement && entitlement.tier !== "free");

  if (isCurrentPlan) {
    return (
      <button
        type="button"
        disabled
        className={cn(className, "cursor-default opacity-60")}
      >
        Current plan
      </button>
    );
  }

  const isPending = isCheckoutPending || changePlanMutation.isPending;

  return (
    <button
      type="button"
      onClick={hasPaidPlan ? onChangePlan : () => checkout(productId)}
      disabled={isPending}
      className={cn(
        className,
        "inline-flex items-center justify-center gap-2 disabled:opacity-70",
      )}
    >
      {isPending ? (
        <>
          <Spinner className="size-3.5" />
          {hasPaidPlan ? "Switching…" : "Redirecting…"}
        </>
      ) : hasPaidPlan ? (
        `Switch to ${planSlug[0].toUpperCase()}${planSlug.slice(1)}`
      ) : (
        label
      )}
    </button>
  );
}
