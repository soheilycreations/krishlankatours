"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { categoryLabels, type TourCategory } from "@/lib/tours";
import type { Locale } from "@/i18n/routing";
import Reveal from "@/components/Reveal";

const categoryImages: Record<TourCategory, string> = {
  wildlife: "/images/elephants-trio.jpg",
  heritage: "/images/buddha-carving.jpg",
  hillcountry: "/images/golden-temple-hills.jpg",
  wetland: "/images/river-boat-safari.jpg",
  coastal: "/images/couple-pool-sunset.jpg",
};

const order: TourCategory[] = [
  "wildlife",
  "heritage",
  "hillcountry",
  "wetland",
  "coastal",
];

export default function CategoryIcons() {
  const locale = useLocale() as Locale;

  return (
    <div className="flex flex-wrap justify-center gap-x-8 gap-y-7 sm:gap-x-12">
      {order.map((cat, i) => (
        <Reveal key={cat} delay={i * 0.06} className="flex flex-col items-center">
          <Link href={`/tours?category=${cat}`} className="group flex flex-col items-center gap-3">
            <span className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-blue transition-all">
              <Image
                src={categoryImages[cat]}
                alt={categoryLabels[cat][locale]}
                fill
                sizes="100px"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </span>
            <span className="font-body text-sm text-ink-text/75 group-hover:text-blue transition-colors">
              {categoryLabels[cat][locale]}
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
