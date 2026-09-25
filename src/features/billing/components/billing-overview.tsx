"use client";

import { useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertTriangle, ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTRPC } from "@/trpc/client";

function formatUnits(units: number): string {
  return new Intl.NumberFormat("en-US").format(units);
}

function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function formatDate(value: Date | string | null): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function BillingOverview() {
  const trpc = useTRPC();
  const { data, isPending } = useQuery(trpc.billing.getOverview.queryOptions());

  const portalMutation = useMutation(
    trpc.billing.createPortalSession.mutationOptions({}),
  );

  const openPortal = useCallback(() => {
    portalMutation.mutate(undefined, {
      onSuccess: (result) => window.open(result.portalUrl, "_blank"),
      onError: () => toast.error("Could not open the billing portal."),
    });
  }, [portalMutation]);

  if (isPending || !data) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {!data.plan.isAdmin && (
        <div className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/40 p-3">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Only organization admins can change the plan or open the billing
            portal.
          </p>
        </div>
      )}

      <PlanCard
        planName={data.plan.planName}
        periodEnd={data.plan.periodEnd}
        cancelAtPeriodEnd={data.plan.cancelAtPeriodEnd}
        isAdmin={data.plan.isAdmin}
        isPortalPending={portalMutation.isPending}
        onOpenPortal={openPortal}
      />

      <UsageCard meters={data.meters} />

      <HistoryCard orders={data.orders} />

      {/* Tier comparison lives on /pricing so there is one canonical grid.
          Members who cannot change the plan are not shown the upsell. */}
      {data.plan.isAdmin && (
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <p className="text-sm font-medium">Need a different plan?</p>
            <p className="text-sm text-muted-foreground">
              Compare every tier and switch in one step.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/pricing">Compare plans</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

function PlanCard({
  planName,
  periodEnd,
  cancelAtPeriodEnd,
  isAdmin,
  isPortalPending,
  onOpenPortal,
}: {
  planName: string;
  periodEnd: Date | string | null;
  cancelAtPeriodEnd: boolean;
  isAdmin: boolean;
  isPortalPending: boolean;
  onOpenPortal: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              {planName}
              {cancelAtPeriodEnd && (
                <Badge variant="destructive">Cancels {formatDate(periodEnd)}</Badge>
              )}
            </CardTitle>
            <CardDescription>
              {cancelAtPeriodEnd
                ? "Your allowance stays available until the period ends."
                : `Renews ${formatDate(periodEnd)}`}
            </CardDescription>
          </div>
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              disabled={isPortalPending}
              onClick={onOpenPortal}
            >
              {isPortalPending ? (
                <>
                  <Spinner className="size-3" />
                  Opening…
                </>
              ) : (
                <>
                  Billing portal
                  <ExternalLink className="size-3.5" />
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}

function UsageCard({
  meters,
}: {
  meters: Array<{
    id: string;
    name: string;
    creditedUnits: number;
    consumedUnits: number;
    balance: number;
    isPrimary: boolean;
  }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage this period</CardTitle>
        <CardDescription>
          Generation stops when an allowance reaches zero. It resets at the
          start of your next period.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {meters.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No metered usage yet.
          </p>
        )}
        {/* Primary meter first: characters are what actually gates the app. */}
        {[...meters]
          .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
          .map((meter) => {
            const ratio =
              meter.creditedUnits > 0 ? meter.balance / meter.creditedUnits : 0;
            const isExhausted = meter.creditedUnits > 0 && meter.balance <= 0;

            return (
              <div key={meter.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-medium">{meter.name}</p>
                  <p
                    className={cn(
                      "text-sm tabular-nums",
                      isExhausted ? "text-destructive" : "text-muted-foreground",
                    )}
                  >
                    {meter.creditedUnits > 0
                      ? `${formatUnits(meter.balance)} / ${formatUnits(meter.creditedUnits)} left`
                      : `${formatUnits(meter.consumedUnits)} used`}
                  </p>
                </div>
                {meter.creditedUnits > 0 && (
                  <Progress
                    value={Math.min(100, Math.max(0, ratio * 100))}
                    className="mt-2 h-1.5"
                  />
                )}
              </div>
            );
          })}
      </CardContent>
    </Card>
  );
}

function HistoryCard({
  orders,
}: {
  orders: Array<{
    id: string;
    createdAt: Date | string;
    status: string;
    paid: boolean;
    totalAmount: number;
    currency: string;
    invoiceNumber: string | null;
  }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing history</CardTitle>
        <CardDescription>
          Invoices and receipts are available in the billing portal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No charges yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {order.invoiceNumber ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.paid ? "secondary" : "outline"}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatMoney(order.totalAmount, order.currency)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
