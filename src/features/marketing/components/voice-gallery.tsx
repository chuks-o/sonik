"use client";

import { useCallback } from "react";
import { Play } from "lucide-react";

import { VOICE_SAMPLES } from "@/features/marketing/data/site";
import { placeholderPeaks } from "@/features/marketing/hooks/use-peaks";
import { SELECT_VOICE_EVENT } from "@/features/marketing/components/demo-studio";
import { VoicePortrait } from "@/features/marketing/components/voice-portrait";
import { SectionHeading } from "@/features/marketing/components/section-heading";

const MINI_BUCKETS = 40;

export function VoiceGallery() {
  // Hand the voice to the hero player, then bring it back into view.
  const play = useCallback((id: string) => {
    window.dispatchEvent(new CustomEvent(SELECT_VOICE_EVENT, { detail: id }));
    document.getElementById("demo")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "center",
    });
  }, []);

  return (
    <section id="voices" className="scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading eyebrow="The library"
          title="Meet the cast"
          body="Every voice carries an accent, a register and a category, so you search the library the way a casting director would. Pick one and it loads into the player above."
        />

        <div className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {VOICE_SAMPLES.map((voice) => {
            const peaks = placeholderPeaks(voice.id, MINI_BUCKETS);
            return (
              <div key={voice.id}>
                <button
                  type="button"
                  onClick={() => play(voice.id)}
                  aria-label={`Load ${voice.name} into the player`}
                  className="group mk-hairline relative h-full w-full overflow-hidden rounded-2xl border border-mk-border bg-mk-elevated/50 p-5 text-left transition-all duration-500 hover:border-mk-accent/40 hover:bg-mk-elevated focus-visible:ring-2 focus-visible:ring-mk-accent-soft focus-visible:outline-none"
                >
                  {/* Portrait and name on one row; the tagline gets the full
                      card width below, so every card wraps the same way. */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <VoicePortrait
                        photo={voice.photo}
                        name={voice.name}
                        size={44}
                        className="size-11 transition-transform duration-500 group-hover:-translate-y-0.5"
                      />
                      <h3 className="truncate text-[15px] font-medium tracking-tight text-mk-fg">
                        {voice.name}
                      </h3>
                    </div>
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-mk-border bg-mk-fill text-mk-muted transition-all duration-300 group-hover:scale-110 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-mk-accent-soft group-hover:to-mk-accent-deep group-hover:text-white">
                      <Play className="size-3.5 translate-x-[1px] fill-current" />
                    </span>
                  </div>

                  {/* Reserved height keeps the waveforms on one line across cards. */}
                  <p className="mt-4 min-h-[2.5rem] text-[13px] leading-snug text-mk-muted">
                    {voice.tagline}
                  </p>

                  {/* Static waveform thumbnail; it fills with accent on hover. */}
                  <div
                    aria-hidden="true"
                    className="mt-3 flex h-9 items-center gap-[2px]"
                  >
                    {peaks.map((peak, j) => (
                      <span
                        key={j}
                        className="min-h-[2px] flex-1 rounded-full bg-mk-track transition-colors duration-500 group-hover:bg-mk-accent-soft/70"
                        style={{
                          height: `${Math.round(peak * 100)}%`,
                          transitionDelay: `${j * 8}ms`,
                        }}
                      />
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <span className="rounded-md border border-mk-border px-2 py-0.5 text-[11px] text-mk-faint">
                      {voice.accent}
                    </span>
                    <span className="rounded-md border border-mk-border px-2 py-0.5 text-[11px] text-mk-faint">
                      {voice.category}
                    </span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
