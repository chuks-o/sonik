import type { Metadata } from "next";

import { Faq } from "@/features/marketing/components/faq";
import { Pricing } from "@/features/marketing/components/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Start free with the full voice library and every sampling control unlocked. Move up a tier when the character count says you should.",
};

// Products change rarely, so the page is regenerated hourly rather than
// calling Polar on every visit.
export const revalidate = 3600;

export default function PricingPage() {
  return (
    <>
      <Pricing />
      <Faq />
    </>
  );
}
