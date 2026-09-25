/**
 * Single source of truth for landing page copy and data.
 * Everything a non-engineer would want to tweak lives here, not in JSX.
 */

export interface VoiceSample {
  /** Matches the filename in /public/samples/<id>.m4a */
  id: string;
  name: string;
  /** Portrait filename in /public/portraits/<photo>.jpg */
  photo: string;
  tagline: string;
  accent: string;
  category: string;
  /** The line spoken in the sample, shown as a transcript. */
  script: string;
  /** Generation parameters shown on the studio panel. */
  params: {
    temperature: number;
    topP: number;
    topK: number;
    repetitionPenalty: number;
  };
}

/**
 * The cast. Deliberately four: every voice has a real portrait, and repeating a
 * face across two voices would read as a mistake. To add a fifth, drop a square
 * photo into /public/portraits and add an entry here.
 */
export const VOICE_SAMPLES: VoiceSample[] = [
  {
    id: "aria",
    name: "Aria",
    photo: "joseph",
    tagline: "Warm, confident product narration",
    accent: "American",
    category: "Advertising",
    script:
      "Every product has a voice. Sonic makes sure yours sounds like it was recorded in a studio, not generated in a browser tab.",
    params: { temperature: 0.7, topP: 0.9, topK: 50, repetitionPenalty: 1.2 },
  },
  {
    id: "orion",
    name: "Orion",
    photo: "orion",
    tagline: "Measured, literary, built for long-form",
    accent: "British",
    category: "Audiobook",
    script:
      "Chapter one. The harbour lights came on all at once, and for a moment the whole bay looked like it was holding its breath.",
    params: { temperature: 0.55, topP: 0.85, topK: 40, repetitionPenalty: 1.35 },
  },
  {
    id: "juno",
    name: "Juno",
    photo: "christopher",
    tagline: "Bright and unhurried on support calls",
    accent: "Australian",
    category: "Customer service",
    script:
      "Thanks for calling. I can see your order right here, and it looks like it shipped this morning. Want me to text you the tracking link?",
    params: { temperature: 0.8, topP: 0.92, topK: 60, repetitionPenalty: 1.15 },
  },
  {
    id: "vale",
    name: "Vale",
    photo: "aiony",
    tagline: "Low, slow, and deliberately spacious",
    accent: "Irish",
    category: "Meditation",
    script:
      "Take a slow breath in. Hold it for a count of four. And now let it go, gently, all the way to the end.",
    params: { temperature: 0.45, topP: 0.8, topK: 30, repetitionPenalty: 1.4 },
  },
];

export interface SafetyPillar {
  title: string;
  body: string;
}

export const SAFETY: SafetyPillar[] = [
  {
    title: "Consent",
    body: "A cloned voice needs the speaker's permission. We ask you to confirm it, and we keep the record attached to the voice.",
  },
  {
    title: "Provenance",
    body: "Generated audio should be identifiable as generated. Every file Sonic produces stays traceable back to the generation that made it.",
  },
  {
    title: "Accountability",
    body: "Workspaces are auditable. Voices, takes and the people who made them are attributable long after the session ends.",
  },
];

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: "Is there a free plan?",
    a: "Yes. Every workspace gets 10,000 characters a month at no cost, with the full voice library. You only choose a paid plan when you need more characters, voice cloning or commercial rights.",
  },
  {
    q: "What happens when I run out of characters?",
    a: "Generation pauses until your allowance resets, a month after your plan started, or until you move to a larger plan. There is no overage, so you are never billed more than your plan price.",
  },
  {
    q: "What makes Sonic different from other text to speech tools?",
    a: "Most tools give you a voice and a play button. Sonic lets you shape the delivery of every take and keeps the exact settings that produced it, so a read you like is a read you can reproduce.",
  },
  {
    q: "What do I need to clone a voice?",
    a: "A few minutes of clean, single-speaker audio without background noise. You need the rights to the voice, or the speaker's explicit consent, and we ask you to confirm it.",
  },
  {
    q: "Can I use generated audio commercially?",
    a: "Yes, on any paid plan. The free allowance is intended for evaluation and personal projects.",
  },
  {
    q: "Is there an API?",
    a: "Yes. Generation, the voice library and history are all available over HTTP, and the dashboard is built on the same endpoints your integration would call.",
  },
];
