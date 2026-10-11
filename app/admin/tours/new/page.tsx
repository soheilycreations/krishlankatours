import TourForm from "@/components/admin/TourForm";
import { requireAdmin } from "@/lib/auth";
import { getCategoryOptions } from "@/lib/admin-categories";

export const dynamic = "force-dynamic";

export default async function NewTourPage() {
  const { supabase } = await requireAdmin();
  const categoryOptions = await getCategoryOptions(supabase);

  return (
    <div>
      <h1 className="font-display text-2xl text-navy mb-6">New tour</h1>
      <TourForm categoryOptions={categoryOptions} />
    </div>
  );
}
