# Deploying krishlankatours.com to Cloudflare

Phase 2A: get the site live on Cloudflare Workers, first on `*.workers.dev`, then on
`krishlankatours.com`. The Supabase project and data stay exactly where they are.

This setup runs on the **Workers FREE plan**: no payment card, no R2 and no Durable Objects.
Pages are cached in **Workers KV** and revalidation timestamps are kept in **D1**.

**Order matters:** Part A (database) → Part B (Cloudflare account) → Part C (deploy to workers.dev)
→ Part D (test) → **stop and confirm** → Part E (domain).

---

## What runs where

| Piece | Where | Notes |
|---|---|---|
| Website + admin + API | Cloudflare Worker `krishlankatours` | Built with `@opennextjs/cloudflare` |
| Page cache (ISR) | KV namespace (binding `NEXT_INC_CACHE_KV`) | Pages are generated once, then served from cache |
| "Refresh after admin edit" timestamps | D1 database `krishlankatours-tag-cache` | Table created automatically on deploy |
| Background (hourly) page refresh | Memory queue, inside the Worker | Uses the `WORKER_SELF_REFERENCE` service binding; nothing to create |
| Database, auth, photo storage | Supabase (unchanged) | |
| Supabase photos | Served via `/media/tour-images/...` | Edge-cached by the Worker for 1 year |

### Free-plan limits that matter here

| Limit (free plan) | This site |
|---|---|
| Worker size: 3 MiB gzipped | ≈ 2.0 MiB gzipped (checked with `wrangler deploy --dry-run`) |
| Workers requests: 100,000/day | Fine for current traffic |
| KV: 100,000 reads/day, **1,000 writes/day** | Each deploy writes ≈ 115 cache entries. Each page refresh (hourly per visited page, or after an admin save) writes 1 entry. Watch *KV → Metrics* in the first days. If writes go over the limit, pages are still served, but new versions may not be saved until the next day |
| D1: 5 million rows read/day, 100,000 rows written/day | Fine |
| CPU time: 10 ms per request | Cached pages are well under this. Watch *Workers → Metrics → CPU time* for admin pages |

---

## Environment variables

| Name | Kind | Value | Required |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | **Build variable** | Supabase → Project Settings → API → Project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Build variable** | Supabase → Project Settings → API → `anon` `public` key | Yes |
| `NEXT_PUBLIC_SITE_URL` | **Build variable** | `https://krishlankatours.com` | Recommended (this is also the default) |

KV and D1 are connected through `wrangler.jsonc` and need no variables:
KV `NEXT_INC_CACHE_KV` = `cc88fe3844d14de29dc05275653cd0a1`, D1 `NEXT_TAG_CACHE_D1` = `d2018d6b-fd26-4ca1-b8a3-894aebf965e4`.
| `ADMIN_EMAILS` | **Secret** (runtime) | `krishlankatours@gmail.com,second@example.com` | Only needed if you deploy *before* running migration 5 |

`NEXT_PUBLIC_*` values are baked into the code when it is **built**, so they must exist at build
time (in `.env.production.local` for a deploy from your computer, or as **build variables** in
Workers Builds). Adding them only as runtime secrets does nothing. The anon key is designed to be
public, so it's fine to keep it in a build variable.

Phase 2B will add the secrets `RESEND_API_KEY` and `TURNSTILE_SECRET_KEY`.

---

## Part A — Supabase (do this first)

1. Open `supabase/migration-5-hardening.sql`. In section 1, add every admin email in **lowercase**
   (one is already there: `krishlankatours@gmail.com`).
2. Supabase Dashboard → **SQL Editor** → New query → paste the **whole** file → **Run**.
   It runs as one transaction and is safe to run twice.
3. Run the verification queries at the bottom of the file. Expect:
   - your admin emails in `admin_users`
   - every `authenticated` policy mentions `is_admin()`
   - no anon `UPDATE` policy on `newsletter_subscribers`
4. Make sure every admin email from step 1 has a user under **Authentication → Users**. Sign-ups
   are already off.

> The old Vercel deployment is suspended, so nothing else is using these policies.

---

## Part B — New Cloudflare account (one time)

Run these on your own computer (Node.js 20 or newer).

```bash
git clone https://github.com/soheilycreations/krishlankatours.git
cd krishlankatours
git checkout claude/funny-pascal-pglqsj      # or main, once this is merged
npm ci
```

1. **Log in to Cloudflare**
   ```bash
   npx wrangler login          # opens the browser — choose the NEW account
   npx wrangler whoami         # confirm the right account is shown
   ```
