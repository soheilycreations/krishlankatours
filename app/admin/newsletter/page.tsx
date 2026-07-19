import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AlertTriangle, Mail } from "lucide-react";
import CopyEmailsButton from "@/components/admin/CopyEmailsButton";

export const dynamic = "force-dynamic";

interface SubscriberRow {
  id: string;
  email: string;
  created_at: string;
}

export default async function NewsletterPage() {
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
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  const subscribers = (data as SubscriberRow[]) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-navy mb-1">Newsletter</h1>
          <p className="font-body text-sm text-ink-text/55">
            {subscribers.length} subscriber{subscribers.length === 1 ? "" : "s"} from the footer signup form.
          </p>
        </div>
        {subscribers.length > 0 && (
          <CopyEmailsButton emails={subscribers.map((s) => s.email)} />
        )}
      </div>

      <div className="bg-white rounded-2xl border border-navy/10 divide-y divide-navy/8 overflow-hidden">
        {subscribers.map((s) => (
          <div key={s.id} className="flex items-center gap-3 px-5 py-3.5">
            <Mail size={15} className="text-blue shrink-0" />
            <span className="flex-1 font-body text-sm text-navy truncate">{s.email}</span>
            <span className="shrink-0 font-body text-xs text-ink-text/40">
              {new Date(s.created_at).toLocaleDateString()}
            </span>
          </div>
        ))}
        {subscribers.length === 0 && (
          <div className="p-8 text-center font-body text-sm text-ink-text/50">
            No subscribers yet.
          </div>
        )}
      </div>
    </div>
  );
}
