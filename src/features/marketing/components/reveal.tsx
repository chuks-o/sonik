"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  /** Milliseconds to wait after entering view; used to stagger siblings. */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "article";
  id?: string;
}

/**
 * Rises into place the first time it scrolls into view, then stays put.
 *
 * Plays once: repeating on every pass reads as fidgeting. Hidden only under
 * `@media (scripting: enabled)` in globals.css, so without JavaScript the
 * content is simply there.
 */
export function Reveal({ children, delay = 0, className, as = "div", id }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Written straight to the DOM: nothing else depends on it, so a React
    // state update here would only cost a re-render per element.
    const show = () => el.setAttribute("data-shown", "true");

    // Reduced motion, or no observer: show immediately rather than never.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      show();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          io.disconnect();
        }
      },
      // Trigger slightly before the element is fully in view, so it has
      // finished moving by the time the eye lands on it.
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as;
  return (
    <Tag
      // A union of intrinsic elements confuses the ref type; all of them are
      // HTMLElements.
      ref={ref as React.Ref<never>}
      id={id}
      className={cn("mk-reveal", className)}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
