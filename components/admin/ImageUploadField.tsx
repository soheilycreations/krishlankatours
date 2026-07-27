"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageOff } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ImageUploadField({
  label,
  name,
  defaultValue = "",
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError("");
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Image uploads aren't connected yet. Please contact your developer.");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("tour-images")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("tour-images").getPublicUrl(path);
    setValue(data.publicUrl);
    setUploading(false);
  };

  return (
    <div>
      <label className="block font-stamp text-xs uppercase tracking-wide text-ink-text/45 mb-1.5">
        {label}
      </label>
      <input type="hidden" name={name} value={value} readOnly />

      <div className="flex items-start gap-3">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-paper-2 border border-navy/10 shrink-0">
          {value ? (
            <Image src={value} alt="" fill sizes="96px" className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ink-text/30">
              <ImageOff size={22} />
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-navy/60 flex items-center justify-center">
              <Loader2 className="animate-spin text-white" size={20} />
            </div>
          )}
        </div>

        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 border border-navy/15 rounded-full px-3.5 py-2 font-body text-xs font-medium text-navy hover:border-blue hover:text-blue transition-colors disabled:opacity-50"
            >
              <Upload size={13} /> Upload
            </button>
            {value && (
              <button
                type="button"
                onClick={() => setValue("")}
                className="inline-flex items-center gap-1.5 border border-navy/15 rounded-full px-3.5 py-2 font-body text-xs font-medium text-ink-text/60 hover:border-red-300 hover:text-red-600 transition-colors"
              >
                <X size={13} /> Remove
              </button>
            )}
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="or paste an image URL / path"
            className="mt-2 w-full border border-navy/12 rounded-lg px-3 py-1.5 font-body text-xs text-navy focus:border-blue outline-none"
          />
          {error && <p className="font-body text-xs text-red-600 mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
}
