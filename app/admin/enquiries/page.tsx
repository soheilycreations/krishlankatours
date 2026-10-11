import { requireAdmin } from "@/lib/auth";
import EnquiriesList from "@/components/admin/EnquiriesList";

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
  hotel_location: string | null;
  message: string | null;
  locale: string;
  status: string;
}

export default async function EnquiriesPage() {
  const { supabase } = await requireAdmin();


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
