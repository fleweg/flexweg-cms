import { deleteFile, uploadFile } from "./flexwegApi";

// Path on Flexweg of the active theme's logo. Stable across uploads —
// cache busting happens via the `?v=<logoUpdatedAt>` query string the
// publisher embeds in /data/menu.json's branding.logoUrl.
export function logoPath(themeId: string): string {
  return `theme-assets/${themeId}-logo.webp`;
}

// Resizes a user-supplied image to the given dimensions and re-encodes
// it as WebP. "contain" preserves the source aspect ratio inside the
// box (transparent letterbox); "cover" crops to fill. Used by the
// default theme's logo upload — the box dimensions come from the
// theme's manifest.
async function resizeImageToWebp(
  file: File,
  width: number,
  height: number,
  fit: "cover" | "contain",
  quality = 0.9,
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const canvas =
    typeof OffscreenCanvas !== "undefined"
      ? new OffscreenCanvas(width, height)
      : Object.assign(document.createElement("canvas"), { width, height });
  const ctx = (canvas as OffscreenCanvas).getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable.");
  ctx.clearRect(0, 0, width, height);
  if (fit === "cover") {
    const scale = Math.max(width / bitmap.width, height / bitmap.height);
    const sw = width / scale;
    const sh = height / scale;
    const sx = (bitmap.width - sw) / 2;
    const sy = (bitmap.height - sh) / 2;
    ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, width, height);
  } else {
    const scale = Math.min(width / bitmap.width, height / bitmap.height);
    const dw = bitmap.width * scale;
    const dh = bitmap.height * scale;
    const dx = (width - dw) / 2;
    const dy = (height - dh) / 2;
    ctx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height, dx, dy, dw, dh);
  }
  bitmap.close?.();
  if ("convertToBlob" in canvas) {
    return canvas.convertToBlob({ type: "image/webp", quality });
  }
  return await new Promise<Blob>((resolve, reject) => {
    (canvas as HTMLCanvasElement).toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Failed to encode WebP."))),
      "image/webp",
      quality,
    );
  });
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Unexpected FileReader result."));
        return;
      }
      const idx = result.indexOf(",");
      resolve(idx >= 0 ? result.slice(idx + 1) : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error("FileReader failed."));
    reader.readAsDataURL(blob);
  });
}

// Uploads a resized logo to /theme-assets/<themeId>-logo.webp on
// Flexweg. The caller persists `{ logoEnabled: true, logoUpdatedAt }`
// in the theme config so the publisher can build a cache-busted URL
// for /data/menu.json's branding block on the next republish.
export async function uploadThemeLogo(args: {
  themeId: string;
  file: File;
  width: number;
  height: number;
  fit?: "cover" | "contain";
}): Promise<void> {
  const blob = await resizeImageToWebp(
    args.file,
    args.width,
    args.height,
    args.fit ?? "contain",
  );
  const base64 = await blobToBase64(blob);
  await uploadFile({
    path: logoPath(args.themeId),
    content: base64,
    encoding: "base64",
  });
}

// Best-effort delete of a previously uploaded logo. 404 is treated as
// success by deleteFile, so this stays silent when no logo was set.
export async function removeThemeLogo(themeId: string): Promise<void> {
  await deleteFile(logoPath(themeId));
}
