import { Check, Play } from "lucide-react";

import { cn } from "@/lib/utils";
import { placeholderPeaks } from "@/features/marketing/lib/peaks";
import { voiceAvatarUri } from "@/components/voice-avatar/use-voice-avatar";
import { VoicePortrait } from "@/features/marketing/components/voice-portrait";

/*
 * One illustration per capability, each in a different visual language —
 * an editor, a photograph, a timeline, a prompt, a transcript — so the five
 * sections stop reading as one block repeated. What they share is the page's
 * one rule: anything that represents sound is orange.
 */

/** A static waveform. Orange up to `played`, track grey after it. */
function Bars({
  seed,
  count,
  played = 1,
  onAccent,
  className,
}: {
  seed: string;
  count: number;
  played?: number;
  /** Bars drawn on top of an orange block rather than on white. */
  onAccent?: boolean;
  className?: string;
}) {
  const peaks = placeholderPeaks(seed, count);
  const cut = Math.round(count * played);

  return (
    <div aria-hidden="true" className={cn("flex items-center gap-[2px]", className)}>
      {peaks.map((peak, i) => (
        <span
          key={i}
          className={cn(
            "min-h-[2px] flex-1 rounded-full",
            onAccent ? "bg-white/75" : i < cut ? "bg-mk-brand" : "bg-mk-track",
          )}
          style={{ height: `${Math.round(peak * 100)}%` }}
        />
      ))}
    </div>
  );
}

function CardHeader({
  title,
  aside,
}: {
  title: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-mk-border px-5 py-3.5">
      <p className="truncate text-[13.5px] font-medium text-mk-fg">{title}</p>
      {aside}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="shrink-0 rounded-full bg-mk-fill px-2.5 py-1 text-[12px] font-medium text-mk-muted">
      {children}
    </span>
  );
}

/* --- Text to speech: a script with delivery cues, and its take ----------- */

function Cue({ children }: { children: React.ReactNode }) {
  return (
    <span className="mx-0.5 inline-flex -translate-y-px items-center rounded-md border border-mk-border bg-mk-fill px-1.5 py-[3px] align-middle text-[12px] leading-none font-medium text-mk-muted">
      {children}
    </span>
  );
}

export function ScriptVisual() {
  return (
    <div className="relative pt-4">
      {/* Earlier takes, kept: every generation is stored with its settings. */}
      <div aria-hidden="true" className="absolute inset-x-8 top-0 h-10 rounded-2xl border border-mk-border bg-white/60" />
      <div aria-hidden="true" className="absolute inset-x-4 top-2 h-10 rounded-2xl border border-mk-border bg-white/85" />

      <div className="mk-float relative rounded-2xl border border-mk-border bg-white">
        <CardHeader
          title="Launch film narration"
          aside={
            <span className="flex shrink-0 items-center gap-2 rounded-full bg-mk-fill py-1 pr-3 pl-1 text-[12.5px] text-mk-muted">
              <VoicePortrait photo="joseph" name="Aria" size={22} decorative className="size-[22px]" />
              Aria
            </span>
          }
        />
        <p className="px-5 pt-5 text-[15px] leading-[1.95] text-mk-fg">
          This is the new Sonic studio. <Cue>warmly</Cue> Everything you write
          can finally sound the way you hear it. <Cue>pause</Cue> And when a
          take lands, it stays exactly that way.
        </p>
        <div className="flex items-center gap-3 p-5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-mk-brand-deep text-white">
            <Play className="size-3.5 translate-x-px fill-current" />
          </span>
          <Bars seed="tts-launch-film" count={52} played={0.42} className="h-9 min-w-0 flex-1" />
          <span className="mk-num shrink-0 text-[11.5px] text-mk-faint">0:07 / 0:16</span>
        </div>
      </div>
    </div>
  );
}

/* --- Voice cloning: a person, a recording, a voice ----------------------- */

