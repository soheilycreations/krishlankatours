import { z } from "zod";
import { SLUG_PATTERN, SLUG_MAX_LENGTH } from "@/lib/slug";

// ---------------------------------------------------------------------------
// Shared building blocks
// ---------------------------------------------------------------------------

/** Trimmed text with a max length; empty string allowed. */
const text = (max: number) => z.string().trim().max(max);

/** Trimmed text that must not be empty. */
const requiredText = (max: number, label: string) =>
  z.string().trim().min(1, `${label} is required.`).max(max, `${label} is too long.`);

/** Optional text → null when empty. */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((v) => (v ? v : null));

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, "Email is too long.")
  .pipe(z.email("Please enter a valid email address."));

/** A plain calendar date (YYYY-MM-DD) — no time, no timezone. */
const plainDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date.")
  .refine((v) => !Number.isNaN(Date.parse(`${v}T00:00:00Z`)), "Invalid date.");

const optionalPlainDate = z
  .union([plainDate, z.literal("")])
  .nullish()
  .transform((v) => (v ? v : null));

const slugSchema = z
  .string()
  .min(1, "Slug is required.")
  .max(SLUG_MAX_LENGTH, "Slug is too long.")
  .regex(SLUG_PATTERN, "Slug may only contain a–z, 0–9 and single dashes.");

/** Image reference: a site path (/images/...), a cached media path, or an https URL. */
const imageRef = z
  .string()
  .trim()
  .max(1000, "Image URL is too long.")
  .refine(
    (v) => v === "" || (v.startsWith("/") && !v.startsWith("//")) || /^https:\/\/[^\s]+$/i.test(v),
    "Images must be a /images/... path or an https:// URL."
  );

const localized = (max: number) => z.object({ en: text(max), de: text(max) });

// ---------------------------------------------------------------------------
// Public forms
// ---------------------------------------------------------------------------

export const LOCALES = ["en", "de"] as const;
const localeSchema = z
  .enum(LOCALES)
  .optional()
  .catch("en")
  .transform((v) => v ?? "en");

export const inquirySchema = z.object({
  name: requiredText(120, "Name"),
  email: emailSchema,
  phone: optionalText(40),
  tourSlug: optionalText(SLUG_MAX_LENGTH),
  travelDates: optionalText(120),
  groupSize: optionalText(60),
  hotelLocation: optionalText(200),
  message: optionalText(5000),
  locale: localeSchema,
});
export type InquiryInput = z.infer<typeof inquirySchema>;

export const customTripSchema = z.object({
  name: requiredText(120, "Name"),
  email: emailSchema,
  phone: optionalText(40),
  notes: optionalText(5000),
  arrivalDate: optionalPlainDate,
  departureDate: optionalPlainDate,
  travelers: z.coerce.number().int().min(1).max(100).optional().nullable().catch(null),
  locations: z
    .array(z.object({ slug: text(SLUG_MAX_LENGTH), name: text(160) }))
    .min(1, "Pick at least one location.")
    .max(30),
  vehicleId: z
    .string()
    .uuid()
    .optional()
    .nullable()
    .catch(null),
  vehicleName: optionalText(160),
  hotelCategory: optionalText(40),
  locale: localeSchema,
});
export type CustomTripInput = z.infer<typeof customTripSchema>;

export const newsletterSchema = z.object({ email: emailSchema });

// ---------------------------------------------------------------------------
// Admin forms
// ---------------------------------------------------------------------------

export const tourSchema = z.object({
  category: slugSchema,
  duration_days: z.coerce.number().int("Duration must be whole days.").min(1).max(60),
  price_from_usd: z
    .union([z.literal(""), z.coerce.number().min(0).max(1_000_000)])
    .transform((v) => (v === "" ? null : v)),
  group_size: text(160),
  hero_image: imageRef.transform((v) => v || null),
  gallery: z.array(imageRef.refine((v) => v !== "")).max(60, "Too many gallery photos."),
  title_en: requiredText(160, "English title"),
  title_de: text(160),
  tagline_en: text(300),
  tagline_de: text(300),
  summary_en: text(5000),
  summary_de: text(5000),
  highlights: z.array(localized(400)).max(40),
  itinerary: z
    .array(
      z.object({
        day: z.number().int().min(1),
        title: localized(200),
        description: localized(3000),
      })
    )
    .max(90),
  published: z.boolean(),
});
export type TourInput = z.infer<typeof tourSchema>;

