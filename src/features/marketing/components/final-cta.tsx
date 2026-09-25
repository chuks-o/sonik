import { cn } from "@/lib/utils";
import { VOICE_SAMPLES } from "@/features/marketing/data/site";
import { AuthLink } from "@/features/marketing/components/auth-link";
import { Reveal } from "@/features/marketing/components/reveal";
import { VoicePortrait } from "@/features/marketing/components/voice-portrait";
import { BUTTON_PRIMARY, BUTTON_SECONDARY } from "@/features/marketing/lib/ui";

export function FinalCta() {
  return (
    <section className="pt-8 pb-28 sm:pb-36">
      <Reveal className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        {/* The cast, waiting: the page closes on the people it opened with. */}
        <div className="flex justify-center -space-x-3">
          {VOICE_SAMPLES.map((voice) => (
            <VoicePortrait
              key={voice.id}
              photo={voice.photo}
              name={voice.name}
              size={52}
              decorative
              className="size-[52px] ring-4 ring-white"
            />
          ))}
        </div>

        <h2 className="mt-8 text-[2.25rem] leading-[1.06] font-semibold tracking-[-0.035em] text-balance text-mk-fg sm:text-[3rem]">
          Your script is ready to be heard.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[17px] leading-relaxed text-pretty text-mk-muted">
          Start with 10,000 free characters a month. Choose a plan when you
          need more.
        </p>

        <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <AuthLink href="/sign-up" className={cn(BUTTON_PRIMARY, "h-12 px-6 text-[15px]")}>
            Start free
          </AuthLink>
          <a href="/pricing" className={cn(BUTTON_SECONDARY, "h-12 px-6 text-[15px]")}>
            Compare plans
          </a>
        </div>
      </Reveal>
    </section>
  );
}
