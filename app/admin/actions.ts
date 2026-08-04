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

export async function updateInquiryStatus(inquiryId: string, status: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("inquiries").update({ status }).eq("id", inquiryId);
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}

export async function deleteInquiry(inquiryId: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("inquiries").delete().eq("id", inquiryId);
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}

interface DestinationFormResult {
  error?: string;
  success?: boolean;
}

export async function saveDestination(
  destinationId: string | null,
  prevState: unknown,
  formData: FormData
): Promise<DestinationFormResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { error: "This isn't connected yet." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You're not signed in." };
  }

  const description = parseLocalizedList(formData, "description");
  const highlights = parseLocalizedList(formData, "highlight");

  const payload = {
    slug: String(formData.get("slug") || "").trim(),
    name_en: String(formData.get("name_en") || ""),
    name_de: String(formData.get("name_de") || ""),
    region_en: String(formData.get("region_en") || ""),
    region_de: String(formData.get("region_de") || ""),
    tagline_en: String(formData.get("tagline_en") || ""),
    tagline_de: String(formData.get("tagline_de") || ""),
    image: String(formData.get("image") || "") || null,
    gallery: String(formData.get("gallery") || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    description,
    highlights,
    best_time_en: String(formData.get("best_time_en") || ""),
    best_time_de: String(formData.get("best_time_de") || ""),
    related_tour_slug: String(formData.get("related_tour_slug") || ""),
    published: formData.get("published") === "on",
  };

  if (!payload.slug || !payload.name_en) {
    return { error: "Slug and English name are required." };
  }

  const { error } = destinationId
    ? await supabase.from("destinations").update(payload).eq("id", destinationId)
    : await supabase.from("destinations").insert(payload);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/[locale]", "layout");
  revalidatePath("/admin/destinations");
  redirect("/admin/destinations");
}

export async function deleteDestination(destinationId: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("destinations").delete().eq("id", destinationId);
  revalidatePath("/[locale]", "layout");
  revalidatePath("/admin/destinations");
}

// =========================================================
// VEHICLES (custom trip planner)
// =========================================================
export async function saveVehicle(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const id = String(formData.get("id") || "");
  const payload = {
    name: String(formData.get("name") || "").trim(),
    type: String(formData.get("type") || "car"),
    seats: Number(formData.get("seats") || 4),
    description: String(formData.get("description") || "").trim() || null,
    image_url: String(formData.get("image_url") || "").trim() || null,
    active: formData.get("active") === "on",
    sort_order: Number(formData.get("sort_order") || 0),
  };
  if (!payload.name) return;
  if (id) {
    await supabase.from("vehicles").update(payload).eq("id", id);
  } else {
    await supabase.from("vehicles").insert(payload);
  }
  revalidatePath("/admin/vehicles");
  revalidatePath("/[locale]/plan", "page");
  redirect("/admin/vehicles");
}

export async function deleteVehicle(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const id = String(formData.get("id") || "");
  if (id) await supabase.from("vehicles").delete().eq("id", id);
  revalidatePath("/admin/vehicles");
  revalidatePath("/[locale]/plan", "page");
}

export async function toggleVehicle(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const id = String(formData.get("id") || "");
  const active = formData.get("next") === "true";
  if (id) await supabase.from("vehicles").update({ active }).eq("id", id);
  revalidatePath("/admin/vehicles");
  revalidatePath("/[locale]/plan", "page");
}

// =========================================================
// CUSTOM TRIP REQUESTS
// =========================================================
export async function updateTripRequestStatus(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "new");
  if (id) await supabase.from("custom_trip_requests").update({ status }).eq("id", id);
  revalidatePath("/admin/trip-requests");
}

// =========================================================
// CATEGORIES
// =========================================================
export async function saveCategory(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const id = String(formData.get("id") || "");
  const payload = {
    slug: String(formData.get("slug") || "").trim().toLowerCase().replace(/\s+/g, "-"),
    name_en: String(formData.get("name_en") || "").trim(),
    name_de: String(formData.get("name_de") || "").trim() || null,
    image_url: String(formData.get("image_url") || "").trim() || null,
    sort_order: Number(formData.get("sort_order") || 0),
    active: formData.get("active") === "on",
  };
  if (!payload.slug || !payload.name_en) return;
  if (id) await supabase.from("categories").update(payload).eq("id", id);
  else await supabase.from("categories").insert(payload);
  revalidatePath("/admin/categories");
  revalidatePath("/[locale]", "page");
  redirect("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const id = String(formData.get("id") || "");
  if (id) await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categories");
  revalidatePath("/[locale]", "page");
}

// =========================================================
// GALLERY
// =========================================================
export async function saveGalleryImage(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const id = String(formData.get("id") || "");
  const payload = {
    image_url: String(formData.get("image_url") || "").trim(),
    caption_en: String(formData.get("caption_en") || "").trim() || null,
    caption_de: String(formData.get("caption_de") || "").trim() || null,
    tall: formData.get("tall") === "on",
    sort_order: Number(formData.get("sort_order") || 0),
    active: true,
  };
  if (!payload.image_url) return;
  if (id) await supabase.from("gallery_images").update(payload).eq("id", id);
  else await supabase.from("gallery_images").insert(payload);
  revalidatePath("/admin/gallery");
  revalidatePath("/[locale]/gallery", "page");
  redirect("/admin/gallery");
}

export async function deleteGalleryImage(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const id = String(formData.get("id") || "");
  if (id) await supabase.from("gallery_images").delete().eq("id", id);
  revalidatePath("/admin/gallery");
  revalidatePath("/[locale]/gallery", "page");
}

// =========================================================
// REVIEWS
// =========================================================
export async function saveReview(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const id = String(formData.get("id") || "");
  const payload = {
    author: String(formData.get("author") || "").trim(),
    country: String(formData.get("country") || "").trim() || null,
    rating: Math.min(5, Math.max(1, Number(formData.get("rating") || 5))),
    text_en: String(formData.get("text_en") || "").trim(),
    text_de: String(formData.get("text_de") || "").trim() || null,
    review_date: String(formData.get("review_date") || "") || null,
    sort_order: Number(formData.get("sort_order") || 0),
    active: formData.get("active") === "on",
  };
  if (!payload.author || !payload.text_en) return;
  if (id) await supabase.from("reviews").update(payload).eq("id", id);
  else await supabase.from("reviews").insert(payload);
  revalidatePath("/admin/reviews");
  revalidatePath("/[locale]", "page");
  redirect("/admin/reviews");
}

export async function deleteReview(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const id = String(formData.get("id") || "");
  if (id) await supabase.from("reviews").delete().eq("id", id);
  revalidatePath("/admin/reviews");
  revalidatePath("/[locale]", "page");
}
