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
-- 2. TOURS  (the admin panel at /admin reads and writes this
--    table. The public site fetches from here; if this table is
--    empty or Supabase isn't configured, the site automatically
--    falls back to the starter content in lib/tours.ts so it
--    never breaks.)
-- =========================================================
create table if not exists tours (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category text not null,
  duration_days int not null default 1,
  price_from_usd numeric,
  group_size text,
  hero_image text,
  gallery text[] default '{}',
  title_en text not null,
  title_de text,
  tagline_en text,
  tagline_de text,
  summary_en text,
  summary_de text,
  highlights jsonb default '[]',
  itinerary jsonb default '[]',
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table tours enable row level security;

create policy "Published tours are publicly readable"
  on tours for select
  to anon
  using (published = true);

-- The admin panel signs in with Supabase Auth (see README), so any
-- authenticated user can manage tours. There's no public sign-up, so in
-- practice this means only the account(s) you create yourself.
create policy "Only authenticated users can manage tours"
  on tours for all
  to authenticated
  using (true)
  with check (true);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists tours_set_updated_at on tours;
create trigger tours_set_updated_at
  before update on tours
  for each row execute function set_updated_at();

-- =========================================================
-- 2b. STORAGE  (photo uploads from the admin panel)
-- =========================================================
insert into storage.buckets (id, name, public)
values ('tour-images', 'tour-images', true)
on conflict (id) do nothing;

create policy "Public can view tour images"
  on storage.objects for select
  to public
  using (bucket_id = 'tour-images');

create policy "Authenticated users can upload tour images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'tour-images');

create policy "Authenticated users can update tour images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'tour-images');

create policy "Authenticated users can delete tour images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'tour-images');

-- =========================================================
-- 2c. DESTINATIONS  (the admin panel manages these too, same
--     pattern as tours — public site falls back to
--     lib/destinations.ts if this table is empty)
-- =========================================================
create table if not exists destinations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_de text,
  region_en text,
  region_de text,
  tagline_en text,
  tagline_de text,
  image text,
  description jsonb default '[]',
  highlights jsonb default '[]',
  best_time_en text,
  best_time_de text,
  related_tour_slug text,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table destinations enable row level security;

create policy "Published destinations are publicly readable"
  on destinations for select
  to anon
  using (published = true);

create policy "Only authenticated users can manage destinations"
  on destinations for all
  to authenticated
  using (true)
  with check (true);

drop trigger if exists destinations_set_updated_at on destinations;
create trigger destinations_set_updated_at
  before update on destinations
  for each row execute function set_updated_at();

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
