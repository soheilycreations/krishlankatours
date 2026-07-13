import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";

export default async function AboutPage() {
  const t = await getTranslations("about");
  const values = t.raw("values") as { title: string; body: string }[];

  return (
    <>
      <section className="relative h-[46vh] min-h-[340px] flex items-end overflow-hidden">
        <Image
          src="/images/palm-avenue-garden.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-navy/10" />
        <div className="relative z-10 mx-auto max-w-5xl w-full px-5 sm:px-8 pb-12">
          <p className="font-stamp text-xs uppercase tracking-[0.2em] text-blue-light mb-4">
            {t("pageEyebrow")}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-white text-balance">
            {t("pageTitle")}
          </h1>
        </div>
      </section>

      <section className="bg-paper-textured py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal>
            <p className="font-body text-lg text-ink-text/80 leading-relaxed mb-6">
              {t("introBody1")}
            </p>
            <p className="font-body text-ink-text/70 leading-relaxed">
              {t("introBody2")}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-navy py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Reveal className="mb-12">
            <h2 className="font-display text-3xl text-white text-balance">
              {t("valuesTitle")}
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <Reveal
                key={v.title}
                delay={i * 0.08}
                className="bg-navy-2 border border-blue/20 rounded-2xl p-7"
              >
                <div className="font-stamp text-xs text-blue-light mb-3">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display text-lg text-white mb-2.5">{v.title}</h3>
                <p className="font-body text-sm text-white/60 leading-relaxed">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper-textured py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 grid md:grid-cols-2 gap-12 items-center">
          <Reveal className="relative h-72 sm:h-96 rounded-2xl overflow-hidden postcard-edge order-2 md:order-1">
            <Image
              src="/images/buddha-carving.jpg"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover"
            />
          </Reveal>
          <Reveal delay={0.1} className="order-1 md:order-2">
            <h2 className="font-display text-3xl text-navy mb-5 text-balance">
              {t("experienceTitle")}
            </h2>
            <p className="font-body text-ink-text/70 leading-relaxed">
              {t("experienceBody")}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
