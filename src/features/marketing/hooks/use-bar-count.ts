"use client";

import { useEffect, useState } from "react";

/**
 * Waveform resolution has to track viewport width. A phone gives the studio
 * player roughly 210px for the waveform, and at 96 bars the 2px gaps alone eat
 * the whole track, leaving sub-pixel bars that read as a grey smear.
 */
const BREAKPOINTS = [
  { query: "(min-width: 1024px)", bars: 96 },
  { query: "(min-width: 640px)", bars: 72 },
] as const;

const FALLBACK = 44;

function measure() {
  for (const { query, bars } of BREAKPOINTS) {
    if (window.matchMedia(query).matches) return bars;
  }
  return FALLBACK;
}

export function useBarCount() {
  // Start at the phone count so the server markup and first client paint agree,
  // then upgrade after mount.
  const [bars, setBars] = useState(FALLBACK);

  useEffect(() => {
    const update = () => setBars(measure());
    update();

    const lists = BREAKPOINTS.map(({ query }) => window.matchMedia(query));
    lists.forEach((list) => list.addEventListener("change", update));
    return () => lists.forEach((list) => list.removeEventListener("change", update));
  }, []);

  return bars;
}
