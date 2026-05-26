// SQLite implementation of the media service. The image-processing
// pipeline (services/imageProcessing.ts) is browser-side and stays
// unchanged — only the metadata CRUD is dispatched. The actual file
// uploads to Flexweg go through services/flexwegApi.ts which is
// backend-agnostic.

import { sqlExec, sqlQuery } from "./client";
import { notifyPotentialChange, subscribeWithPolling } from "./subscriptions";
import { deleteFile, deleteFolder, publicUrlFor, uploadFile } from "../flexwegApi";
import { ADMIN_FORMATS } from "../imageFormats";
import {
  blobToBase64,
  extensionForMime,
  mergeFormats,
  processImage,
  validateInputExtension,
} from "../imageProcessing";
import { getActiveTheme } from "../../themes";
import { normalizeMediaSlug } from "../../core/slug";
import type {
  ImageFormatConfig,
  Media,
  MediaVariant,
  SiteSettings,
} from "../../core/types";

export const MAX_MEDIA_SIZE_BYTES = 25 * 1024 * 1024;

// Mirrors firebase/media.ts. Kept loose enough to cover the common
// photo formats; the canvas decode does the real safety check.
const DEFAULT_INPUT_FORMATS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

interface MediaRow {
  id: string;
  name: string;
  content_type: string;
  size: number;
  storage_base: string | null;
  formats: string | null;
  default_format: string | null;
  alt: string | null;
  caption: string | null;
  uploaded_at: number;
  uploaded_by: string;
  storage_path: string | null;
  url: string | null;
}

function parseFormats(s: string | null): Record<string, MediaVariant> | undefined {
  if (!s) return undefined;
  try {
    const v = JSON.parse(s);
    return v && typeof v === "object" ? (v as Record<string, MediaVariant>) : undefined;
  } catch {
    return undefined;
  }
}

function rowToMedia(r: MediaRow): Media {
  const media: Media = {
    id: r.id,
    name: r.name,
    contentType: r.content_type,
    size: r.size,
    uploadedAt: r.uploaded_at,
    uploadedBy: r.uploaded_by,
  };
  if (r.storage_base) media.storageBase = r.storage_base;
  const formats = parseFormats(r.formats);
  if (formats) media.formats = formats;
  if (r.default_format) media.defaultFormat = r.default_format;
  if (r.alt) media.alt = r.alt;
  if (r.caption) media.caption = r.caption;
  if (r.storage_path) media.storagePath = r.storage_path;
  if (r.url) media.url = r.url;
  return media;
}

export interface ValidationOk {
  ok: true;
}
export interface ValidationFail {
  ok: false;
  reason: string;
}

export function validateMediaFile(
  file: File,
  inputFormats: string[] = DEFAULT_INPUT_FORMATS,
): ValidationOk | ValidationFail {
  if (file.size > MAX_MEDIA_SIZE_BYTES) {
    return {
      ok: false,
      reason: `"${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(1)} MB > ${(MAX_MEDIA_SIZE_BYTES / 1024 / 1024).toFixed(0)} MB).`,
    };
  }
  const reason = validateInputExtension(file.name, inputFormats);
  if (reason) return { ok: false, reason };
  return { ok: true };
}

export function subscribeToMedia(
  onChange: (items: Media[]) => void,
  onError?: (err: Error) => void,
): () => void {
  return subscribeWithPolling(
    async () => {
      const { rows } = await sqlQuery<MediaRow>(
        "SELECT * FROM media ORDER BY uploaded_at DESC",
        [],
      );
      return rows.map(rowToMedia);
    },
    onChange,
    onError,
  );
}

export async function listAllMedia(): Promise<Media[]> {
  const { rows } = await sqlQuery<MediaRow>(
    "SELECT * FROM media ORDER BY uploaded_at DESC",
    [],
  );
  return rows.map(rowToMedia);
}

function buildStorageBase(filename: string): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const slug = normalizeMediaSlug(filename);
  return `media/${yyyy}/${mm}/${slug}`;
}

function resolveImageFormatConfig(settings: SiteSettings | undefined): ImageFormatConfig | undefined {
  try {
    const theme = getActiveTheme(settings?.activeThemeId ?? "default");
    return theme.imageFormats;
  } catch {
    return undefined;
  }
}

function genId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// Mirrors firebase/media.ts.uploadMedia — pipelined, browser-side
// variant generation, Flexweg Files API for the uploads, SQLite for
// the metadata row.
export async function uploadMedia(
  file: File,
  uploadedBy: string,
  settings?: SiteSettings,
): Promise<Media> {
  const themeConfig = resolveImageFormatConfig(settings);
  const validation = validateMediaFile(file, themeConfig?.inputFormats ?? DEFAULT_INPUT_FORMATS);
  if (!validation.ok) throw new Error(validation.reason);

  const merged = mergeFormats(ADMIN_FORMATS, themeConfig);
  const variants = await processImage(file, {
    formats: merged.formats,
    outputMime: merged.outputMime,
    quality: merged.quality,
  });
  const ext = extensionForMime(merged.outputMime);

  const storageBase = buildStorageBase(file.name);
  const id = genId();
  const formats: Record<string, MediaVariant> = {};
  let totalBytes = 0;

  for (const variant of variants) {
    const path = `${storageBase}/${variant.name}.${ext}`;
    const content = await blobToBase64(variant.blob);
    await uploadFile({ path, content, encoding: "base64" });
    const url = await publicUrlFor(path);
    formats[variant.name] = {
      url,
      width: variant.width,
      height: variant.height,
      bytes: variant.bytes,
    };
    totalBytes += variant.bytes;
  }

  const media: Media = {
    id,
    name: file.name,
    contentType: merged.outputMime,
    size: totalBytes,
    storageBase,
    formats,
    defaultFormat: merged.defaultFormat,
    uploadedAt: Date.now(),
    uploadedBy,
  };
  await sqlExec(
    `INSERT INTO media (
      id, name, content_type, size, storage_base,
      formats, default_format, alt, caption,
      uploaded_at, uploaded_by, storage_path, url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      media.id,
      media.name,
      media.contentType,
      media.size,
      media.storageBase ?? null,
      media.formats ? JSON.stringify(media.formats) : null,
      media.defaultFormat ?? null,
      null,
      null,
      media.uploadedAt,
      media.uploadedBy,
      null,
      null,
    ],
  );
  notifyPotentialChange();
  return media;
}

export async function updateMedia(
  id: string,
  patch: Partial<Pick<Media, "alt" | "caption">>,
): Promise<void> {
  const sets: string[] = [];
  const params: unknown[] = [];
  if (patch.alt !== undefined) {
    sets.push("alt = ?");
    params.push(patch.alt);
  }
  if (patch.caption !== undefined) {
    sets.push("caption = ?");
    params.push(patch.caption);
  }
  if (sets.length === 0) return;
  params.push(id);
  await sqlExec(`UPDATE media SET ${sets.join(", ")} WHERE id = ?`, params);
  notifyPotentialChange();
}

export async function deleteMedia(media: Media): Promise<void> {
  try {
    if (media.storageBase) {
      await deleteFolder(media.storageBase);
    } else if (media.storagePath) {
      await deleteFile(media.storagePath);
    }
  } catch (err) {
    console.warn("Flexweg media delete failed (continuing):", err);
  }
  await sqlExec("DELETE FROM media WHERE id = ?", [media.id]);
  notifyPotentialChange();
}
