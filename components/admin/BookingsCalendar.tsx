"use client";

import { useMemo, useState } from "react";
import {
  addMonths, subMonths, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, parseISO, isValid, parse,
} from "date-fns";
import { ChevronLeft, ChevronRight, MapPin, CalendarDays, Users, Car } from "lucide-react";

export interface BookingEvent {
  id: string;
  kind: "trip" | "enquiry";
  name: string;
  email: string;
  phone: string | null;
  from: string | null; // yyyy-MM-dd
  to: string | null;
  status: string;
  detail: string; // locations summary / tour slug
  travelers: string;
  vehicle: string | null;
}

const KIND_STYLES = {
  trip: { chip: "bg-blue text-white", dot: "bg-blue", label: "Custom trip" },
  enquiry: { chip: "bg-sea/90 text-white", dot: "bg-sea", label: "Tour enquiry" },
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue/10 text-blue",
  contacted: "bg-clay/15 text-clay",
  quoted: "bg-sea/15 text-sea",
  booked: "bg-emerald-100 text-emerald-600",
  closed: "bg-navy/8 text-navy/50",
};

/** Best-effort parse of free-text enquiry dates like "01 Aug 2026 → 10 Aug 2026". */
export function parseTextRange(text: string | null): { from: string | null; to: string | null } {
  if (!text) return { from: null, to: null };
  const parts = text.split("→").map((p) => p.trim());
  const tryParse = (v?: string) => {
    if (!v) return null;
    for (const f of ["dd MMM yyyy", "yyyy-MM-dd", "dd/MM/yyyy"]) {
      const d = parse(v, f, new Date());
      if (isValid(d)) return format(d, "yyyy-MM-dd");
    }
    return null;
  };
  return { from: tryParse(parts[0]), to: tryParse(parts[1]) ?? tryParse(parts[0]) };
}

