"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement?: new (
          options: Record<string, unknown>,
          elementId: string
        ) => unknown;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

/**
 * Loads the Google Translate widget in the background (hidden) so the
 * custom flag dropdown in the header can trigger translation into any
 * of ~100 languages. The two "real" languages on this site — English
 * and German — are hand-translated via next-intl and never touch this;
 * this only powers the extra languages in the dropdown.
 */
export default function GoogleTranslate() {
  useEffect(() => {
    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return <div id="google_translate_element" className="hidden" />;
}

/** Robustly switches Google Translate to the given language by writing the
 *  googtrans cookie and reloading. Works from ANY current language to any
 *  other (the old select-element approach silently failed when switching
 *  between two auto-translated languages). */
export function setGoogleTranslateLanguage(langCode: string) {
  const value = `/auto/${langCode}`;
  const host = window.location.hostname;
  document.cookie = `googtrans=${value};path=/`;
  document.cookie = `googtrans=${value};path=/;domain=${host}`;
  document.cookie = `googtrans=${value};path=/;domain=.${host}`;
  window.location.reload();
}

/** Removes the googtrans cookie completely so the page returns to its
 *  original (next-intl) language. Call before switching to EN/DE. */
export function clearGoogleTranslate() {
  const past = "Thu, 01 Jan 1970 00:00:00 UTC";
  const host = window.location.hostname;
  for (const domain of ["", `;domain=${host}`, `;domain=.${host}`]) {
    document.cookie = `googtrans=;path=/${domain};expires=${past}`;
  }
}

/** Reads the currently active Google Translate language from the cookie. */
export function getGoogleTranslateLanguage(): string | null {
  const m = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]*\/([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}
