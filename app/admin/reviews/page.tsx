import { createSupabaseServerClient } from "@/lib/supabase/server";
import { saveReview, deleteReview } from "@/app/admin/actions";
import { AlertTriangle, Star, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

function ReviewForm({ review }: { review?: Record<string, unknown> }) {
  const r = review ?? {};
  return (
    <form action={saveReview} className="grid sm:grid-cols-2 gap-4 bg-paper-2/50 rounded-xl p-5">
      {review ? <input type="hidden" name="id" value={String(r.id)} /> : null}
      <div>
        <label className="block font-stamp text-[10px] uppercase tracking-wide text-ink-text/50 mb-1.5">Guest name *</label>
        <input name="author" defaultValue={String(r.author ?? "")} required className="w-full bg-white border border-navy/12 rounded-lg px-3 py-2.5 font-body text-sm text-navy outline-none focus:border-blue" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block font-stamp text-[10px] uppercase tracking-wide text-ink-text/50 mb-1.5">Country</label>
          <input name="country" defaultValue={String(r.country ?? "")} placeholder="Germany" className="w-full bg-white border border-navy/12 rounded-lg px-3 py-2.5 font-body text-sm text-navy outline-none" />
        </div>
        <div>
          <label className="block font-stamp text-[10px] uppercase tracking-wide text-ink-text/50 mb-1.5">Rating</label>
          <select name="rating" defaultValue={Number(r.rating ?? 5)} className="w-full bg-white border border-navy/12 rounded-lg px-2 py-2.5 font-body text-sm text-navy outline-none">
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
          </select>
        </div>
        <div>
          <label className="block font-stamp text-[10px] uppercase tracking-wide text-ink-text/50 mb-1.5">Date</label>
          <input name="review_date" type="date" defaultValue={String(r.review_date ?? "")} className="w-full bg-white border border-navy/12 rounded-lg px-2 py-2.5 font-body text-sm text-navy outline-none" />
        </div>
      </div>
      <div className="sm:col-span-2">
        <label className="block font-stamp text-[10px] uppercase tracking-wide text-ink-text/50 mb-1.5">Review text (English) * <span className="normal-case text-ink-text/35">— copy it exactly from Google</span></label>
        <textarea name="text_en" rows={3} defaultValue={String(r.text_en ?? "")} required className="w-full bg-white border border-navy/12 rounded-lg px-3 py-2.5 font-body text-sm text-navy outline-none focus:border-blue resize-none" />
      </div>
      <div className="sm:col-span-2">
        <label className="block font-stamp text-[10px] uppercase tracking-wide text-ink-text/50 mb-1.5">Review text (German, optional)</label>
        <textarea name="text_de" rows={2} defaultValue={String(r.text_de ?? "")} className="w-full bg-white border border-navy/12 rounded-lg px-3 py-2.5 font-body text-sm text-navy outline-none resize-none" />
      </div>
      <div className="sm:col-span-2 flex items-center justify-between">
        <label className="flex items-center gap-2 font-body text-sm text-ink-text/70">
          <input type="checkbox" name="active" defaultChecked={r.active !== false} className="accent-blue w-4 h-4" /> Visible on site
        </label>
        <div className="flex items-center gap-3">
          <input name="sort_order" type="number" defaultValue={Number(r.sort_order ?? 0)} className="w-20 bg-white border border-navy/12 rounded-lg px-2 py-2 font-body text-sm text-navy outline-none" title="Order" />
          <button className="inline-flex items-center gap-1.5 bg-blue text-white px-5 py-2.5 rounded-full font-body text-sm font-medium hover:bg-blue-light transition-colors">
            <Plus size={14} /> {review ? "Save changes" : "Add review"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default async function ReviewsAdminPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return (
      <div className="bg-white rounded-2xl border border-navy/10 p-8 text-center">
        <AlertTriangle className="text-clay mx-auto mb-3" size={28} />
        <p className="font-body text-sm text-ink-text/60">Not connected yet — contact your developer.</p>
      </div>
    );
  }
  const { data: reviews, error } = await supabase.from("reviews").select("*").order("sort_order").order("review_date", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-navy">Guest Reviews</h1>
        <p className="font-body text-sm text-ink-text/55 mt-1">
          These show in the &quot;What our guests say&quot; section on the homepage. Copy your favourite Google reviews here word-for-word.
        </p>
      </div>
      {error?.message.includes("does not exist") && (
        <div className="bg-clay/10 border border-clay/30 rounded-xl p-4 font-body text-sm text-ink-text/70">
          Run <code className="font-stamp text-xs">supabase/migration-2-content.sql</code> in the Supabase SQL editor first.
        </div>
      )}
      <div className="bg-white rounded-2xl border border-navy/10 p-6">
        <h2 className="font-display text-lg text-navy mb-4">Add a review</h2>
        <ReviewForm />
      </div>
      <div className="space-y-5">
        {(reviews ?? []).map((r) => (
          <details key={r.id} className="bg-white rounded-2xl border border-navy/10 overflow-hidden">
            <summary className="flex items-center gap-4 px-6 py-4 cursor-pointer select-none">
              <span className="flex gap-0.5 shrink-0">
                {[...Array(r.rating)].map((_, i) => <Star key={i} size={13} className="fill-clay text-clay" />)}
              </span>
              <span className="flex-1">
                <span className="font-display text-base text-navy block">{r.author} {r.country ? `· ${r.country}` : ""}</span>
                <span className="font-body text-xs text-ink-text/50 line-clamp-1">{r.text_en}</span>
              </span>
              <form action={deleteReview}>
                <input type="hidden" name="id" value={r.id} />
                <button className="font-body text-xs px-3 py-1.5 rounded-full border border-navy/15 text-ink-text/60 hover:border-red-400 hover:text-red-500 transition-colors">Delete</button>
              </form>
            </summary>
            <div className="px-6 pb-6 border-t border-navy/8 pt-5">
              <ReviewForm review={r} />
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
