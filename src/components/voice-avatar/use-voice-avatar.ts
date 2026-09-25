import { useMemo } from "react";

/** FNV-1a: small, fast, and stable across runs so a voice keeps its colours. */
function hash(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * A deterministic gradient plate for a voice, as an inline SVG data URI.
 *
 * Replaces the previous @dicebear "glass" avatars, which pulled two packages in
 * to draw what is ultimately two circles and a blur. A plain function as well
 * as a hook, so server-rendered pages (the marketing site) can draw the same
 * plates the product does.
 */
export function voiceAvatarUri(seed: string) {
  const h = hash(seed);
  const hue = h % 360;
  const hue2 = (hue + 40 + (h % 60)) % 360;
  const cx = 30 + (h % 40);
  const cy = 25 + ((h >>> 8) % 40);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0%" stop-color="hsl(${hue} 70% 62%)"/>
<stop offset="100%" stop-color="hsl(${hue2} 65% 46%)"/>
</linearGradient></defs>
<rect width="100" height="100" fill="url(#g)"/>
<circle cx="${cx}" cy="${cy}" r="26" fill="hsl(${hue2} 85% 78%)" opacity="0.55"/>
<circle cx="${100 - cx}" cy="${100 - cy}" r="18" fill="hsl(${hue} 90% 30%)" opacity="0.4"/>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function useVoiceAvatar(seed: string) {
  return useMemo(() => voiceAvatarUri(seed), [seed]);
}