2. **Plan**: the free Workers plan is enough. No card, R2 or Durable Objects needed.
3. **KV namespace (page cache)**: already created. Its ID `cc88fe3844d14de29dc05275653cd0a1` is in
   `wrangler.jsonc` under `kv_namespaces` (binding `NEXT_INC_CACHE_KV`). If you ever need to
   recreate it:
   ```bash
   npx wrangler kv namespace create NEXT_INC_CACHE_KV
   ```
   and put the new ID in `wrangler.jsonc`.
4. **D1 database (revalidation timestamps)**: already created. Its ID
   `d2018d6b-fd26-4ca1-b8a3-894aebf965e4` is in `wrangler.jsonc` (binding `NEXT_TAG_CACHE_D1`,
   name `krishlankatours-tag-cache`). To recreate:
   ```bash
   npx wrangler d1 create krishlankatours-tag-cache
   ```
   The `revalidations` table is created automatically by `npm run deploy`.

---

## Part C — Deploy to workers.dev

1. **Build variables**: create `.env.production.local` in the project folder. It's git-ignored.
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://<your-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key>
   NEXT_PUBLIC_SITE_URL=https://krishlankatours.com
   ```
   (Use `.env.example` as a template.)
2. **Optional secret.** Only needed if migration 5 isn't run yet:
   ```bash
   npx wrangler secret put ADMIN_EMAILS
   # paste: krishlankatours@gmail.com,second@example.com
   ```
   You can only add secrets after the first deploy, because the Worker must exist. Run this after
   step 4 if you need it.
3. **Optional local test on the Cloudflare runtime** (http://localhost:8787):
   ```bash
   npm run preview
   ```
4. **Deploy**
   ```bash
   npm run deploy
   ```
   This builds the site, uploads the Worker and static files, creates the D1 table and fills the
   KV page cache (≈ 115 KV writes). The first time, Wrangler may ask you to choose a
   `workers.dev` subdomain.

   The output ends with the live URL, e.g.
   `https://krishlankatours.<your-subdomain>.workers.dev`.

**Every later deploy** is just `npm run deploy`. It always rebuilds from the current database
content.

### Alternative: deploy from GitHub (Workers Builds)

Dashboard → *Workers & Pages* → **Create** → *Import a repository* → pick
`soheilycreations/krishlankatours` and the branch, then set:

- Build command: `npx opennextjs-cloudflare build`
- Deploy command: `npx opennextjs-cloudflare deploy`
- **Build variables** (Settings → Build → Variables): the three `NEXT_PUBLIC_*` values above.

The KV namespace and D1 database from Part B are still required; their IDs are already in `wrangler.jsonc`.

---

## Part D — Test checklist (on the workers.dev URL)

Public site
- [ ] `/` (English) and `/de` (German) load with photos, tours, destinations, reviews and gallery
- [ ] `/en/tours` redirects to `/tours`
- [ ] `/tours` shows all tours; the **Village Tours** chip and `/tours?category=village` show only village tours
- [ ] Open a tour in EN and DE; "Enquire" opens `/contact?tour=<slug>` with that tour preselected
- [ ] `/destinations`, a destination page, `/blog`, a blog post, `/faq`, `/vehicles`,
      `/airport-transfer`, `/taxi-service`, `/surfing`, `/gallery`, `/about` all load in both languages
- [ ] An unknown URL (e.g. `/tours/nope`) shows the 404 page

Forms
- [ ] Enquiry form → success message → appears in `/admin/enquiries`
- [ ] Trip planner: pick places, dates (e.g. 24–31 Dec), vehicle and hotel → success → the
      **same dates** show in `/admin/trip-requests` and `/admin/bookings`
- [ ] Newsletter (footer) with a **new** email → "Subscribed"
- [ ] Newsletter with the **same** email again → also "Subscribed" (no error)
- [ ] Newsletter with `abc` → browser or form error, nothing saved

Admin
- [ ] `/admin` redirects to `/admin/login`; signing in with an allowlisted email opens the dashboard
- [ ] Edit a tour (e.g. change the German title) → Save → the public EN/DE tour page shows the
      change on the next load
- [ ] Edit the village tour → the category is still "Village Tours" after saving
- [ ] In a tour form: add 3 highlights, delete the **first** one → the other two remain
- [ ] New tour titled `Test Schildkröten Straße` → web address `test-schildkroeten-strasse`;
      a second tour with the same title → friendly "already exists" message. Then delete both.
- [ ] Upload a phone photo → it uploads as `.webp` and the image shows on the site via `/media/...`
- [ ] Delete a test enquiry → it stays deleted after reload
- [ ] Sign out

