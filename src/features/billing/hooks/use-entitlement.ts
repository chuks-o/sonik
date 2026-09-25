"use client";

import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

/**
 * The org's remaining allowance, for UI that should stop a request before it
 * is made rather than explain a failure after it.
 */
export function useEntitlement() {
  const trpc = useTRPC();
  const { data, isPending } = useQuery(
    trpc.billing.getEntitlement.queryOptions(),
  );

  return {
    entitlement: data,
    isPending,
    balance: data?.balance ?? 0,
    /**
     * Until the query resolves this is `true`, so the Generate button stays
     * enabled. Guessing the other way would disable it on every page load.
     */
    canSpend: (units: number) => (data ? data.balance >= units : true),
  };
}
