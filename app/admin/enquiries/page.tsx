import { createSupabaseServerClient } from "@/lib/supabase/server";
import EnquiriesList from "@/components/admin/EnquiriesList";
import { AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export interface InquiryRow {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  tour_slug: string | null;
  travel_dates: string | null;
  group_size: string | null;
  message: string | null;
  locale: string;
  status: string;
}

export default async function EnquiriesPage() {
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

  const { data } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  const inquiries = (data as InquiryRow[]) ?? [];

  return (
    <div>
      <h1 className="font-display text-2xl text-navy mb-1">Enquiries</h1>
      <p className="font-body text-sm text-ink-text/55 mb-8">
        Every booking enquiry submitted through the contact form, newest first.
      </p>
      <EnquiriesList inquiries={inquiries} />
    </div>
  );
}
