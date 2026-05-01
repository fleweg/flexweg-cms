import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { collections, getDb } from "./firebase";
import { deleteFile, deleteFolder, publicUrlFor, uploadFile } from "./flexwegApi";
import { ADMIN_FORMATS } from "./imageFormats";
import {
  blobToBase64,
  extensionForMime,
  mergeFormats,
  processImage,
  validateInputExtension,
} from "./imageProcessing";
import { getActiveTheme } from "../themes";
import { normalizeMediaSlug } from "../core/slug";
import type { ImageFormatConfig, Media, MediaVariant, SiteSettings } from "../core/types";

export const MAX_MEDIA_SIZE_BYTES = 25 * 1024 * 1024;

// Default input allow-list when the active theme didn't declare one. Kept
// loose enough to cover the common photo formats; the real safety check
// happens in the canvas decode (`createImageBitmap` will reject anything
// the browser can't read).
const DEFAULT_INPUT_FORMATS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

const mediaCollection = () => collection(getDb(), collections.media);
const mediaDoc = (id: string) => doc(getDb(), collections.media, id);

function newId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
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
  const q = query(mediaCollection(), orderBy("uploadedAt", "desc"));
  return onSnapshot(
    q,
    (snap) => onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Media)),
    onError,
  );
}

export async function listAllMedia(): Promise<Media[]> {
  const snap = await getDocs(query(mediaCollection(), orderBy("uploadedAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Media);
}

// Builds the storage prefix for a new asset. Year/month organisation
// keeps the file explorer manageable; the random hex suffix on the slug
// guarantees uniqueness even if two users upload "photo.jpg" in the same
// month.
function buildStorageBase(filename: string): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const slug = normalizeMediaSlug(filename);
  return `media/${yyyy}/${mm}/${slug}`;
}

// Active-theme image format catalog, with sensible fallbacks for sites
// that haven't activated a theme yet. Resolved synchronously so the
// upload UI can show progress before the first byte is sent.
function resolveImageFormatConfig(settings: SiteSettings | undefined): ImageFormatConfig | undefined {
  try {
    const theme = getActiveTheme(settings?.activeThemeId ?? "default");
    return theme.imageFormats;
  } catch {
    return undefined;
  }
}

// Uploads a single image and produces every variant the active theme + the
// admin both want. The original file is intentionally never stored.
//
// Pipeline:
//   1. Validate extension against the theme's inputFormats (or a default).
//   2. Decode + resize on the client into N blobs (one per variant).
//   3. POST each variant to Flexweg under media/yyyy/mm/<slug>/<name>.<ext>.
//   4. Persist the metadata in Firestore.
//
// Caller passes the SiteSettings so we can pick the active theme without
// reaching into a React context. The settings argument also covers the
// case where uploads happen during onboarding before settings are stable.
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
  const id = newId();
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
  await setDoc(mediaDoc(id), media);
  return media;
}

export async function updateMedia(
  id: string,
  patch: Partial<Pick<Media, "alt" | "caption">>,
): Promise<void> {
  const update: Record<string, unknown> = {};
  if (patch.alt !== undefined) update.alt = patch.alt;
  if (patch.caption !== undefined) update.caption = patch.caption;
  if (Object.keys(update).length === 0) return;
  await updateDoc(mediaDoc(id), update);
}

// Tries to wipe every Flexweg artifact tied to this asset, then drops the
// Firestore doc. Order matters: even if the public-side cleanup fails, we
// only want to leave the source-of-truth alive. A 404 on the delete call
// is treated as success inside flexwegApi (already-gone == desired state).
export async function deleteMedia(media: Media): Promise<void> {
  try {
    if (media.storageBase) {
      // New-shape media: one folder holds every variant — single API call.
      await deleteFolder(media.storageBase);
    } else if (media.storagePath) {
      // Legacy media: a single file at a flat path.
      await deleteFile(media.storagePath);
    }
  } catch (err) {
    console.warn("Flexweg media delete failed (continuing):", err);
  }
  await deleteDoc(mediaDoc(media.id));
}
