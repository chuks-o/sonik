"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { TEXT_MAX_LENGTH } from "@/features/text-to-speech/data/constants";
import { useEntitlement } from "@/features/billing/hooks/use-entitlement";

export function TextInputPanel() {
  const [text, setText] = useState("");
  const router = useRouter();
  const { balance, canSpend } = useEntitlement();

  const fits = canSpend(text.length);

  const handleGenerate = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    router.push(`/app/text-to-speech?text=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="
      rounded-[22px] bg-black/30 p-0.5 shadow-[0_0_0_4px_white]
    ">
      {/* Using px values for border-radius to ensure proper gradient border math (outer - padding = inner). */}
      {/* Standard classes like rounded-4xl use CSS calc() which doesn't align cleanly at corners. */}
      <div className="rounded-[20px] bg-[#F9F9F9] p-1">
        <div className="space-y-4 rounded-2xl bg-white p-4 drop-shadow-xs">
          <Textarea
            placeholder="Start typing or paste your text here..."
            className="min-h-35 resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={TEXT_MAX_LENGTH}
          />

          {/* Bottom info */}

          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className={cn(
                "gap-1.5 border-dashed",
                !fits && "border-destructive/50 text-destructive",
              )}
            >
              <Coins
                className={cn(
                  "size-3",
                  fits ? "text-chart-5" : "text-destructive",
                )}
              />
              <span className="text-xs">
                <span className="tabular-nums">
                  {balance.toLocaleString()}
                </span>{" "}
                characters left
              </span>
            </Badge>
            <span className="text-xs text-muted-foreground">
              {text.length.toLocaleString()} / {TEXT_MAX_LENGTH.toLocaleString()} characters
            </span>
          </div>
        </div>

        {/* Action bar */}

        <div className="flex items-center justify-end p-3">
          {fits ? (
            <Button
              size="sm"
              disabled={!text.trim()}
              onClick={handleGenerate}
              className="w-full lg:w-auto"
            >
              Generate speech
            </Button>
          ) : (
            <Button asChild size="sm" className="w-full lg:w-auto">
              <Link href="/pricing">Upgrade to generate</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}