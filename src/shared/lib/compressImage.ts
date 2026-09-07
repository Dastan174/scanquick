'use client';

// Resizes and re-encodes a photo in the browser before it's ever sent to the
// server — a raw phone photo can be 10-20MB, but the app only ever displays
// it inside a phone-sized frame, so there's no reason to store it at full
// resolution. Cuts both the upload time and the Supabase Storage footprint.

const MAX_DIMENSION = 1600; // px — comfortably sharp even on a 2x-density phone screen
const QUALITY = 0.82;
const SKIP_BELOW_BYTES = 400 * 1024; // not worth the CPU cost for already-small files

export async function compressImage(file: File): Promise<File> {
  if (file.size < SKIP_BELOW_BYTES) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', QUALITY),
    );
    // Keep the original if re-encoding somehow didn't actually save anything.
    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
    return new File([blob], name, { type: 'image/jpeg' });
  } catch {
    // HEIC/HEIF and anything else the browser can't decode via canvas —
    // upload the original rather than block the user.
    return file;
  }
}
