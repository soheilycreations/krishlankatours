# Krish Lanka Tours — Phase 1 Audit Report

Audit of branch `claude/funny-pascal-pglqsj` at commit `dc7e28b`. No application code was changed.
Baseline checks run in a clean container (no Supabase env vars):

| Check | Result |
|---|---|
| `npm ci` | OK |
| `tsc --noEmit` | passes, 0 errors |
| `next build` | passes, 82 pages generated |
| `next lint` | **no ESLint config exists** — the command stops at the interactive setup prompt, so lint has never run |

> I could not see the **live** Supabase database. Sections 3 and 8 describe what the SQL files in `supabase/` create. Some of them depend on which files were actually run (see Q2 at the end).

---

## 1. Stack & versions

| Package | Installed | Latest | Notes |
|---|---|---|---|
| next | 14.2.35 (App Router) | 16.4.0 | Two majors behind. `@opennextjs/cloudflare` targets Next 15+ best |
| react / react-dom | 18.3.1 | 19.3.0 | Next 15 uses React 19 |
| next-intl | 4.13.2 | 4.14.9 | `localePrefix: "as-needed"`, locales `en` (default) + `de` |
| tailwindcss | 3.4.19 | 4.3.3 | v4 is a rewrite. Recommend **staying on 3.4** so the design does not change |
| typescript | 5.9.3 | 7.0.2 | `strict: true` |
| @supabase/ssr | 0.12.3 | 0.12.7 | |
| @supabase/supabase-js | 2.110.6 | 2.117.3 | |
| framer-motion | 12.42.2 | 14.1.0 | Used in 14 files |
| lucide-react | 1.24.0 | 1.55.0 | |
| date-fns | 4.4.0 | — | Bookings calendar, contact form |
| react-day-picker | 10.0.1 | 10.0.2 | Date range field |
| eslint / eslint-config-next | 8.57.1 / 14.2.35 | 10 / 16 | No config file, never runs |

**Unused dependencies:** `clsx` (0 imports) and `@fontsource/kaushan-script` (0 imports; the font is self-hosted from `app/fonts/KaushanScript-Regular.woff2`).

**Unused code:** `components/HeroCollage.tsx`, `components/ParallaxDrift.tsx`, `components/SriLankaStats.tsx` and `components/TopBar.tsx` are imported nowhere. `scripts/generate-seed.ts` and `scripts/generate-destinations-seed.ts` are one-off seed generators. `NEXT_PUBLIC_WHATSAPP_NUMBER` is read in `app/[locale]/contact/page.tsx` but never used; the number is hard-coded instead.

**i18n setup**
- `i18n/routing.ts`: locales `en` and `de`, default `en`, prefix `as-needed`. English has no prefix and German lives under `/de`.
- `i18n/request.ts` loads `messages/{locale}.json`. `en.json` and `de.json` have **identical key sets** (verified: 0 missing keys either way).
- Middleware runs `next-intl` locale detection (Accept-Language header plus `NEXT_LOCALE` cookie), so a German browser opening `/` is redirected to `/de`.
- Tour, destination, blog, category, review and gallery content is bilingual data (`{en, de}` objects in code, or `_en`/`_de` columns in the DB). It is not in the message files.
- `components/GoogleTranslate.tsx` and `components/LanguageDropdown.tsx` add 11 extra machine-translated languages through the Google Translate widget, which uses the `googtrans` cookie.

**Fonts:** `next/font/local` loads Fraunces, Work Sans, Space Mono and Kaushan Script from `app/fonts`. They are processed at build time and work on Cloudflare.

---

## 2. Routes

### Public pages (every one exists for both locales)

