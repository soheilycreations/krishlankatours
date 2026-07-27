import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import TourForm, { type TourFormData } from "@/components/admin/TourForm";

export const dynamic = "force-dynamic";

export default async function EditTourPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  if (!supabase) notFound();

  const { data, error } = await supabase.from("tours").select("*").eq("id", id).single();
  if (error || !data) notFound();

  const tour: TourFormData = {
    id: data.id,
    slug: data.slug,
    category: data.category,
    duration_days: data.duration_days,
    price_from_usd: data.price_from_usd,
    group_size: data.group_size ?? "",
    hero_image: data.hero_image,
    gallery: data.gallery ?? [],
    title_en: data.title_en ?? "",
    title_de: data.title_de ?? "",
    tagline_en: data.tagline_en ?? "",
    tagline_de: data.tagline_de ?? "",
    summary_en: data.summary_en ?? "",
    summary_de: data.summary_de ?? "",
    highlights: data.highlights ?? [],
    itinerary: data.itinerary ?? [],
    published: data.published,
  };

  return (
    <div>
      <h1 className="font-display text-2xl text-navy mb-6">Edit tour</h1>
      <TourForm tour={tour} />
    </div>
  );
}
