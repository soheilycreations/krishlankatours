import ParallaxSection from "@/components/ParallaxSection";
import Reveal from "@/components/Reveal";

/** Postcard-look page banner: painterly parallax photo, sunset glow, script flourish. */
export default function PageHero({
  image,
  eyebrow,
  title,
  subtitle,
  script,
}: {
  image: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  script?: string;
}) {
  return (
    <ParallaxSection image={image} variant="dark" glow="top" className="pt-16 pb-14 sm:pt-20 sm:pb-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="font-stamp text-xs uppercase tracking-[0.2em] text-golden mb-3">
            {eyebrow}
          </p>
          {script && (
            <p className="font-script text-xl sm:text-2xl text-blue-light -rotate-2 origin-left mb-2">
              {script}
            </p>
          )}
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-4 text-balance">
            {title}
          </h1>
          {subtitle && (
            <p className="font-body text-white/70 leading-relaxed">{subtitle}</p>
          )}
        </Reveal>
      </div>
    </ParallaxSection>
  );
}