| URL (EN) | URL (DE) | File | Data source | Render |
|---|---|---|---|---|
| `/` | `/de` | `app/[locale]/page.tsx` | tours, destinations, categories, reviews, gallery (DB with static fallback) | `revalidate = 60` |
| `/tours` | `/de/tours` | `tours/page.tsx` | tours | 60s. Query params `?category=` and `?duration=day\|multi` |
| `/tours/{slug}` | `/de/tours/{slug}` | `tours/[slug]/page.tsx` | tours | 60s. `generateStaticParams` uses the **static** tours only; DB-only tours render on demand |
| `/destinations` | `/de/destinations` | `destinations/page.tsx` | destinations | 60s |
| `/destinations/{slug}` | `/de/destinations/{slug}` | `destinations/[slug]/page.tsx` | destinations + tours | 60s, dynamic |
| `/blog` | `/de/blog` | `blog/page.tsx` | `lib/blog.ts` (static, 3 posts) | 3600s |
| `/blog/{slug}` | `/de/blog/{slug}` | `blog/[slug]/page.tsx` | static | SSG |
| `/gallery` | `/de/gallery` | `gallery/page.tsx` | `gallery_images` with static fallback, plus a YouTube embed | 60s |
| `/about` | `/de/about` | `about/page.tsx` | messages only | static |
| `/contact` | `/de/contact` | `contact/page.tsx` | tours (for the dropdown). `?tour={slug}` preselects a tour | 60s |
| `/plan` | `/de/plan` | `plan/page.tsx` | destinations + vehicles | 60s |
| `/faq` | `/de/faq` | `faq/page.tsx` | messages | 3600s |
| `/vehicles` | `/de/vehicles` | `vehicles/page.tsx` | vehicles | 60s |
| `/airport-transfer` | `/de/airport-transfer` | `airport-transfer/page.tsx` | messages (`ServicePage`) | static |
| `/taxi-service` | `/de/taxi-service` | `taxi-service/page.tsx` | messages | static |
| `/surfing` | `/de/surfing` | `surfing/page.tsx` | messages | static |

**Locale prefix behaviour:** `/en/...` is valid but `next-intl` redirects it to the unprefixed URL. `/de/...` is served directly. An unknown locale segment returns 404 through `notFound()` in `app/[locale]/layout.tsx`.

**Known content slugs**
- Static tours (`lib/tours.ts`, 13): `wild-heart-safari`, `ancient-kingdoms-trail`, `hill-country-sacred-peaks`, `lagoon-wetland-safari`, `culture-and-coast-escape`, `galle-day-tour`, `udawalawe-safari-tour`, `sigiriya-lion-rock`, `kandy-day-tour`, `bentota-river-safari`, `mirissa-whale-watching`, `colombo-city-tour`, `ayurveda-massage-experience`
- DB-only tours (from the seed files): `bentota-deep-sea-fishing`, `brief-garden-bawa`, `lunuganga-estate-tour`, `kitulgala-white-water-rafting`, `kosgoda-turtle-hatchery`, `pinnawala-elephant-orphanage-tour`, `sinharaja-rainforest-tour`, `ahungalla-village-tuktuk-tour`
- Static destinations (6): `yala`, `kandy`, `nuwara-eliya`, `ella`, `anuradhapura`, `polonnaruwa`. DB seeds add `sigiriya-lion-rock`, `trincomalee-beach`, `mirissa-beach`, `galle-fort`, `bentota-beach`.
- Blog: `best-time-visit-sri-lanka`, `sigiriya-vs-pidurangala`, `packing-list-sri-lanka`

> **Important fallback behaviour:** if the DB `tours` table has **any** published row, the static list is ignored entirely; the same applies to destinations. Which URLs are live today therefore depends on the live DB contents.

### Admin (not localized, protected by middleware)
`/admin` (dashboard), `/admin/login`, `/admin/bookings`, `/admin/enquiries`, `/admin/tours`, `/admin/tours/new`, `/admin/tours/[id]`, `/admin/destinations`, `/admin/destinations/new`, `/admin/destinations/[id]`, `/admin/trip-requests`, `/admin/categories`, `/admin/gallery`, `/admin/reviews`, `/admin/vehicles`, `/admin/newsletter`. All of them are `force-dynamic`.

