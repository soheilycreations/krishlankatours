import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import DestinationForm, { type DestinationFormData } from "@/components/admin/DestinationForm";

export const dynamic = "force-dynamic";

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  if (!supabase) notFound();

  const { data, error } = await supabase.from("destinations").select("*").eq("id", id).single();
  if (error || !data) notFound();

  const destination: DestinationFormData = {
    id: data.id,
    slug: data.slug,
    name_en: data.name_en ?? "",
    name_de: data.name_de ?? "",
    region_en: data.region_en ?? "",
    region_de: data.region_de ?? "",
    tagline_en: data.tagline_en ?? "",
    tagline_de: data.tagline_de ?? "",
    image: data.image,
    description: data.description ?? [],
    highlights: data.highlights ?? [],
    best_time_en: data.best_time_en ?? "",
    best_time_de: data.best_time_de ?? "",
    related_tour_slug: data.related_tour_slug ?? "",
    published: data.published,
  };

  return (
    <div>
      <h1 className="font-display text-2xl text-navy mb-6">Edit destination</h1>
      <DestinationForm destination={destination} />
    </div>
  );
}
