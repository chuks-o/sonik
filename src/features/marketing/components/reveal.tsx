"use client";

import { type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { useInView } from "@/features/marketing/hooks/use-in-view";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger, in milliseconds. */
  delay?: number;
  /** Travel distance in pixels; 0 gives a pure fade. */
  y?: number;
  /** Starting scale, for cards that should settle rather than slide. */
  scale?: number;
  as?: ElementType;
}

/**
 * One-shot scroll reveal. The animation itself is pure CSS (see `.reveal` in
 * globals.css) so this only ever toggles a data attribute.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  scale = 1,
  as: Tag = "div",
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      data-shown={inView}
      className={cn("reveal", className)}
      style={
        {
          "--reveal-delay": `${delay}ms`,
          "--reveal-y": `${y}px`,
          "--reveal-s": scale,
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
