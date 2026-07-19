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

/** Programmatically switches Google Translate to the given language code
 *  (e.g. "fr", "es", "zh-CN"). Pass "en" to revert to the original text. */
export function setGoogleTranslateLanguage(langCode: string) {
  const trySet = () => {
    const select = document.querySelector<HTMLSelectElement>(
      "select.goog-te-combo"
    );
    if (!select) return false;
    select.value = langCode;
    select.dispatchEvent(new Event("change"));
    return true;
  };

  if (trySet()) return;

  // Widget may still be initializing — retry briefly.
  let attempts = 0;
  const interval = setInterval(() => {
    attempts += 1;
    if (trySet() || attempts > 20) clearInterval(interval);
  }, 250);
}