### API and metadata routes
- `POST /api/inquiries`: contact form, writes to `inquiries`
- `POST /api/custom-trips`: trip planner, writes to `custom_trip_requests`
- `POST /api/newsletter`: footer signup, upserts into `newsletter_subscribers`
- `/sitemap.xml`, `/robots.txt`, `/icon.png`; `favicon.ico` exists in both `app/` and `public/`

---

## 3. Supabase

### Environment variables used
| Var | Where | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/supabase.ts`, `lib/supabase/{client,server}.ts`, `middleware.ts` | Inlined at **build time** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | same files | Public key, inlined at build time |
| `NEXT_PUBLIC_SITE_URL` | `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts` | Defaults disagree: layout uses `krishlankatours.vercel.app`, sitemap and robots use `krishlankatours.com` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | contact page | Read but unused |

No service-role key is used anywhere. Every query runs as `anon` or as the signed-in `authenticated` user, so RLS is the only access control.

### Tables (as defined by `schema.sql` plus migrations)
| Table | Columns | RLS |
|---|---|---|
| `inquiries` | id, created_at, name*, email*, phone, tour_slug, travel_dates (free text), group_size (text), message, locale, status (`new\|contacted\|booked\|closed`), **hotel_location** (migration-3) | anon INSERT; authenticated SELECT and UPDATE; **no DELETE policy** |
| `tours` | id, slug (unique), category, duration_days, price_from_usd, group_size, hero_image, gallery text[], title/tagline/summary `_en/_de`, highlights jsonb, itinerary jsonb, published, sort_order, created_at, updated_at | anon SELECT where `published`; authenticated ALL |
| `destinations` | id, slug (unique), name/region/tagline/best_time `_en/_de`, image, **gallery text[]** (migration-4), description jsonb, highlights jsonb, related_tour_slug, published, sort_order, timestamps | anon SELECT where `published`; authenticated ALL |
| `newsletter_subscribers` | id, email (unique), created_at | anon INSERT; **anon UPDATE `using (true)`**; authenticated SELECT |
| `categories` (migration-2) | id, slug (unique), name_en/de, image_url, sort_order, active | anon SELECT where active; authenticated ALL |
| `reviews` (migration-2) | id, author, country, rating 1–5, text_en/de, source, review_date, active, sort_order | anon SELECT where active; authenticated ALL |
| `gallery_images` (migration-2) | id, image_url, caption_en/de, tall, sort_order, active | anon SELECT where active; authenticated ALL |
| `vehicles` | id, name, type (`car\|van\|suv\|minibus\|coach`), seats, description, image_url, active, sort_order | anon SELECT where active; authenticated ALL |
| `custom_trip_requests` | id, name, email, phone, arrival_date, departure_date (date), travelers, locations jsonb, vehicle_id → vehicles (on delete set null), vehicle_name, hotel_category, notes, locale, status (`new\|contacted\|quoted\|booked\|closed`) | anon INSERT; authenticated SELECT and UPDATE; no DELETE |

**Relations:** the only foreign key is `custom_trip_requests.vehicle_id → vehicles.id`. Every other link is a soft text reference: `destinations.related_tour_slug → tours.slug`, `inquiries.tour_slug → tours.slug`, and `tours.category → categories.slug` (not enforced).

**Functions and triggers:** `set_updated_at()` plus `BEFORE UPDATE` triggers on `tours` and `destinations`.

**Storage:** public bucket `tour-images`. Anyone can read. Any authenticated user can insert, update and delete. There is no size or MIME limit.

**`FULL-SETUP.sql` is stale.** It omits migration-2 (categories, reviews, gallery), migration-3 (`inquiries.hotel_location`) and migration-4 (`destinations.gallery`). On a fresh project built from it, every contact-form submission fails with a 500, because the API inserts `hotel_location`.

### Where the app queries Supabase
| File | Client | Runs on |
|---|---|---|
| `lib/tours-data.ts`, `lib/destinations-data.ts` | `createSupabaseServerClient()` (**reads cookies**) | server (RSC) |
| `lib/content-data.ts` (categories, reviews, gallery), `lib/vehicles-data.ts` | shared anon client `lib/supabase.ts` | server |
| `app/api/*` | shared anon client | server (route handlers) |
| `app/admin/**/page.tsx`, `app/admin/layout.tsx`, `app/admin/actions.ts` | cookie server client (authenticated) | server |
| `middleware.ts` | `createServerClient` → `auth.getUser()` on `/admin*` | middleware |
| `components/admin/ImageUploadField.tsx`, `GalleryUploadField.tsx` | `createSupabaseBrowserClient()` → Storage upload | **browser** |

Because `getTours()` and `getDestinations()` call `cookies()`, every page that uses them is **dynamically rendered on each request** once the env vars are set, so `revalidate = 60` has no effect. The local build showed them as SSG only because the env vars were missing there.

---

## 4. Admin CMS

**Auth:** Supabase email and password, through the server action `signIn` in `app/admin/actions.ts`. `middleware.ts` checks `auth.getUser()` and redirects to `/admin/login`. **Any authenticated Supabase user counts as an admin**: there is no role or allowlist check in the code or in RLS.

| Screen | What it does |
|---|---|
| Dashboard `/admin` | Counts of new and total enquiries, tours and subscribers; the 5 latest enquiries |
| Bookings `/admin/bookings` | Month calendar (`components/admin/BookingsCalendar.tsx`) that merges trip requests (real dates) and enquiries (free-text dates parsed best-effort); undated items are listed separately |
| Enquiries `/admin/enquiries` | Filter by status, expand, change status, delete (`EnquiriesList.tsx`) |
| Tours | List with thumbnail; create and edit (`TourForm.tsx`): category, duration, price, group size, hero image, gallery, EN/DE text, highlights, itinerary; delete |
| Destinations | Same pattern (`DestinationForm.tsx`) |
| Trip requests | Read requests from the planner and change their status |
| Categories, Gallery, Reviews, Vehicles | Simple CRUD forms using `<form action={serverAction}>` |
| Newsletter | List subscribers; copy all emails |

### Weak spots
1. **Slug handling (TourForm and DestinationForm)**
   - The slug is generated **only in the browser**. `saveTour` and `saveDestination` take whatever string is posted, with only `.trim()`; nothing is validated on the server.
   - The two forms use **different `slugify` implementations**, and neither transliterates non-ASCII characters. `"Kosgoda Schildkröten"` becomes `kosgoda-schildkrten`. A title made only of non-ASCII characters produces an empty slug: TourForm catches this, DestinationForm sends `""` and gets "Slug … required".
   - A duplicate slug surfaces the raw Postgres error (`duplicate key value violates unique constraint "tours_slug_key"`).
   - The slug cannot be changed after creation, because it is a hidden field.
   - `related_tour_slug` is free text with no check that the tour exists.
2. **TourForm is missing the `village` category** (`components/admin/TourForm.tsx`, the `categories` array). Opening `ahungalla-village-tuktuk-tour` shows "Wildlife" selected, because the browser falls back to the first option, and **saving silently re-categorises the tour as wildlife**. Categories added in `/admin/categories` can never be chosen either.
3. **Removing a highlight, itinerary day or description row deletes the wrong row.** These lists use `key={index}` with uncontrolled `defaultValue` inputs. Deleting row 1 of 3 leaves rows 1 and 2 visible and drops row 3. This affects `TourForm.tsx` and `DestinationForm.tsx`.
4. **Deleting an enquiry does nothing.** There is no DELETE RLS policy on `inquiries`, so Supabase deletes 0 rows without an error. The UI removes the row optimistically and it comes back on reload.
5. **Several server actions skip the "signed in?" check:** `saveVehicle`, `deleteVehicle`, `toggleVehicle`, `updateTripRequestStatus`, `saveCategory`, `deleteCategory`, `saveGalleryImage`, `deleteGalleryImage`, `saveReview`, `deleteReview`. Today RLS still blocks anonymous writes, but nothing protects them if a policy changes. No action validates its input: `Number("abc")` becomes `NaN`, and the `status` value is not checked against an allowed list.
6. **Bookings calendar**
   - Enquiry dates are free text parsed with three fixed formats, so anything typed differently becomes "undated".
   - Trip dates are shifted by timezone (see §8, bug B1), so the calendar shows them a day early.
   - Statuses differ between the two sources (`quoted` exists only on trips).
   - It loads **all** rows from both tables with no date window.
7. **Uploads:** no file size or type checks; the extension is taken from the file name; no cleanup of orphaned files when an image is removed or a tour deleted.
8. **Navigation:** "Back to tours" and the end of `saveTour` both go to `/admin`, not `/admin/tours`. The price field says *"not shown publicly"*, but the tour page and tour cards **do** show it when it is above 0.
9. Admin login has no rate limit beyond Supabase's own, and no 2FA.

---

## 5. Integrations

| Integration | Where | Notes |
|---|---|---|
| WhatsApp | `WhatsAppFab.tsx` (floating button on every page), `contact/page.tsx`, `ServicePage.tsx` | `wa.me/94779168959` is hard-coded in 3 places; it also exists as `SITE.whatsapp` in `lib/site-config.ts` |
| Phone and email | `site-config.ts`, `Footer.tsx`, `contact/page.tsx` | Also hard-coded in several places. The email is plain text, not a `mailto:` link |
| Social | `SocialLinks.tsx`, `SocialRail.tsx`, and JSON-LD `sameAs` | Facebook, Instagram, YouTube, TikTok, TripAdvisor, Google Maps. **The Instagram URL points to one post (`/p/DX9dCTTiP5b/`), not the profile** |
| Contact or enquiry form | `ContactForm.tsx` → `/api/inquiries` | Only `name` and `email` are required server-side. No email format check, length limits, honeypot or captcha |
| Trip planner | `CustomTripPlanner.tsx` → `/api/custom-trips` | Same; `locations` is any JSON array |
| Newsletter | `NewsletterForm.tsx` → `/api/newsletter` | Upsert (see bug B4) |
| **Email notifications** | — | **None.** New enquiries are only visible in `/admin`; nobody is notified |
| **Analytics** | — | **None.** The README mentions Vercel Analytics, but it is not installed |
| Google Maps embed | contact page | iframe |
| YouTube embed | gallery page | Uploads playlist iframe |
| Google Translate | `GoogleTranslate.tsx` | Third-party script loaded on every page; sets the `googtrans` cookie. No cookie or consent banner exists, which is relevant for DE/EU visitors |

---

## 6. SEO

**What exists**
- Root `metadata` in `app/layout.tsx`: title template `%s | Krish Lanka Tours & Travels`, description, keywords, OG and Twitter tags with `/og-image.jpg?v=3` (1200×630, confirmed).
- `generateMetadata` exists on: tour detail, destination detail, blog index and post, airport transfer, taxi service, surfing, vehicles.
- **No page-specific metadata** on home, tours, destinations, gallery, about, contact, plan or faq; they inherit the root title.
- JSON-LD `TravelAgency` in `app/[locale]/layout.tsx`.
- `robots.ts` allows `/` and disallows `/admin` and `/api`.
- `sitemap.ts`.

**Problems**
1. **Sitemap URLs redirect.** It emits `https://krishlankatours.com/en/...`, but with `as-needed` the canonical English URLs have no prefix, so every English sitemap entry is a redirect.
2. **The sitemap is missing pages:** `/blog`, `/blog/*`, `/faq`, `/vehicles`, `/airport-transfer`, `/taxi-service` and `/surfing` are not listed. `lastModified` is always "now".
3. **No `hreflang` alternates and no canonical tags** anywhere, so EN and DE pages are not linked for Google.
4. **The production domain is inconsistent.** `metadataBase` defaults to `https://krishlankatours.vercel.app`, and the JSON-LD `url` and `logo` are hard-coded to `krishlankatours.vercel.app`. Unless `NEXT_PUBLIC_SITE_URL` is set on Vercel, OG URLs point at the Vercel subdomain.
5. Service-page titles and descriptions are **English only**, even on `/de/...`.
6. JSON-LD `aggregateRating` is hard-coded (`5.0`, `reviewCount: 6`). Google treats self-served ratings on a LocalBusiness as ineligible, and the number will drift. There is no structured data for tours, blog posts or breadcrumbs.
7. `<html lang>` is set correctly per locale. Google-translated languages are client-side only and not indexable, which is fine.

