import {z} from "zod";
import {createEnv} from "@t3-oss/env-nextjs";

export const env = createEnv({
  server: {
    POLAR_ACCESS_TOKEN: z.string().min(1),
    POLAR_SERVER: z.enum(["sandbox", "production"]).default("sandbox"),
    // Event name and metadata property the TTS meter filters on.
    POLAR_METER_TTS_GENERATION: z.string().min(1),
    POLAR_METER_TTS_PROPERTY: z.string().min(1),
    // The meter itself. Needed to pick the right entry out of `activeMeters`,
    // which now holds more than one meter per customer.
    POLAR_METER_TTS_ID: z.string().min(1),
    // Event name the voice-creation meter filters on. Must match the meter's
    // filter in Polar exactly, or the events are ingested and never counted.
    POLAR_METER_VOICE_CREATION: z.string().min(1),
    // One product per tier. These are the only products the app will ever open
    // a checkout for — see CHECKOUT_PRODUCT_IDS in features/billing/data/plans.
    POLAR_FREE_TIER_ID: z.string().min(1),
    POLAR_STARTER_TIER_ID: z.string().min(1),
    POLAR_CREATOR_TIER_ID: z.string().min(1),
    POLAR_PRO_TIER_ID: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    APP_URL: z.string().min(1),
    R2_ACCESS_KEY_ID: z.string().min(1),
    R2_SECRET_ACCESS_KEY: z.string().min(1),
    R2_ACCOUNT_ID: z.string().min(1),
    R2_BUCKET_NAME: z.string().min(1),
    CHATTERBOX_API_URL: z.url(),
    CHATTERBOX_API_KEY: z.string().min(1),
  },
  experimental__runtimeEnv: {},
  skipValidation: !!process.env.SKIP_ENV_VALIDATION
});