"use client";

import { useState, useRef, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { ChevronDown, Check } from "lucide-react";
import { setGoogleTranslateLanguage } from "@/components/GoogleTranslate";

interface LangOption {
  code: string;
  flag: string;
  label: string;
  native: boolean; // true = real next-intl translation (en/de)
}

const languages: LangOption[] = [
  { code: "en", flag: "🇬🇧", label: "English", native: true },
  { code: "de", flag: "🇩🇪", label: "Deutsch", native: true },
  { code: "fr", flag: "🇫🇷", label: "Français", native: false },
  { code: "es", flag: "🇪🇸", label: "Español", native: false },
  { code: "it", flag: "🇮🇹", label: "Italiano", native: false },
  { code: "nl", flag: "🇳🇱", label: "Nederlands", native: false },
  { code: "ru", flag: "🇷🇺", label: "Русский", native: false },
  { code: "zh-CN", flag: "🇨🇳", label: "中文", native: false },
  { code: "ja", flag: "🇯🇵", label: "日本語", native: false },
  { code: "ko", flag: "🇰🇷", label: "한국어", native: false },
  { code: "ar", flag: "🇸🇦", label: "العربية", native: false },
  { code: "pt", flag: "🇵🇹", label: "Português", native: false },
  { code: "hi", flag: "🇮🇳", label: "हिन्दी", native: false },
];

export default function LanguageDropdown({
  locale,
  pathname,
  variant = "light",
  compact = false,
}: {
  locale: string;
  pathname: string;
  variant?: "light" | "dark";
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [activeCode, setActiveCode] = useState(locale);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveCode(locale);
  }, [locale]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = languages.find((l) => l.code === activeCode) ?? languages[0];

  const handleSelect = (lang: LangOption) => {
    if (!lang.native) {
      setGoogleTranslateLanguage(lang.code);
      setActiveCode(lang.code);
    }
    setOpen(false);
  };

  const isDark = variant === "dark";

  return (
    <div className="relative" ref={ref}>
      {compact ? (
        <button
          onClick={() => setOpen(!open)}
          aria-label="Choose language"
          aria-expanded={open}
          className={`flex items-center justify-center w-10 h-10 rounded-full border transition-colors ${
            isDark
              ? "border-white/20 hover:border-white/40"
              : "border-navy/15 hover:border-blue/40"
          }`}
        >
          <span className="text-lg leading-none notranslate">{current.flag}</span>
        </button>
      ) : (
        <button
          onClick={() => setOpen(!open)}
          aria-label="Choose language"
          aria-expanded={open}
          className={`flex items-center gap-1.5 font-body text-sm px-3 py-1.5 rounded-full border transition-colors ${
            isDark
              ? "border-white/20 text-white/80 hover:border-white/40"
              : "border-navy/15 text-ink-text/70 hover:border-blue/40"
          }`}
        >
          <span className="text-base leading-none notranslate">{current.flag}</span>
          <span className="notranslate">{current.label}</span>
          <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      )}

      {open && (
        <div className="absolute right-0 mt-2 w-52 max-h-80 overflow-y-auto bg-white border border-navy/10 rounded-xl shadow-xl py-2 z-50">
          {languages.map((lang) => {
            const isActive = lang.code === activeCode;
            const content = (
              <>
                <span className="text-base leading-none notranslate">{lang.flag}</span>
                <span className="notranslate flex-1 text-left">{lang.label}</span>
                {isActive && <Check size={14} className="text-blue" />}
              </>
            );
            const rowClass = `w-full flex items-center gap-2.5 px-4 py-2 font-body text-sm hover:bg-paper-2/60 transition-colors ${
              isActive ? "text-blue" : "text-ink-text/80"
            }`;

            return lang.native ? (
              <Link
                key={lang.code}
                href={pathname}
                locale={lang.code}
                onClick={() => setOpen(false)}
                className={rowClass}
              >
                {content}
              </Link>
            ) : (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang)}
                className={rowClass}
              >
                {content}
              </button>
            );
          })}
          <div className="border-t border-navy/8 mt-1 pt-2 px-4">
            <p className="font-body text-[11px] text-ink-text/40 leading-snug">
              Auto-translated languages are machine-translated and may not be
              perfectly accurate.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
