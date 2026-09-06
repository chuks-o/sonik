"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { AuthLink } from "@/features/marketing/components/auth-link";
import { ThemeToggle } from "@/features/marketing/components/theme-toggle";

const LINKS = [
  { label: "Demo", href: "#demo" },
  { label: "Platform", href: "#capabilities" },
  { label: "Voices", href: "#voices" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Passive listener with a cheap threshold check; no layout reads.
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-mk-border bg-mk-bg/70 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md focus-visible:ring-2 focus-visible:ring-mk-accent-soft focus-visible:outline-none"
        >
          <Image src="/logo.svg" alt="" width={22} height={26} priority />
          <span className="text-lg font-semibold tracking-tight">Sonik</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-[13px] text-mk-muted transition-colors hover:text-mk-fg"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <AuthLink
            href="/sign-in"
            className="rounded-lg px-3 py-2 text-[13px] text-mk-muted transition-colors hover:text-mk-fg"
          >
            Sign in
          </AuthLink>
          <AuthLink
            href="/sign-up"
            className="rounded-lg bg-mk-fg px-3.5 py-2 text-[13px] font-medium text-mk-bg transition-transform duration-200 hover:scale-[1.03] active:scale-95"
          >
            Start free
          </AuthLink>
        </div>

        <div className="flex items-center gap-1.5 md:hidden">
          <ThemeToggle />
          <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-2 flex size-10 items-center justify-center rounded-lg text-mk-muted"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <div
        className={cn(
          "grid overflow-hidden border-mk-border bg-mk-bg/95 backdrop-blur-xl transition-all duration-400 md:hidden",
          open
            ? "grid-rows-[1fr] border-b opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0">
          <div className="flex flex-col gap-1 px-5 pt-2 pb-6">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-[15px] text-mk-muted transition-colors hover:text-mk-fg"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 grid gap-2">
              <AuthLink
                href="/sign-in"
                className="rounded-xl border border-mk-border px-4 py-3 text-center text-[14px] text-mk-fg"
              >
                Sign in
              </AuthLink>
              <AuthLink
                href="/sign-up"
                className="rounded-xl bg-mk-fg px-4 py-3 text-center text-[14px] font-medium text-mk-bg"
              >
                Start free
              </AuthLink>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
