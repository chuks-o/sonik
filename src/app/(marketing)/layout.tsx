import type { Metadata } from "next";

import { MarketingNav } from "@/features/marketing/components/marketing-nav";
import { ColumnRules } from "@/features/marketing/components/column-rules";
import { THEME_INIT_SCRIPT } from "@/features/marketing/hooks/use-marketing-theme";
import { MarketingFooter } from "@/features/marketing/components/marketing-footer";

export const metadata: Metadata = {
  title: {
    absolute: "Sonic — Studio-grade text to speech, with the controls left on",
  },
  description:
    "Sonic turns scripts into studio-grade speech and exposes the sampling controls behind the model, so you can direct the performance instead of regenerating and hoping.",
  openGraph: {
    title: "Sonic — Studio-grade text to speech",
    description:
      "Generate speech with real direction: temperature, top-p, top-k and repetition penalty on every take. Clone voices, keep the history, ship over the API.",
    siteName: "Sonic",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sonic — Studio-grade text to speech",
    description:
      "Direct the performance instead of rolling the dice on every generation.",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // `.marketing` scopes the theme so neither palette reaches the product UI.
    <div className="marketing scroll-smooth">
      {/* Sets the theme attribute before first paint, so there is no flash. */}
      <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />

      {/* Scroll reveals start at opacity 0 and are cleared by JS. Without this
          the whole page below the hero is invisible to no-JS users and to any
          crawler that does not execute scripts. */}
      <noscript>
        <style>{".reveal{opacity:1!important;transform:none!important}"}</style>
      </noscript>
      <ColumnRules />
      <MarketingNav />
      <main className="relative z-10">{children}</main>
      <MarketingFooter />
    </div>
  );
}
