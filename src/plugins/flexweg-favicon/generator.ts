// Favicon generation pipeline. Takes a single user-uploaded image and
// produces every variant the modern web expects, then uploads them to
// `favicon/...` on Flexweg via the standard files API.
//
// Browser-only — leans on `createImageBitmap` for decoding (handles
// PNG/JPG/WebP/SVG transparently) and `OffscreenCanvas` (or a regular
// HTMLCanvasElement fallback) for resizing. Output is always PNG except
// for the .ico (custom encoder) and .svg (passthrough only when the
// input was already an SVG).

import { deleteFile, deleteFolder, uploadFile } from "../../services/flexwegApi";
import { encodeIco, type IcoImage } from "./icoEncoder";

export const FAVICON_FOLDER = "favicon";

// File names we generate. Path under FAVICON_FOLDER.
export const FAVICON_FILES = {
  png96: "favicon-96x96.png",
  apple: "apple-touch-icon.png",
  manifest192: "web-app-manifest-192x192.png",
  manifest512: "web-app-manifest-512x512.png",
  ico: "favicon.ico",
  svg: "favicon.svg",
  manifest: "site.webmanifest",
} as const;

// PWA manifest customization handed in by the settings page.
export interface PwaManifestInput {
  name: string;
  shortName: string;
  themeColor: string;
  backgroundColor: string;
  display: "standalone" | "browser" | "fullscreen" | "minimal-ui";
}

// Result returned to the settings page so it can persist the
// per-format flags into the plugin config and refresh the head
// injection accordingly.
export interface FaviconUploadResult {
  hasIco: boolean;
  hasSvg: boolean;
  hasPng96: boolean;
  hasAppleTouch: boolean;
  hasManifest192: boolean;
  hasManifest512: boolean;
  hasManifest: boolean;
}

// ─── Canvas helpers ────────────────────────────────────────────────

function makeCanvas(width: number, height: number): HTMLCanvasElement | OffscreenCanvas {
  if (typeof OffscreenCanvas !== "undefined") {
    return new OffscreenCanvas(width, height);
  }
  return Object.assign(document.createElement("canvas"), { width, height });
}

async function canvasToBlob(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  mime: string,
  quality?: number,
): Promise<Blob> {
  if ("convertToBlob" in canvas) {
    return canvas.convertToBlob({ type: mime, quality });
  }
  return await new Promise<Blob>((resolve, reject) => {
    (canvas as HTMLCanvasElement).toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Failed to encode image."))),
      mime,
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

async function blobToText(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("FileReader failed."));
    reader.readAsText(blob);
  });
}

// Center-crop + resize the bitmap into a square box of `size`. Used
// for every PNG variant. `background` paints behind the image — null
// keeps transparency (needed for maskable PWA icons; also fine for
// favicon-96x96). The Apple touch icon uses a solid color because
// iOS used to apply a black mask on transparent corners.
function renderSquare(
  bitmap: ImageBitmap,
  size: number,
  background: string | null,
): HTMLCanvasElement | OffscreenCanvas {
  const canvas = makeCanvas(size, size);
  const ctx = (canvas as OffscreenCanvas).getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable.");
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, size, size);
  } else {
    ctx.clearRect(0, 0, size, size);
  }
  // Cover crop: scale the source so the smaller side fills the box,
  // then center it.
  const scale = Math.max(size / bitmap.width, size / bitmap.height);
  const sw = size / scale;
  const sh = size / scale;
  const sx = (bitmap.width - sw) / 2;
  const sy = (bitmap.height - sh) / 2;
  ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, size, size);
  return canvas;
}

async function squareToPngBlob(
  bitmap: ImageBitmap,
  size: number,
  background: string | null,
): Promise<Blob> {
  const canvas = renderSquare(bitmap, size, background);
  return canvasToBlob(canvas, "image/png");
}

async function blobToBytes(blob: Blob): Promise<Uint8Array> {
  const buf = await blob.arrayBuffer();
  return new Uint8Array(buf);
}

function favPath(file: string): string {
  return `${FAVICON_FOLDER}/${file}`;
}

// ─── Manifest builder ──────────────────────────────────────────────

