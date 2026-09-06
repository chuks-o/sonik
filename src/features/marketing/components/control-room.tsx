"use client";

import { useMemo, useState } from "react";

import { SectionHeading } from "@/features/marketing/components/section-heading";

const BARS = 56;

interface Control {
  key: "temperature" | "topP" | "topK" | "repetitionPenalty";
  label: string;
  mono: string;
  min: number;
  max: number;
  step: number;
  blurb: string;
}

const CONTROLS: Control[] = [
  {
    key: "temperature",
    label: "Temperature",
    mono: "temperature",
    min: 0.1,
    max: 1.2,
    step: 0.05,
    blurb: "How much the delivery is allowed to vary from the safest read.",
  },
  {
    key: "topP",
    label: "Top-p",
    mono: "top_p",
    min: 0.5,
    max: 1,
    step: 0.01,
    blurb: "Trims the long tail of unlikely acoustic choices.",
  },
  {
    key: "topK",
    label: "Top-k",
    mono: "top_k",
    min: 10,
    max: 100,
    step: 1,
    blurb: "Caps how many candidates the sampler considers per step.",
  },
  {
    key: "repetitionPenalty",
    label: "Repetition penalty",
    mono: "rep_penalty",
    min: 1,
    max: 2,
    step: 0.05,
    blurb: "Discourages the flat, looping cadence long scripts drift into.",
  },
];

/** Small deterministic PRNG so the illustration is stable between renders. */
function seeded(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export function ControlRoom() {
  const [values, setValues] = useState({
    temperature: 0.7,
    topP: 0.9,
    topK: 50,
    repetitionPenalty: 1.2,
  });

  // An illustration, not a simulation: each control maps onto a visible
  // property of the shape so the trade-offs read at a glance.
  const bars = useMemo(() => {
    const jitter = values.temperature; // variance
    const smooth = values.topP; // envelope tightness
    const detail = values.topK / 100; // high-frequency content
    const damp = values.repetitionPenalty - 1; // breaks up periodicity

    return Array.from({ length: BARS }, (_, i) => {
      const t = i / (BARS - 1);
      const envelope = Math.sin(t * Math.PI) ** (1.5 - smooth);
      const carrier = Math.abs(Math.sin(t * Math.PI * (3 + damp * 5)));
      const noise = (seeded(i, 1) - 0.5) * jitter * 0.9;
      const grain = (seeded(i, 2) - 0.5) * detail * 0.5;
      const value = envelope * (0.45 + carrier * 0.4) + noise * 0.35 + grain;
      return Math.min(1, Math.max(0.06, value));
    });
  }, [values]);

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading eyebrow="The controls"
          title="Direct the read, don't reroll it"
          body="These are the same four parameters the app exposes on every generation. Drag them to see how much of the performance is actually under your hand."
        />

        <div className="mt-14">
          <div className="mk-hairline grid overflow-hidden rounded-3xl border border-mk-border bg-mk-elevated/50 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
            {/* Visualisation */}
            <div className="relative flex min-h-[240px] items-center justify-center overflow-hidden border-b border-mk-border p-8 lg:border-r lg:border-b-0">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{ background: "var(--mk-glow)" }}
              />
              <div
                aria-hidden="true"
                className="relative flex h-40 w-full items-center gap-[3px]"
              >
                {bars.map((height, i) => (
                  <span
                    key={i}
                    className="min-h-[3px] flex-1 rounded-full bg-gradient-to-t from-mk-accent-deep/80 via-mk-accent/85 to-mk-accent-soft/70"
                    style={{
                      height: `${Math.round(height * 100)}%`,
                      // Staggered easing makes a drag feel like one liquid shape.
                      transition: `height 420ms cubic-bezier(0.22,1,0.36,1) ${i * 4}ms`,
                    }}
                  />
                ))}
              </div>
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 mk-label text-center">
                An illustration, not a live generation
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col justify-center gap-6 p-6 sm:p-8">
              {CONTROLS.map((control) => (
                <div key={control.key}>
                  <div className="flex items-baseline justify-between gap-3">
                    <label
                      htmlFor={`control-${control.key}`}
                      className="text-[13px] font-medium text-mk-fg"
                    >
                      {control.label}
                    </label>
                    <span className="font-mono text-[11px] text-mk-accent-soft tabular-nums">
                      {values[control.key]}
                    </span>
                  </div>
                  <input
                    id={`control-${control.key}`}
                    type="range"
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={values[control.key]}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        [control.key]: Number(e.target.value),
                      }))
                    }
                    aria-describedby={`control-${control.key}-help`}
                    className="mt-2.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-mk-track-faint outline-none [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-mk-accent-soft [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-mk-accent-soft [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_var(--mk-thumb-ring)] [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-110 focus-visible:ring-2 focus-visible:ring-mk-accent-soft"
                  />
                  <p
                    id={`control-${control.key}-help`}
                    className="mt-2 text-[12px] leading-relaxed text-mk-faint"
                  >
                    {control.blurb}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