**Current URL structure to preserve:** everything in §2, plus `/en/*` → `/*` (308), `/sitemap.xml`, `/robots.txt`, `/icon.png`, `/favicon.ico`, `/apple-touch-icon.png`, `/og-image.jpg`, and every `/images/**` path. These are also stored as strings in DB rows such as `hero_image` and `gallery`.

---

## 7. Vercel-specific items to change for Cloudflare (OpenNext)

| Item | Current | On Cloudflare Workers via `@opennextjs/cloudflare` |
|---|---|---|
| Next version | 14.2 | OpenNext Cloudflare is developed against Next 15+. **Plan: upgrade to Next 15** (async `params` is already used, which makes this easier) |
| `next/image` | `unoptimized: true` | Works as-is (served as static assets). Option: custom loader using **Cloudflare Image Transformations** (`/cdn-cgi/image/...`), which needs Images enabled on the zone |
| ISR (`revalidate`) and `revalidatePath` in admin actions | Vercel data cache | Needs OpenNext caches: **R2 incremental cache + D1 (or Durable Object) tag cache + DO queue**, otherwise admin edits will not invalidate pages. Alternatively render public pages dynamically with no ISR |
| Pages calling `cookies()` for public reads | Forces dynamic | Switch public reads to a cookie-less anon client so pages can actually be cached |
| `middleware.ts` (edge) | next-intl + Supabase auth | Supported. `@supabase/ssr` works in workerd |
| API route handlers | Node serverless | Run in the Worker with `nodejs_compat`. Nothing Node-only is used (no `fs`, `Buffer` or `child_process`) |
| `vercel.json`, crons, `export const runtime` | **None** | Nothing to migrate |
| `_vercel` in the middleware matcher | harmless | Remove |
| `NEXT_PUBLIC_*` env vars | Vercel env | **Inlined at build time**, so they must be **build variables** in Workers Builds (or `.env.production` for local `deploy`). Setting them only as runtime secrets is not enough. Real secrets (a future Resend key or Turnstile secret) go in `wrangler secret` |
| Worker size | n/a | Free plan: 3 MiB compressed; paid: 10 MiB. A Next app with framer-motion and Supabase usually lands around 2–5 MiB, so **Workers Paid ($5/month) is likely needed** |
| Domain | Vercel DNS records | Move DNS to Cloudflare, attach the custom domain to the Worker, redirect www to the apex |
| `krishlankatours.vercel.app` | live | Keep the Vercel project briefly with a permanent redirect to the new domain, then delete it |

