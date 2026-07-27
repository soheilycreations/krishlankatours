import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updateTripRequestStatus } from "@/app/admin/actions";
import { AlertTriangle, MapPin, CalendarDays, Users, Car, Hotel, Phone, Mail } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUSES = ["new", "contacted", "quoted", "booked", "closed"];
const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue/10 text-blue",
  contacted: "bg-clay/15 text-clay",
  quoted: "bg-sea/15 text-sea",
  booked: "bg-emerald-100 text-emerald-600",
  closed: "bg-navy/8 text-navy/50",
};

export default async function TripRequestsPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return (
      <div className="bg-white rounded-2xl border border-navy/10 p-8 text-center">
        <AlertTriangle className="text-clay mx-auto mb-3" size={28} />
        <p className="font-body text-sm text-ink-text/60">Not connected yet — contact your developer.</p>
      </div>
    );
  }

  const { data: requests, error } = await supabase
    .from("custom_trip_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-navy">Custom Trip Requests</h1>
        <p className="font-body text-sm text-ink-text/55 mt-1">
          Trip plans built by visitors in the custom planner (/plan).
        </p>
      </div>

      {error?.message.includes("does not exist") && (
        <div className="bg-clay/10 border border-clay/30 rounded-xl p-4 font-body text-sm text-ink-text/70">
          Run <code className="font-stamp text-xs">supabase/migration-custom-planner.sql</code> in
          the Supabase SQL editor to create this table.
        </div>
      )}

      {(requests ?? []).length === 0 && !error && (
        <div className="bg-white rounded-2xl border border-navy/10 p-10 text-center font-body text-sm text-ink-text/50">
          No trip requests yet — they&apos;ll appear here as soon as someone plans a trip.
        </div>
      )}

      <div className="space-y-5">
        {(requests ?? []).map((r) => {
          const locations: { name?: string }[] = Array.isArray(r.locations) ? r.locations : [];
          return (
            <div key={r.id} className="bg-white rounded-2xl border border-navy/10 p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <p className="font-display text-lg text-navy">{r.name}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1.5 font-body text-xs text-blue hover:underline">
                      <Mail size={12} /> {r.email}
                    </a>
                    {r.phone && (
                      <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1.5 font-body text-xs text-ink-text/60">
                        <Phone size={12} /> {r.phone}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-stamp text-[10px] uppercase tracking-wide px-3 py-1.5 rounded-full ${STATUS_COLORS[r.status] ?? STATUS_COLORS.new}`}>
                    {r.status}
                  </span>
                  <form action={updateTripRequestStatus} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={r.id} />
                    <select name="status" defaultValue={r.status} className="bg-paper-2/60 border border-navy/12 rounded-lg px-2 py-1.5 font-body text-xs text-navy outline-none">
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button className="font-body text-xs px-3 py-1.5 rounded-full bg-navy text-white hover:bg-navy-2 transition-colors">
                      Update
                    </button>
                  </form>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <div className="flex items-center gap-2 bg-paper-2/50 rounded-lg px-3 py-2.5">
                  <CalendarDays size={14} className="text-blue shrink-0" />
                  <span className="font-body text-xs text-ink-text/70">
                    {r.arrival_date ?? "?"} → {r.departure_date ?? "?"}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-paper-2/50 rounded-lg px-3 py-2.5">
                  <Users size={14} className="text-blue shrink-0" />
                  <span className="font-body text-xs text-ink-text/70">{r.travelers ?? "?"} travelers</span>
                </div>
                <div className="flex items-center gap-2 bg-paper-2/50 rounded-lg px-3 py-2.5">
                  <Car size={14} className="text-blue shrink-0" />
                  <span className="font-body text-xs text-ink-text/70 truncate">{r.vehicle_name ?? "No preference"}</span>
                </div>
                <div className="flex items-center gap-2 bg-paper-2/50 rounded-lg px-3 py-2.5">
                  <Hotel size={14} className="text-blue shrink-0" />
                  <span className="font-body text-xs text-ink-text/70">{r.hotel_category ?? "No preference"}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {locations.map((l, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 font-body text-xs bg-blue/8 text-blue px-3 py-1.5 rounded-full">
                    <MapPin size={11} /> {i + 1}. {l.name}
                  </span>
                ))}
              </div>

              {r.notes && (
                <p className="font-body text-sm text-ink-text/65 bg-paper-2/40 rounded-lg px-4 py-3 mt-4">
                  &ldquo;{r.notes}&rdquo;
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