export function CloningVisual() {
  return (
    <div className="relative mx-auto max-w-[440px] pt-7 pb-16">
      <VoicePortrait
        photo="christopher"
        name="Juno"
        size={360}
        shape="rounded"
        decorative
        className="aspect-[4/5] w-[76%] rounded-[24px]"
      />

      <div className="mk-float absolute top-0 right-0 flex items-center gap-2.5 rounded-full border border-mk-border bg-white py-2 pr-4 pl-3">
        <span className="size-2.5 rounded-full bg-red-500" />
        <span className="text-[13px] font-medium text-mk-fg">Recording reference</span>
        <span className="mk-num text-[12px] text-mk-faint">0:42</span>
      </div>

      <div className="mk-lift absolute right-0 bottom-0 w-[66%] rounded-2xl border border-mk-border bg-white p-4 sm:p-5">
        <p className="flex items-center gap-1.5 text-[12.5px] font-medium text-mk-fg">
          <Check className="size-3.5" strokeWidth={2.5} />
          Voice ready
        </p>
        <p className="mt-2 text-[17px] font-semibold tracking-tight text-mk-fg">Juno</p>
        <p className="text-[13px] text-mk-muted">Australian, bright and unhurried</p>
        <Bars seed="juno-first-take" count={34} className="mt-3.5 h-8" />
      </div>
    </div>
  );
}

/* --- Dubbing: one performer, four languages, the same timing ------------- */

const LANES = [
  { code: "EN", label: "English", source: true, segments: [[2, 24], [30, 22], [58, 30]] },
  { code: "ES", label: "Spanish", segments: [[2, 27], [30, 24], [58, 33]] },
  { code: "JA", label: "Japanese", segments: [[2, 22], [30, 20], [58, 28]] },
  { code: "DE", label: "German", segments: [[2, 26], [30, 25], [58, 34]] },
] as const;

// Width of the lane label column plus the gap after it, in px. The playhead is
// positioned against the track area to the right of this.
const LABEL_COLUMN = 116;