---

## 8. Bugs, dead code and risky patterns (ranked)

### Security
- **S1. Supabase sign-up exposure (critical, verify now).** RLS gives full read and write to the role `authenticated`. If **"Allow new users to sign up"** is enabled in Supabase Auth (it is on by default), anyone can call `auth.signUp()` with the public anon key. That person could then read every enquiry and trip request (names, emails, phones), edit or delete tours, and upload files. Fix: disable sign-ups now, then add an admin allowlist (`admin_users` table plus an `is_admin()` function) to the RLS policies through a new migration.
- **S2.** `newsletter_subscribers` grants anon `UPDATE using (true)`. This is too broad and should be removed; the code can use insert with "ignore duplicates" instead.
- **S3.** The storage bucket accepts any file type and size from any authenticated user.
- **S4.** No server-side input validation on any API route or server action: no length caps, email checks or spam protection on public forms.

### Functional bugs
- **B1. The trip planner saves the wrong dates.** `CustomTripPlanner.tsx` sends `range.from.toISOString().slice(0,10)`. For visitors east of UTC (Germany, Sri Lanka and most customers) local midnight converts to the **previous day**, so 15 Aug is stored as 14 Aug. The bookings calendar inherits the shift.
- **B2. The `village` category is missing from the TourForm select.** Saving a village tour turns it into a wildlife tour (§4.2).
- **B3. The `village` category is also missing from `ToursFilterGrid` and `HeroSearchBar`.** The homepage "Village Tours" circle links to `/tours?category=village`, which shows **all** tours. Admin-created categories never appear in the filters.
- **B4. Repeat newsletter sign-ups probably fail.** `upsert(..., onConflict: "email")` needs SELECT rights on the existing row under RLS, and anon has none. A repeat email most likely returns a 500 and the user sees an error. Needs a live test.
- **B5. Deleting an enquiry is a silent no-op** (§4.4).
- **B6. Deleting a list row removes the wrong one** in the admin forms (§4.3).
- **B7. A fresh database from `FULL-SETUP.sql` breaks the contact form** (missing `hotel_location`) and the categories, reviews and gallery admin.
- **B8. The language switcher adds an extra redirect.** `LanguageDropdown` sends English to `/en/...`, which then redirects to `/...`.
- **B9. The hero search ignores the dates and travelers fields**; only the category is used.
- **B10. The tour list in the contact form follows DB-or-static.** If the DB is reachable but empty, the static list is shown (acceptable). If the DB has tours, static-only tours are hidden; `?tour=` with such a slug leaves the select blank.
- **B11. Gallery lightbox bookkeeping.** `GalleryGrid` tracks broken images by index after filtering, and duplicate `src` values cause duplicate React keys.

