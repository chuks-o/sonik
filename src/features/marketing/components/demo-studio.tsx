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
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setPlaying(false);
    setDuration(0);
    setAriaProgress(0);
    paint(0);
    if (timeRef.current) timeRef.current.textContent = "0:00";
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
      const id = (event as CustomEvent<string>).detail;
      if (VOICE_SAMPLES.some((v) => v.id === id)) setVoiceId(id);
    };
    window.addEventListener(SELECT_VOICE_EVENT, onExternalSelect);
    return () => window.removeEventListener(SELECT_VOICE_EVENT, onExternalSelect);
  }, []);

  return (
    <div ref={cardRef} className="mk-hairline relative overflow-hidden rounded-[20px] border border-mk-border bg-mk-elevated/70 shadow-[0_40px_120px_-40px_var(--mk-studio-shadow)] backdrop-blur-xl">
      {/* Chrome bar */}
      <div className="flex items-center justify-between gap-3 border-b border-mk-border px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-mk-track" />
          <span className="size-2 rounded-full bg-mk-track" />
          <span className="size-2 rounded-full bg-mk-track" />
        </div>
        <p className="mk-label">
          Sonic studio
        </p>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "size-1.5 rounded-full transition-colors",
              playing ? "bg-emerald-400" : "bg-mk-track",
            )}
          />
          <span className="hidden text-[11px] text-mk-faint sm:inline">
            {playing ? "playing" : "idle"}
          </span>
        </div>
      </div>

      <div className="grid min-w-0 gap-0 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
        {/* Voice picker: a rail on desktop, a horizontal scroller on phones. */}
        <div className="min-w-0 border-mk-border lg:border-r">
          <p className="px-4 pt-4 pb-2 mk-label sm:px-5">
            Voices
          </p>
          <div
            role="radiogroup"
            aria-label="Demo voice"
            className="flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-4 sm:px-5 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-2 lg:pb-3"
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
                    "group flex min-w-[164px] shrink-0 snap-start items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-300 lg:w-full lg:min-w-0",
                    active
                      ? "border-mk-accent/45 bg-mk-accent/12"
                      : "border-transparent hover:border-mk-border-strong hover:bg-mk-fill",
                  )}
                >
                  <span className="relative flex shrink-0">
                    <VoicePortrait
                      photo={v.photo}
                      name={v.name}
                      active={active}
                      size={36}
                      priority
                      className="size-9"
                    />
                    {active && playing && (
                      <span className="absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full bg-mk-accent text-mk-bg ring-2 ring-mk-elevated">
                        <EqualizerIcon />
                      </span>
                    )}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block truncate text-[13px] font-medium",
                        active ? "text-mk-fg" : "text-mk-muted",
                      )}
                    >
                      {v.name}
                    </span>
                    <span className="block truncate text-[11px] text-mk-faint">
                      {v.accent}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Transcript, waveform and transport */}
        <div className="flex min-w-0 flex-col justify-center gap-5 p-4 sm:p-5 lg:p-6">
          <div>
            <p className="mk-label">
              Script
            </p>
            <p
              key={voice.id}
              className="reveal mt-2 text-pretty text-[15px] leading-relaxed text-mk-fg/90 sm:text-base"
              data-shown="true"
            >
              {voice.script}
            </p>
            <p className="mt-2 text-[13px] text-mk-faint">{voice.tagline}</p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? `Pause ${voice.name}` : `Play ${voice.name}`}
              className="relative flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-mk-accent-soft to-mk-accent-deep text-white transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-mk-accent-soft focus-visible:ring-offset-2 focus-visible:ring-offset-mk-bg focus-visible:outline-none active:scale-95 sm:size-14"
            >
              {/* Pulse ring, only while playing. */}
              {playing && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-mk-accent/60"
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

            <div className="h-14 min-w-0 flex-1 sm:h-16">
              <Waveform
                ref={progressRef}
                peaks={peaks}
                pending={!ready}
                initialProgress={ariaProgress}
                onSeek={seek}
                label={`Seek ${voice.name} sample`}
              />
            </div>

            <div className="mk-num shrink-0 text-right text-[11px] text-mk-faint sm:text-xs">
              <span ref={timeRef}>0:00</span>
              <span className="text-mk-faint/60"> / {formatTime(duration)}</span>
            </div>
          </div>

          {/* The generation parameters that produced this take. */}
          <div className="flex flex-wrap gap-1.5 border-t border-mk-border pt-4">
            {[
              ["temperature", voice.params.temperature],
              ["top_p", voice.params.topP],
              ["top_k", voice.params.topK],
              ["rep_penalty", voice.params.repetitionPenalty],
            ].map(([key, value]) => (
              <span
                key={key as string}
                className="rounded-md border border-mk-border bg-mk-fill px-2 py-1 font-mono text-[11px] text-mk-faint"
              >
                {key}
                <span className="text-mk-accent-soft"> {value}</span>
              </span>
            ))}
          </div>
        </div>
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

/** Three bars bouncing in a loop, used as the "now playing" affordance. */
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
