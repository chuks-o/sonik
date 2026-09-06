"use client";

import { Check, Globe, Mic, Play, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { VOICE_SAMPLES } from "@/features/marketing/data/site";
import { VoicePortrait } from "@/features/marketing/components/voice-portrait";

/** Deterministic bar heights, seeded so server and client markup agree. */
function bars(seed: number, count: number, floor = 0.18) {
  return Array.from({ length: count }, (_, i) => {
    const x = Math.sin((i + 1) * 12.9898 + seed * 78.233) * 43758.5453;
    const r = x - Math.floor(x);
    const envelope = Math.sin((i / count) * Math.PI) ** 0.55;
    return floor + r * (1 - floor) * envelope;
  });
}

function Wave({
  seed,
  count = 72,
  active = 0,
  className,
}: {
  seed: number;
  count?: number;
  active?: number;
  className?: string;
}) {
  const heights = bars(seed, count);
  const cut = Math.round(count * active);
  return (
    <div className={cn("flex h-full w-full items-center gap-[1.5px]", className)}>
      {heights.map((h, i) => (
        <span
          key={i}
          className={cn(
            "min-h-[2px] flex-1 rounded-full",
            i < cut ? "bg-mk-accent/80" : "bg-mk-track",
          )}
          style={{ height: `${Math.round(h * 100)}%` }}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Text to speech                                                        */
/* -------------------------------------------------------------------------- */

export function TextToSpeechVisual() {
  const cast = VOICE_SAMPLES;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-mk-border bg-mk-bg/60 p-4">
        <p className="mk-label">Script</p>
        <p className="mt-3 text-[14px] leading-relaxed text-mk-fg/90">
          In the ancient land of Eldoria, skies shimmered and forests whispered
          secrets to the wind. <span className="text-mk-accent">[warmly]</span>{" "}
          There lived a dragon named Zephyros.{" "}
          <span className="text-mk-accent">[whispers]</span> Even the birds fell
          silent when he passed.
        </p>
      </div>

      {/* The cast, with faces — picking a voice is casting a person. */}
      <div className="rounded-xl border border-mk-border bg-mk-bg/60 p-4">
        <p className="mk-label">Casting</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-4">
          {cast.map((voice, i) => (
            <div key={voice.id} className="flex min-w-0 flex-col items-center gap-1.5">
              <VoicePortrait
                photo={voice.photo}
                name={voice.name}
                active={i === 1}
                size={48}
                className="size-12"
              />
              <span
                className={cn(
                  "truncate text-[11px]",
                  i === 1 ? "text-mk-fg" : "text-mk-faint",
                )}
              >
                {voice.name}
              </span>
            </div>
          ))}
          <div className="flex w-full items-center gap-2 sm:ml-auto sm:w-auto sm:self-start">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-mk-border px-2.5 py-1.5 text-[12px] text-mk-muted">
              <Globe className="size-3.5 text-mk-faint" />
              English
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-mk-fg px-3 py-1.5 text-[12px] font-medium text-mk-bg">
              <Play className="size-3 fill-current" />
              Play
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-mk-border bg-mk-bg/60 px-4 py-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-mk-accent text-mk-bg">
          <Play className="size-3.5 translate-x-px fill-current" />
        </span>
        <div className="h-9 min-w-0 flex-1">
          <Wave seed={5} count={80} active={0.42} />
        </div>
        <span className="mk-num shrink-0 text-[11px] text-mk-faint">
          0:11
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Voice cloning                                                         */
/* -------------------------------------------------------------------------- */

export function VoiceCloningVisual() {
  return (
    <div className="space-y-3">
      {/* The person doing the cloning, front and centre. */}
      <div className="flex items-center gap-4 rounded-xl border border-mk-border bg-mk-bg/60 p-4">
        <VoicePortrait photo="aiony" name="Vale" active size={64} className="size-16" />
        <div className="min-w-0">
          <p className="truncate text-[14px] font-medium text-mk-fg">Vale</p>
          <p className="truncate text-[12.5px] text-mk-muted">
            Narrator, recording a reference take
          </p>
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-mk-border px-2 py-1 text-[11px] text-mk-faint">
            <Mic className="size-3" />
            3 min 41 s of clean audio
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-mk-border-strong bg-mk-bg/40 px-4 py-3">
        <div className="h-10">
          <Wave seed={7} count={92} />
        </div>
        <p className="mk-label mt-2 text-center">reference take</p>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-mk-accent/35 bg-mk-accent/10 p-4">
        <VoicePortrait photo="aiony" name="Vale" active size={44} className="size-11" />
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-medium text-mk-fg">
            Vale&rsquo;s voice, cloned
          </p>
          <p className="truncate text-[12px] text-mk-faint">
            Available to everyone in the workspace
          </p>
        </div>
        <Check className="ml-auto size-4 shrink-0 text-mk-accent" />
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-mk-border bg-mk-bg/50 px-4 py-3">
        <ShieldCheck className="size-4 shrink-0 text-mk-faint" />
        <p className="text-[12.5px] text-mk-muted">
          Vale confirmed consent when this voice was made
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Dubbing                                                               */
/* -------------------------------------------------------------------------- */

const DUBS = [
  { lang: "Spanish", native: "Español", state: "done" },
  { lang: "Japanese", native: "日本語", state: "done" },
  { lang: "French", native: "Français", state: "running" },
  { lang: "Yoruba", native: "Yorùbá", state: "running" },
  { lang: "Hindi", native: "हिन्दी", state: "queued" },
] as const;

export function DubbingVisual() {
  return (
    <div className="space-y-4">
      {/* One performer, many languages — the same face all the way down. */}
      <div className="flex items-center gap-4 rounded-xl border border-mk-border bg-mk-bg/60 p-4">
        <VoicePortrait photo="vicky" name="Orion" active size={56} className="size-14" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-medium text-mk-fg">
            Orion, original take
          </p>
          <div className="mt-2 h-7">
            <Wave seed={3} count={78} />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {DUBS.map((dub) => (
          <div
            key={dub.lang}
            className={cn(
              "flex items-center gap-3 rounded-xl border px-3.5 py-2.5 transition-colors",
              dub.state === "queued"
                ? "border-mk-border bg-transparent opacity-60"
                : "border-mk-border bg-mk-bg/50",
            )}
          >
            <VoicePortrait
              photo="vicky"
              name="Orion"
              active={dub.state === "running"}
              size={32}
              className="size-8"
            />
            <div className="w-16 min-w-0 shrink-0 sm:w-24">
              <p className="truncate text-[12.5px] text-mk-fg">{dub.lang}</p>
              <p className="truncate text-[11px] text-mk-faint">{dub.native}</p>
            </div>
            <div className="h-6 min-w-0 flex-1">
              <Wave
                seed={dub.lang.length * 11}
                count={56}
                active={dub.state === "running" ? 0.55 : 0}
              />
            </div>
            <span className="shrink-0 text-[11px] text-mk-faint">
              {dub.state === "done"
                ? "ready"
                : dub.state === "running"
                  ? "dubbing"
                  : "queued"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
