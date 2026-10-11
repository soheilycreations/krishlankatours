"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminUser, requireAdmin } from "@/lib/auth";
import { slugify, isValidSlug } from "@/lib/slug";
import {
  tourSchema,
  destinationSchema,
  vehicleSchema,
  categorySchema,
  galleryImageSchema,
  reviewSchema,
  inquiryStatusSchema,
  tripRequestStatusSchema,
  uuidSchema,
  emailSchema,
  firstIssue,
} from "@/lib/validation";

// ===========================================================================
// Helpers
// ===========================================================================

interface ActionResult {
  error?: string;
  success?: boolean;
}

/** Refresh every public page (ISR cache on Cloudflare) plus the sitemap. */
function revalidatePublicSite() {
  revalidatePath("/[locale]", "layout");
  revalidatePath("/sitemap.xml");
}

const str = (formData: FormData, key: string) => String(formData.get(key) ?? "");
const bool = (formData: FormData, key: string) => formData.get(key) === "on";

/** Reads `${prefix}_en_0`, `${prefix}_de_0`, `${prefix}_en_1`, ... until a gap. */
function parseLocalizedList(formData: FormData, prefix: string): { en: string; de: string }[] {
  const items: { en: string; de: string }[] = [];
  let i = 0;
  while (formData.has(`${prefix}_en_${i}`)) {
    const en = str(formData, `${prefix}_en_${i}`).trim();
    const de = str(formData, `${prefix}_de_${i}`).trim();
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
    const titleEn = str(formData, `itinerary_title_en_${i}`).trim();
    const titleDe = str(formData, `itinerary_title_de_${i}`).trim();
    const descEn = str(formData, `itinerary_desc_en_${i}`).trim();
    const descDe = str(formData, `itinerary_desc_de_${i}`).trim();
    if (titleEn) {
      items.push({
        day: items.length + 1,
        title: { en: titleEn, de: titleDe || titleEn },
        description: { en: descEn, de: descDe || descEn },
      });
    }
    i += 1;
  }
  return items;
}

const parseLines = (value: string) =>
  value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

