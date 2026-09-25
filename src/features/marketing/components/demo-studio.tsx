"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Pause, Play } from "lucide-react";

import { cn } from "@/lib/utils";
import { VOICE_SAMPLES } from "@/features/marketing/data/site";
import { usePeaks } from "@/features/marketing/hooks/use-peaks";
import { useBarCount } from "@/features/marketing/hooks/use-bar-count";
import { Waveform } from "@/features/marketing/components/waveform";
import { VoicePortrait } from "@/features/marketing/components/voice-portrait";

/** Lets other sections hand a voice to the player without shared state. */
export const SELECT_VOICE_EVENT = "sonic:select-voice";

export interface SelectVoiceDetail {
  id: string;
  autoplay?: boolean;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

/**
 * The interactive demo. Plays pre-generated clips so the page always speaks
 * instantly and never depends on the generation backend being reachable.
 *
 * Playback progress is written straight to the DOM inside a rAF loop; React
 * state only tracks things that change at human speed (voice, play/pause).
 */
export function DemoStudio() {
  const [voiceId, setVoiceId] = useState(VOICE_SAMPLES[0].id);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  // Coarse progress, updated a few times a second purely for assistive tech.
  const [ariaProgress, setAriaProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef(0);
  const ariaTickRef = useRef(0);
  // Set when another section asks for a voice to be played, consumed by the
  // reset effect once the new source is in the DOM.
  const autoplayRef = useRef(false);
  const voiceIdRef = useRef(voiceId);

  const voice = useMemo(
    () => VOICE_SAMPLES.find((v) => v.id === voiceId) ?? VOICE_SAMPLES[0],
    [voiceId],
  );
  const src = `/samples/${voice.id}.m4a`;
  const buckets = useBarCount();
  const { peaks, ready } = usePeaks(src, voice.id, buckets);

  const paint = useCallback((fraction: number) => {
    const clamped = Math.min(1, Math.max(0, fraction));
    if (progressRef.current) {
      progressRef.current.style.clipPath = `inset(0 ${100 - clamped * 100}% 0 0)`;
    }
  }, []);

  // Drive the playhead outside React while audio is running.
  useEffect(() => {
    if (!playing) {
      cancelAnimationFrame(frameRef.current);
      return;
    }

    const tick = () => {
      const audio = audioRef.current;
      if (audio && audio.duration > 0) {
        const fraction = audio.currentTime / audio.duration;
        paint(fraction);
        if (timeRef.current) {
          timeRef.current.textContent = formatTime(audio.currentTime);
        }
        const now = performance.now();
        if (now - ariaTickRef.current > 400) {
          ariaTickRef.current = now;
          setAriaProgress(fraction);
        }
      }
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [playing, paint]);

  // Reset the transport whenever the selected voice changes.
  useEffect(() => {
    voiceIdRef.current = voiceId;
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setPlaying(false);
    setDuration(0);
    setAriaProgress(0);
    paint(0);
    if (timeRef.current) timeRef.current.textContent = "0:00";

    if (autoplayRef.current) {
      autoplayRef.current = false;
      // Browsers that refuse playback outside the click itself leave the
      // voice loaded and in view; one more press plays it.
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  }, [voiceId, paint]);

  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      setPlaying(false);
      return;
    }

    try {
      setLoading(true);
      await audio.play();
      setPlaying(true);
    } catch {
      // Autoplay refusal or a decode error: fall back to a stopped transport.
      setPlaying(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const seek = useCallback(
    (fraction: number) => {
      const audio = audioRef.current;
      if (!audio || !Number.isFinite(audio.duration) || audio.duration === 0) return;
      audio.currentTime = fraction * audio.duration;
      paint(fraction);
      setAriaProgress(fraction);
      if (timeRef.current) timeRef.current.textContent = formatTime(audio.currentTime);
    },
    [paint],
  );

  const selectVoice = useCallback((id: string) => setVoiceId(id), []);

  // Audio that keeps playing after the player has scrolled away is disorienting
  // and wastes data. Stop on exit and when the tab is hidden.
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const halt = () => {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        audio.pause();
        setPlaying(false);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) halt();
      },
      { threshold: 0 },
    );
    io.observe(card);

    const onHidden = () => document.hidden && halt();
    document.addEventListener("visibilitychange", onHidden);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onHidden);
    };
  }, []);

  // The voice gallery further down the page drives this player by dispatching
  // an event, which keeps the two sections decoupled and avoids lifting audio
  // state into a provider for a single interaction.
  useEffect(() => {
    const onExternalSelect = (event: Event) => {
      const detail = (event as CustomEvent<SelectVoiceDetail | string>).detail;
      const { id, autoplay } =
        typeof detail === "string" ? { id: detail, autoplay: false } : detail;
      if (!VOICE_SAMPLES.some((v) => v.id === id)) return;

      if (id === voiceIdRef.current) {
        // Same voice: no source change will trigger the reset effect.
        if (autoplay && audioRef.current?.paused) void toggle();
        return;
      }
      autoplayRef.current = Boolean(autoplay);
      setVoiceId(id);
    };
    window.addEventListener(SELECT_VOICE_EVENT, onExternalSelect);
    return () => window.removeEventListener(SELECT_VOICE_EVENT, onExternalSelect);
  }, [toggle]);

