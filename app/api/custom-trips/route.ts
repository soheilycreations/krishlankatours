import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { customTripSchema, firstIssue } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json(
      { error: "The trip planner isn't connected yet. Please contact us on WhatsApp." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = customTripSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: firstIssue(parsed.error) }, { status: 400 });
  }
  const d = parsed.data;

  // Departure before arrival → treat as a one-day range rather than rejecting.
  const departure =
    d.arrivalDate && d.departureDate && d.departureDate < d.arrivalDate ? d.arrivalDate : d.departureDate;

  const { error } = await supabase.from("custom_trip_requests").insert({
    name: d.name,
    email: d.email,
    phone: d.phone,
    arrival_date: d.arrivalDate, // plain DATE "YYYY-MM-DD", no timezone conversion
    departure_date: departure,
    travelers: d.travelers ?? null,
    locations: d.locations,
    vehicle_id: d.vehicleId ?? null,
    vehicle_name: d.vehicleName,
    hotel_category: d.hotelCategory,
    notes: d.notes,
    locale: d.locale,
  });

  if (error) {
    console.error("custom_trip_requests insert error:", error.message);
    return NextResponse.json(
      { error: "Could not save your trip request. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
