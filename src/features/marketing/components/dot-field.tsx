"use client";

import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";
import { useMarketingTheme } from "@/features/marketing/hooks/use-marketing-theme";

// three is ~150KB gzipped, so it loads in its own chunk after first paint and
// never blocks the headline. No SSR: it needs a real canvas.
const DottedSurface = dynamic(
  () => import("@/components/ui/dotted-surface").then((m) => m.DottedSurface),
  { ssr: false },
);

type DotFieldProps = {
  className?: string;
  size?: number;
  opacity?: number;
  amplitude?: number;
};

/**
 * The dotted surface tuned for this site: warm dots, low opacity, and masked so
 * it fades out before it reaches any text. It is a floor for the composition,
 * not a feature.
 */
export function DotField({
  className,
  size = 5,
  opacity = 0.45,
  amplitude = 30,
}: DotFieldProps) {
  const { theme } = useMarketingTheme();

  return (
    <DottedSurface
      size={size}
      opacity={theme === "dark" ? opacity : opacity * 0.75}
      amplitude={amplitude}
      color={theme === "dark" ? "#e08a42" : "#b8642a"}
      className={cn(
        // z-0, not the primitive's -z-10: a negative index would drop the
        // canvas behind `.marketing`'s own background and render it invisible.
        "z-0 [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)]",
        className,
      )}
    />
  );
}
