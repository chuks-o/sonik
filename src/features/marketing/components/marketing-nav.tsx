"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { AuthLink } from "@/features/marketing/components/auth-link";
import { BUTTON_PRIMARY, BUTTON_SECONDARY } from "@/features/marketing/lib/ui";

// Absolute hashes so the links still land on the homepage sections when the
// nav is rendered on /pricing.
const LINKS = [
  { label: "Product", href: "/#product" },
  { label: "Voices", href: "/#voices" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/#faq" },
];

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        // The rule under the nav is permanent from tablet width up; on a
        // phone it appears once the page scrolls, to keep the top clean.
        "md:border-mk-border",
        scrolled || open
          ? "border-mk-border bg-white/85 backdrop-blur-xl"
          : "border-transparent bg-white/0",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md focus-visible:ring-2 focus-visible:ring-mk-accent focus-visible:outline-none"
        >
          <Image src="/logo.svg" alt="" width={22} height={26} priority />
          <span className="text-[17px] font-semibold tracking-tight text-mk-fg">
            Sonic
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-[14px] text-mk-muted transition-colors hover:text-mk-fg focus-visible:ring-2 focus-visible:ring-mk-accent focus-visible:outline-none"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <AuthLink
            href="/sign-in"
            className="rounded-full px-3.5 py-2 text-[14px] text-mk-muted transition-colors hover:text-mk-fg"
          >
            Sign in
          </AuthLink>
          <AuthLink href="/sign-up" className={cn(BUTTON_PRIMARY, "h-10 px-4 text-[14px]")}>
            Start free
          </AuthLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-2 flex size-11 items-center justify-center rounded-full text-mk-fg md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      <div
        id="mobile-nav"
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows] duration-300 md:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0">
          <div className="flex flex-col gap-1 px-5 pt-2 pb-6">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-[16px] text-mk-fg hover:bg-mk-fill"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 grid gap-2">
              <AuthLink href="/sign-in" className={cn(BUTTON_SECONDARY, "w-full")}>
                Sign in
              </AuthLink>
              <AuthLink href="/sign-up" className={cn(BUTTON_PRIMARY, "w-full")}>
                Start free
              </AuthLink>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
