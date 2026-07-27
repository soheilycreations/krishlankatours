"use client";

import { useState, useRef, useEffect } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

export type { DateRange };

/** Arrival → departure range picker. Click opens a calendar; picking the
 *  arrival date starts a highlighted range that closes on departure. */
export default function DateRangeField({
  value,
  onChange,
  arrivalLabel,
  departureLabel,
  placeholder,
}: {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  arrivalLabel: string;
  departureLabel: string;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const fmt = (d?: Date) => (d ? format(d, "dd MMM yyyy") : "");

  return (
    <div className="relative" ref={ref}>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: arrivalLabel, text: fmt(value?.from) },
          { label: departureLabel, text: fmt(value?.to) },
        ].map((f) => (
          <button
            type="button"
            key={f.label}
            onClick={() => setOpen((o) => !o)}
            className="text-left bg-paper-2/40 border border-navy/12 rounded-lg px-4 py-3 hover:border-blue/50 transition-colors"
          >
            <span className="block font-stamp text-[10px] uppercase tracking-wide text-ink-text/45 mb-1">
              {f.label}
            </span>
            <span className={`flex items-center gap-2 font-body text-sm ${f.text ? "text-navy" : "text-ink-text/40"}`}>
              <CalendarDays size={14} className="text-blue shrink-0" />
              {f.text || placeholder}
            </span>
          </button>
        ))}
      </div>

      {open && (
        <div className="absolute z-40 mt-2 bg-white border border-navy/10 rounded-2xl shadow-2xl shadow-navy/15 p-4 left-1/2 -translate-x-1/2">
          <DayPicker
            mode="range"
            numberOfMonths={1}
            selected={value}
            disabled={{ before: new Date() }}
            onSelect={(range) => {
              onChange(range);
              if (range?.from && range?.to) setOpen(false);
            }}
            classNames={{
              today: "text-blue font-semibold",
              chevron: "fill-blue",
            }}
            styles={{ root: { "--rdp-accent-color": "#E8502B", "--rdp-accent-background-color": "#FBEEDD", margin: 0 } as React.CSSProperties }}
          />
        </div>
      )}
    </div>
  );
}
