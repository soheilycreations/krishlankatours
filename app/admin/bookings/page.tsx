import { createSupabaseServerClient } from "@/lib/supabase/server";
import BookingsCalendar, {
  parseTextRange,
  type BookingEvent,
} from "@/components/admin/BookingsCalendar";
import { AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

function safeStr(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v);
}

function safeDate(v: unknown): string | null {
  if (typeof v !== "string" || v.trim() === "") return null;
  return v;
}

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

  let events: BookingEvent[] = [];
  let loadError: string | null = null;

  try {
    const [tripsRes, inquiriesRes] = await Promise.all([
      supabase.from("custom_trip_requests").select("*").order("arrival_date"),
      supabase.from("inquiries").select("*").order("created_at", { ascending: false }),
    ]);

    const trips = Array.isArray(tripsRes.data) ? tripsRes.data : [];
    const inquiries = Array.isArray(inquiriesRes.data) ? inquiriesRes.data : [];

    const tripEvents: BookingEvent[] = trips.map((r: Record<string, unknown>) => {
      const rawLocations = r.locations;
      const locations: { name?: string }[] = Array.isArray(rawLocations)
        ? rawLocations.filter((l): l is { name?: string } => typeof l === "object" && l !== null)
        : [];
      return {
        id: `trip-${safeStr(r.id)}`,
        kind: "trip",
        name: safeStr(r.name) || "—",
        email: safeStr(r.email),
        phone: r.phone ? safeStr(r.phone) : null,
        from: safeDate(r.arrival_date),
        to: safeDate(r.departure_date),
        status: safeStr(r.status) || "new",
        detail: locations.map((l, i) => `${i + 1}. ${safeStr(l?.name)}`).join(" → "),
        travelers: r.travelers ? `${safeStr(r.travelers)} travelers` : "Travelers not set",
        vehicle: r.vehicle_name ? safeStr(r.vehicle_name) : null,
      };
    });

    const inquiryEvents: BookingEvent[] = inquiries.map((q: Record<string, unknown>) => {
      let range: { from: string | null; to: string | null } = { from: null, to: null };
      try {
        range = parseTextRange(typeof q.travel_dates === "string" ? q.travel_dates : null);
      } catch {
        // malformed free-text date — treat as undated rather than crashing
      }
      return {
        id: `enq-${safeStr(q.id)}`,
        kind: "enquiry",
        name: safeStr(q.name) || "—",
        email: safeStr(q.email),
        phone: q.phone ? safeStr(q.phone) : null,
        from: range.from,
        to: range.to,
        status: safeStr(q.status) || "new",
        detail: q.tour_slug ? `Tour: ${safeStr(q.tour_slug)}` : safeStr(q.message).slice(0, 80),
        travelers: q.group_size ? `${safeStr(q.group_size)} guests` : "Group size not set",
        vehicle: null,
      };
    });

    events = [...tripEvents, ...inquiryEvents];
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Unknown error loading bookings.";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-navy">Bookings Calendar</h1>
        <p className="font-body text-sm text-ink-text/55 mt-1">
          Custom trip requests and tour enquiries on one calendar — click a day to see who&apos;s arriving.
        </p>
      </div>

      {loadError ? (
        <div className="bg-white rounded-2xl border border-navy/10 p-8 text-center">
          <AlertTriangle className="text-clay mx-auto mb-3" size={28} />
          <p className="font-body text-sm text-ink-text/70 mb-1">Couldn&apos;t load bookings.</p>
          <p className="font-body text-xs text-ink-text/45">{loadError}</p>
        </div>
      ) : (
        <BookingsCalendar events={events} />
      )}
    </div>
  );
}
