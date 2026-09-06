"use client";

import {
  AudioLines,
  Copy,
  FileText,
  Languages,
  Music,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { CAPABILITIES } from "@/features/marketing/data/site";

const ICONS: Record<string, LucideIcon> = {
  AudioLines,
  Sparkles,
  Copy,
  Languages,
  Music,
  FileText,
};

/**
 * The platform surface, stated immediately under the hero demo. Each pill jumps
 * to that capability's card so the rail doubles as a table of contents.
 */
export function CapabilityRail() {
  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "center",
    });
  };

  return (
    <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible">
      {CAPABILITIES.map((capability) => {
        const Icon = ICONS[capability.icon] ?? AudioLines;
        return (
          <button
            key={capability.id}
            type="button"
            onClick={() => jump(capability.id)}
            className="group flex shrink-0 snap-start items-center gap-2 rounded-full border border-mk-border bg-mk-fill px-3.5 py-2 text-[12.5px] whitespace-nowrap text-mk-muted backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-mk-accent/40 hover:bg-mk-accent/10 hover:text-mk-fg focus-visible:ring-2 focus-visible:ring-mk-accent-soft focus-visible:outline-none"
          >
            <Icon className="size-3.5 text-mk-faint transition-colors group-hover:text-mk-accent-soft" />
            {capability.name}
          </button>
        );
      })}
    </div>
  );
}
