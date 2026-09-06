import { Check, Globe, Loader2, Play, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { VoicePortrait } from "@/features/marketing/components/voice-portrait";

/**
 * Compact, static product mockups shown inside each capability card. They are
 * illustrations of the interface rather than live components: no state, no
 * network, and deterministic geometry so server and client markup agree.
 */

/** Stable pseudo-random bar heights, seeded so SSR and hydration match. */
function bars(seed: number, count: number, floor = 0.2) {
  return Array.from({ length: count }, (_, i) => {
    const x = Math.sin((i + 1) * 12.9898 + seed * 78.233) * 43758.5453;
    const r = x - Math.floor(x);
    const envelope = Math.sin((i / count) * Math.PI) ** 0.5;
    return floor + r * (1 - floor) * envelope;
  });
}

function Chip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-mk-border bg-mk-fill px-2.5 py-1.5 text-[12px] text-mk-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

function Waves({
  seed,
  count = 34,
  className,
  active = 1,
}: {
  seed: number;
  count?: number;
  className?: string;
  /** Fraction of bars rendered in the accent colour. */
  active?: number;
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
            i < cut ? "bg-mk-accent-soft/75" : "bg-mk-track",
          )}
          style={{ height: `${Math.round(h * 100)}%` }}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

export function TextToSpeechVisual() {
  return (
    <div className="rounded-xl border border-mk-border bg-mk-bg/60 p-4">
      <p className="text-[13.5px] leading-relaxed text-mk-fg/90">
        In the ancient land of Eldoria, skies shimmered and forests whispered
        secrets to the wind.{" "}
        <span className="text-mk-accent">[warmly]</span> There lived a
        dragon named Zephyros.{" "}
        <span className="text-mk-accent">[whispers]</span> Even the birds
        fell silent when he passed.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-mk-border pt-3">
        <Chip>
          <Globe className="size-3.5 text-mk-faint" />
          English
        </Chip>
        <Chip>
          <span className="size-2.5 rounded-full bg-gradient-to-br from-mk-accent-soft to-mk-accent-deep" />
          Orion
        </Chip>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-mk-fg px-3 py-1.5 text-[12px] font-medium text-mk-bg">
          <Play className="size-3 fill-current" />
          Play
        </span>
      </div>
    </div>
  );
}

export function VoiceGeneratorVisual() {
  // Three warm variations rather than three different hues: the palette stays
  // at one accent family even inside an illustration.
  const voices = [
    { name: "Gravel", gradient: "from-amber-200/70 via-amber-500/60 to-orange-700/60" },
    { name: "Cirrus", gradient: "from-stone-200/70 via-stone-400/50 to-stone-600/50" },
    { name: "Ember", gradient: "from-orange-300/70 via-orange-600/60 to-red-800/55" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-xl border border-mk-border bg-mk-bg/60 px-3.5 py-3">
        <Sparkles className="size-3.5 shrink-0 text-mk-faint" />
        <p className="truncate text-[13px] text-mk-fg/85">
          a warm, gravelly narrator in his sixties
        </p>
        <span
          aria-hidden="true"
          className="ml-auto h-4 w-px shrink-0 bg-mk-accent-soft/80"
        />
      </div>

      <div className="flex items-start justify-between gap-3">
        {voices.map((voice) => (
          <div key={voice.name} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <span
              className={cn(
                "aspect-square w-full max-w-[68px] rounded-full bg-gradient-to-br blur-[0.3px]",
                voice.gradient,
              )}
            />
            <span className="truncate text-[11.5px] text-mk-muted">{voice.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function VoiceCloningVisual() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-mk-border-strong bg-mk-bg/50 px-3.5 py-3">
        <div className="h-7 min-w-0 flex-1">
          <Waves seed={7} count={68} active={0} />
        </div>
        <span className="shrink-0 font-mono text-[11px] text-mk-faint">3:41</span>
      </div>

      <p className="mk-label text-center">
        reference take
      </p>

      <div className="flex items-center gap-3 rounded-xl border border-mk-accent/35 bg-mk-accent/10 px-3.5 py-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-mk-accent-soft to-mk-accent-deep text-[13px] font-semibold text-white">
          M
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[13px] font-medium text-mk-fg">
            Maya, cloned
          </span>
          <span className="block truncate text-[11.5px] text-mk-faint">
            Ready for the whole workspace
          </span>
        </span>
        <Check className="ml-auto size-4 shrink-0 text-mk-accent" />
      </div>
    </div>
  );
}

export function DubbingVisual() {
  const targets = [
    { label: "Spanish", progress: 100, done: true },
    { label: "Japanese", progress: 100, done: true },
    { label: "French", progress: 62, done: false },
    { label: "Yoruba", progress: 24, done: false },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-xl border border-mk-border bg-mk-bg/60 px-3.5 py-2.5">
        <Chip className="shrink-0 border-transparent bg-mk-fill py-1">
          English
        </Chip>
        <div className="h-6 min-w-0 flex-1">
          <Waves seed={3} count={104} active={0} />
        </div>
      </div>

      <div className="space-y-2">
        {targets.map((target) => (
          <div key={target.label} className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-[12px] text-mk-muted">
              {target.label}
            </span>
            <span className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-mk-track-faint">
              <span
                className={cn(
                  "block h-full rounded-full",
                  target.done ? "bg-mk-track" : "bg-mk-accent",
                )}
                style={{ width: `${target.progress}%` }}
              />
            </span>
            {target.done ? (
              <Check className="size-3.5 shrink-0 text-mk-faint" />
            ) : (
              <Loader2 className="size-3.5 shrink-0 animate-spin text-mk-faint" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MusicVisual() {
  /**
   * Rhythmic patterns rather than noise: a sequencer only reads as music if the
   * hits land on a grid. "X" is an accent, "x" a normal hit, "." a rest. Each
   * 16-step bar is played twice.
   */
  const lanes = [
    { name: "Drums", pattern: "X..x.x..X..x.x.x" },
    { name: "Bass", pattern: "X...x...X...x..x" },
    { name: "Keys", pattern: "..Xx..Xx..XXxx.." },
    { name: "Strings", pattern: "XXXX....XXXXXX.." },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-xl border border-mk-border bg-mk-bg/60 px-3.5 py-3">
        <p className="truncate text-[13px] text-mk-fg/85">
          slow, warm strings under a documentary voiceover
        </p>
      </div>

      <div className="space-y-2">
        {lanes.map((lane) => {
          const steps = `${lane.pattern}${lane.pattern}`.split("");
          return (
            <div key={lane.name} className="flex items-center gap-3">
              <span className="w-14 shrink-0 text-[11.5px] text-mk-faint">
                {lane.name}
              </span>
              <div className="flex h-5 min-w-0 flex-1 items-center gap-[2px]">
                {steps.map((step, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-full flex-1 rounded-[2px]",
                      step === "X"
                        ? "bg-mk-accent/80"
                        : step === "x"
                          ? "bg-mk-track"
                          : "bg-mk-track-faint",
                    )}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SpeechToTextVisual() {
  const lines = [
    { time: "00:04", speaker: "A", text: "So the launch moved to the ninth?", muted: true },
    { time: "00:07", speaker: "B", text: "It did. Marketing wanted the extra week.", muted: false },
    { time: "00:12", speaker: "A", text: "Then let's cut the demo down to two minutes.", muted: true },
  ];

  return (
    <div className="space-y-2.5">
      {lines.map((line) => (
        <div key={line.time} className="flex items-start gap-3">
          <span className="mt-0.5 shrink-0 font-mono text-[11px] text-mk-faint tabular-nums">
            {line.time}
          </span>
          <VoicePortrait
            photo={line.speaker === "A" ? "christopher" : "joseph"}
            name={`Speaker ${line.speaker}`}
            active={!line.muted}
            size={24}
            className="mt-0.5 size-6"
          />
          <p
            className={cn(
              "text-[13px] leading-relaxed",
              line.muted ? "text-mk-muted" : "text-mk-fg/90",
            )}
          >
            {line.text}
          </p>
        </div>
      ))}

      <div className="flex items-center gap-3 border-t border-mk-border pt-3">
        <div className="h-6 min-w-0 flex-1">
          <Waves seed={19} count={92} active={0.18} />
        </div>
      </div>
    </div>
  );
}

export const CAPABILITY_VISUALS: Record<string, () => React.ReactElement> = {
  "text-to-speech": TextToSpeechVisual,
  "voice-generator": VoiceGeneratorVisual,
  "voice-cloning": VoiceCloningVisual,
  dubbing: DubbingVisual,
  music: MusicVisual,
  "speech-to-text": SpeechToTextVisual,
};
