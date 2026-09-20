import {
  FileText,
  Music,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  MusicVisual,
  SpeechToTextVisual,
  VoiceGeneratorVisual,
} from "@/features/marketing/components/capability-visuals";
import { PlatformSection } from "@/features/marketing/components/platform-section";
import {
  DubbingVisual,
  TextToSpeechVisual,
  VoiceCloningVisual,
} from "@/features/marketing/components/platform-visuals";
import { SectionHeading } from "@/features/marketing/components/section-heading";

const SUPPORTING: {
  id: string;
  name: string;
  title: string;
  body: string;
  icon: LucideIcon;
  Visual: () => React.ReactElement;
}[] = [
    {
      id: "voice-generator",
      name: "AI Voice Generator",
      title: "Describe a voice into existence",
      body: "Write the voice you need in plain language and get back candidates that have never belonged to anyone, free of likeness questions.",
      icon: Sparkles,
      Visual: VoiceGeneratorVisual,
    },
    {
      id: "music",
      name: "Music",
      title: "Scores and beds from a sentence",
      body: "Generate a cue that fits the edit, then pull the stems apart to mix it against the voiceover rather than under it.",
      icon: Music,
      Visual: MusicVisual,
    },
    {
      id: "speech-to-text",
      name: "Speech to Text",
      title: "Transcripts that know who spoke",
      body: "Word-level timings and speaker labels, so a recording becomes something you can search, caption and cut against.",
      icon: FileText,
      Visual: SpeechToTextVisual,
    },
  ];

export function Platform() {
  return (
    <div id="capabilities" className="scroll-mt-20">
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading
            title="Six ways to make audio. One engine."
            body="Speech is where Sonic starts, not where it stops. Generation, cloning, translation, music and transcription all run on the same research, so a voice you build in one place behaves the same everywhere else."
          />
        </div>
      </section>

      <PlatformSection
        id="text-to-speech"
        label="Text to Speech"
        title="Speech you can direct, line by line"
        body="Mark up a script with delivery cues, cast a voice from the library, and shape the read with the sampling controls until it lands the way you heard it in your head."
        points={[
          {
            title: "Delivery cues inline",
            body: "Drop [warmly] or [whispers] into the script and the read follows, without splitting the take into fragments.",
          },
          {
            title: "A cast, not a dropdown",
            body: "Voices carry an accent, a register and a category, so choosing one feels like casting rather than picking option four.",
          },
          {
            title: "Reproducible takes",
            body: "The parameters that produced a read are stored with it. Reopen any generation and branch from exactly there.",
          },
        ]}
        visual={<TextToSpeechVisual />}
      />

      <PlatformSection
        id="voice-cloning"
        label="Voice Cloning"
        title="Your own voice, on tap"
        body="Record a few minutes of clean reference audio and Sonic builds a reusable voice your whole workspace can generate against — the same person, available long after the session ends."
        flip
        points={[
          {
            title: "Minutes, not hours",
            body: "A single clean take is enough. No studio booking, no reading a phonetic script for an afternoon.",
          },
          {
            title: "Shared across the workspace",
            body: "Once a voice exists, everyone on the team generates against it, so the brand keeps one voice instead of six.",
          },
          {
            title: "Consent recorded with the voice",
            body: "Permission is captured when the voice is created and stays attached to it, so provenance is never a question later.",
          },
        ]}
        footnote="You need the speaker's permission to clone their voice. We ask you to confirm it every time."
        visual={<VoiceCloningVisual />}
      />

      <PlatformSection
        id="dubbing"
        label="Dubbing"
        title="Carry a performance across languages"
        body="Keep the timing, emphasis and character of the original take while the words change. The same performer, in every language you ship — so a dub stops sounding like a dub."
        points={[
          {
            title: "The performance travels",
            body: "Pacing and emphasis carry over, instead of being flattened into a neutral read in the target language.",
          },
          {
            title: "One voice, many markets",
            body: "Queue every language you need from a single take and collect the finished audio as each one lands.",
          },
          {
            title: "Timed to the original",
            body: "Lines stay aligned to the source, so dubbed audio drops back onto the existing edit without a re-cut.",
          },
        ]}
        visual={<DubbingVisual />}
      />

      {/* The remaining three sit together: real capabilities, less page weight. */}
      <section className="border-t border-mk-border py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div>
            <p className="mk-eyebrow">Also on the platform</p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 lg:grid-cols-3">
            {SUPPORTING.map((item) => (
              <div key={item.id}>
                <article
                  id={item.id}
                  className="group relative flex h-full scroll-mt-24 flex-col"
                >
                  <div className="flex flex-1 items-center rounded-xl border border-mk-border bg-mk-elevated/40 p-5">
                    <div className="w-full">
                      <item.Visual />
                    </div>
                  </div>
                  <div className="pt-5">
                    <div className="flex items-center gap-2">
                      <item.icon className="size-4 text-mk-faint" />
                      <h3 className="text-[13px] font-medium tracking-tight text-mk-fg">
                        {item.name}
                      </h3>
                    </div>
                    <p
                      className={cn(
                        "mt-3 text-[15px] leading-snug font-medium tracking-tight text-balance text-mk-fg",
                      )}
                    >
                      {item.title}
                    </p>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-pretty text-mk-muted">
                      {item.body}
                    </p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
