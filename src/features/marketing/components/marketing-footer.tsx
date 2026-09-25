import Image from "next/image";
import Link from "next/link";

const LINKS = [
  { label: "Product", href: "/#product" },
  { label: "Voices", href: "/#voices" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "mailto:hello@sonic.app" },
];

export function MarketingFooter() {
  return (
    <footer className="px-3 pb-3 sm:px-6 sm:pb-6">
      <div className="mx-auto max-w-7xl rounded-[36px] bg-mk-surface px-6 pt-16 pb-8 sm:px-10">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="" width={22} height={26} />
            <span className="text-[17px] font-semibold tracking-tight text-mk-fg">
              Sonic
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-mk-muted">
            Text to speech, voice cloning, dubbing and transcription, on one
            set of voices.
          </p>
        </div>

        <div className="mt-14 flex flex-col-reverse items-center justify-between gap-6 border-t border-mk-border pt-7 sm:flex-row">
          <p className="text-[13.5px] text-mk-faint">
            &copy; {new Date().getFullYear()} Sonic
          </p>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[14px] text-mk-muted transition-colors hover:text-mk-fg"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
