import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import Reveal from "@/components/Reveal";
import { getBlogPosts, getBlogPostBySlug } from "@/lib/blog";
import type { Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return getBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  const loc = locale as Locale;
  return {
    title: post.title[loc],
    description: post.excerpt[loc],
    openGraph: { title: post.title[loc], description: post.excerpt[loc], images: [{ url: post.image, width: 1200, height: 630 }] },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("blog");

  return (
    <>
      <section className="relative h-[42vh] min-h-[320px] flex items-end overflow-hidden">
        <Image src={post.image} alt={post.title[locale]} fill priority className="object-cover painterly" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-navy/10" />
        <div className="relative z-10 mx-auto max-w-3xl w-full px-5 sm:px-8 pb-10">
          <Link href="/blog" className="inline-flex items-center gap-2 font-body text-sm text-white/70 hover:text-blue-light mb-5">
            <ArrowLeft size={15} /> {t("back")}
          </Link>
          <p className="flex items-center gap-1.5 font-stamp text-[10px] uppercase tracking-wide text-golden mb-3">
            <Clock size={11} /> {t("readTime", { count: post.readMinutes })}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-white text-balance">{post.title[locale]}</h1>
        </div>
      </section>
      <article className="bg-paper-textured py-14 sm:py-20">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <Reveal>
            {post.body[locale].map((para, i) => (
              <p key={i} className="font-body text-ink-text/75 leading-relaxed mb-5">
                {para}
              </p>
            ))}
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 pt-8 border-t border-navy/10 text-center">
              <Link
                href="/plan"
                className="inline-flex items-center gap-2 bg-blue text-white px-6 py-3 rounded-full font-body text-sm font-semibold shadow-lg shadow-blue/25 hover:bg-blue-light transition-colors"
              >
                {t("planCta")}
              </Link>
            </div>
          </Reveal>
        </div>
      </article>
    </>
  );
}
