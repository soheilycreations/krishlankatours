-- =========================================================================
-- KRISH LANKA TOURS & TRAVELS — COMPLETE DATABASE SETUP (fresh project)
-- =========================================================================
-- Brings a NEW, empty Supabase project to the same state as the live
-- database after supabase/migration-5-hardening.sql. It is the sum of:
--   schema.sql + migration-2-content.sql + migration-3-hotel-location.sql
--   + migration-4-destination-gallery.sql + migration-custom-planner.sql
--   + migration-5-hardening.sql
--
-- ⚠ Do NOT run this on the live database — use the individual migration
--   files there. (It is idempotent, but it's meant for a fresh project.)
--
-- Run: Supabase Dashboard → SQL Editor → New query → paste ALL → Run.
--
-- Afterwards:
--   1. Add admin emails in section 1 below (before running), then
--      Authentication → Users → Add user for each of them.
--   2. Authentication → Sign In / Providers → turn OFF "Allow new users
--      to sign up".
--   3. Optional starter content (run once each, in this order):
--        seed.sql                    (12 tours + 6 destinations)
--        seed-5-tours.sql, seed-5-destinations.sql,
--        seed-pinnawala-sinharaja.sql, seed-village-tour.sql,
--        seed-ayurveda-tour.sql, seed-reviews.sql
--   4. Cloudflare build variables: NEXT_PUBLIC_SUPABASE_URL and
--      NEXT_PUBLIC_SUPABASE_ANON_KEY (see CLOUDFLARE-DEPLOY.md).
-- =========================================================================

begin;

-- =========================================================================
-- 0. SHARED HELPERS
-- =========================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================================
-- 1. ADMIN ALLOWLIST + is_admin()
-- =========================================================================
create table if not exists public.admin_users (
  email      text primary key
             check (email = lower(btrim(email)) and position('@' in email) > 1),
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;

insert into public.admin_users (email) values
  ('krishlankatours@gmail.com')
  -- , ('second.admin@example.com')   -- ← add more admins here (lowercase)
on conflict (email) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users a
    where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- =========================================================================
-- 2. INQUIRIES (contact / booking form)
-- =========================================================================
create table if not exists public.inquiries (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  name           text not null,
  email          text not null,
  phone          text,
  tour_slug      text,
  travel_dates   text,
  group_size     text,
  hotel_location text,
  message        text,
  locale         text default 'en',
  status         text not null default 'new'
                 check (status in ('new', 'contacted', 'booked', 'closed'))
);
alter table public.inquiries add column if not exists hotel_location text;
alter table public.inquiries enable row level security;

drop policy if exists "Public can submit inquiries" on public.inquiries;
create policy "Public can submit inquiries"
  on public.inquiries for insert to anon with check (true);

drop policy if exists "Admins can read inquiries" on public.inquiries;
create policy "Admins can read inquiries"
  on public.inquiries for select to authenticated using ((select public.is_admin()));

drop policy if exists "Admins can update inquiries" on public.inquiries;
create policy "Admins can update inquiries"
  on public.inquiries for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "Admins can delete inquiries" on public.inquiries;
create policy "Admins can delete inquiries"
  on public.inquiries for delete to authenticated using ((select public.is_admin()));

-- =========================================================================
-- 3. TOURS
-- =========================================================================
create table if not exists public.tours (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  category       text not null,
  duration_days  int not null default 1,
  price_from_usd numeric,
  group_size     text,
  hero_image     text,
  gallery        text[] default '{}',
  title_en       text not null,
  title_de       text,
  tagline_en     text,
  tagline_de     text,
  summary_en     text,
  summary_de     text,
  highlights     jsonb default '[]',
  itinerary      jsonb default '[]',
  published      boolean not null default true,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
alter table public.tours enable row level security;

drop policy if exists "Published tours are publicly readable" on public.tours;
create policy "Published tours are publicly readable"
  on public.tours for select to anon using (published = true);

drop policy if exists "Admins can manage tours" on public.tours;
create policy "Admins can manage tours"
  on public.tours for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

drop trigger if exists tours_set_updated_at on public.tours;
create trigger tours_set_updated_at
  before update on public.tours
  for each row execute function public.set_updated_at();

-- =========================================================================
-- 4. DESTINATIONS
-- =========================================================================
create table if not exists public.destinations (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  name_en           text not null,
  name_de           text,
  region_en         text,
  region_de         text,
  tagline_en        text,
  tagline_de        text,
  image             text,
  gallery           text[] default '{}',
  description       jsonb default '[]',
  highlights        jsonb default '[]',
  best_time_en      text,
  best_time_de      text,
  related_tour_slug text,
  published         boolean not null default true,
  sort_order        int not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
alter table public.destinations add column if not exists gallery text[] default '{}';
alter table public.destinations enable row level security;

drop policy if exists "Published destinations are publicly readable" on public.destinations;
create policy "Published destinations are publicly readable"
  on public.destinations for select to anon using (published = true);

drop policy if exists "Admins can manage destinations" on public.destinations;
create policy "Admins can manage destinations"
  on public.destinations for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

drop trigger if exists destinations_set_updated_at on public.destinations;
create trigger destinations_set_updated_at
  before update on public.destinations
  for each row execute function public.set_updated_at();

-- =========================================================================
-- 5. NEWSLETTER SUBSCRIBERS + subscribe_newsletter()
-- =========================================================================
create table if not exists public.newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  created_at timestamptz not null default now()
);
alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Public can subscribe" on public.newsletter_subscribers;
create policy "Public can subscribe"
  on public.newsletter_subscribers for insert to anon with check (true);

drop policy if exists "Admins can read subscribers" on public.newsletter_subscribers;
create policy "Admins can read subscribers"
  on public.newsletter_subscribers for select to authenticated using ((select public.is_admin()));

drop policy if exists "Admins can delete subscribers" on public.newsletter_subscribers;
create policy "Admins can delete subscribers"
  on public.newsletter_subscribers for delete to authenticated using ((select public.is_admin()));

create or replace function public.subscribe_newsletter(p_email text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(btrim(coalesce(p_email, '')));
begin
  if length(v_email) < 3 or length(v_email) > 254
     or v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'invalid email' using errcode = '22023';
  end if;
  insert into public.newsletter_subscribers (email)
  values (v_email)
  on conflict (email) do nothing;
end;
$$;
revoke all on function public.subscribe_newsletter(text) from public;
grant execute on function public.subscribe_newsletter(text) to anon, authenticated;

-- =========================================================================
-- 6. CATEGORIES (homepage circles + tours filter)
-- =========================================================================
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  slug       text not null unique,
  name_en    text not null,
  name_de    text,
  image_url  text,
  sort_order int not null default 0,
  active     boolean not null default true
);
alter table public.categories enable row level security;

drop policy if exists "Public can view active categories" on public.categories;
create policy "Public can view active categories"
  on public.categories for select to anon using (active = true);

drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories"
  on public.categories for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

insert into public.categories (slug, name_en, name_de, image_url, sort_order) values
  ('wildlife',    'Wildlife',      'Tierwelt',         '/images/elephants-trio.jpg',           1),
  ('heritage',    'Heritage',      'Kulturerbe',       '/images/buddha-carving.jpg',           2),
  ('hillcountry', 'Hill Country',  'Hochland',         '/images/golden-temple-hills.jpg',      3),
  ('wetland',     'Wetland',       'Feuchtgebiet',     '/images/river-boat-safari.jpg',        4),
  ('coastal',     'Coast & Rest',  'Küste & Erholung', '/images/couple-pool-sunset.jpg',       5),
  ('village',     'Village Tours', 'Dorftouren',       '/images/stock3/rice-paddy-aerial.jpg', 6)
on conflict (slug) do nothing;

-- =========================================================================
-- 7. REVIEWS
-- =========================================================================
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  author      text not null,
  country     text,
  rating      int not null default 5 check (rating between 1 and 5),
  text_en     text not null,
  text_de     text,
  source      text not null default 'google',
  review_date date,
  active      boolean not null default true,
  sort_order  int not null default 0
);
alter table public.reviews enable row level security;

drop policy if exists "Public can view active reviews" on public.reviews;
create policy "Public can view active reviews"
  on public.reviews for select to anon using (active = true);

drop policy if exists "Admins can manage reviews" on public.reviews;
create policy "Admins can manage reviews"
  on public.reviews for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- =========================================================================
-- 8. GALLERY IMAGES
-- =========================================================================
create table if not exists public.gallery_images (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  image_url  text not null,
  caption_en text,
  caption_de text,
  tall       boolean not null default false,
  sort_order int not null default 0,
  active     boolean not null default true
);
alter table public.gallery_images enable row level security;

drop policy if exists "Public can view active gallery images" on public.gallery_images;
create policy "Public can view active gallery images"
  on public.gallery_images for select to anon using (active = true);

drop policy if exists "Admins can manage gallery images" on public.gallery_images;
create policy "Admins can manage gallery images"
  on public.gallery_images for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

insert into public.gallery_images (image_url, caption_en, caption_de, tall, sort_order)
select v.* from (values
  ('/images/golden-temple-hills.jpg', 'A mountain temple above the clouds', 'Ein Bergtempel über den Wolken', true, 1),
  ('/images/elephants-trio.jpg', 'Young elephants at play', 'Junge Elefanten beim Spielen', false, 2),
  ('/images/monk-meditation-cliff.jpg', 'A quiet morning above the sea', 'Ein ruhiger Morgen über dem Meer', true, 3),
  ('/images/kandyan-dance.jpg', 'Traditional Kandyan dance', 'Traditioneller Kandy-Tanz', false, 4),
  ('/images/polonnaruwa-ruins.jpg', 'The old royal palace at Polonnaruwa', 'Der alte Königspalast von Polonnaruwa', false, 5),
  ('/images/river-boat-safari.jpg', 'Drifting down the Madu River', 'Auf dem Madu-Fluss unterwegs', false, 6),
  ('/images/stock2/sigiriya-sunset.jpg', 'Sigiriya rock at sunset', 'Der Sigiriya-Felsen bei Sonnenuntergang', true, 7),
  ('/images/stock2/galle-fort-rampart.jpg', 'Evening walk on Galle Fort', 'Abendspaziergang im Galle Fort', false, 8)
) as v(image_url, caption_en, caption_de, tall, sort_order)
where not exists (select 1 from public.gallery_images);

-- =========================================================================
-- 9. VEHICLES + CUSTOM TRIP REQUESTS (trip planner)
-- =========================================================================
create table if not exists public.vehicles (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  type        text not null default 'car' check (type in ('car', 'van', 'suv', 'minibus', 'coach')),
  seats       int not null default 4,
  description text,
  image_url   text,
  active      boolean not null default true,
  sort_order  int not null default 0
);
alter table public.vehicles enable row level security;

drop policy if exists "Public can view active vehicles" on public.vehicles;
create policy "Public can view active vehicles"
  on public.vehicles for select to anon using (active = true);

drop policy if exists "Admins can manage vehicles" on public.vehicles;
create policy "Admins can manage vehicles"
  on public.vehicles for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

insert into public.vehicles (name, type, seats, description, sort_order)
select v.* from (values
  ('Toyota Prius / Axio', 'car', 3, 'Comfortable sedan, ideal for couples and solo travellers', 1),
  ('Toyota KDH High-Roof Van', 'van', 8, 'Spacious air-conditioned van, great for families', 2),
  ('Toyota Land Cruiser / SUV', 'suv', 5, 'Premium ride with extra comfort for hill country roads', 3),
  ('Toyota Coaster Mini Coach', 'minibus', 22, 'For bigger groups travelling together', 4)
) as v(name, type, seats, description, sort_order)
where not exists (select 1 from public.vehicles);

create table if not exists public.custom_trip_requests (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  name           text not null,
  email          text not null,
  phone          text,
  arrival_date   date,
  departure_date date,
  travelers      int,
  locations      jsonb not null default '[]'::jsonb,
  vehicle_id     uuid references public.vehicles(id) on delete set null,
  vehicle_name   text,
  hotel_category text,
  notes          text,
  locale         text default 'en',
  status         text not null default 'new'
                 check (status in ('new', 'contacted', 'quoted', 'booked', 'closed'))
);
alter table public.custom_trip_requests enable row level security;

drop policy if exists "Public can submit custom trip requests" on public.custom_trip_requests;
create policy "Public can submit custom trip requests"
  on public.custom_trip_requests for insert to anon with check (true);

drop policy if exists "Admins can read custom trip requests" on public.custom_trip_requests;
create policy "Admins can read custom trip requests"
  on public.custom_trip_requests for select to authenticated using ((select public.is_admin()));

drop policy if exists "Admins can update custom trip requests" on public.custom_trip_requests;
create policy "Admins can update custom trip requests"
  on public.custom_trip_requests for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "Admins can delete custom trip requests" on public.custom_trip_requests;
create policy "Admins can delete custom trip requests"
  on public.custom_trip_requests for delete to authenticated using ((select public.is_admin()));

-- =========================================================================
-- 10. STORAGE — tour-images bucket (public read, admin write, images ≤ 10 MB)
-- =========================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'tour-images', 'tour-images', true, 10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do update
  set public             = true,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view tour images" on storage.objects;
create policy "Public can view tour images"
  on storage.objects for select to public using (bucket_id = 'tour-images');

drop policy if exists "Admins can upload tour images" on storage.objects;
create policy "Admins can upload tour images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'tour-images' and (select public.is_admin()));

drop policy if exists "Admins can update tour images" on storage.objects;
create policy "Admins can update tour images"
  on storage.objects for update to authenticated
  using (bucket_id = 'tour-images' and (select public.is_admin()))
  with check (bucket_id = 'tour-images' and (select public.is_admin()));

drop policy if exists "Admins can delete tour images" on storage.objects;
create policy "Admins can delete tour images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'tour-images' and (select public.is_admin()));

commit;

notify pgrst, 'reload schema';