SEO
- [ ] `/sitemap.xml` lists `https://krishlankatours.com/...` URLs (no `/en/`), including blog,
      FAQ, vehicles and service pages, with hreflang alternates
- [ ] `/robots.txt` points to `https://krishlankatours.com/sitemap.xml`
- [ ] Page source of a tour shows `<link rel="canonical" href="https://krishlankatours.com/...">`
      and `hreflang` links for en, de and x-default

> The canonical URLs point at krishlankatours.com even on workers.dev. That's intended, so
> Google never indexes the workers.dev address.

**⏸ Stop here and confirm before Part E.**

---

## Part E — Connect krishlankatours.com (after confirmation)

### E1. Add the domain to Cloudflare

1. Dashboard → **Add a domain** → `krishlankatours.com` → **Free** plan (enough for this site).
2. Cloudflare scans the existing DNS records. Before continuing:
   - **Keep** email records (`MX`, SPF `TXT`, DKIM, DMARC) and verification `TXT` records
     (e.g. `google-site-verification`).
   - **Delete** the old website records that point to Vercel: an `A` record `76.76.21.21` and/or
     a `CNAME` to `cname.vercel-dns.com`, for both `@` and `www`.
   - If the domain currently uses Vercel's nameservers (`ns1.vercel-dns.com`), copy any other
     records you still need from the Vercel dashboard. Vercel's DNS stops answering once the
     nameservers change.
3. Cloudflare shows **two nameservers** (e.g. `xxx.ns.cloudflare.com`).

### E2. Change nameservers at the registrar

1. Log in to the registrar where krishlankatours.com was bought.
2. Replace the current nameservers with the **two Cloudflare nameservers**. Remove all others.
3. If DNSSEC is on at the registrar, turn it **off** first; you can re-enable it in Cloudflare later.
4. Wait until Cloudflare shows the domain as **Active** (usually minutes, up to 24 hours).

### E3. Point the domain at the Worker

1. Dashboard → *Workers & Pages* → **krishlankatours** → *Settings* → *Domains & Routes* →
   **Add** → *Custom domain* → `krishlankatours.com`. Cloudflare creates the DNS record and the
   certificate automatically.
2. **www → root (301)**:
   - DNS → **Add record**: type `AAAA`, name `www`, content `100::`, **Proxied** (orange cloud).
   - *Rules* → **Redirect Rules** → *Create rule* → template **"Redirect from WWW to root"**,
     or a custom rule:
     - When: Hostname equals `www.krishlankatours.com`
     - Then: Dynamic redirect to `concat("https://krishlankatours.com", http.request.uri.path)`,
       status **301**, **preserve query string** ✔
   - The Worker also redirects `www` → root as a safety net.
3. *SSL/TLS* → *Edge Certificates* → **Always Use HTTPS**: On.

### E4. After the domain is live

- Run Part D again on `https://krishlankatours.com`.
- Check `https://www.krishlankatours.com/tours?x=1` → 301 → `https://krishlankatours.com/tours?x=1`.
- Upload a photo in admin, open it on the site twice: the second response for `/media/...` should
  show `cf-cache-status: HIT` (or be served from the browser cache). The edge cache only works on
  the custom domain, not on workers.dev.
- Google Search Console: submit `https://krishlankatours.com/sitemap.xml` (DNS re-verification is
  part of Phase 2B).
- Remove the domain from the suspended Vercel project if Vercel still lists it.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Site shows only the 13 built-in tours | `NEXT_PUBLIC_SUPABASE_*` weren't set at **build** time. Fix `.env.production.local` or the build variables, then deploy again |
| Admin says "This account doesn't have admin access" | Add the email (lowercase) to `public.admin_users` in the SQL editor |
| Enquiry delete says "migration 5 hasn't been run" | Run `supabase/migration-5-hardening.sql` |
| Admin edits don't appear on the site | Check the D1 `database_id` and KV `id` in `wrangler.jsonc`, then redeploy. Also check *KV → Metrics*: once the 1,000 writes/day limit is reached, new page versions can't be saved until the next day |
| Deploy fails with "No KV binding NEXT_INC_CACHE_KV found" | The `kv_namespaces` entry in `wrangler.jsonc` is missing or has the wrong ID |
| Error about worker size (over 3 MiB) | Run `npx wrangler deploy --dry-run --outdir /tmp/cf-out` and send me the "Total Upload … gzip" line |
| Logs | Dashboard → Workers → krishlankatours → *Logs* (observability is on), or `npx wrangler tail` |
