import { Hero } from "@/features/marketing/components/hero";
import { Platform } from "@/features/marketing/components/platform";
import { FeatureRow } from "@/features/marketing/components/feature-row";
import { ControlRoom } from "@/features/marketing/components/control-room";
import { VoiceGallery } from "@/features/marketing/components/voice-gallery";
import { Steps } from "@/features/marketing/components/steps";
import { Safety } from "@/features/marketing/components/safety";
import { Pricing } from "@/features/marketing/components/pricing";
import { Faq } from "@/features/marketing/components/faq";
import { FinalCta } from "@/features/marketing/components/final-cta";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Platform />
      <FeatureRow />
      <ControlRoom />
      <VoiceGallery />
      <Steps />
      <Safety />
      <Pricing />
      <Faq />
      <FinalCta />
    </>
  );
}
