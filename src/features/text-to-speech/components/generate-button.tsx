"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function GenerateButton({
  size,
  disabled,
  isSubmitting,
  needsUpgrade,
  onSubmit,
  className,
}: {
  size?: "default" | "sm";
  disabled: boolean;
  isSubmitting: boolean;
  /** Balance cannot cover this request — offer the fix instead of the action. */
  needsUpgrade?: boolean;
  onSubmit: () => void;
  className?: string;
}) {
  // The best out-of-quota error is the one that never fires: send the user to
  // pricing rather than letting them submit into a 403.
  if (needsUpgrade && !isSubmitting) {
    return (
      <Button asChild size={size} className={className}>
        <Link href="/pricing">Upgrade to generate</Link>
      </Button>
    );
  }

  return (
    <Button
      size={size}
      className={className}
      onClick={onSubmit}
      disabled={disabled}
    >
      {isSubmitting ? (
        <>
          <Spinner className="size-3" />
          Generating...
        </>
      ) : (
        "Generate speech"
      )}
    </Button>
  );
};
