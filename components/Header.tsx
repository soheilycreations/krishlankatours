"use client";

import { useState } from "react";
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
    <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur border-b border-gold/20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 flex items-center justify-between h-20">
        <Link href="/" className="font-display text-paper text-xl sm:text-2xl tracking-tight">
          Krish Lanka
          <span className="text-gold italic"> Tours</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-body text-sm tracking-wide transition-colors ${
                pathname === l.href
                  ? "text-gold"
                  : "text-paper/80 hover:text-gold"
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
            className="font-body text-sm bg-gold text-ink px-5 py-2.5 rounded-full font-medium hover:bg-gold-light transition-colors"
          >
            {t("bookNow")}
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          className="lg:hidden text-paper"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-ink border-t border-gold/20 px-5 pb-6 pt-2">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`font-body py-3 border-b border-paper/10 ${
                  pathname === l.href ? "text-gold" : "text-paper/85"
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
              className="font-body text-sm bg-gold text-ink px-5 py-2.5 rounded-full font-medium"
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
            ? "border-gold text-gold"
            : "border-paper/25 text-paper/60 hover:text-paper"
        }`}
      >
        EN
      </Link>
      <Link
        href={pathname}
        locale="de"
        className={`px-2.5 py-1 rounded-full border ${
          locale === "de"
            ? "border-gold text-gold"
            : "border-paper/25 text-paper/60 hover:text-paper"
        }`}
      >
        DE
      </Link>
    </div>
  );
}
