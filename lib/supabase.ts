import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Shared, cookie-less client using the public anon key.
 *
 * Used for every PUBLIC read (tours, destinations, categories, reviews,
 * gallery, vehicles) and for the public form submissions. Because it never
 * touches request cookies, pages that use it can be statically generated
 * and cached on Cloudflare — Supabase is only queried when a page is
 * (re)built, not on every visit.
 *
 * Row Level Security limits this key to reading published/active rows and
 * inserting enquiries, trip requests and newsletter sign-ups.
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })
  : null;
