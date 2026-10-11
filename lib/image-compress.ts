/**
 * Browser-side image preparation for admin uploads.
 *
 * Phone photos are often 4–12 MB. Before uploading to Supabase Storage we
 * resize to at most MAX_WIDTH px wide and re-encode as WebP (JPEG fallback
 * on browsers that can't encode WebP). Typical result: 150–500 KB, which
 * cuts storage size and every later download.
 */

export const MAX_WIDTH = 1920;
const QUALITY = 0.82;
const MAX_INPUT_BYTES = 30 * 1024 * 1024; // 30 MB

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/heic", "image/heif", "image/gif"];

export interface PreparedImage {
  blob: Blob;
  contentType: string;
  extension: string;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

export async function prepareImageForUpload(file: File): Promise<PreparedImage> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    throw new Error("Please choose a photo (JPG, PNG, WebP or HEIC).");
  }
  if (!ACCEPTED.includes(file.type)) {
    throw new Error(`This file type (${file.type}) isn't supported. Please use JPG, PNG or WebP.`);
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error("This photo is larger than 30 MB. Please choose a smaller one.");
  }
  // Animated GIFs would lose their animation on a canvas — upload as-is.
  if (file.type === "image/gif") {
    return { blob: file, contentType: "image/gif", extension: "gif" };
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error(
      "This browser can't read that photo format. Please convert it to JPG first (iPhone: Settings → Camera → Formats → Most Compatible)."
    );
  }

  const scale = Math.min(1, MAX_WIDTH / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Couldn't process the photo in this browser.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const webp = await canvasToBlob(canvas, "image/webp", QUALITY);
  if (webp && webp.type === "image/webp") {
    return { blob: webp, contentType: "image/webp", extension: "webp" };
  }
  const jpeg = await canvasToBlob(canvas, "image/jpeg", QUALITY);
  if (jpeg) return { blob: jpeg, contentType: "image/jpeg", extension: "jpg" };
  throw new Error("Couldn't process the photo in this browser.");
}

/** Cache-Control for uploaded files (seconds). File names are random UUIDs,
 *  so a file never changes and can be cached for a year. */
export const UPLOAD_CACHE_CONTROL = "31536000";
