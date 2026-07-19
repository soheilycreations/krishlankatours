"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signIn(prevState: unknown, formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { error: "This isn't connected yet. Please contact your developer." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "Incorrect email or password." };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

interface TourFormResult {
  error?: string;
  success?: boolean;
}

function parseLocalizedList(formData: FormData, prefix: string): { en: string; de: string }[] {
  const items: { en: string; de: string }[] = [];
  let i = 0;
  while (formData.has(`${prefix}_en_${i}`)) {
    const en = String(formData.get(`${prefix}_en_${i}`) || "").trim();
    const de = String(formData.get(`${prefix}_de_${i}`) || "").trim();
    if (en) items.push({ en, de: de || en });
    i += 1;
  }
  return items;
}

function parseItinerary(formData: FormData) {
  const items: {
    day: number;
    title: { en: string; de: string };
    description: { en: string; de: string };
  }[] = [];
  let i = 0;
  while (formData.has(`itinerary_title_en_${i}`)) {
    const titleEn = String(formData.get(`itinerary_title_en_${i}`) || "").trim();
    const titleDe = String(formData.get(`itinerary_title_de_${i}`) || "").trim();
    const descEn = String(formData.get(`itinerary_desc_en_${i}`) || "").trim();
    const descDe = String(formData.get(`itinerary_desc_de_${i}`) || "").trim();
    if (titleEn) {
      items.push({
        day: i + 1,
        title: { en: titleEn, de: titleDe || titleEn },
        description: { en: descEn, de: descDe || descEn },
      });
    }
    i += 1;
  }
  return items;
}

export async function saveTour(
  tourId: string | null,
  prevState: unknown,
  formData: FormData
): Promise<TourFormResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { error: "This isn't connected yet. Please contact your developer." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You're not signed in." };
  }

  const gallery = String(formData.get("gallery") || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const payload = {
    slug: String(formData.get("slug") || "").trim(),
    category: String(formData.get("category") || "wildlife"),
    duration_days: Number(formData.get("duration_days") || 1),
    price_from_usd: formData.get("price_from_usd")
      ? Number(formData.get("price_from_usd"))
      : null,
    group_size: String(formData.get("group_size") || ""),
    hero_image: String(formData.get("hero_image") || "") || null,
    gallery,
    title_en: String(formData.get("title_en") || ""),
    title_de: String(formData.get("title_de") || ""),
    tagline_en: String(formData.get("tagline_en") || ""),
    tagline_de: String(formData.get("tagline_de") || ""),
    summary_en: String(formData.get("summary_en") || ""),
    summary_de: String(formData.get("summary_de") || ""),
    highlights: parseLocalizedList(formData, "highlight"),
    itinerary: parseItinerary(formData),
    published: formData.get("published") === "on",
  };

  if (!payload.slug || !payload.title_en) {
    return { error: "Slug and English title are required." };
  }

  const { error } = tourId
    ? await supabase.from("tours").update(payload).eq("id", tourId)
    : await supabase.from("tours").insert(payload);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/[locale]", "layout");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteTour(tourId: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("tours").delete().eq("id", tourId);
  revalidatePath("/[locale]", "layout");
  revalidatePath("/admin");
}
