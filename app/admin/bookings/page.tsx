import { createSupabaseServerClient } from "@/lib/supabase/server";
import BookingsCalendar, {
  parseTextRange,
  type BookingEvent,
} from "@/components/admin/BookingsCalendar";
import { AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return (
      <div className="bg-white rounded-2xl border border-navy/10 p-8 text-center">
        <AlertTriangle className="text-clay mx-auto mb-3" size={28} />
        <p className="font-body text-sm text-ink-text/60">Not connected yet — contact your developer.</p>
      </div>
    );
  }

  const [{ data: trips }, { data: inquiries }] = await Promise.all([
    supabase.from("custom_trip_requests").select("*").order("arrival_date"),
    supabase.from("inquiries").select("*").order("created_at", { ascending: false }),
  ]);

  const events: BookingEvent[] = [
    ...(trips ?? []).map((r): BookingEvent => {
      const locations: { name?: string }[] = Array.isArray(r.locations) ? r.locations : [];
      return {
        id: `trip-${r.id}`,
        kind: "trip",
        name: r.name,
        email: r.email,
        phone: r.phone,
        from: r.arrival_date,
        to: r.departure_date,
        status: r.status,
        detail: locations.map((l, i) => `${i + 1}. ${l.name}`).join(" → "),
        travelers: r.travelers ? `${r.travelers} travelers` : "Travelers not set",
        vehicle: r.vehicle_name,
      };
    }),
    ...(inquiries ?? []).map((q): BookingEvent => {
      const range = parseTextRange(q.travel_dates);
      return {
        id: `enq-${q.id}`,
        kind: "enquiry",
        name: q.name,
        email: q.email,
        phone: q.phone,
        from: range.from,
        to: range.to,
        status: q.status,
        detail: q.tour_slug ? `Tour: ${q.tour_slug}` : q.message?.slice(0, 80) ?? "",
        travelers: q.group_size ? `${q.group_size} guests` : "Group size not set",
        vehicle: null,
      };
    }),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-navy">Bookings Calendar</h1>
        <p className="font-body text-sm text-ink-text/55 mt-1">
          Custom trip requests and tour enquiries on one calendar — click a day to see who&apos;s arriving.
        </p>
      </div>
      <BookingsCalendar events={events} />
    </div>
  );
}
