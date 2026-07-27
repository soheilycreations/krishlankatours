import { createSupabaseServerClient } from "@/lib/supabase/server";
import { saveCategory, deleteCategory } from "@/app/admin/actions";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { AlertTriangle, Shapes, Plus } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

function CategoryForm({ cat }: { cat?: Record<string, unknown> }) {
  const c = cat ?? {};
  return (
    <form action={saveCategory} className="grid sm:grid-cols-2 gap-4 bg-paper-2/50 rounded-xl p-5">
      {cat ? <input type="hidden" name="id" value={String(c.id)} /> : null}
      <div>
        <label className="block font-stamp text-[10px] uppercase tracking-wide text-ink-text/50 mb-1.5">Name (English) *</label>
        <input name="name_en" defaultValue={String(c.name_en ?? "")} required className="w-full bg-white border border-navy/12 rounded-lg px-3 py-2.5 font-body text-sm text-navy outline-none focus:border-blue" />
      </div>
      <div>
        <label className="block font-stamp text-[10px] uppercase tracking-wide text-ink-text/50 mb-1.5">Name (German)</label>
        <input name="name_de" defaultValue={String(c.name_de ?? "")} className="w-full bg-white border border-navy/12 rounded-lg px-3 py-2.5 font-body text-sm text-navy outline-none focus:border-blue" />
      </div>
      <div>
        <label className="block font-stamp text-[10px] uppercase tracking-wide text-ink-text/50 mb-1.5">Slug * <span className="normal-case text-ink-text/35">(matches tour category, e.g. village)</span></label>
        <input name="slug" defaultValue={String(c.slug ?? "")} required className="w-full bg-white border border-navy/12 rounded-lg px-3 py-2.5 font-body text-sm text-navy outline-none focus:border-blue" />
      </div>
      <div>
        <label className="block font-stamp text-[10px] uppercase tracking-wide text-ink-text/50 mb-1.5">Order</label>
        <input name="sort_order" type="number" defaultValue={Number(c.sort_order ?? 0)} className="w-full bg-white border border-navy/12 rounded-lg px-3 py-2.5 font-body text-sm text-navy outline-none focus:border-blue" />
      </div>
      <div className="sm:col-span-2">
        <ImageUploadField label="Category image" name="image_url" defaultValue={String(c.image_url ?? "")} />
      </div>
      <div className="sm:col-span-2 flex items-center justify-between">
        <label className="flex items-center gap-2 font-body text-sm text-ink-text/70">
          <input type="checkbox" name="active" defaultChecked={c.active !== false} className="accent-blue w-4 h-4" />
          Visible on site
        </label>
        <button className="inline-flex items-center gap-1.5 bg-blue text-white px-5 py-2.5 rounded-full font-body text-sm font-medium hover:bg-blue-light transition-colors">
          <Plus size={14} /> {cat ? "Save changes" : "Add category"}
        </button>
      </div>
    </form>
  );
}

export default async function CategoriesAdminPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return (
      <div className="bg-white rounded-2xl border border-navy/10 p-8 text-center">
        <AlertTriangle className="text-clay mx-auto mb-3" size={28} />
        <p className="font-body text-sm text-ink-text/60">Not connected yet — contact your developer.</p>
      </div>
    );
  }
  const { data: cats, error } = await supabase.from("categories").select("*").order("sort_order");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-navy">Tour Categories</h1>
        <p className="font-body text-sm text-ink-text/55 mt-1">The circular category icons on the homepage. The slug must match the category used on tours.</p>
      </div>
      {error?.message.includes("does not exist") && (
        <div className="bg-clay/10 border border-clay/30 rounded-xl p-4 font-body text-sm text-ink-text/70">
          Run <code className="font-stamp text-xs">supabase/migration-2-content.sql</code> in the Supabase SQL editor first.
        </div>
      )}
      <div className="bg-white rounded-2xl border border-navy/10 p-6">
        <h2 className="font-display text-lg text-navy mb-4">Add a category</h2>
        <CategoryForm />
      </div>
      <div className="space-y-5">
        {(cats ?? []).map((c) => (
          <details key={c.id} className="bg-white rounded-2xl border border-navy/10 overflow-hidden">
            <summary className="flex items-center gap-4 px-6 py-4 cursor-pointer select-none">
              <span className="relative w-11 h-11 rounded-full overflow-hidden bg-paper-2 shrink-0">
                {c.image_url ? (
                  <Image src={c.image_url} alt="" fill sizes="44px" className="object-cover" />
                ) : (
                  <Shapes size={18} className="absolute inset-0 m-auto text-navy/30" />
                )}
              </span>
              <span className="flex-1">
                <span className="font-display text-base text-navy block">{c.name_en}</span>
                <span className="font-body text-xs text-ink-text/50">{c.slug} {c.active ? "" : "· hidden"}</span>
              </span>
              <form action={deleteCategory}>
                <input type="hidden" name="id" value={c.id} />
                <button className="font-body text-xs px-3 py-1.5 rounded-full border border-navy/15 text-ink-text/60 hover:border-red-400 hover:text-red-500 transition-colors">Delete</button>
              </form>
            </summary>
            <div className="px-6 pb-6 border-t border-navy/8 pt-5">
              <CategoryForm cat={c} />
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