### Risky patterns and dead code
- Hard-coded contact data duplicated across 6+ files instead of `lib/site-config.ts`.
- Unused components and dependencies listed in §1; no ESLint config.
- The README is outdated: it says only tours are admin-managed, every page is static, and AVIF/WebP is configured.
- `revalidate` exports are ineffective in production because of `cookies()` (§3).
- Supabase types are hand-written; no generated `Database` types.

---

## Proposed rebuild plan (Phase 2, after approval)

**Principles:** same design and content, same URLs, same Supabase project. Schema changes only as new migration files that you run yourself. The work is done on the branch with a preview deploy on `*.workers.dev` before any DNS change.

1. **Foundation**
   - Next 15.x, React 19, next-intl 4.14, Tailwind 3.4 (no visual changes), TypeScript strict, ESLint flat config, zod.
   - `@opennextjs/cloudflare` with `wrangler.jsonc` (`nodejs_compat`, assets binding, R2 incremental cache, D1 tag cache, DO queue).
   - Scripts: `dev`, `build`, `preview` (`opennextjs-cloudflare build && opennextjs-cloudflare preview`), `deploy`, `cf-typegen`, `lint`, `typecheck`.
2. **Config and constants:** one `lib/site-config.ts` for name, phone, WhatsApp, email, socials and the site URL; a zod-validated `lib/env.ts`.
3. **Data layer**
   - `lib/supabase/{public,server,browser}.ts`: a cookie-less anon client for public reads (cacheable) and a cookie client for admin.
   - Generated `Database` types.
   - Keep the static fallbacks.
