"use client";

import { useState, useMemo, useTransition } from "react";
import { ChevronDown, Trash2, Mail, Phone, Calendar, Users, MessageSquare } from "lucide-react";
import { updateInquiryStatus, deleteInquiry } from "@/app/admin/actions";
import type { InquiryRow } from "@/app/admin/enquiries/page";

const statuses = ["new", "contacted", "booked", "closed"] as const;

const statusColors: Record<string, string> = {
  new: "bg-clay/15 text-clay",
  contacted: "bg-blue/10 text-blue",
  booked: "bg-green-100 text-green-700",
  closed: "bg-paper-2 text-ink-text/50",
};

export default function EnquiriesList({ inquiries }: { inquiries: InquiryRow[] }) {
  const [filter, setFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [items, setItems] = useState(inquiries);
  const [, startTransition] = useTransition();

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.status === filter)),
    [items, filter]
  );

  const handleStatusChange = (id: string, status: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    startTransition(() => {
      updateInquiryStatus(id, status);
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete the enquiry from "${name}"? This can't be undone.`)) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    startTransition(() => {
      deleteInquiry(id);
    });
  };

  const counts = {
    all: items.length,
    new: items.filter((i) => i.status === "new").length,
    contacted: items.filter((i) => i.status === "contacted").length,
    booked: items.filter((i) => i.status === "booked").length,
    closed: items.filter((i) => i.status === "closed").length,
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {(["all", ...statuses] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`font-stamp text-xs uppercase tracking-wide px-3.5 py-1.5 rounded-full border transition-colors ${
              filter === s
                ? "bg-navy text-white border-navy"
                : "border-navy/15 text-ink-text/60 hover:border-navy/30"
            }`}
          >
            {s} ({counts[s]})
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-navy/10 divide-y divide-navy/8 overflow-hidden">
        {filtered.map((inq) => {
          const isOpen = expandedId === inq.id;
          return (
            <div key={inq.id}>
              <button
                onClick={() => setExpandedId(isOpen ? null : inq.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-paper-2/40 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm text-navy truncate">{inq.name}</p>
                  <p className="font-body text-xs text-ink-text/50 truncate">
                    {inq.email} {inq.tour_slug && `· ${inq.tour_slug}`}
                  </p>
                </div>
                <span
                  className={`shrink-0 font-stamp text-[10px] uppercase tracking-wide px-2.5 py-1 rounded-full ${statusColors[inq.status] ?? "bg-paper-2 text-ink-text/50"}`}
                >
                  {inq.status}
                </span>
                <span className="hidden sm:inline shrink-0 font-body text-xs text-ink-text/40 w-24 text-right">
                  {new Date(inq.created_at).toLocaleDateString()}
                </span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-ink-text/40 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 bg-paper-2/30">
                  <div className="grid sm:grid-cols-2 gap-3 mb-4 font-body text-sm text-ink-text/75">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-blue shrink-0" />
                      <a href={`mailto:${inq.email}`} className="hover:text-blue truncate">
                        {inq.email}
                      </a>
                    </div>
                    {inq.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-blue shrink-0" />
                        {inq.phone}
                      </div>
                    )}
                    {inq.travel_dates && (
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-blue shrink-0" />
                        {inq.travel_dates}
                      </div>
                    )}
                    {inq.group_size && (
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-blue shrink-0" />
                        {inq.group_size}
                      </div>
                    )}
                  </div>

                  {inq.message && (
                    <div className="flex items-start gap-2 mb-4 font-body text-sm text-ink-text/70 bg-white rounded-lg p-3 border border-navy/8">
                      <MessageSquare size={14} className="text-blue shrink-0 mt-0.5" />
                      <p className="leading-relaxed">{inq.message}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-stamp text-xs text-ink-text/45 uppercase">Status:</span>
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                        className="border border-navy/15 rounded-lg px-2.5 py-1.5 font-body text-xs text-navy focus:border-blue outline-none"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => handleDelete(inq.id, inq.name)}
                      className="flex items-center gap-1.5 font-body text-xs text-ink-text/50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="p-8 text-center font-body text-sm text-ink-text/50">
            No enquiries {filter !== "all" && `with status "${filter}"`} yet.
          </div>
        )}
      </div>
    </div>
  );
}
