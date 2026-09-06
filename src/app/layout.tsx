import type { Metadata } from "next";
import {
  Inter,
  Syne,
  JetBrains_Mono,
  Schibsted_Grotesk,
} from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { TRPCReactProvider } from "@/trpc/client";

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

// Section eyebrows only. Syne is a geometric display face with unusually wide,
// squared forms — distinctive enough to mark a section without competing with
// the headline, and rare enough that it does not read as a default.
const syne = Syne({
  variable: "--font-eyebrow",
  weight: ["600"],
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
  title: {
    default: "Sonik",
    template: "%s | Sonik",
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
        {/* The marketing theme script stamps data-mk-theme on <html> before
            React hydrates, so attribute mismatches here are expected. */}
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${inter.variable} ${schibsted.variable} ${syne.variable} ${jetbrainsMono.variable} antialiased`}
          >
            {children}
            <Toaster />
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
