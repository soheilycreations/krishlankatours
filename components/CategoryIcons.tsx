"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { categoryColors } from "@/lib/tours";
import type { Locale } from "@/i18n/routing";
import type { CategoryItem } from "@/lib/content-data";
import Reveal from "@/components/Reveal";

const DEFAULT_RING = "group-hover:ring-blue";

export default function CategoryIcons({ categories }: { categories: CategoryItem[] }) {
  const locale = useLocale() as Locale;

  return (
    <div className="flex flex-wrap justify-center gap-x-8 gap-y-7 sm:gap-x-12">
      {categories.map((cat, i) => {
        const ring =
          (categoryColors as Record<string, { ring: string }>)[cat.slug]?.ring ?? DEFAULT_RING;
        return (
          <Reveal key={cat.slug} delay={i * 0.06} className="flex flex-col items-center">
            <Link href={`/tours?category=${cat.slug}`} className="group flex flex-col items-center gap-3">
              <span
                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-2 ring-transparent transition-all ${ring}`}
              >
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name[locale]}
                    fill
                    sizes="100px"
                    className="object-cover painterly group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <span className="absolute inset-0 bg-paper-2" />
                )}
              </span>
              <span className="font-body text-sm text-ink-text/75 group-hover:text-blue transition-colors">
                {cat.name[locale]}
              </span>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
