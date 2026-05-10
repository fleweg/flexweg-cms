import type { ImageFit, ImageFormat, ImageFormatConfig } from "../core/types";

// Image-processing pipeline that runs entirely in the browser. Used by
// services/media.ts on upload to produce the configured variants without
// keeping the original file (per the project spec).
//
// The browser has everything we need: createImageBitmap for fast decode,
// OffscreenCanvas for resizing, and canvas.convertToBlob for re-encoding
// to WebP/JPEG/PNG. No third-party dep, no WASM bundle.

export interface ProcessedVariant {
  name: string;
  blob: Blob;
  width: number;
  height: number;
  bytes: number;
}

export interface ProcessImageOptions {
  // Map of variant name → format spec. We pass formats explicitly rather
  // than reading the config so callers can union ADMIN_FORMATS with the
  // active theme's formats before invoking us.
  formats: Record<string, ImageFormat>;
  // Output mime, e.g. "image/webp". Mirrors ImageFormatConfig.outputFormat.
  outputMime: string;
  // 0..1 quality passed to canvas.convertToBlob. Caller is responsible for
  // rescaling from the 0..100 user-facing scale.
  quality: number;
}

// Validates the file's extension against an allow-list. Returns null on
// success or a reason string on rejection. Callers should also check
// magic bytes if they really care, but for an internal CMS the extension
// check is enough.
export function validateInputExtension(filename: string, allowed: string[]): string | null {
  const lower = filename.toLowerCase();
  const dot = lower.lastIndexOf(".");
  const ext = dot >= 0 ? lower.slice(dot) : "";
  const matches = allowed.map((e) => (e.startsWith(".") ? e.toLowerCase() : `.${e.toLowerCase()}`));
  if (!matches.includes(ext)) {
    return `Unsupported file type "${ext}". Accepted: ${matches.join(", ")}.`;
  }
  return null;
}

// Computes the source crop and target dimensions for a given fit. `cover`
// crops the source so it fills the box exactly. `contain` shrinks the
// source so it fits inside the box, leaving the canvas dimensions equal
// to the *content* size (no letterboxing — the output is just smaller on
// one axis). Returning the actual rendered dimensions matters because
// they end up in MediaVariant.{width,height} and drive responsive layout
// hints in templates.
interface FitPlan {
  canvasWidth: number;
  canvasHeight: number;
  srcX: number;
  srcY: number;
  srcWidth: number;
  srcHeight: number;
  drawWidth: number;
  drawHeight: number;
}

export function planFit(
  sourceWidth: number,
  sourceHeight: number,
  format: ImageFormat,
): FitPlan {
  const fit: ImageFit = format.fit ?? "cover";
  const targetW = format.width;
  const targetH = format.height;
  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = targetW / targetH;

  if (fit === "cover") {
    // Crop the source to match the target ratio, then scale to target.
    let srcW = sourceWidth;
    let srcH = sourceHeight;
    let srcX = 0;
    let srcY = 0;
    if (sourceRatio > targetRatio) {
      // Source is wider than target — crop the sides.
      srcW = sourceHeight * targetRatio;
      srcX = (sourceWidth - srcW) / 2;
    } else {
      // Source is taller than target — crop top/bottom.
      srcH = sourceWidth / targetRatio;
      srcY = (sourceHeight - srcH) / 2;
    }
    return {
      canvasWidth: targetW,
      canvasHeight: targetH,
      srcX,
      srcY,
      srcWidth: srcW,
      srcHeight: srcH,
      drawWidth: targetW,
      drawHeight: targetH,
    };
  }

  // contain: scale uniformly to fit inside the target box. We also avoid
  // upscaling — if the source is already smaller than the box, we keep its
  // native size to dodge unnecessary blur.
  const scale = Math.min(targetW / sourceWidth, targetH / sourceHeight, 1);
  const drawW = Math.round(sourceWidth * scale);
  const drawH = Math.round(sourceHeight * scale);
  return {
    canvasWidth: drawW,
    canvasHeight: drawH,
    srcX: 0,
    srcY: 0,
    srcWidth: sourceWidth,
    srcHeight: sourceHeight,
    drawWidth: drawW,
    drawHeight: drawH,
  };
}

