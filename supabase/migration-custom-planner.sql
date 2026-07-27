-- =========================================================
-- CUSTOM TRIP PLANNER MIGRATION
-- Run this in the Supabase SQL editor (after schema.sql)
-- =========================================================

-- 1. VEHICLES (managed from /admin/vehicles, picked in the planner)
create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  type text not null default 'car' check (type in ('car', 'van', 'suv', 'minibus', 'coach')),
  seats int not null default 4,
  description text,
  image_url text,
  active boolean not null default true,
  sort_order int not null default 0
);

alter table vehicles enable row level security;

create policy "Public can view active vehicles"
  on vehicles for select
  to anon
  using (active = true);

create policy "Authenticated can manage vehicles"
  on vehicles for all
  to authenticated
  using (true)
  with check (true);

-- 2. CUSTOM TRIP REQUESTS (submitted from /plan)
create table if not exists custom_trip_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  arrival_date date,
  departure_date date,
  travelers int,
  locations jsonb not null default '[]'::jsonb,
  vehicle_id uuid references vehicles(id) on delete set null,
  vehicle_name text,
  hotel_category text,
  notes text,
  locale text default 'en',
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'booked', 'closed'))
);

alter table custom_trip_requests enable row level security;

create policy "Public can submit custom trip requests"
  on custom_trip_requests for insert
  to anon
  with check (true);

create policy "Authenticated can read custom trip requests"
  on custom_trip_requests for select
  to authenticated
  using (true);

create policy "Authenticated can update custom trip requests"
  on custom_trip_requests for update
  to authenticated
  using (true)
  with check (true);

-- 3. Starter vehicles (edit freely in /admin/vehicles)
insert into vehicles (name, type, seats, description, sort_order) values
  ('Toyota Prius / Axio', 'car', 3, 'Comfortable sedan, ideal for couples and solo travellers', 1),
  ('Toyota KDH High-Roof Van', 'van', 8, 'Spacious air-conditioned van, great for families', 2),
  ('Toyota Land Cruiser / SUV', 'suv', 5, 'Premium ride with extra comfort for hill country roads', 3),
  ('Toyota Coaster Mini Coach', 'minibus', 22, 'For bigger groups travelling together', 4)
on conflict do nothing;
