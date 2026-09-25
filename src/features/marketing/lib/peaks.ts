/**
 * Deterministic stand-in waveform: the same seed always draws the same shape,
 * so server and client render identical bars. Lives outside the hooks module
 * so server components can call it.
 */
export function placeholderPeaks(seed: string, buckets: number): number[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }

  const peaks: number[] = [];
  for (let i = 0; i < buckets; i++) {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    const r = ((h >>> 0) % 1000) / 1000;
    // Taper the ends so it reads as an utterance rather than a noise block.
    const envelope = Math.sin((i / buckets) * Math.PI) ** 0.6;
    peaks.push(0.18 + r * 0.72 * envelope);
  }
  return peaks;
}

