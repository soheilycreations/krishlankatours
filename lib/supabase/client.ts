import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/** Browser client for use inside "use client" components (e.g. the admin
 *  login form, image upload widget). Returns null if Supabase isn't
 *  configured yet so callers can show a friendly message instead of
 *  crashing. */
export function createSupabaseBrowserClient() {
  if (!isSupabaseConfigured) return null;
  return createBrowserClient(supabaseUrl as string, supabaseAnonKey as string);
}
