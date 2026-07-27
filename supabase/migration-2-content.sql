-- =========================================================================
-- MIGRATION 2 — CATEGORIES, REVIEWS, GALLERY
-- Run in Supabase SQL Editor (safe to run on the existing database)
-- =========================================================================

-- 1. TOUR CATEGORIES (homepage circles + tours filter, managed in /admin/categories)
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  slug text not null unique,
  name_en text not null,
  name_de text,
  image_url text,
  sort_order int not null default 0,
  active boolean not null default true
);

alter table categories enable row level security;
create policy "Public can view active categories" on categories for select to anon using (active = true);
create policy "Authenticated can manage categories" on categories for all to authenticated using (true) with check (true);

insert into categories (slug, name_en, name_de, image_url, sort_order) values
  ('wildlife',    'Wildlife',      'Tierwelt',        '/images/elephants-trio.jpg',      1),
  ('heritage',    'Heritage',      'Kulturerbe',      '/images/buddha-carving.jpg',      2),
  ('hillcountry', 'Hill Country',  'Hochland',        '/images/golden-temple-hills.jpg', 3),
  ('wetland',     'Wetland',       'Feuchtgebiet',    '/images/river-boat-safari.jpg',   4),
  ('coastal',     'Coast & Rest',  'Küste & Erholung','/images/couple-pool-sunset.jpg',  5),
  ('village',     'Village Tours', 'Dorftouren',      '/images/stock3/rice-paddy-aerial.jpg', 6)
on conflict (slug) do nothing;

-- 2. GUEST REVIEWS (site testimonials, managed in /admin/reviews)
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  author text not null,
  country text,
  rating int not null default 5 check (rating between 1 and 5),
  text_en text not null,
  text_de text,
  source text not null default 'google',
  review_date date,
  active boolean not null default true,
  sort_order int not null default 0
);

alter table reviews enable row level security;
create policy "Public can view active reviews" on reviews for select to anon using (active = true);
create policy "Authenticated can manage reviews" on reviews for all to authenticated using (true) with check (true);

-- 3. GALLERY IMAGES (managed in /admin/gallery)
create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  image_url text not null,
  caption_en text,
  caption_de text,
  tall boolean not null default false,
  sort_order int not null default 0,
  active boolean not null default true
);

alter table gallery_images enable row level security;
create policy "Public can view active gallery images" on gallery_images for select to anon using (active = true);
create policy "Authenticated can manage gallery images" on gallery_images for all to authenticated using (true) with check (true);

-- seed with the current site gallery so nothing disappears
insert into gallery_images (image_url, caption_en, caption_de, tall, sort_order) values
  ('/images/golden-temple-hills.jpg', 'A mountain temple above the clouds', 'Ein Bergtempel über den Wolken', true, 1),
  ('/images/elephants-trio.jpg', 'Young elephants at play', 'Junge Elefanten beim Spielen', false, 2),
  ('/images/monk-meditation-cliff.jpg', 'A quiet morning above the sea', 'Ein ruhiger Morgen über dem Meer', true, 3),
  ('/images/kandyan-dance.jpg', 'Traditional Kandyan dance', 'Traditioneller Kandy-Tanz', false, 4),
  ('/images/polonnaruwa-ruins.jpg', 'The old royal palace at Polonnaruwa', 'Der alte Königspalast von Polonnaruwa', false, 5),
  ('/images/river-boat-safari.jpg', 'Drifting down the Madu River', 'Auf dem Madu-Fluss unterwegs', false, 6),
  ('/images/stock2/sigiriya-sunset.jpg', 'Sigiriya rock at sunset', 'Der Sigiriya-Felsen bei Sonnenuntergang', true, 7),
  ('/images/stock2/galle-fort-rampart.jpg', 'Evening walk on Galle Fort', 'Abendspaziergang im Galle Fort', false, 8)
on conflict do nothing;
