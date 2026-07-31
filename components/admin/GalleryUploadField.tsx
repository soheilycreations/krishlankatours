"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Link2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/** Multi-image gallery manager: upload several photos to Supabase storage,
 *  add by URL, remove, and submit as a newline-joined hidden field — fully
 *  compatible with the existing saveTour server action. */
export default function GalleryUploadField({
  label,
  name,
  defaultValue = [],
}: {
  label: string;
  name: string;
  defaultValue?: string[];
}) {
  const [images, setImages] = useState<string[]>(defaultValue.filter(Boolean));
  const [uploading, setUploading] = useState(0); // number of files in flight
  const [error, setError] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadFiles = async (files: FileList) => {
    setError("");
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Image uploads aren't connected yet. Please contact your developer.");
      return;
    }
    setUploading(files.length);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("tour-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (uploadError) {
        setError(uploadError.message);
      } else {
        const { data } = supabase.storage.from("tour-images").getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      setUploading((n) => n - 1);
    }
    setImages((imgs) => [...imgs, ...uploaded]);
  };

  const addUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    setImages((imgs) => [...imgs, url]);
    setUrlInput("");
  };

  const move = (i: number, dir: -1 | 1) =>
    setImages((imgs) => {
      const next = [...imgs];
      const j = i + dir;
      if (j < 0 || j >= next.length) return imgs;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <div>
      <label className="block font-stamp text-xs uppercase tracking-wide text-ink-text/45 mb-1.5">
        {label}
      </label>
      {/* newline-joined so the existing server action parses it unchanged */}
      <input type="hidden" name={name} value={images.join("\n")} readOnly />

      {/* thumbnails */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 mb-3">
          {images.map((src, i) => (
            <div key={`${src}-${i}`} className="relative group rounded-lg overflow-hidden border border-navy/10 bg-paper-2 aspect-square">
              <Image src={src} alt="" fill sizes="140px" className="object-cover" />
              <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/45 transition-colors flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                <button type="button" aria-label="Move left" onClick={() => move(i, -1)} className="w-7 h-7 rounded-full bg-white/90 text-navy text-xs font-bold">←</button>
                <button type="button" aria-label="Remove" onClick={() => setImages((imgs) => imgs.filter((_, x) => x !== i))} className="w-7 h-7 rounded-full bg-white/90 text-red-500 flex items-center justify-center">
                  <X size={13} />
                </button>
                <button type="button" aria-label="Move right" onClick={() => move(i, 1)} className="w-7 h-7 rounded-full bg-white/90 text-navy text-xs font-bold">→</button>
              </div>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 bg-blue text-white font-stamp text-[8px] uppercase px-1.5 py-0.5 rounded">
                  1st
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* actions */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files?.length && uploadFiles(e.target.files)}
      />
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading > 0}
          className="inline-flex items-center gap-1.5 bg-navy text-white px-4 py-2 rounded-full font-body text-xs font-medium hover:bg-navy-2 transition-colors disabled:opacity-50"
        >
          {uploading > 0 ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
          {uploading > 0 ? `Uploading ${uploading}...` : "Upload photos"}
        </button>
        <span className="font-body text-xs text-ink-text/40">or</span>
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addUrl(); } }}
            placeholder="Paste an image URL"
            className="flex-1 bg-white border border-navy/12 rounded-lg px-3 py-2 font-body text-xs text-navy outline-none focus:border-blue"
          />
          <button type="button" onClick={addUrl} className="inline-flex items-center gap-1 border border-navy/15 text-ink-text/60 px-3 py-2 rounded-full font-body text-xs hover:border-blue hover:text-blue transition-colors">
            <Link2 size={12} /> Add
          </button>
        </div>
      </div>
      {error && <p className="font-body text-xs text-red-500 mt-2">{error}</p>}
      <p className="font-body text-[11px] text-ink-text/40 mt-2">
        Hover a photo to remove or reorder — these appear in the tour&apos;s photo gallery section.
      </p>
    </div>
  );
}
