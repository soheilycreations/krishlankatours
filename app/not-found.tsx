import Link from "next/link";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

/** Fallback 404 for URLs outside the localized site (e.g. /de-xyz/...). */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className={`${fontVariables} font-body bg-paper text-ink-text antialiased`}>
        <main className="min-h-screen flex items-center justify-center px-5">
          <div className="text-center max-w-md">
            <p className="font-stamp text-xs uppercase tracking-[0.2em] text-blue mb-4">404</p>
            <h1 className="font-display text-3xl text-navy mb-3">Page not found</h1>
            <p className="font-body text-ink-text/65 mb-8">
              This page doesn&apos;t exist or has moved.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-blue text-white px-6 py-3 rounded-full font-body font-medium hover:bg-blue-light transition-colors"
            >
              Back to the homepage
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