export default function BookingsCalendar({ events }: { events: BookingEvent[] }) {
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const [selected, setSelected] = useState<Date | null>(null);

  const days = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
        end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
      }),
    [month]
  );

  const eventsOn = (day: Date) =>
    events.filter((e) => {
      if (!e.from) return false;
      const from = parseISO(e.from);
      if (!isValid(from)) return false;
      let to = e.to ? parseISO(e.to) : from;
      if (!isValid(to)) to = from;
      if (to < from) to = from; // guard against reversed/bad date ranges crashing the calendar
      return isWithinInterval(day, { start: from, end: to });
    });

  const monthEvents = events
    .filter((e) => e.from && isValid(parseISO(e.from)) && isSameMonth(parseISO(e.from), month))
    .sort((a, b) => (a.from! < b.from! ? -1 : 1));
  const undated = events.filter((e) => !e.from);
  const listed = selected ? eventsOn(selected) : monthEvents;

  return (
    <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 items-start">
      {/* ------- CALENDAR ------- */}
      <div className="bg-white rounded-2xl border border-navy/10 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-navy">{format(month, "MMMM yyyy")}</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => { setMonth(startOfMonth(new Date())); setSelected(null); }} className="font-body text-xs px-3 py-1.5 rounded-full border border-navy/15 text-ink-text/60 hover:border-blue hover:text-blue transition-colors">
              Today
            </button>
            <button aria-label="Previous month" onClick={() => { setMonth((m) => subMonths(m, 1)); setSelected(null); }} className="w-8 h-8 rounded-full border border-navy/15 flex items-center justify-center text-navy hover:border-blue hover:text-blue transition-colors">
              <ChevronLeft size={15} />
            </button>
            <button aria-label="Next month" onClick={() => { setMonth((m) => addMonths(m, 1)); setSelected(null); }} className="w-8 h-8 rounded-full border border-navy/15 flex items-center justify-center text-navy hover:border-blue hover:text-blue transition-colors">
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 mb-1">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <p key={d} className="font-stamp text-[10px] uppercase tracking-wide text-ink-text/40 text-center py-1">{d}</p>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const dayEvents = eventsOn(day);
            const inMonth = isSameMonth(day, month);
            const isToday = isSameDay(day, new Date());
            const isSelected = selected && isSameDay(day, selected);
            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelected(isSelected ? null : day)}
                className={`min-h-[68px] sm:min-h-[80px] rounded-xl p-1.5 text-left align-top transition-all border ${
                  isSelected
                    ? "border-blue ring-2 ring-blue/25 bg-blue/5"
                    : isToday
                      ? "border-clay/60 bg-clay/5"
                      : "border-transparent hover:border-navy/15"
                } ${inMonth ? "" : "opacity-35"}`}
              >
                <span className={`font-body text-xs ${isToday ? "font-bold text-clay" : "text-ink-text/60"}`}>
                  {format(day, "d")}
                </span>
                <span className="block mt-1 space-y-0.5">
                  {dayEvents.slice(0, 2).map((e) => (
                    <span key={e.id} className={`block truncate rounded px-1 py-0.5 font-body text-[9px] leading-tight ${KIND_STYLES[e.kind].chip}`}>
                      {e.name.split(" ")[0]}
                    </span>
                  ))}
                  {dayEvents.length > 2 && (
                    <span className="block font-body text-[9px] text-ink-text/45 px-1">+{dayEvents.length - 2} more</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-navy/8">
          {Object.values(KIND_STYLES).map((k) => (
            <span key={k.label} className="inline-flex items-center gap-1.5 font-body text-xs text-ink-text/55">
              <span className={`w-2.5 h-2.5 rounded-full ${k.dot}`} /> {k.label}
            </span>
          ))}
        </div>
      </div>

      {/* ------- LIST ------- */}
      <div className="space-y-4">
        <h3 className="font-display text-lg text-navy">
          {selected ? format(selected, "dd MMMM yyyy") : format(month, "MMMM")} bookings
          <span className="font-body text-sm text-ink-text/45 ml-2">({listed.length})</span>
        </h3>

        {listed.length === 0 && (
          <p className="bg-white rounded-2xl border border-navy/10 p-6 font-body text-sm text-ink-text/50 text-center">
            Nothing {selected ? "on this day" : "this month"} yet.
          </p>
        )}

        {listed.map((e) => (
          <div key={e.id} className="bg-white rounded-2xl border border-navy/10 p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="font-display text-base text-navy leading-tight">{e.name}</p>
                <a href={`mailto:${e.email}`} className="font-body text-xs text-blue hover:underline">{e.email}</a>
                {e.phone && <p className="font-body text-xs text-ink-text/50">{e.phone}</p>}
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className={`font-stamp text-[9px] uppercase tracking-wide px-2.5 py-1 rounded-full ${KIND_STYLES[e.kind].chip}`}>
                  {KIND_STYLES[e.kind].label}
                </span>
                <span className={`font-stamp text-[9px] uppercase tracking-wide px-2.5 py-1 rounded-full ${STATUS_COLORS[e.status] ?? STATUS_COLORS.new}`}>
                  {e.status}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="flex items-center gap-1.5 font-body text-xs text-ink-text/65">
                <CalendarDays size={12} className="text-blue shrink-0" />
                {e.from ?? "?"} {e.to && e.to !== e.from ? `→ ${e.to}` : ""}
              </p>
              {e.detail && (
                <p className="flex items-start gap-1.5 font-body text-xs text-ink-text/65">
                  <MapPin size={12} className="text-blue shrink-0 mt-0.5" /> <span>{e.detail}</span>
                </p>
              )}
              <p className="flex items-center gap-1.5 font-body text-xs text-ink-text/65">
                <Users size={12} className="text-blue shrink-0" /> {e.travelers}
              </p>
              {e.vehicle && (
                <p className="flex items-center gap-1.5 font-body text-xs text-ink-text/65">
                  <Car size={12} className="text-blue shrink-0" /> {e.vehicle}
                </p>
              )}
            </div>
          </div>
        ))}

        {!selected && undated.length > 0 && (
          <details className="bg-white rounded-2xl border border-navy/10 p-4">
            <summary className="font-body text-sm text-ink-text/60 cursor-pointer">
              {undated.length} enquiries without clear dates
            </summary>
            <div className="mt-3 space-y-2">
              {undated.map((e) => (
                <p key={e.id} className="font-body text-xs text-ink-text/60 border-t border-navy/8 pt-2">
                  <span className="text-navy font-medium">{e.name}</span> — {e.email}
                </p>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
