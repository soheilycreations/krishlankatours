-- =========================================================================
-- MIGRATION 5 — SECURITY HARDENING (admin allowlist)
-- Krish Lanka Tours & Travels
--
-- Safe to run on the LIVE database:
--   * No table, column or row is deleted. Only policies are replaced and
--     two helper functions + one small table (admin_users) are added.
--   * Idempotent: running it twice is harmless.
--   * Runs in a single transaction: if anything fails, nothing changes.
--
-- What it does
--   1. admin_users allowlist table + public.is_admin() helper.
--   2. Replaces every "authenticated + true" policy with an admin-only
--      policy (tables AND storage objects in the tour-images bucket).
--      Before this, ANY signed-in Supabase user had full access.
--   3. Adds admin-only DELETE policies for inquiries and
--      custom_trip_requests (enquiry delete in /admin didn't work).
--   4. REMOVES the anon UPDATE policy on newsletter_subscribers.
--   5. Adds public.subscribe_newsletter(email): insert ... on conflict do
--      nothing, so repeat sign-ups succeed without revealing anything.
--   6. Limits the tour-images bucket to images of max 10 MB.
--   Public INSERT on inquiries, custom_trip_requests and
--   newsletter_subscribers, and public READ of published/active content,
--   stay exactly as they are.
--
-- How to run
--   Supabase Dashboard → SQL Editor → New query → paste ALL of this → Run.
--   Then run the verification queries at the bottom.
--
-- BEFORE RUNNING: add every admin email in section 1 (lowercase).
-- An admin who is not in admin_users can still sign in to Supabase but
-- will see "This account doesn't have admin access" in /admin.
-- =========================================================================

begin;

-- -------------------------------------------------------------------------
-- 1. ADMIN ALLOWLIST
-- -------------------------------------------------------------------------
create table if not exists public.admin_users (
  email      text primary key
             check (email = lower(btrim(email)) and position('@' in email) > 1),
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
-- Deliberately NO policies: the table can only be read/changed from the
-- SQL editor (or the service role). The app checks it via is_admin().
revoke all on public.admin_users from anon, authenticated;

insert into public.admin_users (email) values
  ('krishlankatours@gmail.com')
  -- , ('second.admin@example.com')   -- ← add more admins here (lowercase)
on conflict (email) do nothing;

-- -------------------------------------------------------------------------
-- 2. is_admin() — true when the signed-in user's email is on the allowlist
-- -------------------------------------------------------------------------
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

-- -------------------------------------------------------------------------
-- 3. CONTENT TABLES — "authenticated + true" → admin only
--    (public read policies for published/active rows are NOT touched)
-- -------------------------------------------------------------------------

-- tours
drop policy if exists "Only authenticated users can manage tours" on public.tours;
drop policy if exists "Admins can manage tours" on public.tours;
create policy "Admins can manage tours"
  on public.tours for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- destinations
drop policy if exists "Only authenticated users can manage destinations" on public.destinations;
drop policy if exists "Admins can manage destinations" on public.destinations;
create policy "Admins can manage destinations"
  on public.destinations for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- categories
drop policy if exists "Authenticated can manage categories" on public.categories;
drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories"
  on public.categories for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- reviews
drop policy if exists "Authenticated can manage reviews" on public.reviews;
drop policy if exists "Admins can manage reviews" on public.reviews;
create policy "Admins can manage reviews"
  on public.reviews for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- gallery_images
drop policy if exists "Authenticated can manage gallery images" on public.gallery_images;
drop policy if exists "Admins can manage gallery images" on public.gallery_images;
create policy "Admins can manage gallery images"
  on public.gallery_images for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- vehicles
drop policy if exists "Authenticated can manage vehicles" on public.vehicles;
drop policy if exists "Admins can manage vehicles" on public.vehicles;
create policy "Admins can manage vehicles"
  on public.vehicles for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- -------------------------------------------------------------------------
-- 4. SUBMISSIONS — admin read/update/delete; public INSERT unchanged
-- -------------------------------------------------------------------------

-- inquiries ("Public can submit inquiries" INSERT policy is kept)
drop policy if exists "Only authenticated users can read inquiries" on public.inquiries;
drop policy if exists "Only authenticated users can update inquiries" on public.inquiries;
drop policy if exists "Admins can read inquiries" on public.inquiries;
drop policy if exists "Admins can update inquiries" on public.inquiries;
drop policy if exists "Admins can delete inquiries" on public.inquiries;
create policy "Admins can read inquiries"
  on public.inquiries for select to authenticated
  using ((select public.is_admin()));
create policy "Admins can update inquiries"
  on public.inquiries for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can delete inquiries"
  on public.inquiries for delete to authenticated
  using ((select public.is_admin()));

-- custom_trip_requests ("Public can submit custom trip requests" is kept)
drop policy if exists "Authenticated can read custom trip requests" on public.custom_trip_requests;
drop policy if exists "Authenticated can update custom trip requests" on public.custom_trip_requests;
drop policy if exists "Admins can read custom trip requests" on public.custom_trip_requests;
drop policy if exists "Admins can update custom trip requests" on public.custom_trip_requests;
drop policy if exists "Admins can delete custom trip requests" on public.custom_trip_requests;
create policy "Admins can read custom trip requests"
  on public.custom_trip_requests for select to authenticated
  using ((select public.is_admin()));
create policy "Admins can update custom trip requests"
  on public.custom_trip_requests for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can delete custom trip requests"
  on public.custom_trip_requests for delete to authenticated
  using ((select public.is_admin()));

-- newsletter_subscribers ("Public can subscribe" INSERT policy is kept)
drop policy if exists "Public can update their own subscription (upsert)" on public.newsletter_subscribers;
drop policy if exists "Only authenticated users can read subscribers" on public.newsletter_subscribers;
drop policy if exists "Admins can read subscribers" on public.newsletter_subscribers;
drop policy if exists "Admins can delete subscribers" on public.newsletter_subscribers;
create policy "Admins can read subscribers"
  on public.newsletter_subscribers for select to authenticated
  using ((select public.is_admin()));
create policy "Admins can delete subscribers"
  on public.newsletter_subscribers for delete to authenticated
  using ((select public.is_admin()));

-- -------------------------------------------------------------------------
-- 5. NEWSLETTER SIGN-UP FUNCTION
--    New email → saved. Repeat email → silently ignored. The caller gets
--    the same (empty) result either way, so it never reveals whether an
--    address is already subscribed. The anon role still has no SELECT or
--    UPDATE on the table.
-- -------------------------------------------------------------------------
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

-- -------------------------------------------------------------------------
-- 6. STORAGE — tour-images bucket: admin-only writes, images only, ≤ 10 MB
--    ("Public can view tour images" SELECT policy is kept, so every
--    existing image URL keeps working.)
-- -------------------------------------------------------------------------
drop policy if exists "Authenticated users can upload tour images" on storage.objects;
drop policy if exists "Authenticated users can update tour images" on storage.objects;
drop policy if exists "Authenticated users can delete tour images" on storage.objects;
drop policy if exists "Admins can upload tour images" on storage.objects;
drop policy if exists "Admins can update tour images" on storage.objects;
drop policy if exists "Admins can delete tour images" on storage.objects;

create policy "Admins can upload tour images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'tour-images' and (select public.is_admin()));
create policy "Admins can update tour images"
  on storage.objects for update to authenticated
  using (bucket_id = 'tour-images' and (select public.is_admin()))
  with check (bucket_id = 'tour-images' and (select public.is_admin()));
create policy "Admins can delete tour images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'tour-images' and (select public.is_admin()));

-- Applies to NEW uploads only; existing files are not touched.
update storage.buckets
set file_size_limit    = 10485760, -- 10 MB
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
where id = 'tour-images';

commit;

-- Make the new functions visible to the API immediately.
notify pgrst, 'reload schema';

-- =========================================================================
-- VERIFICATION — run these after the migration
-- =========================================================================
-- 1) Admin list:
--      select * from public.admin_users;
--
-- 2) No "authenticated + true" policies left, no anon UPDATE on newsletter:
--      select tablename, policyname, cmd, roles, qual
--      from pg_policies
--      where schemaname in ('public', 'storage')
--      order by 1, 2;
--    Expect: every authenticated policy mentions is_admin(); the only anon
--    policies are the 3 INSERTs and the published/active SELECTs.
--
-- 3) Functions exist:
--      select proname from pg_proc
--      where proname in ('is_admin', 'subscribe_newsletter');
--
-- =========================================================================
-- HOW TO UNDO (only if needed) — restores the previous, open behaviour:
--   For each "Admins can ..." policy above:  drop policy "<name>" on <table>;
--   then re-create the old policies from supabase/schema.sql,
--   migration-2-content.sql and migration-custom-planner.sql.
-- =========================================================================
