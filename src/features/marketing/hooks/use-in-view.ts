"use client";

import { useEffect, useRef, useState } from "react";

interface Options {
  /** Keep the element marked visible after it first enters. */
  once?: boolean;
  rootMargin?: string;
  threshold?: number;
}

/**
 * Reports whether an element is on screen. Used both for one-shot scroll
 * reveals and for pausing canvas animation loops that have scrolled away.
 */
export function useInView<T extends HTMLElement>({
  once = true,
  rootMargin = "0px 0px -10% 0px",
  threshold = 0,
}: Options = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Without IntersectionObserver, show everything rather than nothing.
    // Deferred to a frame so this stays out of the effect body itself.
    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return { ref, inView };
}
