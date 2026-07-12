import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Single shared client using the public anon key. Row Level Security policies
// (see supabase/schema.sql) restrict this key to INSERT-only on the
// `inquiries` table, so it's safe to use from the browser and from this
// route handler alike — no service role key is needed for this feature.
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;
