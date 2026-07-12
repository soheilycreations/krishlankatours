"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t("home") },
    { href: "/tours", label: t("tours") },
    { href: "/gallery", label: t("gallery") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-navy/8">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <span className="relative w-11 h-11 rounded-full bg-paper-2 flex items-center justify-center overflow-hidden shrink-0">
            <Image
              src="/images/logo-icon.png"
              alt="Krish Lanka Tours & Travels"
              width={40}
              height={40}
              className="object-contain w-9 h-9"
            />
          </span>
          <span className="font-display text-navy text-base sm:text-xl tracking-tight leading-tight whitespace-nowrap">
            Krish Lanka<span className="text-blue italic"> Tours</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-body text-sm tracking-wide transition-colors ${
                pathname === l.href
                  ? "text-blue"
                  : "text-ink-text/70 hover:text-blue"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <LangSwitcher locale={locale} pathname={pathname} />
          <Link
            href="/contact"
            className="font-body text-sm bg-blue text-white px-5 py-2.5 rounded-full font-medium hover:bg-blue-light transition-colors"
          >
            {t("bookNow")}
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          className="lg:hidden text-navy"
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
            <LangSwitcher locale={locale} pathname={pathname} />
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

function LangSwitcher({ locale, pathname }: { locale: string; pathname: string }) {
  return (
    <div className="flex items-center gap-1 font-stamp text-xs">
      <Link
        href={pathname}
        locale="en"
        className={`px-2.5 py-1 rounded-full border ${
          locale === "en"
            ? "border-blue text-blue"
            : "border-navy/15 text-ink-text/50 hover:text-ink-text"
        }`}
      >
        EN
      </Link>
      <Link
        href={pathname}
        locale="de"
        className={`px-2.5 py-1 rounded-full border ${
          locale === "de"
            ? "border-blue text-blue"
            : "border-navy/15 text-ink-text/50 hover:text-ink-text"
        }`}
      >
        DE
      </Link>
    </div>
  );
}
