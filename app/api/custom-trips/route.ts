import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request: Request) {
  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json(
      { error: "Supabase isn't configured yet. Run supabase/migration-custom-planner.sql and set env vars." },
      { status: 503 }
    );
  }

  const body = await request.json();
  const {
    name, email, phone, arrivalDate, departureDate,
    travelers, locations, vehicleId, vehicleName, hotelCategory, notes, locale,
  } = body;

  if (!name || !email || !Array.isArray(locations) || locations.length === 0) {
    return NextResponse.json(
      { error: "Name, email and at least one location are required." },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("custom_trip_requests").insert({
    name,
    email,
    phone: phone || null,
    arrival_date: arrivalDate || null,
    departure_date: departureDate || null,
    travelers: travelers ? Number(travelers) : null,
    locations,
    vehicle_id: vehicleId && !vehicleId.startsWith("fallback") ? vehicleId : null,
    vehicle_name: vehicleName || null,
    hotel_category: hotelCategory || null,
    notes: notes || null,
    locale: locale || "en",
  });

  if (error) {
    console.error("Supabase insert error:", error.message);
    return NextResponse.json(
      { error: "Could not save your trip request. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
