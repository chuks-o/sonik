import Image from "next/image";

import { cn } from "@/lib/utils";

interface VoicePortraitProps {
  /** Portrait filename without extension, from /public/portraits. */
  photo: string;
  name: string;
  className?: string;
  /** Rendered size in CSS pixels; drives the srcset Next requests. */
  size?: number;
  /** Rings the portrait with the accent. */
  active?: boolean;
  /** Set for above-the-fold portraits so they are not lazy-loaded. */
  priority?: boolean;
}

/**
 * A face for every voice.
 *
 * Real photography rather than generated avatars, cropped square at source so
 * the browser never downloads more pixels than it paints.
 */
export function VoicePortrait({
  photo,
  name,
  className,
  size = 48,
  active,
  priority,
}: VoicePortraitProps) {
  return (
    <span
      className={cn(
        "relative block shrink-0 overflow-hidden rounded-full ring-1 transition-all duration-300",
        active
          ? "ring-2 ring-mk-accent/70"
          : "ring-mk-border-strong",
        className,
      )}
    >
      <Image
        src={`/portraits/${photo}.jpg`}
        alt={name}
        width={size}
        height={size}
        sizes={`${size}px`}
        priority={priority}
        className={cn(
          "size-full object-cover transition-[filter,opacity] duration-500",
          active ? "opacity-100" : "opacity-85 saturate-[0.85]",
        )}
      />
    </span>
  );
}
