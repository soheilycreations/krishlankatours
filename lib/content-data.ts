import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { galleryImages as staticGallery, type GalleryImage } from "@/lib/gallery";

// ---------- CATEGORIES ----------
export interface CategoryItem {
  slug: string;
  name: { en: string; de: string };
  image: string;
}

const FALLBACK_CATEGORIES: CategoryItem[] = [
  { slug: "wildlife", name: { en: "Wildlife", de: "Tierwelt" }, image: "/images/elephants-trio.jpg" },
  { slug: "heritage", name: { en: "Heritage", de: "Kulturerbe" }, image: "/images/buddha-carving.jpg" },
  { slug: "hillcountry", name: { en: "Hill Country", de: "Hochland" }, image: "/images/golden-temple-hills.jpg" },
  { slug: "wetland", name: { en: "Wetland", de: "Feuchtgebiet" }, image: "/images/river-boat-safari.jpg" },
  { slug: "coastal", name: { en: "Coast & Rest", de: "Küste & Erholung" }, image: "/images/couple-pool-sunset.jpg" },
  { slug: "village", name: { en: "Village Tours", de: "Dorftouren" }, image: "/images/stock3/rice-paddy-aerial.jpg" },
];

export async function getCategories(): Promise<CategoryItem[]> {
  if (!isSupabaseConfigured || !supabase) return FALLBACK_CATEGORIES;
  const { data, error } = await supabase
    .from("categories").select("*").eq("active", true).order("sort_order");
  if (error || !data || data.length === 0) return FALLBACK_CATEGORIES;
  return data.map((r) => ({
    slug: r.slug,
    name: { en: r.name_en, de: r.name_de ?? r.name_en },
    image: r.image_url ?? "",
  }));
}

// ---------- REVIEWS ----------
export interface Review {
  id: string;
  author: string;
  country: string;
  rating: number;
  text: { en: string; de: string };
  date: string | null;
}

export async function getReviews(): Promise<Review[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase
    .from("reviews").select("*").eq("active", true)
    .order("sort_order").order("review_date", { ascending: false });
  if (error || !data) return [];
  return data.map((r) => ({
    id: r.id,
    author: r.author,
    country: r.country ?? "",
    rating: r.rating,
    text: { en: r.text_en, de: r.text_de ?? r.text_en },
    date: r.review_date,
  }));
}

// ---------- GALLERY ----------
export async function getGalleryImages(): Promise<GalleryImage[]> {
  if (!isSupabaseConfigured || !supabase) return staticGallery;
  const { data, error } = await supabase
    .from("gallery_images").select("*").eq("active", true).order("sort_order");
  if (error || !data || data.length === 0) return staticGallery;
  return data.map((r) => ({
    src: r.image_url,
    caption: { en: r.caption_en ?? "", de: r.caption_de ?? r.caption_en ?? "" },
    tall: r.tall,
  }));
}
