"use client";

import { useEffect, useMemo, useState } from "react";

import { placeholderPeaks } from "@/features/marketing/lib/peaks";

export { placeholderPeaks };

/**
 * Decoded peak arrays shared across component instances. Keyed by URL *and*
 * bucket count, since the resolution changes with viewport width.
 */
const cache = new Map<string, number[]>();
const inflight = new Map<string, Promise<number[]>>();

const keyFor = (url: string, buckets: number) => `${url}@${buckets}`;

async function decodePeaks(url: string, buckets: number): Promise<number[]> {
  const response = await fetch(url);
  const bytes = await response.arrayBuffer();

  const Ctx =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctx) throw new Error("Web Audio unavailable");

  const ctx = new Ctx();
  try {
    const buffer = await ctx.decodeAudioData(bytes);
    const channel = buffer.getChannelData(0);
    const size = Math.floor(channel.length / buckets);
    const peaks: number[] = [];

    let max = 0;
    for (let i = 0; i < buckets; i++) {
      let sum = 0;
      const start = i * size;
      // RMS rather than peak: reads closer to perceived loudness.
      for (let j = 0; j < size; j++) {
        const v = channel[start + j] ?? 0;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / Math.max(1, size));
      peaks.push(rms);
      if (rms > max) max = rms;
    }

    return max > 0 ? peaks.map((p) => Math.min(1, (p / max) * 0.95 + 0.06)) : peaks;
  } finally {
    void ctx.close();
  }
}

/**
 * Real waveform peaks for a clip, falling back to the deterministic
 * placeholder while decoding and permanently if decoding is unsupported.
 *
 * The peaks are derived from the module-level cache during render rather than
 * mirrored into state, so switching to an already-decoded clip paints the real
 * waveform on the first render instead of after a second pass.
 */
export function usePeaks(url: string, seed: string, buckets: number) {
  // Decoding happens outside React, so a counter is all that is needed to ask
  // for a re-render once a new result lands in the cache.
  const [, revision] = useState(0);
  const key = keyFor(url, buckets);

  useEffect(() => {
    if (cache.has(key)) return;

    let active = true;
    let job = inflight.get(key);
    if (!job) {
      job = decodePeaks(url, buckets);
      inflight.set(key, job);
    }

    job
      .then((result) => {
        cache.set(key, result);
        if (active) revision((n) => n + 1);
      })
      // Keep the placeholder: a decode failure should never break the demo.
      .catch(() => undefined)
      .finally(() => inflight.delete(key));

    return () => {
      active = false;
    };
  }, [key, url, buckets]);

  const decoded = cache.get(key);
  const fallback = useMemo(
    () => placeholderPeaks(seed, buckets),
    [seed, buckets],
  );

  return { peaks: decoded ?? fallback, ready: decoded !== undefined };
}