function buildSiteWebmanifest(input: PwaManifestInput): string {
  const manifest = {
    name: input.name,
    short_name: input.shortName,
    icons: [
      {
        src: `/${favPath(FAVICON_FILES.manifest192)}`,
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: `/${favPath(FAVICON_FILES.manifest512)}`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    theme_color: input.themeColor,
    background_color: input.backgroundColor,
    display: input.display,
  };
  return JSON.stringify(manifest, null, 2);
}

// ─── Public entry points ───────────────────────────────────────────

// Full pipeline: takes the user's source image, produces every variant
// and uploads them. Skips the SVG step unless the source is already an
// SVG (we can't vectorize a raster).
export async function generateAndUploadFavicons(args: {
  file: File;
  pwa: PwaManifestInput;
}): Promise<FaviconUploadResult> {
  const isSvgSource = args.file.type === "image/svg+xml";
  const bitmap = await createImageBitmap(args.file);

  // PNG variants. The Apple touch icon gets a solid white fill
  // because Safari's older renderers darkened transparent corners.
  // The other variants stay transparent for cleaner integration.
  const png96 = await squareToPngBlob(bitmap, 96, null);
  const appleTouch = await squareToPngBlob(bitmap, 180, "#ffffff");
  const manifest192 = await squareToPngBlob(bitmap, 192, null);
  const manifest512 = await squareToPngBlob(bitmap, 512, null);

  // ICO multi-size — 16, 32 and 48 are enough for legacy browsers and
  // taskbar icons. Each entry is a PNG payload (Vista+ supports it).
  const ico16 = await squareToPngBlob(bitmap, 16, null);
  const ico32 = await squareToPngBlob(bitmap, 32, null);
  const ico48 = await squareToPngBlob(bitmap, 48, null);
  const icoEntries: IcoImage[] = [
    { size: 16, png: await blobToBytes(ico16) },
    { size: 32, png: await blobToBytes(ico32) },
    { size: 48, png: await blobToBytes(ico48) },
  ];
  const icoBytes = encodeIco(icoEntries);
  // Wrap in a Blob so we can run it through the same base64 helper.
  const icoBlob = new Blob([icoBytes as BlobPart], { type: "image/x-icon" });

  bitmap.close?.();

  // Uploads — we run sequentially to avoid hammering the API.
  await uploadFile({
    path: favPath(FAVICON_FILES.png96),
    content: await blobToBase64(png96),
    encoding: "base64",
  });
  await uploadFile({
    path: favPath(FAVICON_FILES.apple),
    content: await blobToBase64(appleTouch),
    encoding: "base64",
  });
  await uploadFile({
    path: favPath(FAVICON_FILES.manifest192),
    content: await blobToBase64(manifest192),
    encoding: "base64",
  });
  await uploadFile({
    path: favPath(FAVICON_FILES.manifest512),
    content: await blobToBase64(manifest512),
    encoding: "base64",
  });
  await uploadFile({
    path: favPath(FAVICON_FILES.ico),
    content: await blobToBase64(icoBlob),
    encoding: "base64",
  });

  // SVG passthrough — only when the source was already vector. Trying
  // to wrap a raster in <svg><image href="data:..."/></svg> would
  // produce a fake-vector that doesn't scale crisply, so we skip it.
  let hasSvg = false;
  if (isSvgSource) {
    const svgText = await blobToText(args.file);
    await uploadFile({
      path: favPath(FAVICON_FILES.svg),
      content: svgText,
      encoding: "utf-8",
    });
    hasSvg = true;
  }

  // PWA manifest last so all the icons it references are already up.
  await uploadFile({
    path: favPath(FAVICON_FILES.manifest),
    content: buildSiteWebmanifest(args.pwa),
    encoding: "utf-8",
  });

  return {
    hasIco: true,
    hasSvg,
    hasPng96: true,
    hasAppleTouch: true,
    hasManifest192: true,
    hasManifest512: true,
    hasManifest: true,
  };
}

// Manifest-only re-upload. Used when the admin tweaks PWA name /
// colors / display mode without changing the source image — much
// faster than the full pipeline.
export async function regenerateManifest(args: { pwa: PwaManifestInput }): Promise<void> {
  await uploadFile({
    path: favPath(FAVICON_FILES.manifest),
    content: buildSiteWebmanifest(args.pwa),
    encoding: "utf-8",
  });
}

// Wipes every favicon file. Path-by-path with a single folder delete
// at the end so even legacy uploads (e.g. user-renamed files we don't
// know about) get cleaned up.
export async function removeAllFavicons(): Promise<void> {
  // Try the bulk-delete first. flexwegApi already silences 404, so a
  // never-uploaded plugin won't surface a noisy error.
  try {
    await deleteFolder(FAVICON_FOLDER);
    return;
  } catch {
    // Some Flexweg accounts may not have the delete-folder endpoint
    // enabled — fall back to per-file deletes.
  }
  for (const file of Object.values(FAVICON_FILES)) {
    try {
      await deleteFile(favPath(file));
    } catch {
      // Already gone or transient — keep cleaning.
    }
  }
}
