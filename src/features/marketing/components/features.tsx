import {
  AudioLines,
  FileText,
  Languages,
  Mic,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { SectionHeading } from "@/features/marketing/components/section-heading";
import { Reveal } from "@/features/marketing/components/reveal";
import {
  CloningVisual,
  DubbingVisual,
  ScriptVisual,
  TranscriptVisual,
  VoiceDesignVisual,
} from "@/features/marketing/components/feature-visuals";

interface Point {
  title: string;
  body: string;
}

/** Names the capability, since the headline beneath it names the benefit. */
function CapabilityName({ icon: Icon, name }: { icon: LucideIcon; name: string }) {
  return (
    <p className="flex items-center gap-2 text-[14px] font-medium text-mk-muted">
      <Icon aria-hidden="true" className="size-4" />
      {name}
    </p>
  );
}

function Feature({
  id,
  icon,
  name,
  title,
  body,
  points,
  note,
  visual,
  flip,
}: {
  id: string;
  icon: LucideIcon;
  name: string;
  title: string;
  body: string;
  points: Point[];
  note?: string;
  visual: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-14 sm:py-20">
      <div
        className={cn(
          "mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20",
          flip && "lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]",
        )}
      >
        <Reveal className={cn("min-w-0", flip && "lg:order-2")}>
          <CapabilityName icon={icon} name={name} />
          <h3 className="mt-4 text-[1.875rem] leading-[1.1] font-semibold tracking-[-0.03em] text-balance text-mk-fg sm:text-[2.25rem]">
            {title}
          </h3>
          <p className="mt-4 max-w-md text-[16.5px] leading-[1.65] text-pretty text-mk-muted">
            {body}
          </p>

          <dl className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {points.map((point) => (
              <div key={point.title}>
                <dt className="text-[15px] font-semibold tracking-tight text-mk-fg">
                  {point.title}
                </dt>
                <dd className="mt-1.5 text-[14.5px] leading-relaxed text-pretty text-mk-muted">
                  {point.body}
                </dd>
              </div>
            ))}
          </dl>

          {note && <p className="mt-8 text-[13.5px] text-mk-faint">{note}</p>}
        </Reveal>

        <Reveal
            delay={110}
            className={cn("min-w-0 rounded-[28px] bg-mk-surface p-5 sm:p-9", flip && "lg:order-1")}
          >
          {visual}
        </Reveal>
      </div>
    </section>
  );
}

export function Features() {
  return (
    <div id="product" className="scroll-mt-20">
      <section className="px-5 pt-12 pb-6 sm:px-8 sm:pt-16">
        <Reveal>
          <SectionHeading
            title="One studio for every kind of voice work"
            body="Write it, clone it, translate it or transcribe it. Every tool shares the same voices, so one you build once sounds the same everywhere."
          />
        </Reveal>
      </section>

      <Feature
        id="text-to-speech"
        icon={AudioLines}
        name="Text to speech"
        title="Direct the read, line by line"
        body="Write the script, choose a voice, and mark where it should soften, slow down or pause. The read follows your cues instead of guessing."
        points={[
          {
            title: "Cues inside the script",
            body: "Type [warmly] or [pause] where you want it. No splitting a take into fragments to fix one line.",
          },
          {
            title: "Every take is kept",
            body: "Each generation is saved with the settings that made it, so a read you like is a read you can reproduce.",
          },
        ]}
        visual={<ScriptVisual />}
      />

      <Feature
        id="voice-cloning"
        icon={Mic}
        name="Voice cloning"
        title="Your voice, from a single take"
        body="Record a few minutes of clean audio and Sonic builds a voice your whole workspace can use, long after the recording session ends."
        flip
        points={[
          {
            title: "Minutes, not a studio day",
            body: "One clean take is enough. No booking a booth, no reading phonetic scripts for an afternoon.",
          },
          {
            title: "One voice for the team",
            body: "Everyone generates against the same voice, so your brand keeps one sound instead of six.",
          },
        ]}
        note="You need the speaker's permission to clone their voice. We ask you to confirm it every time."
        visual={<CloningVisual />}
      />

      <Feature
        id="dubbing"
        icon={Languages}
        name="Dubbing"
        title="The same performance, in every language"
        body="Keep the timing, emphasis and character of the original while the words change, so a dub stops sounding like a dub."
        points={[
          {
            title: "Timed to the original",
            body: "Lines stay aligned to the source, so dubbed audio drops back into your edit without a re-cut.",
          },
          {
            title: "Many markets, one take",
            body: "Queue every language from a single recording and collect each one as it finishes.",
          },
        ]}
        visual={<DubbingVisual />}
      />

      {/* Two more tools, given less page weight but the same care. */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 sm:px-8 lg:grid-cols-2">
          <Reveal className="h-full">
            <SmallFeature
              id="voice-design"
              icon={Sparkles}
              name="Voice design"
              title="Describe a voice that doesn't exist yet"
              body="Write the voice you need in plain words and get candidates that belong to no one, so there's no likeness to clear."
              visual={<VoiceDesignVisual />}
            />
          </Reveal>
          <Reveal delay={110} className="h-full">
            <SmallFeature
              id="speech-to-text"
              icon={FileText}
              name="Speech to text"
              title="Transcripts that know who spoke"
              body="Word-level timing and speaker labels turn any recording into something you can search, caption and cut."
              visual={<TranscriptVisual />}
            />
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function SmallFeature({
  id,
  icon,
  name,
  title,
  body,
  visual,
}: {
  id: string;
  icon: LucideIcon;
  name: string;
  title: string;
  body: string;
  visual: React.ReactNode;
}) {
  return (
    <article
      id={id}
      className="flex h-full scroll-mt-24 flex-col rounded-[28px] bg-mk-surface p-5 sm:p-8"
    >
      <div className="flex-1">{visual}</div>
      <div className="mt-8 px-1">
        <CapabilityName icon={icon} name={name} />
        <h3 className="mt-3 text-[1.375rem] leading-[1.2] font-semibold tracking-[-0.025em] text-balance text-mk-fg sm:text-[1.5rem]">
          {title}
        </h3>
        <p className="mt-2.5 max-w-md text-[15px] leading-relaxed text-pretty text-mk-muted">
          {body}
        </p>
      </div>
    </article>
  );
}
