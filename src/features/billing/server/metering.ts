import "server-only";

import * as Sentry from "@sentry/nextjs";

import { env } from "@/lib/env";
import { polar } from "@/lib/polar";

/**
 * Usage reporting to Polar.
 *
 * These are awaited, not fired and forgotten. The previous `.catch(() => {})`
 * meant a dropped event was unbilled usage that nobody ever found out about,
 * and — now that the balance gates generation — an event that never lands is
 * also an allowance that never decrements, so the customer keeps spending
 * against a balance that should have gone down.
 *
 * A failure here still does not fail the user's request: the work is already
 * done and paid for in compute. It is reported to Sentry instead, loudly.
 */

/** Characters are the billable unit for text-to-speech. */
export function countUnits(text: string): number {
  return text.length;
}

export async function recordTextToSpeechUsage(params: {
  orgId: string;
  units: number;
  generationId: string;
}): Promise<void> {
  try {
    await polar.events.ingest({
      events: [
        {
          name: env.POLAR_METER_TTS_GENERATION,
          externalCustomerId: params.orgId,
          metadata: {
            [env.POLAR_METER_TTS_PROPERTY]: params.units,
            // Polar has no idempotency key on events, so this is what makes a
            // double-ingest detectable after the fact.
            generation_id: params.generationId,
          },
          timestamp: new Date(),
        },
      ],
    });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { scope: "billing.metering", meter: "tts" },
      extra: { ...params },
    });
  }
}

export async function recordVoiceCreationUsage(params: {
  orgId: string;
  voiceId: string;
}): Promise<void> {
  try {
    await polar.events.ingest({
      events: [
        {
          // Must equal the meter's filter value exactly — the meter counts
          // events by name, and a mismatch is silently counted as nothing.
          name: env.POLAR_METER_VOICE_CREATION,
          externalCustomerId: params.orgId,
          metadata: { voice_id: params.voiceId },
          timestamp: new Date(),
        },
      ],
    });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { scope: "billing.metering", meter: "voice_creation" },
      extra: { ...params },
    });
  }
}