  return (
    <div
      ref={cardRef}
      className="mk-lift overflow-hidden rounded-[24px] border border-mk-border bg-white text-left"
    >
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[208px_minmax(0,1fr)] lg:gap-10 lg:p-9">
        {/* Who is speaking */}
        <div className="flex items-center gap-4 lg:block">
          <VoicePortrait
            key={voice.id}
            photo={voice.photo}
            name={voice.name}
            size={208}
            shape="rounded"
            priority
            className="size-16 sm:size-20 lg:size-[208px] lg:rounded-[20px]"
          />
          <div className="min-w-0 lg:mt-5">
            <p className="text-[17px] font-semibold tracking-tight text-mk-fg">
              {voice.name}
            </p>
            <p className="mt-0.5 text-[14px] text-mk-muted">
              {voice.accent} accent
            </p>
            <span className="mt-2.5 inline-flex rounded-full bg-mk-fill px-2.5 py-1 text-[12px] font-medium text-mk-muted">
              {voice.category}
            </span>
          </div>
        </div>

        {/* What they say, and the transport */}
        <div className="flex min-w-0 flex-col justify-between gap-8">
          <div>
            <p className="mk-label">Script</p>
            <p className="mt-3 text-[19px] leading-[1.55] tracking-[-0.01em] text-pretty text-mk-fg sm:text-[22px]">
              &ldquo;{voice.script}&rdquo;
            </p>
            <p className="mt-3 text-[14px] text-mk-faint">{voice.tagline}</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? `Pause ${voice.name}` : `Play ${voice.name}`}
              className="relative flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-mk-brand-deep text-white transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-mk-accent focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95 sm:size-14"
            >
              {/* Sound is orange: the ring only appears while audio plays. */}
              {playing && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-mk-brand/45"
                  style={{ animation: "mk-pulse-ring 2s ease-out infinite" }}
                />
              )}
              <span className="relative">
                {loading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : playing ? (
                  <Pause className="size-5 fill-current" />
                ) : (
                  <Play className="size-5 translate-x-[1px] fill-current" />
                )}
              </span>
            </button>

            <div className="h-12 min-w-0 flex-1 sm:h-14">
              <Waveform
                ref={progressRef}
                peaks={peaks}
                pending={!ready}
                initialProgress={ariaProgress}
                onSeek={seek}
                label={`Seek ${voice.name} sample`}
              />
            </div>

            <div className="mk-num shrink-0 text-right text-[12px] text-mk-faint">
              <span ref={timeRef}>0:00</span>
              <span> / {formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* The cast. A radio group: exactly one voice is loaded at a time. */}
      <div
        role="radiogroup"
        aria-label="Choose a voice"
        className="flex gap-2 overflow-x-auto border-t border-mk-border bg-mk-fill-faint px-5 py-4 sm:px-7 lg:px-9"
      >
        {VOICE_SAMPLES.map((v) => {
          const active = v.id === voice.id;
          return (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => selectVoice(v.id)}
              className={cn(
                "flex min-h-11 shrink-0 cursor-pointer items-center gap-2.5 rounded-full border py-1.5 pr-4 pl-1.5 text-[14px] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-mk-accent focus-visible:outline-none",
                active
                  ? "mk-contact border-mk-border-strong bg-white font-medium text-mk-fg"
                  : "border-transparent text-mk-muted hover:bg-white hover:text-mk-fg",
              )}
            >
              <span className="relative">
                <VoicePortrait
                  photo={v.photo}
                  name={v.name}
                  size={32}
                  decorative
                  className="size-8"
                />
                {active && playing && (
                  <span className="absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full bg-mk-brand-deep text-white ring-2 ring-white">
                    <EqualizerIcon />
                  </span>
                )}
              </span>
              {v.name}
            </button>
          );
        })}
      </div>

      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        // Some browsers only settle on a real duration after metadata lands.
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => {
          setPlaying(false);
          paint(0);
          setAriaProgress(0);
          if (audioRef.current) audioRef.current.currentTime = 0;
          if (timeRef.current) timeRef.current.textContent = "0:00";
        }}
      />
    </div>
  );
}

/** Three bars bouncing in a loop: the "now playing" mark on the active voice. */
function EqualizerIcon() {
  return (
    <span aria-hidden="true" className="flex h-2 items-end gap-[1.5px]">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[1.5px] origin-bottom rounded-full bg-current"
          style={{
            height: "100%",
            animation: `mk-bar ${0.7 + i * 0.18}s ease-in-out ${i * 0.12}s infinite`,
          }}
        />
      ))}
    </span>
  );
}
