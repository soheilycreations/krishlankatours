import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";
import GalleryGrid from "@/components/GalleryGrid";

export default async function GalleryPage() {
  const t = await getTranslations("gallery");

  return (
    <section className="bg-white min-h-screen pt-16 pb-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mb-12 max-w-2xl">
          <p className="font-stamp text-xs uppercase tracking-[0.2em] text-blue mb-4">
            {t("pageEyebrow")}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-navy mb-5 text-balance">
            {t("pageTitle")}
          </h1>
          <p className="font-body text-ink-text/60 leading-relaxed">
            {t("pageSubtitle")}
          </p>
        </Reveal>

        <GalleryGrid />
      </div>
    </section>
  );
}
