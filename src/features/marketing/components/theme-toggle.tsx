"use client";

import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { useMarketingTheme } from "@/features/marketing/hooks/use-marketing-theme";

/**
 * Two icons stacked in one box, cross-faded and rotated on change, so the
 * control never reflows the nav.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useMarketingTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={!isDark}
      title={isDark ? "Light mode" : "Dark mode"}
      className={cn(
        "relative flex size-9 shrink-0 items-center justify-center rounded-lg border border-mk-border bg-mk-fill text-mk-muted transition-colors duration-300 hover:border-mk-border-strong hover:text-mk-fg focus-visible:ring-2 focus-visible:ring-mk-accent-soft focus-visible:outline-none",
        className,
      )}
    >
      <Sun
        aria-hidden="true"
        className={cn(
          "absolute size-4 transition-all duration-400",
          isDark
            ? "scale-50 -rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100",
        )}
      />
      <Moon
        aria-hidden="true"
        className={cn(
          "absolute size-4 transition-all duration-400",
          isDark
            ? "scale-100 rotate-0 opacity-100"
            : "scale-50 rotate-90 opacity-0",
        )}
      />
    </button>
  );
}
