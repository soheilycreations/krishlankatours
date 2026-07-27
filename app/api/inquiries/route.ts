import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request: Request) {
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json(
      {
        error:
          "Supabase isn't configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment (see .env.example) and run supabase/schema.sql in your project.",
      },
      { status: 503 }
    );
  }

  const body = await request.json();
  const { name, email, phone, tourSlug, travelDates, groupSize, message, locale } = body;

  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required." },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("inquiries").insert({
    name,
    email,
    phone: phone || null,
    tour_slug: tourSlug || null,
    travel_dates: travelDates || null,
    group_size: groupSize || null,
    message: message || null,
    locale: locale || "en",
  });

  if (error) {
    console.error("Supabase insert error:", error.message);
    return NextResponse.json(
      { error: "Could not save your enquiry. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
