"use client";

import Link from "next/link";
import { useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";

const LOW_BALANCE_RATIO = 0.2;

/**
 * Exact, not compact. `notation: "compact"` rounds 29,753 to "30K", so a
 * generation of a few hundred characters left the meter visibly unchanged and
 * the counter looked broken.
 */
function formatUnits(units: number): string {
  return new Intl.NumberFormat("en-US").format(units);
}

function formatResetDate(periodEnd: Date | string | null): string | null {
  if (!periodEnd) return null;
  const date = periodEnd instanceof Date ? periodEnd : new Date(periodEnd);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function UsageContainer() {
  const trpc = useTRPC();
  const { data, isPending } = useQuery(
    trpc.billing.getEntitlement.queryOptions(),
  );

  const portalMutation = useMutation(
    trpc.billing.createPortalSession.mutationOptions({}),
  );

  const openPortal = useCallback(() => {
    portalMutation.mutate(undefined, {
      onSuccess: (result) => {
        window.open(result.portalUrl, "_blank");
      },
    });
  }, [portalMutation]);

  return (
    <div className="group-data-[collapsible=icon]:hidden bg-background border border-border rounded-lg p-3">
      {isPending || !data ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : (
        <UsageCard
          planName={data.planName}
          balance={data.balance}
          includedUnits={data.includedUnits}
          periodEnd={data.periodEnd}
          isFreePlan={data.tier === "free"}
          canManage={data.isAdmin}
          isPortalPending={portalMutation.isPending}
          onOpenPortal={openPortal}
        />
      )}
    </div>
  );
}

function UsageCard({
  planName,
  balance,
  includedUnits,
  periodEnd,
  isFreePlan,
  canManage,
  isPortalPending,
  onOpenPortal,
}: {
  planName: string;
  balance: number;
  includedUnits: number;
  periodEnd: Date | string | null;
  isFreePlan: boolean;
  canManage: boolean;
  isPortalPending: boolean;
  onOpenPortal: () => void;
}) {
  // Remaining rather than consumed: the number that decides whether the next
  // generation runs is the one worth showing.
  const ratio = includedUnits > 0 ? balance / includedUnits : 0;
  const isExhausted = balance <= 0;
  const isLow = !isExhausted && ratio <= LOW_BALANCE_RATIO;
  const resetDate = formatResetDate(periodEnd);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm font-semibold tracking-tight text-foreground">
            {planName}
          </p>
          <p
            className={cn(
              "text-xs tabular-nums",
              isExhausted
                ? "text-destructive"
                : isLow
                  ? "text-chart-5"
                  : "text-muted-foreground",
            )}
          >
            {formatUnits(balance)} / {formatUnits(includedUnits)}
          </p>
        </div>

        <Progress
          value={Math.min(100, Math.max(0, ratio * 100))}
          className="mt-2 h-1.5"
        />

        <p className="text-xs text-muted-foreground mt-1.5">
          {isExhausted
            ? resetDate
              ? `No characters left · resets ${resetDate}`
              : "No characters left"
            : resetDate
              ? `characters left · resets ${resetDate}`
              : "characters left"}
        </p>
      </div>

      {/* A free org has no subscription to manage, and an exhausted one needs
          a bigger plan rather than an invoice history — both go to pricing. */}
      {isFreePlan || isExhausted || !canManage ? (
        <Button asChild variant="outline" className="w-full text-xs" size="sm">
          <Link href="/pricing">
            {isExhausted ? "Get more characters" : "View plans"}
          </Link>
        </Button>
      ) : (
        <Button
          variant="outline"
          className="w-full text-xs"
          size="sm"
          disabled={isPortalPending}
          onClick={onOpenPortal}
        >
          {isPortalPending ? (
            <>
              <Spinner className="size-3" />
              Redirecting…
            </>
          ) : (
            "Manage subscription"
          )}
        </Button>
      )}
    </div>
  );
}
