import Image from "next/image";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "Text to Speech", href: "#text-to-speech" },
      { label: "AI Voice Generator", href: "#voice-generator" },
      { label: "Voice Cloning", href: "#voice-cloning" },
      { label: "Dubbing", href: "#dubbing" },
      { label: "Music", href: "#music" },
      { label: "Speech to Text", href: "#speech-to-text" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Demo", href: "#demo" },
      { label: "Voices", href: "#voices" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Sign in", href: "/sign-in" },
      { label: "Start free", href: "/sign-up" },
      { label: "Contact", href: "mailto:hello@sonik.app" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Voice cloning policy", href: "#" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-mk-border">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.2fr)_repeat(4,minmax(0,1fr))]">
          <div>
            <div className="flex items-center gap-2">
              <Image src="/logo.svg" alt="" width={20} height={24} />
              <span className="text-[15px] font-semibold tracking-tight">
                Sonik
              </span>
            </div>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-mk-faint">
              Studio-grade speech generation with the controls left switched on.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="mk-label">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[13px] text-mk-muted transition-colors hover:text-mk-fg"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-mk-border pt-6">
          <p className="text-[12px] text-mk-faint">
            &copy; {new Date().getFullYear()} Sonik. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}
