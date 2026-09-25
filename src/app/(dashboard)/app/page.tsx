import { DashboardView } from "@/features/dashboard/views/dashboard-view";
import { BillingReturnHandler } from "@/features/billing/components/billing-return-handler";
import { PLANS, isPlanSlug } from "@/features/billing/data/plans";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const planParam = typeof params.plan === "string" ? params.plan : null;
  const checkoutId =
    typeof params.checkout_id === "string" ? params.checkout_id : null;

  // Resolved here rather than in the client component: the product IDs come
  // from server-only env, and a slug that does not map to a paid tier is
  // simply ignored.
  const pendingProductId =
    planParam && isPlanSlug(planParam) && PLANS[planParam].requiresCheckout
      ? PLANS[planParam].productId
      : null;

  return (
    <>
      <BillingReturnHandler
        pendingProductId={pendingProductId}
        checkoutId={checkoutId}
      />
      <DashboardView />
    </>
  );
};
