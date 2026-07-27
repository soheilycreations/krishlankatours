import { createSupabaseServerClient } from "@/lib/supabase/server";
import { saveGalleryImage, deleteGalleryImage } from "@/app/admin/actions";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { AlertTriangle, Plus } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function GalleryAdminPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return (
      <div className="bg-white rounded-2xl border border-navy/10 p-8 text-center">
        <AlertTriangle className="text-clay mx-auto mb-3" size={28} />
        <p className="font-body text-sm text-ink-text/60">Not connected yet — contact your developer.</p>
      </div>
    );
  }
  const { data: images, error } = await supabase.from("gallery_images").select("*").order("sort_order");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-navy">Gallery</h1>
        <p className="font-body text-sm text-ink-text/55 mt-1">Photos shown on the public gallery page. Upload, caption, and remove freely.</p>
      </div>
      {error?.message.includes("does not exist") && (
        <div className="bg-clay/10 border border-clay/30 rounded-xl p-4 font-body text-sm text-ink-text/70">
          Run <code className="font-stamp text-xs">supabase/migration-2-content.sql</code> in the Supabase SQL editor first.
        </div>
      )}

      <div className="bg-white rounded-2xl border border-navy/10 p-6">
        <h2 className="font-display text-lg text-navy mb-4">Add a photo</h2>
        <form action={saveGalleryImage} className="grid sm:grid-cols-2 gap-4 bg-paper-2/50 rounded-xl p-5">
          <div className="sm:col-span-2">
            <ImageUploadField label="Photo *" name="image_url" />
          </div>
          <div>
            <label className="block font-stamp text-[10px] uppercase tracking-wide text-ink-text/50 mb-1.5">Caption (English)</label>
            <input name="caption_en" className="w-full bg-white border border-navy/12 rounded-lg px-3 py-2.5 font-body text-sm text-navy outline-none focus:border-blue" />
          </div>
          <div>
            <label className="block font-stamp text-[10px] uppercase tracking-wide text-ink-text/50 mb-1.5">Caption (German)</label>
            <input name="caption_de" className="w-full bg-white border border-navy/12 rounded-lg px-3 py-2.5 font-body text-sm text-navy outline-none focus:border-blue" />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 font-body text-sm text-ink-text/70">
              <input type="checkbox" name="tall" className="accent-blue w-4 h-4" /> Tall photo (portrait)
            </label>
            <div className="flex items-center gap-2">
              <span className="font-stamp text-[10px] uppercase text-ink-text/50">Order</span>
              <input name="sort_order" type="number" defaultValue={0} className="w-20 bg-white border border-navy/12 rounded-lg px-2 py-2 font-body text-sm text-navy outline-none" />
            </div>
          </div>
          <div className="flex justify-end items-end">
            <button className="inline-flex items-center gap-1.5 bg-blue text-white px-5 py-2.5 rounded-full font-body text-sm font-medium hover:bg-blue-light transition-colors">
              <Plus size={14} /> Add photo
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {(images ?? []).map((img) => (
          <div key={img.id} className="bg-white rounded-2xl border border-navy/10 overflow-hidden">
            <div className="relative h-36">
              <Image src={img.image_url} alt={img.caption_en ?? ""} fill sizes="240px" className="object-cover" />
            </div>
            <div className="p-3">
              <p className="font-body text-xs text-ink-text/70 truncate">{img.caption_en || "No caption"}</p>
              <p className="font-stamp text-[9px] uppercase text-ink-text/40 mt-0.5">
                {img.tall ? "tall" : "standard"} · order {img.sort_order}
              </p>
              <form action={deleteGalleryImage} className="mt-2">
                <input type="hidden" name="id" value={img.id} />
                <button className="w-full font-body text-xs py-1.5 rounded-full border border-navy/15 text-ink-text/60 hover:border-red-400 hover:text-red-500 transition-colors">
                  Remove
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
