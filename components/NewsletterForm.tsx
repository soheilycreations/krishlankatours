"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, Check } from "lucide-react";

export default function NewsletterForm() {
  const t = useTranslations("footer");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="flex items-center gap-2 text-blue-light font-body text-sm mt-4">
        <Check size={16} /> Subscribed
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <input
        type="email"
        required
        placeholder={t("newsletterPlaceholder")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="min-w-0 flex-1 bg-white/10 border border-white/15 rounded-full px-4 py-2.5 font-body text-sm text-white placeholder:text-white/40 focus:border-blue outline-none"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        aria-label={t("newsletterButton")}
        className="shrink-0 bg-blue text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-light transition-colors disabled:opacity-60"
      >
        <Send size={16} />
      </button>
    </form>
  );
}
