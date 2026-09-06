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
      "Every product has a voice. Sonik makes sure yours sounds like it was recorded in a studio, not generated in a browser tab.",
    params: { temperature: 0.7, topP: 0.9, topK: 50, repetitionPenalty: 1.2 },
  },
  {
    id: "orion",
    name: "Orion",
    photo: "vicky",
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

export interface Feature {
  title: string;
  body: string;
  /** Lucide icon name, resolved in the component. */
  icon: string;
}

/**
 * Deliberately short. These are properties of the platform rather than things
 * you make with it, so they sit as a quiet band between the two big sections.
 */
export const FEATURES: Feature[] = [
  {
    icon: "SlidersHorizontal",
    title: "Direct the performance",
    body: "Sampling controls exposed on every generation, not buried behind a preset.",
  },
  {
    icon: "History",
    title: "Nothing is ever lost",
    body: "Every take is stored with the text and parameters that produced it.",
  },
  {
    icon: "Users",
    title: "Built for teams, not seats",
    body: "Workspaces scope voices, history and billing to the organisation.",
  },
  {
    icon: "Terminal",
    title: "The same engine over HTTP",
    body: "Everything the dashboard does is available as an API you can ship on.",
  },
];

export interface Capability {
  id: string;
  /** Short name used in the hero rail and the section nav. */
  name: string;
  title: string;
  body: string;
  icon: string;
  /** Tailwind column span on the 12-column desktop grid. */
  span: string;
}

/** The full surface of the product. */
export const CAPABILITIES: Capability[] = [
  {
    id: "text-to-speech",
    name: "Text to Speech",
    title: "Speech you can direct, line by line",
    body: "Mark up a script with delivery cues, choose a voice, and shape the read with temperature, top-p, top-k and repetition penalty until it lands.",
    icon: "AudioLines",
    span: "lg:col-span-7",
  },
  {
    id: "voice-generator",
    name: "AI Voice Generator",
    title: "Describe a voice into existence",
    body: "Write the voice you need in plain language and get back candidates that have never belonged to anyone, free of likeness questions.",
    icon: "Sparkles",
    span: "lg:col-span-5",
  },
  {
    id: "voice-cloning",
    name: "Voice Cloning",
    title: "Your own voice, on tap",
    body: "Upload a few minutes of clean reference audio and Sonik builds a reusable voice your whole workspace can generate against.",
    icon: "Copy",
    span: "lg:col-span-5",
  },
  {
    id: "dubbing",
    name: "Dubbing",
    title: "Carry a performance across languages",
    body: "Keep the timing, emphasis and character of the original take while the words change, so a dub stops sounding like a dub.",
    icon: "Languages",
    span: "lg:col-span-7",
  },
  {
    id: "music",
    name: "Music",
    title: "Scores and beds from a sentence",
    body: "Generate a cue that fits the edit, then pull the stems apart to mix it against the voiceover rather than under it.",
    icon: "Music",
    span: "lg:col-span-6",
  },
  {
    id: "speech-to-text",
    name: "Speech to Text",
    title: "Transcripts that know who spoke",
    body: "Word-level timings and speaker labels, so a recording becomes something you can search, caption and cut against.",
    icon: "FileText",
    span: "lg:col-span-6",
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
    body: "Generated audio should be identifiable as generated. Every file Sonik produces stays traceable back to the generation that made it.",
  },
  {
    title: "Accountability",
    body: "Workspaces are auditable. Voices, takes and the people who made them are attributable long after the session ends.",
  },
];

export interface Step {
  label: string;
  title: string;
  body: string;
}

export const STEPS: Step[] = [
  {
    label: "01",
    title: "Choose or clone a voice",
    body: "Start from the curated library, or upload a reference take and make the voice your own.",
  },
  {
    label: "02",
    title: "Write and direct",
    body: "Paste the script, then shape delivery with the generation controls until the read lands.",
  },
  {
    label: "03",
    title: "Ship the audio",
    body: "Download the file, or call the same generation from your product over the API.",
  },
];

export interface PricingTier {
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

export const PRICING: PricingTier[] = [
  {
    name: "Studio",
    price: "$0",
    cadence: "to start",
    blurb: "For trying the engine on real scripts.",
    features: [
      "10,000 characters a month",
      "Full system voice library",
      "Standard generation queue",
      "Personal workspace",
    ],
    cta: "Start free",
  },
  {
    name: "Producer",
    price: "$29",
    cadence: "per month",
    blurb: "For people shipping audio every week.",
    features: [
      "500,000 characters a month",
      "5 cloned voices",
      "Priority generation queue",
      "Team workspace and shared history",
      "Commercial usage rights",
    ],
    cta: "Start free trial",
    featured: true,
  },
  {
    name: "Label",
    price: "Custom",
    cadence: "pricing",
    blurb: "For products with speech in the critical path.",
    features: [
      "Volume character pricing",
      "Unlimited cloned voices",
      "Dedicated throughput",
      "SSO and audit logging",
      "Support with an SLA",
    ],
    cta: "Talk to us",
  },
];

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: "What makes the output different from a generic TTS API?",
    a: "Most APIs give you a voice and a play button. Sonik exposes the sampling parameters behind the model, so you can direct the delivery the way you would direct a session musician, then keep the exact settings that worked.",
  },
  {
    q: "Can I use generated audio commercially?",
    a: "Yes on the Producer plan and above. The free Studio plan is intended for evaluation and personal projects.",
  },
  {
    q: "What do I need to clone a voice?",
    a: "A few minutes of clean, single-speaker audio with no music or background noise. You need the rights or explicit consent to use the voice you upload.",
  },
  {
    q: "Where is my audio stored?",
    a: "Generations are written to object storage scoped to your workspace, and served through short-lived signed URLs. Deleting a generation removes the underlying file.",
  },
  {
    q: "Is there an API?",
    a: "Yes. Generation, the voice library and history are all available over HTTP, and the dashboard is built on the same endpoints your integration would call.",
  },
  {
    q: "How fast is generation?",
    a: "A typical paragraph returns in a few seconds. Longer scripts stream progress, and Producer workspaces run on a priority queue.",
  },
];

export const USE_CASES = [
  "Audiobooks",
  "E-learning",
  "Voice agents",
  "Podcast intros",
  "Product demos",
  "IVR and support",
  "Game dialogue",
  "Ad reads",
  "Accessibility",
  "Meditation apps",
] as const;
