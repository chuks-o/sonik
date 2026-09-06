import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  body?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * Marker, headline, deck — stacked in a single left-aligned column.
 *
 * The supporting copy sits directly under the headline at a constrained
 * measure rather than off in a second column: one reading path instead of two,
 * and the deck reads as belonging to the headline rather than beside it.
 */
export function SectionHeading({
  eyebrow,
  title,
  body,
  action,
  className,
}: SectionHeadingProps) {
  const label = eyebrow && <p className="mk-eyebrow">{eyebrow}</p>;

  return (
    <div className={cn("max-w-3xl", className)}>
      {label}
      <h2
        className={cn(
          "text-[2rem] leading-[1.05] font-semibold tracking-[-0.032em] text-balance sm:text-[2.75rem]",
          label && "mt-4",
        )}
      >
        {title}
      </h2>
      {body && (
        // ~65 characters: long enough for a real thought, short enough to scan.
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-pretty text-mk-muted sm:text-[16px]">
          {body}
        </p>
      )}
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
