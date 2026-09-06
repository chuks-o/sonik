"use client";

import { useCallback, useSyncExternalStore } from "react";

export type MarketingTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "sonik-theme";
const CHANGE_EVENT = "sonik:theme-change";

/**
 * Runs before the page paints so the first frame is already in the right
 * theme. Kept as a string because it is injected as an inline script; it must
 * stay dependency-free and never throw in a private-mode browser.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});var t=(s==="light"||s==="dark")?s:(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");document.documentElement.dataset.mkTheme=t;}catch(e){document.documentElement.dataset.mkTheme="dark";}})()`;

function currentTheme(): MarketingTheme {
  return document.documentElement.dataset.mkTheme === "light" ? "light" : "dark";
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

/**
 * The DOM attribute is the source of truth — the inline script writes it before
 * React boots, so state would only ever be a second, staler copy of it.
 */
export function useMarketingTheme() {
  const theme = useSyncExternalStore<MarketingTheme>(
    subscribe,
    currentTheme,
    () => "dark",
  );

  const setTheme = useCallback((next: MarketingTheme) => {
    document.documentElement.dataset.mkTheme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private mode or blocked storage: the choice just will not persist.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const toggle = useCallback(
    () => setTheme(currentTheme() === "dark" ? "light" : "dark"),
    [setTheme],
  );

  return { theme, setTheme, toggle };
}
