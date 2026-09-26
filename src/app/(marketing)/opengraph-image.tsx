import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { VOICE_SAMPLES } from "@/features/marketing/data/site";
import { placeholderPeaks } from "@/features/marketing/lib/peaks";

/*
 * The link preview for every marketing page (/ and /pricing).
 *
 * Next.js renders this to a PNG at build time and adds the og:image tags
 * itself. It is drawn in the homepage's own language — Clerk's blacks, the
 * logo's gold for sound and shadow, the real cast — so the card someone sees
 * in a feed matches the page they land on.
 */

export const alt = "Sonic — text that sounds like someone meant it.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#212126";
const MUTED = "#52555e";
const GOLD = "#f08a3e";
const GOLD_DEEP = "#d2661e";
const TRACK = "#e2e2df";
const BORDER = "#e6e8e8";

const BARS = 46;
const PLAYED = 0.45;

export default async function OpenGraphImage() {
  const root = process.cwd();

  // Fonts are committed as static TTF: the renderer cannot read the WOFF2
  // files next/font serves, and fetching from Google at build time would make
  // every build depend on the network.
  const [regular, semibold, logo, ...portraits] = await Promise.all([
    readFile(join(root, "assets/fonts/SchibstedGrotesk-400.ttf")),
    readFile(join(root, "assets/fonts/SchibstedGrotesk-600.ttf")),
    readFile(join(root, "public/logo.svg")),
    ...VOICE_SAMPLES.map((voice) =>
      readFile(join(root, `public/portraits/${voice.photo}.jpg`)),
    ),
  ]);

  const logoSrc = `data:image/svg+xml;base64,${logo.toString("base64")}`;
  const faces = portraits.map(
    (photo) => `data:image/jpeg;base64,${photo.toString("base64")}`,
  );
  const peaks = placeholderPeaks("og-preview", BARS);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "72px 80px",
          background: "#ffffff",
          fontFamily: "Schibsted Grotesk",
          color: INK,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img src={logoSrc} width={40} height={48} alt="" />
          <span style={{ fontSize: 34, fontWeight: 600, letterSpacing: -0.5 }}>
            Sonic
          </span>
        </div>

        <div
          style={{
            marginTop: 46,
            fontSize: 78,
            fontWeight: 600,
            lineHeight: 1.04,
            letterSpacing: -3,
            maxWidth: 880,
          }}
        >
          Text that sounds like someone meant it.
        </div>

        <div style={{ marginTop: 22, fontSize: 30, color: MUTED }}>
          Natural text to speech and voice cloning, for every script you write.
        </div>

        {/* The player: the one thing the homepage leads with. */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            gap: 28,
            padding: "22px 30px",
            background: "#ffffff",
            border: `1px solid ${BORDER}`,
            borderRadius: 28,
            boxShadow:
              "0 2px 4px rgba(169, 80, 26, 0.12), 0 26px 60px -24px rgba(210, 102, 30, 0.4)",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              background: GOLD_DEEP,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="24" height="26" viewBox="0 0 24 26">
              <path d="M4 2.5 22 13 4 23.5Z" fill="#ffffff" />
            </svg>
          </div>

          <div
            style={{
              flex: 1,
              height: 56,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            {peaks.map((peak, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${Math.round(peak * 100)}%`,
                  borderRadius: 999,
                  background: i < Math.round(BARS * PLAYED) ? GOLD : TRACK,
                }}
              />
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            {faces.map((src, i) => (
              <img
                key={src.slice(-24)}
                src={src}
                width={58}
                height={58}
                alt=""
                style={{
                  borderRadius: 999,
                  border: "4px solid #ffffff",
                  marginLeft: i === 0 ? 0 : -16,
                  objectFit: "cover",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Schibsted Grotesk", data: regular, weight: 400, style: "normal" },
        { name: "Schibsted Grotesk", data: semibold, weight: 600, style: "normal" },
      ],
    },
  );
}
