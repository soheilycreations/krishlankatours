"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyEmailsButton({ emails }: { emails: string[] }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(emails.join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 border border-navy/15 rounded-full px-4 py-2 font-body text-sm text-navy hover:border-blue hover:text-blue transition-colors shrink-0"
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}
      {copied ? "Copied!" : "Copy all emails"}
    </button>
  );
}
