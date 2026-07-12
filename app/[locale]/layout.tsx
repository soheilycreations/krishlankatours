import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../globals.css";

const fraunces = localFont({
  src: [
    { path: "../fonts/Fraunces-Variable.ttf", weight: "300 700", style: "normal" },
    { path: "../fonts/Fraunces-Italic-Variable.ttf", weight: "300 700", style: "italic" },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

const workSans = localFont({
  src: [{ path: "../fonts/WorkSans-Variable.ttf", weight: "300 700", style: "normal" }],
  variable: "--font-work-sans",
  display: "swap",
});

const spaceMono = localFont({
  src: [
    { path: "../fonts/SpaceMono-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/SpaceMono-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Krish Lanka Tours & Travels | Private Sri Lanka Tours",
  description:
    "Private, driver-guided tours across Sri Lanka — wildlife safaris, ancient cities, tea country and the coast, planned around you.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body
        className={`${fraunces.variable} ${workSans.variable} ${spaceMono.variable} font-body bg-paper text-ink-text antialiased`}
      >
        <NextIntlClientProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
