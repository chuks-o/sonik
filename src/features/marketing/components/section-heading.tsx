import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: React.ReactNode;
  body?: string;
  align?: "center" | "left";
  className?: string;
}

/**
 * Headline and a short deck. Centered by default: the page is built around a
 * single column of attention, and each section opens by restating it.
 */
export function SectionHeading({
  title,
  body,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <h2 className="text-[2rem] leading-[1.08] font-semibold tracking-[-0.035em] text-balance text-mk-fg sm:text-[2.625rem]">
        {title}
      </h2>
      {body && (
        <p
          className={cn(
            "mt-5 max-w-xl text-[16px] leading-[1.65] text-pretty text-mk-muted sm:text-[17px]",
            align === "center" && "mx-auto",
          )}
        >
          {body}
        </p>
      )}
    </div>
  );
}
