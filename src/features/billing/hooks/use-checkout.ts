import { useCallback } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

/**
 * Opens a Polar checkout for a specific product.
 *
 * The redirect leaves the app entirely, so failures have to surface here —
 * silently doing nothing on error reads to the user as a dead button.
 */
export function useCheckout() {
  const trpc = useTRPC();
  const mutation = useMutation(trpc.billing.createCheckout.mutationOptions({}));

  const checkout = useCallback(
    (productId: string) => {
      mutation.mutate(
        { productId },
        {
          onSuccess: (data) => {
            window.location.href = data.checkoutUrl;
          },
          onError: () => {
            toast.error("Could not start checkout. Please try again.");
          },
        },
      );
    },
    [mutation],
  );

  return { checkout, isPending: mutation.isPending };
}