/** Redirect back to a simple admin list page with an error banner. */
function failTo(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

// ===========================================================================
// Auth
// ===========================================================================

export async function signIn(prevState: unknown, formData: FormData): Promise<ActionResult> {
  const emailParsed = emailSchema.safeParse(str(formData, "email"));
  const password = str(formData, "password");
  if (!emailParsed.success || !password || password.length > 200) {
    return { error: "Incorrect email or password." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { error: "This isn't connected yet. Please contact your developer." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailParsed.data,
    password,
  });
  if (error || !data.user) {
    return { error: "Incorrect email or password." };
  }

  if (!(await isAdminUser(supabase, data.user))) {
    await supabase.auth.signOut();
    return { error: "This account doesn't have admin access." };
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

// ===========================================================================
// Tours
// ===========================================================================

export async function saveTour(
  tourId: string | null,
  prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  if (tourId && !uuidSchema.safeParse(tourId).success) {
    return { error: "Invalid tour." };
  }

  const parsed = tourSchema.safeParse({
    category: slugify(str(formData, "category")),
    duration_days: str(formData, "duration_days") || "1",
    price_from_usd: str(formData, "price_from_usd").trim(),
    group_size: str(formData, "group_size"),
    hero_image: str(formData, "hero_image"),
    gallery: parseLines(str(formData, "gallery")),
    title_en: str(formData, "title_en"),
    title_de: str(formData, "title_de"),
    tagline_en: str(formData, "tagline_en"),
    tagline_de: str(formData, "tagline_de"),
    summary_en: str(formData, "summary_en"),
    summary_de: str(formData, "summary_de"),
    highlights: parseLocalizedList(formData, "highlight"),
    itinerary: parseItinerary(formData),
    published: bool(formData, "published"),
  });
  if (!parsed.success) return { error: firstIssue(parsed.error) };

  // Slug: fixed once a tour exists (it's the public URL). New tours get a
  // server-side sanitized slug from the submitted value or the English title.
  let slug: string;
  if (tourId) {
    const { data: existing, error } = await supabase
      .from("tours")
      .select("slug")
      .eq("id", tourId)
      .maybeSingle();
    if (error || !existing) return { error: "This tour no longer exists." };
    slug = existing.slug;
  } else {
    slug = slugify(str(formData, "slug") || parsed.data.title_en);
    if (!isValidSlug(slug)) {
      return { error: "Please use an English title with at least one letter or number." };
    }
    const { data: clash } = await supabase.from("tours").select("id").eq("slug", slug).maybeSingle();
    if (clash) {
      return {
        error: `A tour with the web address /tours/${slug} already exists. Please change the English title slightly.`,
      };
    }
  }

  const payload = { ...parsed.data, slug };
  const { error } = tourId
    ? await supabase.from("tours").update(payload).eq("id", tourId)
    : await supabase.from("tours").insert(payload);

  if (error) {
    if (error.code === "23505") {
      return { error: `A tour with the web address /tours/${slug} already exists.` };
    }
    console.error("saveTour:", error.message);
    return { error: "Could not save the tour. Please try again." };
  }

  revalidatePublicSite();
  revalidatePath("/admin", "layout");
  redirect("/admin/tours");
}

export async function deleteTour(tourId: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!uuidSchema.safeParse(tourId).success) return { error: "Invalid tour." };

  const { data, error } = await supabase.from("tours").delete().eq("id", tourId).select("id");
  if (error || !data?.length) {
    return { error: "Could not delete the tour. Please refresh and try again." };
  }
  revalidatePublicSite();
  revalidatePath("/admin", "layout");
  return { success: true };
}

// ===========================================================================
// Enquiries
// ===========================================================================

export async function updateInquiryStatus(inquiryId: string, status: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const id = uuidSchema.safeParse(inquiryId);
  const st = inquiryStatusSchema.safeParse(status);
  if (!id.success || !st.success) return { error: "Invalid request." };

  const { data, error } = await supabase
    .from("inquiries")
    .update({ status: st.data })
    .eq("id", id.data)
    .select("id");
  if (error || !data?.length) return { error: "Could not update the status." };

  revalidatePath("/admin", "layout");
  return { success: true };
}

export async function deleteInquiry(inquiryId: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const id = uuidSchema.safeParse(inquiryId);
  if (!id.success) return { error: "Invalid request." };

  // .select() returns the deleted rows, so a delete blocked by Row Level
  // Security (0 rows) is reported instead of silently "succeeding".
  const { data, error } = await supabase.from("inquiries").delete().eq("id", id.data).select("id");
  if (error || !data?.length) {
    return {
      error:
        "Could not delete this enquiry. (If this keeps happening, supabase/migration-5-hardening.sql hasn't been run yet.)",
    };
  }

  revalidatePath("/admin", "layout");
  return { success: true };
}

// ===========================================================================
// Destinations
// ===========================================================================

export async function saveDestination(
  destinationId: string | null,
  prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  if (destinationId && !uuidSchema.safeParse(destinationId).success) {
    return { error: "Invalid destination." };
  }

  const parsed = destinationSchema.safeParse({
    name_en: str(formData, "name_en"),
    name_de: str(formData, "name_de"),
    region_en: str(formData, "region_en"),
    region_de: str(formData, "region_de"),
    tagline_en: str(formData, "tagline_en"),
    tagline_de: str(formData, "tagline_de"),
    image: str(formData, "image"),
    gallery: parseLines(str(formData, "gallery")),
    description: parseLocalizedList(formData, "description"),
    highlights: parseLocalizedList(formData, "highlight"),
    best_time_en: str(formData, "best_time_en"),
    best_time_de: str(formData, "best_time_de"),
    related_tour_slug: slugify(str(formData, "related_tour_slug")),
    published: bool(formData, "published"),
  });
  if (!parsed.success) return { error: firstIssue(parsed.error) };

  if (parsed.data.related_tour_slug) {
    const { data: tour } = await supabase
      .from("tours")
      .select("id")
      .eq("slug", parsed.data.related_tour_slug)
      .maybeSingle();
    if (!tour) {
      return {
        error: `No tour with the slug "${parsed.data.related_tour_slug}" exists. Check "Related tour slug" (or leave it empty).`,
      };
    }
  }

  let slug: string;
  if (destinationId) {
    const { data: existing, error } = await supabase
      .from("destinations")
      .select("slug")
      .eq("id", destinationId)
      .maybeSingle();
    if (error || !existing) return { error: "This destination no longer exists." };
    slug = existing.slug;
  } else {
    slug = slugify(str(formData, "slug") || parsed.data.name_en);
    if (!isValidSlug(slug)) {
      return { error: "Please use an English name with at least one letter or number." };
    }
    const { data: clash } = await supabase
      .from("destinations")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (clash) {
      return {
        error: `A destination with the web address /destinations/${slug} already exists. Please change the English name slightly.`,
      };
    }
  }

  const payload = { ...parsed.data, slug };
  const { error } = destinationId
    ? await supabase.from("destinations").update(payload).eq("id", destinationId)
    : await supabase.from("destinations").insert(payload);

  if (error) {
    if (error.code === "23505") {
      return { error: `A destination with the web address /destinations/${slug} already exists.` };
    }
    console.error("saveDestination:", error.message);
    return { error: "Could not save the destination. Please try again." };
  }

  revalidatePublicSite();
  revalidatePath("/admin", "layout");
  redirect("/admin/destinations");
}

export async function deleteDestination(destinationId: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!uuidSchema.safeParse(destinationId).success) return { error: "Invalid destination." };

  const { data, error } = await supabase
    .from("destinations")
    .delete()
    .eq("id", destinationId)
    .select("id");
  if (error || !data?.length) {
    return { error: "Could not delete the destination. Please refresh and try again." };
  }
  revalidatePublicSite();
  revalidatePath("/admin", "layout");
  return { success: true };
}

// ===========================================================================
// Vehicles (custom trip planner)
// ===========================================================================

export async function saveVehicle(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(formData, "id");
  if (id && !uuidSchema.safeParse(id).success) failTo("/admin/vehicles", "Invalid vehicle.");

  const parsed = vehicleSchema.safeParse({
    name: str(formData, "name"),
    type: str(formData, "type") || "car",
    seats: str(formData, "seats") || "4",
    description: str(formData, "description"),
    image_url: str(formData, "image_url"),
    active: bool(formData, "active"),
    sort_order: str(formData, "sort_order") || "0",
  });
  if (!parsed.success) failTo("/admin/vehicles", firstIssue(parsed.error));

  const { error } = id
    ? await supabase.from("vehicles").update(parsed.data).eq("id", id)
    : await supabase.from("vehicles").insert(parsed.data);
  if (error) {
    console.error("saveVehicle:", error.message);
    failTo("/admin/vehicles", "Could not save the vehicle.");
  }

  revalidatePublicSite();
  revalidatePath("/admin/vehicles");
  redirect("/admin/vehicles");
}

export async function deleteVehicle(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(formData, "id");
  if (!uuidSchema.safeParse(id).success) failTo("/admin/vehicles", "Invalid vehicle.");

  const { error } = await supabase.from("vehicles").delete().eq("id", id);
  if (error) failTo("/admin/vehicles", "Could not delete the vehicle.");

  revalidatePublicSite();
  revalidatePath("/admin/vehicles");
}

export async function toggleVehicle(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(formData, "id");
  if (!uuidSchema.safeParse(id).success) failTo("/admin/vehicles", "Invalid vehicle.");
  const active = formData.get("next") === "true";

  const { error } = await supabase.from("vehicles").update({ active }).eq("id", id);
  if (error) failTo("/admin/vehicles", "Could not update the vehicle.");

  revalidatePublicSite();
  revalidatePath("/admin/vehicles");
}

// ===========================================================================
// Custom trip requests
// ===========================================================================

export async function updateTripRequestStatus(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(formData, "id");
  const status = tripRequestStatusSchema.safeParse(str(formData, "status"));
  if (!uuidSchema.safeParse(id).success || !status.success) {
    failTo("/admin/trip-requests", "Invalid request.");
  }

  const { error } = await supabase
    .from("custom_trip_requests")
    .update({ status: status.data })
    .eq("id", id);
  if (error) failTo("/admin/trip-requests", "Could not update the status.");

  revalidatePath("/admin/trip-requests");
  revalidatePath("/admin/bookings");
}

// ===========================================================================
// Categories
// ===========================================================================

export async function saveCategory(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(formData, "id");
  if (id && !uuidSchema.safeParse(id).success) failTo("/admin/categories", "Invalid category.");

  const nameEn = str(formData, "name_en");
  const parsed = categorySchema.safeParse({
    slug: slugify(str(formData, "slug") || nameEn),
    name_en: nameEn,
    name_de: str(formData, "name_de"),
    image_url: str(formData, "image_url"),
    sort_order: str(formData, "sort_order") || "0",
    active: bool(formData, "active"),
  });
  if (!parsed.success) failTo("/admin/categories", firstIssue(parsed.error));

  const { error } = id
    ? await supabase.from("categories").update(parsed.data).eq("id", id)
    : await supabase.from("categories").insert(parsed.data);
  if (error) {
    failTo(
      "/admin/categories",
      error.code === "23505"
        ? `A category with the slug "${parsed.data.slug}" already exists.`
        : "Could not save the category."
    );
  }

  revalidatePublicSite();
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(formData, "id");
  if (!uuidSchema.safeParse(id).success) failTo("/admin/categories", "Invalid category.");

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) failTo("/admin/categories", "Could not delete the category.");

  revalidatePublicSite();
  revalidatePath("/admin/categories");
}

// ===========================================================================
// Gallery
// ===========================================================================

export async function saveGalleryImage(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(formData, "id");
  if (id && !uuidSchema.safeParse(id).success) failTo("/admin/gallery", "Invalid photo.");

  const parsed = galleryImageSchema.safeParse({
    image_url: str(formData, "image_url"),
    caption_en: str(formData, "caption_en"),
    caption_de: str(formData, "caption_de"),
    tall: bool(formData, "tall"),
    sort_order: str(formData, "sort_order") || "0",
  });
  if (!parsed.success) failTo("/admin/gallery", firstIssue(parsed.error));

  const payload = { ...parsed.data, active: true };
  const { error } = id
    ? await supabase.from("gallery_images").update(payload).eq("id", id)
    : await supabase.from("gallery_images").insert(payload);
  if (error) failTo("/admin/gallery", "Could not save the photo.");

  revalidatePublicSite();
  revalidatePath("/admin/gallery");
  redirect("/admin/gallery");
}

export async function deleteGalleryImage(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(formData, "id");
  if (!uuidSchema.safeParse(id).success) failTo("/admin/gallery", "Invalid photo.");

  const { error } = await supabase.from("gallery_images").delete().eq("id", id);
  if (error) failTo("/admin/gallery", "Could not remove the photo.");

  revalidatePublicSite();
  revalidatePath("/admin/gallery");
}

// ===========================================================================
// Reviews
// ===========================================================================

export async function saveReview(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(formData, "id");
  if (id && !uuidSchema.safeParse(id).success) failTo("/admin/reviews", "Invalid review.");

  const parsed = reviewSchema.safeParse({
    author: str(formData, "author"),
    country: str(formData, "country"),
    rating: str(formData, "rating") || "5",
    text_en: str(formData, "text_en"),
    text_de: str(formData, "text_de"),
    review_date: str(formData, "review_date"),
    sort_order: str(formData, "sort_order") || "0",
    active: bool(formData, "active"),
  });
  if (!parsed.success) failTo("/admin/reviews", firstIssue(parsed.error));

  const { error } = id
    ? await supabase.from("reviews").update(parsed.data).eq("id", id)
    : await supabase.from("reviews").insert(parsed.data);
  if (error) failTo("/admin/reviews", "Could not save the review.");

  revalidatePublicSite();
  revalidatePath("/admin/reviews");
  redirect("/admin/reviews");
}

export async function deleteReview(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(formData, "id");
  if (!uuidSchema.safeParse(id).success) failTo("/admin/reviews", "Invalid review.");

  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) failTo("/admin/reviews", "Could not delete the review.");

  revalidatePublicSite();
  revalidatePath("/admin/reviews");
}
