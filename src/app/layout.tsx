import type { Metadata } from "next";
import {
  Inter,
  JetBrains_Mono,
  Schibsted_Grotesk,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { TRPCReactProvider } from "@/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { env } from "@/lib/env";

// Product UI keeps Inter; the marketing site deliberately does not use it.
// `preload: false` keeps the marketing page from fetching a face it never
// renders — the variable is still declared for the app's routes.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  preload: false,
});

// Display face for marketing headlines: a grotesk with enough character to
// read as chosen rather than defaulted.
// One family carries both display and body. Four typefaces was indecision,
// not a system; Schibsted Grotesk holds up at text sizes and its wider forms
// stay distinctive at display sizes.
const schibsted = Schibsted_Grotesk({
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

// Timecodes, parameters and UI chrome — anything that reads as instrumentation.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-ui",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // Social platforms need absolute URLs for the link preview image. Set
  // APP_URL to the production domain in production, or previews point at
  // localhost and render blank.
  metadataBase: new URL(env.APP_URL),
  title: {
    default: "Sonic",
    template: "%s | Sonic",
  },
  description: "Voice text-to-speech and speech-to-text application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <TRPCReactProvider>
        <html lang="en">
          <body
            className={`${inter.variable} ${schibsted.variable} ${jetbrainsMono.variable} antialiased`}
          >
            <NuqsAdapter>
              {children}
            </NuqsAdapter>
            <Toaster />
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