4. **Public site:** port every page 1:1. Fix B1, B3, B8, B9 and B11. The category list comes from the DB (with fallback) everywhere.
5. **Admin CMS**
   - A `requireAdmin()` guard in every server action and admin page.
   - Shared zod schemas for each entity.
   - One server-side `slugify` with German and Latin transliteration (ä→ae, ö→oe, ü→ue, ß→ss), a uniqueness check and a friendly error.
   - Keyed list rows (fixes B6) and the full category list (fixes B2).
   - Upload limits: images only, at most 5 MB, extension taken from the MIME type.
   - Bookings calendar on proper date columns with a date window.
6. **Forms:** zod validation on all three APIs, a honeypot, optional Cloudflare Turnstile, and optional email notification of new enquiries through Resend (fetch-based, works on Workers).
7. **SEO**
   - Per-page bilingual metadata, canonical tags and `hreflang` (en, de, x-default) through one helper.
   - A sitemap with correct unprefixed English URLs, all pages, and alternates.
   - JSON-LD from config on `krishlankatours.com`, plus `TouristTrip` for tours, `BlogPosting` for posts and `BreadcrumbList`.
   - Keep `/en/*` → `/*` and add a redirect map for anything that changes (nothing is planned to change).
8. **Images:** a `next/image` loader using Cloudflare Image Transformations for local and Supabase images when enabled on the zone, otherwise `unoptimized`. One flag switches between them.
9. **New SQL migration for your review: `supabase/migration-5-hardening.sql`** (no data changes)
   - `admin_users` allowlist plus `is_admin()`.
   - Rewrite the `authenticated` policies to `is_admin()`.
   - DELETE policies for enquiries and trip requests (admin only).
   - Drop the anon UPDATE on newsletter.
   - Bucket file-size and MIME limits; storage writes for admins only.
   - Also a corrected, up-to-date `FULL-SETUP.sql` for fresh installs.
