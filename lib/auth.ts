import { redirect } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Admin access control.
 *
 * Source of truth: the `public.is_admin()` database function created by
 * supabase/migration-5-hardening.sql (backed by the `admin_users` table).
 * Row Level Security uses the same function, so the app and the database
 * always agree on who is an admin.
 *
 * Until migration 5 has been run, `is_admin()` doesn't exist yet; in that
 * case only, we fall back to the ADMIN_EMAILS environment variable
 * (comma-separated) so the panel keeps working during the switch-over.
 */

const DEFAULT_ADMIN_EMAILS = ["krishlankatours@gmail.com"];

function fallbackAllowlist(): string[] {
  const raw = process.env.ADMIN_EMAILS;
  const list = raw
    ? raw
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)
    : DEFAULT_ADMIN_EMAILS;
  return list;
}

export async function isAdminUser(supabase: SupabaseClient, user: User): Promise<boolean> {
  const { data, error } = await supabase.rpc("is_admin");
  if (!error) return data === true;
  // PGRST202 = function not found (migration 5 not run yet).
  if (error.code === "PGRST202" || error.code === "42883") {
    return !!user.email && fallbackAllowlist().includes(user.email.toLowerCase());
  }
  console.error("is_admin() check failed:", error.message);
  return false;
}

export type AdminSession = { supabase: SupabaseClient; user: User };

type SessionCheck =
  | { status: "admin"; supabase: SupabaseClient; user: User }
  | { status: "denied"; supabase: SupabaseClient; user: User }
  | { status: "signed-out" };

/** Who is making this request? */
export async function checkAdminSession(): Promise<SessionCheck> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { status: "signed-out" };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "signed-out" };
  if (!(await isAdminUser(supabase, user))) return { status: "denied", supabase, user };
  return { status: "admin", supabase, user };
}

/** Returns the signed-in admin, or null (not configured / not signed in / not an admin). */
export async function getAdminSession(): Promise<AdminSession | null> {
  const check = await checkAdminSession();
  return check.status === "admin" ? { supabase: check.supabase, user: check.user } : null;
}

/** For admin pages and form actions: redirects unless the request comes
 *  from a signed-in admin. Signed-in non-admins go to the login page with
 *  ?denied=1 (the middleware lets that through, so there's no loop). */
export async function requireAdmin(): Promise<AdminSession> {
  const check = await checkAdminSession();
  if (check.status === "signed-out") redirect("/admin/login");
  if (check.status === "denied") redirect("/admin/login?denied=1");
  return { supabase: check.supabase, user: check.user };
}
