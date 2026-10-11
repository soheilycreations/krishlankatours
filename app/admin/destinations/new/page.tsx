import DestinationForm from "@/components/admin/DestinationForm";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewDestinationPage() {
  await requireAdmin();

  return (
    <div>
      <h1 className="font-display text-2xl text-navy mb-6">New destination</h1>
      <DestinationForm />
    </div>
  );
}