// Converts the user-facing 0..100 quality to the canvas API's 0..1 range.
function normalizeQuality(value: number): number {
  if (!Number.isFinite(value)) return 0.8;
  return Math.max(0, Math.min(1, value > 1 ? value / 100 : value));
}

// Decodes the file once, then renders each requested variant into its own
// blob. Returns the variants in the same iteration order as the input
// formats map so callers can rely on deterministic output.
export async function processImage(
  file: File,
  opts: ProcessImageOptions,
): Promise<ProcessedVariant[]> {
  const bitmap = await createImageBitmap(file);
  try {
    const globalQuality = normalizeQuality(opts.quality);
    const variants: ProcessedVariant[] = [];

    for (const [name, format] of Object.entries(opts.formats)) {
      const plan = planFit(bitmap.width, bitmap.height, format);
      const canvas = createCanvas(plan.canvasWidth, plan.canvasHeight);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("2D canvas context unavailable.");
      // High-quality resampling. Browsers default to a fair quality but
      // setting these explicitly avoids regressions on older WebKit.
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        bitmap,
        plan.srcX,
        plan.srcY,
        plan.srcWidth,
        plan.srcHeight,
        0,
        0,
        plan.drawWidth,
        plan.drawHeight,
      );
      const variantQuality =
        format.quality !== undefined ? normalizeQuality(format.quality) : globalQuality;
      const blob = await canvasToBlob(canvas, opts.outputMime, variantQuality);
      if (!blob) throw new Error(`Failed to encode variant "${name}".`);
      variants.push({
        name,
        blob,
        width: plan.canvasWidth,
        height: plan.canvasHeight,
        bytes: blob.size,
      });
    }
    return variants;
  } finally {
    bitmap.close?.();
  }
}

// OffscreenCanvas is widely supported and avoids touching the DOM, but
// some Safari versions still don't expose it. Fall back to a detached
// HTMLCanvasElement when needed.
type AnyCanvas = OffscreenCanvas | HTMLCanvasElement;

function createCanvas(width: number, height: number): AnyCanvas {
  if (typeof OffscreenCanvas !== "undefined") {
    return new OffscreenCanvas(width, height);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function canvasToBlob(canvas: AnyCanvas, type: string, quality: number): Promise<Blob | null> {
  if ("convertToBlob" in canvas) {
    return canvas.convertToBlob({ type, quality });
  }
  return new Promise((resolve) =>
    (canvas as HTMLCanvasElement).toBlob((b) => resolve(b), type, quality),
  );
}

// Reads a Blob and returns a base64 string (without the data: prefix).
// Identical to the helper in flexwegApi.ts but kept here so the upload
// pipeline can be unit-tested without dragging the API layer in.
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Unexpected FileReader result type"));
        return;
      }
      const idx = result.indexOf(",");
      resolve(idx >= 0 ? result.slice(idx + 1) : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read blob"));
    reader.readAsDataURL(blob);
  });
}

// Map an output mime to the file extension used in the variant filename.
export function extensionForMime(mime: string): string {
  switch (mime) {
    case "image/webp":
      return "webp";
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    default:
      return "bin";
  }
}

// Convenience: union the active theme's formats with the admin formats so
// we generate everything in one pass. Theme formats win on key conflicts —
// gives a theme the option to override the admin defaults.
export function mergeFormats(
  admin: Record<string, ImageFormat>,
  themeConfig: ImageFormatConfig | undefined,
): { formats: Record<string, ImageFormat>; outputMime: string; quality: number; defaultFormat: string } {
  const themeFormats = themeConfig?.formats ?? {};
  const merged: Record<string, ImageFormat> = { ...admin, ...themeFormats };
  const outputFormat = themeConfig?.outputFormat ?? "webp";
  const outputMime = `image/${outputFormat === "jpeg" ? "jpeg" : outputFormat}`;
  const quality = themeConfig?.quality ?? 80;
  // Theme's defaultFormat is the source of truth for templates; if the
  // theme didn't declare one, fall back to a sensible admin key so
  // pickMediaUrl always returns something.
  const defaultFormat =
    themeConfig?.defaultFormat ??
    (themeFormats["medium"] ? "medium" : Object.keys(themeFormats)[0] ?? "admin-preview");
  return { formats: merged, outputMime, quality, defaultFormat };
}