export function DubbingVisual() {
  return (
    <div className="mk-float rounded-2xl border border-mk-border bg-white">
      <CardHeader title="Product tour, episode 12" aside={<Pill>4 languages</Pill>} />

      <div className="px-5 pt-3 pb-5">
        <div
          className="grid items-center gap-3"
          style={{ gridTemplateColumns: `${LABEL_COLUMN - 12}px minmax(0,1fr)` }}
        >
          <span />
          <div className="mk-num flex justify-between text-[11px] text-mk-faint">
            <span>0:00</span>
            {/* Five ticks crowd a phone-width track; keep every other one. */}
            <span className="hidden sm:inline">0:05</span>
            <span>0:10</span>
            <span className="hidden sm:inline">0:15</span>
            <span>0:20</span>
          </div>
        </div>

        <div className="relative mt-2">
          {LANES.map((lane) => (
            <div
              key={lane.code}
              className="grid items-center gap-3 py-2"
              style={{ gridTemplateColumns: `${LABEL_COLUMN - 12}px minmax(0,1fr)` }}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                {/* The same face on every lane: it is one performer. */}
                <span className="relative">
                  <VoicePortrait photo="joseph" name="Aria" size={28} decorative className="size-7" />
                  <span className="absolute -right-1.5 -bottom-1 rounded-[5px] bg-white px-1 text-[8.5px] leading-[13px] font-semibold text-mk-fg ring-1 ring-mk-border">
                    {lane.code}
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[12.5px] font-medium text-mk-fg">
                    {lane.label}
                  </span>
                  {"source" in lane && (
                    <span className="block text-[11px] text-mk-faint">Original</span>
                  )}
                </span>
              </div>

              <div className="relative h-8 rounded-md bg-mk-fill-faint">
                {lane.segments.map(([left, width], i) => (
                  <span
                    key={i}
                    className={cn(
                      "absolute inset-y-1 flex items-center overflow-hidden rounded-[5px] px-1.5",
                      "source" in lane ? "bg-mk-brand-deep" : "bg-mk-brand",
                    )}
                    style={{ left: `${left}%`, width: `${width}%` }}
                  >
                    <Bars seed={`${lane.code}-${i}`} count={14} onAccent className="h-4 w-full" />
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* One playhead through every language: the lines stay in sync. */}
          <span
            aria-hidden="true"
            className="absolute inset-y-0 w-[1.5px] bg-mk-fg"
            style={{ left: `calc(${LABEL_COLUMN}px + (100% - ${LABEL_COLUMN}px) * 0.44)` }}
          >
            <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-mk-fg" />
          </span>
        </div>
      </div>
    </div>
  );
}

/* --- Voice design: a description in, faceless candidates out ------------ */

// The drawing is the product's own. Seeds chosen so neither blended hue
// falls in the green range (roughly 65–195 degrees).
const CANDIDATES = [
  { id: "A", seed: "host-19", selected: true },
  { id: "B", seed: "host-31" },
  { id: "C", seed: "host-5" },
];

export function VoiceDesignVisual() {
  return (
    <div className="mk-float rounded-2xl border border-mk-border bg-white p-5">
      <p className="mk-label">Describe the voice</p>
      <p className="mt-2.5 rounded-xl border border-mk-border bg-mk-fill-faint px-4 py-3 text-[14px] leading-relaxed text-mk-fg">
        A calm, low voice for a late-night radio host. Slight rasp, never hurried.
      </p>

      <div className="mt-4 space-y-2">
        {CANDIDATES.map((c) => (
          <div
            key={c.id}
            className={cn(
              "flex items-center gap-3 rounded-xl border px-3 py-2.5",
              c.selected ? "border-mk-border-strong bg-white" : "border-transparent bg-mk-fill-faint",
            )}
          >
            {/* No face: a designed voice belongs to nobody. */}
            {/* eslint-disable-next-line @next/next/no-img-element -- inline SVG data URI */}
            <img src={voiceAvatarUri(c.seed)} alt="" className="size-8 shrink-0 rounded-full" />
            <span className="w-[5.5rem] shrink-0 text-[13px] font-medium text-mk-fg">
              Candidate {c.id}
            </span>
            <Bars seed={`design-${c.id}`} count={28} className="h-6 min-w-0 flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- Speech to text: who said what, and when ----------------------------- */

export function TranscriptVisual() {
  return (
    <div className="mk-float rounded-2xl border border-mk-border bg-white">
      <CardHeader title="Customer interview" aside={<Pill>2 speakers</Pill>} />
      <div className="space-y-4 p-5">
        <TranscriptLine photo="orion" name="Orion" time="0:04">
          When did you first notice the recordings sounded different?
        </TranscriptLine>
        <TranscriptLine photo="christopher" name="Juno" time="0:09">
          The first week, honestly. The{" "}
          <mark className="rounded-[4px] bg-mk-fill-strong px-0.5 font-medium text-mk-fg">
            pacing
          </mark>{" "}
          gave it away. It finally breathed like a person.
        </TranscriptLine>
        <TranscriptLine photo="orion" name="Orion" time="0:15" dim>
          And the rest of the team?
        </TranscriptLine>
      </div>
    </div>
  );
}

function TranscriptLine({
  photo,
  name,
  time,
  dim,
  children,
}: {
  photo: string;
  name: string;
  time: string;
  dim?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex gap-3", dim && "opacity-50")}>
      <VoicePortrait photo={photo} name={name} size={28} decorative className="mt-0.5 size-7" />
      <div className="min-w-0">
        <p className="flex items-baseline gap-2">
          <span className="text-[13px] font-semibold text-mk-fg">{name}</span>
          <span className="mk-num text-[11px] text-mk-faint">{time}</span>
        </p>
        <p className="mt-0.5 text-[14px] leading-relaxed text-mk-fg">{children}</p>
      </div>
    </div>
  );
}
