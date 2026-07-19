"use client";

import { usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Phone } from "lucide-react";
import LanguageDropdown from "@/components/LanguageDropdown";

export default function TopBar() {
  const locale = useLocale();
  const pathname = usePathname();
  const contact = useTranslations("contact");

  return (
    <div className="hidden lg:block bg-paper-2/60 border-b border-navy/8">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 h-10 flex items-center justify-between">
        <a
          href="tel:+94"
          className="flex items-center gap-2 font-body text-xs text-ink-text/60 hover:text-blue transition-colors"
        >
          <Phone size={13} />
          <span className="notranslate">+94 XX XXX XXXX</span>
          <span className="text-ink-text/30">·</span>
          <span>{contact("locationValue")}</span>
        </a>
        <LanguageDropdown locale={locale} pathname={pathname} variant="light" />
      </div>
    </div>
  );
}
