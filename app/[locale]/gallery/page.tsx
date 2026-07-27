import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
export const revalidate = 60;

import GalleryGrid from "@/components/GalleryGrid";
import { getGalleryImages } from "@/lib/content-data";

export default async function GalleryPage() {
  const t = await getTranslations("gallery");

  return (
    <>
      <PageHero
        image="/images/kandyan-dance.jpg"
        eyebrow={t("pageEyebrow")}
        title={t("pageTitle")}
        subtitle={t("pageSubtitle")}
        script="Moments we caught..."
      />
    <section className="bg-paper-textured pt-12 pb-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">

        <GalleryGrid images={await getGalleryImages()} />
      </div>
    </section>

      {/* FROM OUR YOUTUBE */}
      <section className="bg-navy torn-top relative overflow-hidden py-14 sm:py-20">
        <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(232,80,43,0.35), transparent 65%)" }} aria-hidden="true" />
        <div className="canvas-texture absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
          <Reveal className="text-center mb-9">
            <p className="font-stamp text-xs uppercase tracking-[0.2em] text-golden mb-4">
              {t("youtubeEyebrow")}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-white">{t("youtubeTitle")}</h2>
          </Reveal>
          <Reveal>
            <div className="relative rounded-2xl overflow-hidden ring-8 ring-paper/10 postcard-shadow aspect-video">
              <iframe
                title="Krish Lanka Tours & Travels on YouTube"
                src="https://www.youtube.com/embed/videoseries?list=UUcQ9ReFdTijG2JACuwz1W9Q"
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </Reveal>
          <p className="text-center mt-6">
            <a
              href="https://www.youtube.com/channel/UCcQ9ReFdTijG2JACuwz1W9Q"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm text-blue-light hover:text-golden transition-colors"
            >
              {t("youtubeCta")} →
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
