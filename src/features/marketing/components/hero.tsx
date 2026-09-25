import { cn } from "@/lib/utils";
import { AuthLink } from "@/features/marketing/components/auth-link";
import { DemoStudio } from "@/features/marketing/components/demo-studio";
import { BUTTON_PRIMARY, BUTTON_SECONDARY } from "@/features/marketing/lib/ui";

export function Hero() {
  return (
    <section className="pt-32 pb-24 sm:pt-52 sm:pb-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mk-enter text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.04em] text-balance text-mk-fg sm:text-[3.5rem] lg:text-[4.25rem]">
            Text that sounds like someone meant it.
          </h1>

          <p style={{ "--enter-delay": "90ms" } as React.CSSProperties} className="mk-enter mx-auto mt-6 max-w-xl text-[17px] leading-[1.6] text-pretty text-mk-muted sm:text-[19px]">
            Sonic turns your writing into natural, directed speech. Clone a
            voice from a single take, carry a performance into other
            languages, and transcribe what was said, all in one place.
          </p>

          <div style={{ "--enter-delay": "170ms" } as React.CSSProperties} className="mk-enter mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <AuthLink href="/sign-up" className={cn(BUTTON_PRIMARY, "h-12 px-6 text-[15px]")}>
              Start free
            </AuthLink>
            <a href="#demo" className={cn(BUTTON_SECONDARY, "h-12 px-6 text-[15px]")}>
              Hear the voices
            </a>
          </div>

          <p style={{ "--enter-delay": "230ms" } as React.CSSProperties} className="mk-enter mt-5 text-[13.5px] text-mk-faint">
            10,000 characters free every month. No card required.
          </p>
        </div>

        {/* The product, framed the way it will be used: pick a voice, press play. */}
        <div id="demo" style={{ "--enter-delay": "320ms" } as React.CSSProperties} className="mk-enter relative mx-auto mt-16 max-w-5xl scroll-mt-28 sm:mt-20">
          <DemoStudio />
        </div>
      </div>
    </section>
  );
}