export const destinationSchema = z.object({
  name_en: requiredText(160, "English name"),
  name_de: text(160),
  region_en: text(160),
  region_de: text(160),
  tagline_en: text(300),
  tagline_de: text(300),
  image: imageRef.transform((v) => v || null),
  gallery: z.array(imageRef.refine((v) => v !== "")).max(60, "Too many gallery photos."),
  description: z.array(localized(5000)).max(20),
  highlights: z.array(localized(400)).max(40),
  best_time_en: text(500),
  best_time_de: text(500),
  related_tour_slug: z.union([z.literal(""), slugSchema]),
  published: z.boolean(),
});
export type DestinationInput = z.infer<typeof destinationSchema>;

export const VEHICLE_TYPES = ["car", "van", "suv", "minibus", "coach"] as const;
export const vehicleSchema = z.object({
  name: requiredText(160, "Name"),
  type: z.enum(VEHICLE_TYPES),
  seats: z.coerce.number().int().min(1).max(100),
  description: optionalText(500),
  image_url: imageRef.transform((v) => v || null),
  active: z.boolean(),
  sort_order: z.coerce.number().int().min(-10000).max(10000).catch(0),
});

export const categorySchema = z.object({
  slug: slugSchema,
  name_en: requiredText(80, "English name"),
  name_de: optionalText(80),
  image_url: imageRef.transform((v) => v || null),
  sort_order: z.coerce.number().int().min(-10000).max(10000).catch(0),
  active: z.boolean(),
});

export const galleryImageSchema = z.object({
  image_url: imageRef.refine((v) => v !== "", "Please add a photo."),
  caption_en: optionalText(300),
  caption_de: optionalText(300),
  tall: z.boolean(),
  sort_order: z.coerce.number().int().min(-10000).max(10000).catch(0),
});

export const reviewSchema = z.object({
  author: requiredText(120, "Guest name"),
  country: optionalText(80),
  rating: z.coerce.number().int().min(1).max(5).catch(5),
  text_en: requiredText(5000, "Review text"),
  text_de: optionalText(5000),
  review_date: optionalPlainDate,
  sort_order: z.coerce.number().int().min(-10000).max(10000).catch(0),
  active: z.boolean(),
});

export const INQUIRY_STATUSES = ["new", "contacted", "booked", "closed"] as const;
export const TRIP_REQUEST_STATUSES = ["new", "contacted", "quoted", "booked", "closed"] as const;
export const inquiryStatusSchema = z.enum(INQUIRY_STATUSES);
export const tripRequestStatusSchema = z.enum(TRIP_REQUEST_STATUSES);
export const uuidSchema = z.string().uuid();

const FIELD_LABELS: Record<string, string> = {
  hero_image: "Hero image",
  image: "Card photo",
  image_url: "Photo",
  gallery: "Gallery photo",
  category: "Category",
  duration_days: "Duration",
  price_from_usd: "Price",
  related_tour_slug: "Related tour slug",
  seats: "Seats",
  highlights: "Highlights",
  itinerary: "Itinerary",
  description: "Description",
  arrivalDate: "Arrival date",
  departureDate: "Departure date",
  locations: "Locations",
};

/** First human-readable message from a failed zod parse, prefixed with the
 *  field it belongs to (e.g. "Hero image: Images must be ..."). */
export function firstIssue(error: z.ZodError): string {
  const issue = error.issues[0];
  if (!issue) return "Please check the form and try again.";
  const message = issue.message || "Please check the form and try again.";
  const field = typeof issue.path[0] === "string" ? FIELD_LABELS[issue.path[0]] : undefined;
  if (!field || message.startsWith(field)) return message;
  const position = typeof issue.path[1] === "number" ? ` ${issue.path[1] + 1}` : "";
  return `${field}${position}: ${message}`;
}