10. **Delivery:** an `npm run preview` smoke test, a deploy to `workers.dev`, your test pass, then the DNS cutover. Deliverables: the deploy checklist, the env var list, the DNS steps and the post-launch test checklist you asked for.

---

## Questions for you

1. **Domain:** what is live today? Is `krishlankatours.com` attached to Vercel, and is `www` or the apex canonical? Who is the registrar, and are the nameservers at Vercel, the registrar, or already Cloudflare?
2. **Live database:** which SQL files were actually run? Please run this in the Supabase SQL editor and send me the output:
   `select tablename, policyname, cmd, roles, qual from pg_policies where schemaname in ('public','storage') order by 1,2;` and `select 'tours', count(*) from tours union all select 'destinations', count(*) from destinations;`
3. **Supabase Auth:** is "Allow new users to sign up" **off**? How many admin users exist? I'll need their emails for the `admin_users` allowlist.
4. **Cloudflare plan:** is Workers Paid ($5/month) acceptable? It is likely needed for the bundle-size limit. Do you already have a Cloudflare account and zone?
5. **Images:** use Cloudflare Image Transformations (free quota, then paid per transformation), or keep images unoptimized as today?
6. **Next.js version:** Next 15 (my recommendation, best-tested with OpenNext Cloudflare) or Next 16?
7. **Email alerts** for new enquiries and trip requests: yes or no? To which address? Is Resend (free tier) OK?
8. **Spam protection:** add Cloudflare Turnstile to the contact, planner and newsletter forms?
9. **Analytics:** add Cloudflare Web Analytics (cookieless)? Do you use Google Search Console or Analytics today, and is the verification a DNS TXT record or a meta tag?
10. **Slugs:** keep them locked after creation, or make them editable with automatic 301 redirects? Editable slugs need a small `slug_redirects` table in the migration.
11. **Prices:** should "price from" be shown publicly? The admin says no, but the site shows it.
12. **Google Translate widget** for the 11 extra languages: keep it? It sets a third-party cookie, and there is currently no consent banner.
13. **JSON-LD rating:** keep the hard-coded 5.0 / 6, compute it from the `reviews` table, or remove it?
14. **Cleanup:** may I delete the unused components, the `clsx` and `@fontsource/kaushan-script` packages, and the `scripts/` seed generators?
15. **Auto-redirect** of German browsers from `/` to `/de`: keep it?
16. **Instagram:** what is the correct profile URL? The current link is a single post.
17. **Design:** please confirm "rebuild cleanly" means the same look and content with cleaner code, not a redesign.
