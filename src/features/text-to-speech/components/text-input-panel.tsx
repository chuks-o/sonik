"use client";

import { Coins } from "lucide-react";
import { useSelector } from "@tanstack/react-form";

import { SettingsDrawer } from "./settings-drawer";
import { HistoryDrawer } from "./history-drawer";
import { VoiceSelectorButton } from "./voice-selector-button";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useTypedAppFormContext } from "@/hooks/use-app-form";

import { TEXT_MAX_LENGTH } from "@/features/text-to-speech/data/constants";
import { useEntitlement } from "@/features/billing/hooks/use-entitlement";
import { ttsFormOptions } from "./text-to-speech-form";
import { GenerateButton } from "./generate-button";
import { PromptSuggestions } from "./prompt-suggestions";

export function TextInputPanel() {
  const form = useTypedAppFormContext(ttsFormOptions);

  const { balance, canSpend, isPending: isBalancePending } = useEntitlement();

  const text = useSelector(form.store, (s) => s.values.text);
  const isSubmitting = useSelector(form.store, (s) => s.isSubmitting);
  const isValid = useSelector(form.store, (s) => s.isValid);

  // The request is priced in characters, so whether it will be refused is
  // known here — no need to round-trip and explain a 403.
  const fits = canSpend(text.length);
  const isExhausted = !isBalancePending && balance <= 0;

  return (
    <div className="flex h-full min-h-0 flex-col flex-1">
      {/* Text input area */}
      <div className="relative min-h-0 flex-1">
        <form.Field name="text">
          {(field) => (
            <Textarea
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Start typing or paste your text here..."
              className="absolute inset-0 resize-none border-0 bg-transparent p-4 pb-6 lg:p-6 lg:pb-8 text-base! leading-relaxed tracking-tight shadow-none wrap-break-word focus-visible:ring-0"
              maxLength={TEXT_MAX_LENGTH}
              disabled={isSubmitting}
            />
          )}
        </form.Field>
        {/* Bottom fade overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-background to-transparent" />
      </div>
      {/* Action bar */}
      <div className="shrink-0 p-4 lg:p-6">
        {/* Mobile layout */}
        <div className="flex flex-col gap-3 lg:hidden">
          <div className="flex items-center gap-2">
            <SettingsDrawer>
              <VoiceSelectorButton />
            </SettingsDrawer>
            <HistoryDrawer />
          </div>
          <GenerateButton
            className="w-full"
            disabled={isSubmitting}
            isSubmitting={isSubmitting}
            needsUpgrade={isExhausted || !fits}
            onSubmit={() => form.handleSubmit()}
          />
        </div>
        {/* Desktop layout */}
        {text.length > 0 ? (
          <div className="hidden items-center justify-between lg:flex">
            <Badge
              variant="outline"
              className={cn(
                "gap-1.5 border-dashed",
                !fits && "border-destructive/50 text-destructive",
              )}
            >
              <Coins
                className={cn("size-3", fits ? "text-chart-5" : "text-destructive")}
              />
              <span className="text-xs">
                <span className="tabular-nums">
                  {balance.toLocaleString()}
                </span>
                &nbsp;characters left
              </span>
            </Badge>
            <div className="flex items-center gap-3">
              <p className="text-xs tracking-tight">
                {text.length.toLocaleString()}
                <span className="text-muted-foreground">
                  &nbsp;/&nbsp;{TEXT_MAX_LENGTH.toLocaleString()} characters
                </span>
              </p>
              <GenerateButton
                size="sm"
                disabled={isSubmitting || !isValid}
                isSubmitting={isSubmitting}
                needsUpgrade={isExhausted || !fits}
                onSubmit={() => form.handleSubmit()}
              />
            </div>
          </div>
        ) : (
          <div className="hidden lg:block">
            <PromptSuggestions
              onSelect={(prompt) => form.setFieldValue("text", prompt)}
            />
          </div>
        )}
      </div>
    </div>
  );
};