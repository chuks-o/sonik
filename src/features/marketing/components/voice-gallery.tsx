"use client";

import { useCallback } from "react";
import { Play } from "lucide-react";

import { VOICE_SAMPLES } from "@/features/marketing/data/site";
import {
  SELECT_VOICE_EVENT,
  type SelectVoiceDetail,
} from "@/features/marketing/components/demo-studio";
import { VoicePortrait } from "@/features/marketing/components/voice-portrait";
import { SectionHeading } from "@/features/marketing/components/section-heading";
import { Reveal } from "@/features/marketing/components/reveal";

export function VoiceGallery() {
  // Hand the voice to the hero player and bring the player into view.
  const play = useCallback((id: string) => {
    window.dispatchEvent(
      new CustomEvent<SelectVoiceDetail>(SELECT_VOICE_EVENT, {
        detail: { id, autoplay: true },
      }),
    );
    document.getElementById("demo")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "center",
    });
  }, []);

  return (
    <section id="voices" className="scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            title="Meet the voices"
            body="Each voice has an accent, a register and a job it does best. Press play on any of them to hear it."
          />
        </Reveal>

        <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {VOICE_SAMPLES.map((voice, i) => (
            <Reveal as="li" key={voice.id} delay={i * 70}>
              <button
                type="button"
                onClick={() => play(voice.id)}
                aria-label={`Play ${voice.name}`}
                className="group relative block w-full cursor-pointer overflow-hidden rounded-[22px] focus-visible:ring-2 focus-visible:ring-mk-accent focus-visible:ring-offset-4 focus-visible:outline-none"
              >
                <VoicePortrait
                  photo={voice.photo}
                  name={voice.name}
                  size={320}
                  shape="rounded"
                  decorative
                  className="aspect-[4/5] w-full rounded-[22px] transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="mk-float absolute right-3 bottom-3 flex size-11 items-center justify-center rounded-full bg-mk-brand-deep text-white transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
                  <Play className="size-4 translate-x-px fill-current" />
                </span>
              </button>

              <div className="mt-4 px-1">
                <p className="text-[17px] font-semibold tracking-tight text-mk-fg">
                  {voice.name}
                </p>
                <p className="mt-0.5 text-[14px] text-mk-muted">
                  {voice.accent} accent
                </p>
                <p className="mt-2.5 text-[14px] leading-relaxed text-pretty text-mk-muted">
                  {voice.tagline}
                </p>
                <span className="mt-3 inline-flex rounded-full bg-mk-fill px-2.5 py-1 text-[12px] font-medium text-mk-muted">
                  {voice.category}
                </span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
