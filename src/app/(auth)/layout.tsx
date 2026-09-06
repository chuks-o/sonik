import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // `.auth-shell` pins these pages to the light palette; they sit outside the
    // marketing theme and never follow its dark toggle.
    <div className="auth-shell relative flex min-h-dvh flex-col overflow-hidden">
      {/* The hero's warm bloom, offset above the card the way it sits above the
          headline on the homepage. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[860px] -translate-x-1/2 rounded-full blur-[110px]"
        style={{ background: "var(--auth-bloom)" }}
      />

      <header className="relative z-10">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-5 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md focus-visible:ring-2 focus-visible:ring-[var(--auth-accent)] focus-visible:outline-none"
          >
            <Image src="/logo.svg" alt="" width={22} height={26} priority />
            <span className="text-lg font-semibold tracking-tight text-[var(--auth-fg)]">
              Sonik
            </span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-[26rem]">{children}</div>
      </main>

      <footer className="relative z-10 px-5 pb-8 sm:px-8">
        <p className="text-center text-[12.5px] text-[var(--auth-faint)]">
          &copy; {new Date().getFullYear()} Sonik
        </p>
      </footer>
    </div>
  );
}
