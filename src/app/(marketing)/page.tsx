import { Hero } from "@/features/marketing/components/hero";
import { Features } from "@/features/marketing/components/features";
import { VoiceGallery } from "@/features/marketing/components/voice-gallery";
import { LanguageGrid } from "@/features/marketing/components/language-grid";
import { Safety } from "@/features/marketing/components/safety";
import { Pricing } from "@/features/marketing/components/pricing";
import { Faq } from "@/features/marketing/components/faq";
import { FinalCta } from "@/features/marketing/components/final-cta";

// The pricing section reads live products from Polar. Regenerate hourly
// rather than rendering the landing page on every request.
export const revalidate = 3600;

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <LanguageGrid />
      <VoiceGallery />
      <Safety />
      <Pricing />
      <Faq />
      <FinalCta />
    </>
  );
}
