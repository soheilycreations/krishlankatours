import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json(
      { error: "Supabase isn't configured yet. See .env.example." },
      { status: 503 }
    );
  }

  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert({ email }, { onConflict: "email" });

  if (error) {
    console.error("Newsletter insert error:", error.message);
    return NextResponse.json({ error: "Could not subscribe. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
