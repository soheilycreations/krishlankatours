import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Users, Car } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { getVehicles } from "@/lib/vehicles-data";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Our Vehicle Fleet — Sri Lanka Private Tours",
    description:
      "Cars, vans, SUVs and mini coaches for private Sri Lanka tours — all with experienced, English-speaking driver-guides. Choose the right vehicle for your group.",
  };
}

export const revalidate = 60;

export default async function VehiclesPage() {
  const t = await getTranslations("vehiclesPage");
  const vehicles = await getVehicles();

  return (
    <>
      <PageHero
        image="/images/stock3/tuktuk-forest-road.jpg"
        eyebrow={t("pageEyebrow")}
        title={t("pageTitle")}
        subtitle={t("pageSubtitle")}
        script="Pick your ride..."
      />
      <section className="bg-paper-textured py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v, i) => (
              <Reveal key={v.id} delay={i * 0.06}>
                <div className="bg-white rounded-2xl overflow-hidden border border-navy/8 shadow-sm hover:shadow-lg transition-shadow h-full">
                  {v.imageUrl ? (
                    <div className="relative h-48">
                      <Image src={v.imageUrl} alt={v.name} fill sizes="400px" className="object-cover" />
                    </div>
                  ) : (
                    <div className="h-48 bg-paper-2 flex items-center justify-center">
                      <Car size={40} className="text-blue/40" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-display text-lg text-navy mb-1.5">{v.name}</h3>
                    <p className="font-body text-sm text-ink-text/60 mb-4">{v.description}</p>
                    <span className="inline-flex items-center gap-1.5 font-stamp text-[10px] uppercase tracking-wide bg-paper-2 text-blue px-3 py-1.5 rounded-full">
                      <Users size={11} /> {t("upTo", { count: v.seats })}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
