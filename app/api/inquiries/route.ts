import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { inquirySchema, firstIssue } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json(
      { error: "The booking form isn't connected yet. Please contact us on WhatsApp." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: firstIssue(parsed.error) }, { status: 400 });
  }
  const d = parsed.data;

  const { error } = await supabase.from("inquiries").insert({
    name: d.name,
    email: d.email,
    phone: d.phone,
    tour_slug: d.tourSlug,
    travel_dates: d.travelDates,
    group_size: d.groupSize,
    hotel_location: d.hotelLocation,
    message: d.message,
    locale: d.locale,
  });

  if (error) {
    console.error("inquiries insert error:", error.message);
    return NextResponse.json(
      { error: "Could not save your enquiry. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
