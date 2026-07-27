"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import LanguageDropdown from "@/components/LanguageDropdown";

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/", label: t("home") },
    { href: "/tours", label: t("tours") },
    { href: "/destinations", label: t("destinations") },
    { href: "/gallery", label: t("gallery") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-navy/8">
      <div
        className={`mx-auto max-w-6xl px-5 sm:px-8 grid grid-cols-[auto_1fr_auto] items-center gap-6 lg:gap-10 transition-all duration-300 ${
          scrolled ? "h-16" : "h-20 sm:h-24"
        }`}
      >
        <Link href="/" className="flex items-center shrink-0" aria-label="Krish Lanka Tours & Travels — home">
          <Image
            src="/images/logo.jpg"
            alt="Krish Lanka Tours & Travels"
            width={200}
            height={200}
            priority
            className={`object-contain transition-all duration-300 ${
              scrolled ? "w-12 h-12" : "w-16 h-16 sm:w-[4.6rem] sm:h-[4.6rem]"
            }`}
          />
        </Link>

        <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-body text-sm tracking-wide whitespace-nowrap transition-colors ${
                pathname === l.href
                  ? "text-blue"
                  : "text-ink-text/70 hover:text-blue"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3 justify-self-end">
          <LanguageDropdown locale={locale} pathname={pathname} variant="light" compact />
          <Link
            href="/contact"
            className="font-body text-sm bg-blue text-white px-5 py-2.5 rounded-full font-medium hover:bg-blue-light transition-colors whitespace-nowrap"
          >
            {t("bookNow")}
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          className="lg:hidden text-navy justify-self-end"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-navy/8 px-5 pb-6 pt-2">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`font-body py-3 border-b border-navy/8 ${
                  pathname === l.href ? "text-blue" : "text-ink-text/80"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex items-center justify-between">
            <LanguageDropdown locale={locale} pathname={pathname} variant="light" />
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="font-body text-sm bg-blue text-white px-5 py-2.5 rounded-full font-medium"
            >
              {t("bookNow")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
