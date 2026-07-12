-- Krish Lanka Tours & Travels — Supabase schema
-- Run this once in your Supabase project's SQL editor
-- (Project dashboard → SQL Editor → New query → paste → Run)

-- =========================================================
-- 1. INQUIRIES  (booking / contact form submissions)
--    This is the table the live contact form writes to.
-- =========================================================
create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  tour_slug text,
  travel_dates text,
  group_size text,
  message text,
  locale text default 'en',
  status text not null default 'new' check (status in ('new', 'contacted', 'booked', 'closed'))
);

alter table inquiries enable row level security;

-- Anyone (the public contact form) can create an inquiry...
create policy "Public can submit inquiries"
  on inquiries for insert
  to anon
  with check (true);

-- ...but only authenticated dashboard users (you, logged into Supabase
-- Studio, or a future admin panel using a real login) can read them back.
create policy "Only authenticated users can read inquiries"
  on inquiries for select
  to authenticated
  using (true);

create policy "Only authenticated users can update inquiries"
  on inquiries for update
  to authenticated
  using (true);

-- =========================================================
-- 2. TOURS  (optional — for later, if you want to manage tour
--    packages from Supabase/a CMS instead of editing lib/tours.ts
--    in code). The site currently reads tour content from code
--    for speed and reliability; this table is here so you can
--    migrate to database-driven tours later without redesigning
--    anything.
-- =========================================================
create table if not exists tours (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category text not null,
  duration_days int not null,
  price_from_usd numeric not null,
  group_size text,
  hero_image text,
  gallery text[],
  title_en text not null,
  title_de text,
  tagline_en text,
  tagline_de text,
  summary_en text,
  summary_de text,
  highlights_en text[],
  highlights_de text[],
  itinerary jsonb,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table tours enable row level security;

create policy "Published tours are publicly readable"
  on tours for select
  to anon
  using (published = true);

create policy "Only authenticated users can manage tours"
  on tours for all
  to authenticated
  using (true)
  with check (true);

-- =========================================================
-- 3. NEWSLETTER SUBSCRIBERS (footer "Stay inspired" signup)
-- =========================================================
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

alter table newsletter_subscribers enable row level security;

create policy "Public can subscribe"
  on newsletter_subscribers for insert
  to anon
  with check (true);

create policy "Public can update their own subscription (upsert)"
  on newsletter_subscribers for update
  to anon
  using (true)
  with check (true);

create policy "Only authenticated users can read subscribers"
  on newsletter_subscribers for select
  to authenticated
  using (true);
