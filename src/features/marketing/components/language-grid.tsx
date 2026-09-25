import Image from "next/image";

import { cn } from "@/lib/utils";
import { AuthLink } from "@/features/marketing/components/auth-link";
import { Reveal } from "@/features/marketing/components/reveal";
import { SectionHeading } from "@/features/marketing/components/section-heading";
import { BUTTON_PRIMARY } from "@/features/marketing/lib/ui";

interface Greeting {
  text: string;
  language: string;
  lang: string;
  rtl?: boolean;
}

/** Every language here is one the dubbing model supports. */
const INNER: Greeting[] = [
  { text: "Hola", language: "Spanish", lang: "es" },
  { text: "こんにちは", language: "Japanese", lang: "ja" },
  { text: "Bonjour", language: "French", lang: "fr" },
  { text: "नमस्ते", language: "Hindi", lang: "hi" },
  { text: "Hallo", language: "German", lang: "de" },
  { text: "مرحبا", language: "Arabic", lang: "ar", rtl: true },
];

const OUTER: Greeting[] = [
  { text: "Olá", language: "Portuguese", lang: "pt" },
  { text: "안녕하세요", language: "Korean", lang: "ko" },
  { text: "Ciao", language: "Italian", lang: "it" },
  { text: "你好", language: "Chinese", lang: "zh" },
  { text: "Merhaba", language: "Turkish", lang: "tr" },
  { text: "Γεια σας", language: "Greek", lang: "el" },
  { text: "Hej", language: "Swedish", lang: "sv" },
  { text: "Cześć", language: "Polish", lang: "pl" },
];

function Tile({ greeting }: { greeting: Greeting }) {
  return (
    <div className="mk-float flex size-[var(--tile)] flex-col items-center justify-center rounded-[18px] border border-mk-border bg-white sm:rounded-[22px]">
      <span
        lang={greeting.lang}
        dir={greeting.rtl ? "rtl" : undefined}
        className="max-w-full truncate px-1 text-[12px] font-medium text-mk-fg sm:text-[15px]"
      >
        {greeting.text}
      </span>
      <span className="mt-0.5 hidden text-[10.5px] text-mk-faint sm:block">
        {greeting.language}
      </span>
    </div>
  );
}

/**
 * One ring of greetings orbiting the centre.
 *
 * Three layers, so the maths stays simple: the ring spins; each tile's
 * positioner is placed once at its angle and radius; the tile itself spins
 * the opposite way at the same speed, which cancels the ring's rotation and
 * keeps the text upright.
 */
function Ring({
  greetings,
  radius,
  duration,
  clockwise,
  offset = 0,
}: {
  greetings: Greeting[];
  radius: string;
  duration: number;
  clockwise: boolean;
  offset?: number;
}) {
  const orbit = { "--orbit-duration": `${duration}s` } as React.CSSProperties;

  return (
    <div
      className={cn("mk-orbit absolute top-1/2 left-1/2 size-0", !clockwise && "mk-orbit-reverse")}
      style={orbit}
    >
      {greetings.map((greeting, i) => {
        const angle = offset + (360 / greetings.length) * i;
        return (
          <div
            key={greeting.lang}
            className="absolute"
            style={{
              left: "calc(var(--tile) / -2)",
              top: "calc(var(--tile) / -2)",
              transform: `rotate(${angle}deg) translateX(${radius}) rotate(${-angle}deg)`,
            }}
          >
            <div
              className={cn("mk-orbit", clockwise && "mk-orbit-reverse")}
              style={orbit}
            >
              <Tile greeting={greeting} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * The page's one bold moment: greetings in their own scripts, orbiting Sonic
 * in two rings that turn in opposite directions. The only place the brand
 * gold appears outside the logo.
 */
export function LanguageGrid() {
  return (
    <section className="overflow-hidden py-24 sm:py-32">
      <Reveal className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          title="Speak to every audience in their own language"
          body="Dub a single take into the languages your listeners speak. The same voice carries every one of them."
        />
      </Reveal>

      <Reveal delay={120}>
        <div
          aria-hidden="true"
          className={cn(
            "mk-orbit-field relative mx-auto mt-10 h-[var(--field)] max-w-5xl",
            "[--field:430px] [--r1:104px] [--r2:176px] [--tile:58px]",
            "sm:[--field:620px] sm:[--r1:158px] sm:[--r2:268px] sm:[--tile:86px]",
            // Soften the outer ring as it passes the edges of the section.
            "[mask-image:radial-gradient(closest-side,black_72%,transparent)]",
          )}
        >
          {/* The paths the rings travel. */}
          <span className="absolute top-1/2 left-1/2 size-[calc(var(--r1)*2)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-mk-border-strong/70" />
          <span className="absolute top-1/2 left-1/2 size-[calc(var(--r2)*2)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-mk-border-strong/60" />

          {/* Brand glow behind the centre. */}
          <span
            className="absolute top-1/2 left-1/2 size-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: "radial-gradient(closest-side, rgb(240 138 62 / 0.2), transparent)" }}
          />

          <Ring greetings={INNER} radius="var(--r1)" duration={48} clockwise />
          <Ring greetings={OUTER} radius="var(--r2)" duration={76} clockwise={false} offset={22.5} />

          {/* Sonic at the centre, still: everything else moves around it. */}
          <div className="absolute top-1/2 left-1/2 flex size-[calc(var(--tile)*1.3)] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[24px] border border-mk-brand/40 bg-white mk-lift">
            <Image src="/logo.svg" alt="" width={34} height={40} className="w-7 sm:w-[34px]" />
          </div>
        </div>
      </Reveal>

      <p className="sr-only">
        Languages shown: {[...INNER, ...OUTER].map((g) => g.language).join(", ")}.
      </p>

      <Reveal delay={200} className="mt-8 flex flex-col items-center px-5 text-center">
        <AuthLink href="/sign-up" className={cn(BUTTON_PRIMARY, "h-12 px-6 text-[15px]")}>
          Start free
        </AuthLink>
        <p className="mt-4 text-[13.5px] text-mk-faint">
          10,000 characters a month on us. No card required.
        </p>
      </Reveal>
    </section>
  );
}
