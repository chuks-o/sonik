import type { Metadata } from "next";

import { MarketingNav } from "@/features/marketing/components/marketing-nav";
import { MarketingFooter } from "@/features/marketing/components/marketing-footer";

export const metadata: Metadata = {
  title: {
    absolute: "Sonic — Studio-grade voices for everything you write",
  },
  description:
    "Turn scripts into natural speech, clone a voice from a single take, dub a performance into other languages, and transcribe recordings with speaker labels.",
  openGraph: {
    title: "Sonic — Studio-grade voices for everything you write",
    description:
      "Text to speech, voice cloning, dubbing and transcription on one engine.",
    siteName: "Sonic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sonic — Studio-grade voices for everything you write",
    description:
      "Text to speech, voice cloning, dubbing and transcription on one engine.",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // `.marketing` scopes the palette so none of it reaches the product UI.
    <div className="marketing scroll-smooth">
      <MarketingNav />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  );
}
