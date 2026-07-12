# Krish Lanka Tours & Travels

Private, driver-guided Sri Lanka tour website. Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion + Supabase, with English/German support.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** for styling
- **Framer Motion** for scroll reveals and the gallery lightbox
- **next-intl** for English/German i18n (auto-detects browser language, manual EN/DE switcher in the header)
- **Supabase** (Postgres) for the contact/booking form submissions
- Self-hosted fonts (Fraunces, Work Sans, Space Mono) — no external font requests at runtime

## Getting started locally

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase values (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The site defaults to English at `/`; German lives at `/de`.

## Project structure

```
app/
  [locale]/                 # every page, nested under the locale segment
    page.tsx                # Home
    tours/page.tsx          # Tour package listing (with category filter)
    tours/[slug]/page.tsx   # Single tour detail + itinerary
    gallery/page.tsx        # Photo gallery with lightbox
    about/page.tsx          # About / founder story
    contact/page.tsx        # Booking enquiry form
  api/inquiries/route.ts    # POST endpoint that writes form submissions to Supabase
lib/
  tours.ts                 # All 5 tour packages — content lives here, in code
  gallery.ts                # Gallery captions
  supabase.ts                # Supabase client (uses the public anon key only)
messages/
  en.json / de.json         # All UI copy (nav, buttons, page text)
supabase/
  schema.sql                # Run this once in your Supabase project
public/images/               # Your 14 photos, already optimized (~6.5MB total)
```

## Editing content

- **Tour packages** (titles, itineraries, prices, images): edit `lib/tours.ts`. Each tour has an `en` and `de` version of every text field side by side, so it's hard to accidentally leave one language behind.
- **Site copy** (headings, button labels, footer, etc.): edit `messages/en.json` and `messages/de.json`. Keep the same keys in both files.
- **Photos**: drop new files into `public/images/` and reference them as `/images/your-file.jpg`. Next.js resizes/optimizes images automatically at request time — but for git repo size, keep source files under ~1MB each (the included photos were compressed with `convert -resize 1920x1920> -strip -quality 82`).

## Setting up Supabase (for the booking form)

The contact form currently returns a friendly "not configured yet" message until you connect a real Supabase project — the rest of the site works fine without it.

1. Create a free project at [supabase.com](https://supabase.com).
2. In your project, open **SQL Editor → New query**, paste the contents of `supabase/schema.sql`, and run it. This creates the `inquiries` table (where booking enquiries land) with row-level security already configured so the public site can only *insert* rows, never read them back.
3. Go to **Project Settings → API**, copy the **Project URL** and **anon public** key.
4. Add them to `.env.local` (and to your hosting provider's environment variables when you deploy):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```
5. To read submitted enquiries, use the Supabase dashboard's **Table Editor → inquiries** (log in with your Supabase account — that's the "authenticated" access the RLS policy allows).

The `supabase/schema.sql` file also includes an optional `tours` table if you ever want to manage tour packages from a database/CMS instead of `lib/tours.ts`. It's not wired up yet — the site reads tours from code for simplicity and speed.

### WhatsApp button

Set `NEXT_PUBLIC_WHATSAPP_NUMBER` in your `.env.local` (international format, digits only, e.g. `94771234567`) to power the "Chat on WhatsApp" button on the contact page.

## Pushing to your own GitHub

This project is already a git repository with an initial commit. To push it to your own GitHub:

```bash
git remote add origin https://github.com/YOUR_USERNAME/krish-lanka-tours.git
git branch -M main
git push -u origin main
```

(Create the empty repo on github.com first, without a README/license, so there's no conflicting initial commit.)

## Deploying

The easiest path for a Next.js site like this is **Vercel** (made by the Next.js team, free tier is generous):

1. Push the repo to GitHub (above).
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Add the same environment variables from `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_WHATSAPP_NUMBER`) in the Vercel project settings.
4. Deploy. Point `krishlankatours.com`'s DNS at Vercel following their custom domain instructions.

## Notes on the design

- Palette: navy (`navy`, `navy-2`) for the header, footer, and one bold CTA band; blue (`blue`, `blue-light`) as the primary accent for buttons, links, and icons; white/light-blue (`paper`, `paper-2`) for section backgrounds. See `tailwind.config.ts` to adjust.
- The "postcard/passport-stamp" motif carries over into the new palette — tour cards and day-by-day itineraries still use the stamp-style circular markers, now in blue instead of gold.
- The homepage hero includes a small search-style widget (destination category, dates, travelers) that links into the filterable tour listing — and a scattered-photo collage echoing the postcard motif.
- All 14 uploaded photos are used across the homepage, tour packages, and gallery — mapped by subject (wildlife → safari tours, ruins/carvings → heritage tour, temple/tea → hill country tour, boats → wetland tour, pool/dance → coastal tour).
- Testimonials on the homepage (`messages/en.json` → `home.testimonials`) are placeholder sample content — swap in real guest reviews when you have them. The star ratings are decorative/uniform (5 stars) until real review scores are wired in.
- The footer newsletter signup posts to `/api/newsletter`, which writes to the `newsletter_subscribers` table in `supabase/schema.sql` (same graceful "not configured yet" behavior as the booking form until Supabase is connected).
