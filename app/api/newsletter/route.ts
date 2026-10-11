import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { newsletterSchema, firstIssue } from "@/lib/validation";

export const dynamic = "force-dynamic";

/**
 * Footer newsletter sign-up.
 *
 * New and repeat sign-ups both return { success: true } — the response
 * never reveals whether an email was already subscribed.
 *
 * Preferred path: the `subscribe_newsletter(email)` database function from
 * supabase/migration-5-hardening.sql (INSERT ... ON CONFLICT DO NOTHING,
 * security definer). If that function doesn't exist yet, fall back to a
 * plain INSERT and treat "already exists" (23505) as success.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: firstIssue(parsed.error) }, { status: 400 });
  }
  const { email } = parsed.data; // trimmed + lowercased by the schema

  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json(
      { error: "The newsletter isn't connected yet." },
      { status: 503 }
    );
  }

  const rpc = await supabase.rpc("subscribe_newsletter", { p_email: email });
  if (!rpc.error) return NextResponse.json({ success: true });

  const functionMissing = rpc.error.code === "PGRST202" || rpc.error.code === "42883";
  if (!functionMissing) {
    console.error("subscribe_newsletter error:", rpc.error.message);
    return NextResponse.json({ error: "Could not subscribe. Please try again." }, { status: 500 });
  }

  const { error } = await supabase.from("newsletter_subscribers").insert({ email });
  if (!error || error.code === "23505") {
    return NextResponse.json({ success: true });
  }

  console.error("newsletter insert error:", error.message);
  return NextResponse.json({ error: "Could not subscribe. Please try again." }, { status: 500 });
}
