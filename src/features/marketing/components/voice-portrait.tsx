import Image from "next/image";

import { cn } from "@/lib/utils";

interface VoicePortraitProps {
  /** Portrait filename without extension, from /public/portraits. */
  photo: string;
  name: string;
  className?: string;
  /** Largest rendered size in CSS pixels; drives the srcset Next requests. */
  size?: number;
  shape?: "circle" | "rounded";
  /** Rings the portrait in the accent: this voice is selected. */
  active?: boolean;
  /** Above-the-fold portraits skip lazy loading. */
  priority?: boolean;
  /** Decorative when a visible name sits beside the portrait. */
  decorative?: boolean;
}

/**
 * A face for every voice. Real photography, one face per voice everywhere
 * on the page, so a name and a face always travel together.
 */
export function VoicePortrait({
  photo,
  name,
  className,
  size = 48,
  shape = "circle",
  active,
  priority,
  decorative,
}: VoicePortraitProps) {
  return (
    <span
      className={cn(
        "relative block shrink-0 overflow-hidden bg-mk-fill",
        shape === "circle" ? "rounded-full" : "rounded-2xl",
        active
          ? "ring-2 ring-mk-accent ring-offset-2 ring-offset-white"
          : "ring-1 ring-black/5",
        className,
      )}
    >
      <Image
        src={`/portraits/${photo}.jpg`}
        alt={decorative ? "" : name}
        width={size}
        height={size}
        sizes={`${size}px`}
        priority={priority}
        className="size-full object-cover"
      />
    </span>
  );
}
