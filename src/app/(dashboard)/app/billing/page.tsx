import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { BillingOverview } from "@/features/billing/components/billing-overview";

export const metadata: Metadata = {
  title: "Billing",
};

export default function BillingPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader title="Billing" />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl p-4 lg:p-6">
          <BillingOverview />
        </div>
      </div>
    </div>
  );
}
