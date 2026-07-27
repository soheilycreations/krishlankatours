import Link from "next/link";
import { Mail, Map, MapPin, Send, ArrowRight, AlertTriangle } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface InquiryRow {
  id: string;
  created_at: string;
  name: string;
  email: string;
  tour_slug: string | null;
  message: string | null;
  status: string;
}

export default async function AdminDashboard() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return (
      <div className="bg-white rounded-2xl border border-navy/10 p-8 text-center">
        <AlertTriangle className="text-clay mx-auto mb-3" size={28} />
        <h1 className="font-display text-xl text-navy mb-2">Not connected yet</h1>
        <p className="font-body text-sm text-ink-text/60 max-w-md mx-auto">
          This system isn&apos;t connected yet. Please contact your developer to finish setting this up.
        </p>
      </div>
    );
  }

  const [{ count: newEnquiries }, { count: totalEnquiries }, { count: totalTours }, { count: totalSubs }, { data: recent }] =
    await Promise.all([
      supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("inquiries").select("id", { count: "exact", head: true }),
      supabase.from("tours").select("id", { count: "exact", head: true }),
      supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
      supabase
        .from("inquiries")
        .select("id, created_at, name, email, tour_slug, message, status")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  const recentInquiries = (recent as InquiryRow[]) ?? [];

  const stats = [
    { label: "New enquiries", value: newEnquiries ?? 0, icon: Mail, href: "/admin/enquiries", highlight: true },
    { label: "Total enquiries", value: totalEnquiries ?? 0, icon: Mail, href: "/admin/enquiries" },
    { label: "Tours", value: totalTours ?? 0, icon: Map, href: "/admin/tours" },
    { label: "Newsletter subscribers", value: totalSubs ?? 0, icon: Send, href: "/admin/newsletter" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-navy mb-1">Dashboard</h1>
      <p className="font-body text-sm text-ink-text/55 mb-8">An overview of what&apos;s happening on the site.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className={`rounded-2xl border p-5 transition-colors ${
                s.highlight && s.value > 0
                  ? "bg-clay/10 border-clay/30 hover:border-clay/50"
                  : "bg-white border-navy/10 hover:border-blue/30"
              }`}
            >
              <Icon className={s.highlight && s.value > 0 ? "text-clay" : "text-blue"} size={20} />
              <p className="font-display text-3xl text-navy mt-3">{s.value}</p>
              <p className="font-body text-xs text-ink-text/55 mt-1">{s.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-navy/10 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy/8">
          <h2 className="font-display text-lg text-navy">Recent enquiries</h2>
          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-1 font-body text-xs text-blue hover:text-blue-light"
          >
            View all <ArrowRight size={13} />
          </Link>
        </div>
        <div className="divide-y divide-navy/8">
          {recentInquiries.map((inq) => (
            <Link
              key={inq.id}
              href="/admin/enquiries"
              className="flex items-center gap-4 px-6 py-4 hover:bg-paper-2/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm text-navy truncate">{inq.name}</p>
                <p className="font-body text-xs text-ink-text/50 truncate">
                  {inq.email} {inq.tour_slug && `· ${inq.tour_slug}`}
                </p>
              </div>
              <span
                className={`shrink-0 font-stamp text-[10px] uppercase tracking-wide px-2.5 py-1 rounded-full ${
                  inq.status === "new"
                    ? "bg-clay/15 text-clay"
                    : "bg-paper-2 text-ink-text/50"
                }`}
              >
                {inq.status}
              </span>
              <span className="shrink-0 font-body text-xs text-ink-text/40 w-20 text-right">
                {new Date(inq.created_at).toLocaleDateString()}
              </span>
            </Link>
          ))}
          {recentInquiries.length === 0 && (
            <div className="px-6 py-8 text-center font-body text-sm text-ink-text/50">
              No enquiries yet.
            </div>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <Link
          href="/admin/tours/new"
          className="flex items-center gap-3 bg-white rounded-2xl border border-navy/10 p-5 hover:border-blue/30 transition-colors"
        >
          <Map className="text-blue" size={20} />
          <span className="font-body text-sm text-navy">Add a new tour</span>
          <ArrowRight size={15} className="text-ink-text/30 ml-auto" />
        </Link>
        <Link
          href="/admin/destinations/new"
          className="flex items-center gap-3 bg-white rounded-2xl border border-navy/10 p-5 hover:border-blue/30 transition-colors"
        >
          <MapPin className="text-blue" size={20} />
          <span className="font-body text-sm text-navy">Add a new destination</span>
          <ArrowRight size={15} className="text-ink-text/30 ml-auto" />
        </Link>
      </div>
    </div>
  );
}
