import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { staticPageMetadata } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { Clock, ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { getBlogPosts } from "@/lib/blog";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata(locale as Locale, "/blog");
}

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const posts = getBlogPosts();

  return (
    <>
      <PageHero
        image="/images/stock2/kandy-colonial-street.jpg"
        eyebrow={t("pageEyebrow")}
        title={t("pageTitle")}
        subtitle={t("pageSubtitle")}
        script="Notes from the road..."
      />
      <section className="bg-paper-textured py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.06}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block bg-white rounded-2xl overflow-hidden border border-navy/8 shadow-sm hover:shadow-lg transition-all h-full"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title[locale]}
                    fill
                    sizes="360px"
                    className="object-cover painterly group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <p className="flex items-center gap-1.5 font-stamp text-[10px] uppercase tracking-wide text-blue mb-2">
                    <Clock size={11} /> {t("readTime", { count: post.readMinutes })}
                  </p>
                  <h3 className="font-display text-lg text-navy leading-snug mb-2 group-hover:text-blue transition-colors">
                    {post.title[locale]}
                  </h3>
                  <p className="font-body text-sm text-ink-text/60 line-clamp-3 mb-3">
                    {post.excerpt[locale]}
                  </p>
                  <span className="inline-flex items-center gap-1 font-body text-xs font-medium text-blue">
                    {t("readMore")} <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
