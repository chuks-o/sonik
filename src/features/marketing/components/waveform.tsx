"use client";

import { forwardRef, useCallback, type PointerEvent } from "react";

import { cn } from "@/lib/utils";

interface WaveformProps {
  peaks: number[];
  /** Fraction of the clip already played, 0-1. Only used for the first paint. */
  initialProgress?: number;
  onSeek?: (fraction: number) => void;
  className?: string;
  /** Dims the bars while real peaks are still being decoded. */
  pending?: boolean;
  label?: string;
}

/**
 * Two stacked bar layers: an unplayed track and a coloured played layer that is
 * revealed with clip-path. The parent drives playback progress by writing to
 * the forwarded ref's style directly, so scrubbing at 60fps never re-renders
 * React or touches layout.
 */
export const Waveform = forwardRef<HTMLDivElement, WaveformProps>(
  function Waveform(
    { peaks, initialProgress = 0, onSeek, className, pending, label },
    progressRef,
  ) {
    const seekFromEvent = useCallback(
      (event: PointerEvent<HTMLDivElement>) => {
        if (!onSeek) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const fraction = (event.clientX - rect.left) / rect.width;
        onSeek(Math.min(1, Math.max(0, fraction)));
      },
      [onSeek],
    );

    const bars = (played: boolean) => (
      <div className="flex h-full w-full items-center gap-[2px]">
        {peaks.map((peak, i) => (
          <span
            key={i}
            className={cn(
              "min-h-[2px] flex-1 rounded-full transition-[background-color] duration-300",
              played
                ? "bg-gradient-to-b from-mk-accent-soft to-mk-accent"
                : pending
                  ? "bg-mk-track-faint"
                  : "bg-mk-track",
            )}
            style={{ height: `${Math.round(peak * 100)}%` }}
          />
        ))}
      </div>
    );

    return (
      <div
        role={onSeek ? "slider" : undefined}
        aria-label={onSeek ? (label ?? "Seek") : undefined}
        aria-valuemin={onSeek ? 0 : undefined}
        aria-valuemax={onSeek ? 100 : undefined}
        aria-valuenow={onSeek ? Math.round(initialProgress * 100) : undefined}
        tabIndex={onSeek ? 0 : undefined}
        onPointerDown={onSeek ? seekFromEvent : undefined}
        onKeyDown={
          onSeek
            ? (event) => {
                if (event.key === "ArrowRight") {
                  onSeek(Math.min(1, initialProgress + 0.05));
                } else if (event.key === "ArrowLeft") {
                  onSeek(Math.max(0, initialProgress - 0.05));
                }
              }
            : undefined
        }
        className={cn(
          "relative h-full w-full outline-none",
          onSeek &&
            "cursor-pointer rounded-md focus-visible:ring-2 focus-visible:ring-mk-accent-soft/70 focus-visible:ring-offset-2 focus-visible:ring-offset-mk-bg",
          className,
        )}
      >
        {bars(false)}
        <div
          ref={progressRef}
          className="pointer-events-none absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - initialProgress * 100}% 0 0)` }}
        >
          {bars(true)}
        </div>
      </div>
    );
  },
);
