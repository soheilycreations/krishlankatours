import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Krish Lanka Tours & Travels | Private Sri Lanka Tours",
  description:
    "Private, driver-guided tours across Sri Lanka — wildlife safaris, ancient cities, tea country and the coast, planned around you.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={`${fontVariables} font-body bg-paper text-ink-text antialiased`}>
        {children}
      </body>
    </html>
  );
}
