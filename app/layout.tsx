import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://krishlankatours.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Krish Lanka Tours & Travels — Private Tours in Sri Lanka",
    template: "%s | Krish Lanka Tours & Travels",
  },
  description:
    "Private driver-guided Sri Lanka tours, airport transfers, and custom itineraries — Yala safari, Sigiriya, Ella day tours, whale watching and more. Rated 5.0 on TripAdvisor. Based in Ahungalla.",
  keywords: [
    "Sri Lanka tours",
    "private driver Sri Lanka",
    "airport transfer Sri Lanka",
    "Yala safari",
    "Ella day tour",
    "Sigiriya tour",
    "Sri Lanka tour packages",
    "Ahungalla tours",
    "Bentota tours",
    "custom Sri Lanka itinerary",
  ],
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Krish Lanka Tours & Travels",
    title: "Krish Lanka Tours & Travels — Private Tours in Sri Lanka",
    description:
      "Private, driver-guided tours across Sri Lanka — wildlife, ancient cities, tea country and the coast. Rated 5.0 on TripAdvisor.",
    images: [{ url: "/og-image.jpg?v=3", width: 1200, height: 630, alt: "Krish Lanka Tours & Travels" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Krish Lanka Tours & Travels — Private Tours in Sri Lanka",
    description:
      "Private, driver-guided tours across Sri Lanka. Rated 5.0 on TripAdvisor.",
    images: ["/og-image.jpg?v=3"],
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
