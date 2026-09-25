"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { useCheckout } from "@/features/billing/hooks/use-checkout";

interface BillingReturnHandlerProps {
  /**
   * Resolved server-side from `?plan=<slug>`. A visitor who picked a tier
   * before signing up arrives here, and this is where that choice finally
   * turns into a checkout.
   */
  pendingProductId: string | null;
  /** Present when Polar has just redirected back from a completed checkout. */
  checkoutId: string | null;
}

/**
 * Handles both ends of the checkout round trip.
 *
 * Renders nothing. It exists because the tier a visitor picks on /pricing has
 * to survive sign-up and organization creation, and because Polar's redirect
 * otherwise drops the user back into the app with no acknowledgement that
 * anything happened.
 */
export function BillingReturnHandler({
  pendingProductId,
  checkoutId,
}: BillingReturnHandlerProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { checkout } = useCheckout();

  // Both effects are one-shot. Without this an entitlement refetch or a
  // re-render would re-open the checkout the user just completed.
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    if (!checkoutId && !pendingProductId) return;
    handled.current = true;

    if (checkoutId) {
      toast.success("You're subscribed", {
        description: "Your new character allowance is ready to use.",
      });
      // The balance the sidebar is showing predates the purchase.
      queryClient.invalidateQueries({
        queryKey: trpc.billing.getEntitlement.queryKey(),
      });
      router.replace("/app");
      return;
    }

    if (pendingProductId) {
      checkout(pendingProductId);
    }
  }, [checkoutId, pendingProductId, checkout, queryClient, router, trpc]);

  return null;
}
