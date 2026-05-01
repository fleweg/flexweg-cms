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
import { deleteFile, fileToBase64, publicUrlFor, uploadFile } from "./flexwegApi";
import type { Media } from "../core/types";

export const MAX_MEDIA_SIZE_BYTES = 10 * 1024 * 1024;

// Same allowlist as the kanban project — what Flexweg's Files API accepts.
const ALLOWED_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "svg",
  "webp",
  "ico",
  "pdf",
]);

const mediaCollection = () => collection(getDb(), collections.media);
const mediaDoc = (id: string) => doc(getDb(), collections.media, id);

function newId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sanitizeForPath(name: string): string {
  return name.replace(/[^\w.\-+@()]/g, "_").slice(0, 200);
}

export interface ValidationOk {
  ok: true;
}
export interface ValidationFail {
  ok: false;
  reason: string;
}

export function validateMediaFile(file: File): ValidationOk | ValidationFail {
  if (file.size > MAX_MEDIA_SIZE_BYTES) {
    return {
      ok: false,
      reason: `"${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(1)} MB > 10 MB).`,
    };
  }
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
    return { ok: false, reason: `"${file.name}" has an unsupported type.` };
  }
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

// Uploads a file to Flexweg and persists the metadata in Firestore. Path
// shape is "media/<yyyy>/<mm>/<id>-<filename>" so the media library survives
// being browsed via Flexweg's file explorer too.
export async function uploadMedia(file: File, uploadedBy: string): Promise<Media> {
  const validation = validateMediaFile(file);
  if (!validation.ok) throw new Error(validation.reason);

  const id = newId();
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const path = `media/${yyyy}/${mm}/${id}-${sanitizeForPath(file.name)}`;
  const content = await fileToBase64(file);

  await uploadFile({ path, content, encoding: "base64" });
  const url = await publicUrlFor(path);

  const media: Media = {
    id,
    name: file.name,
    contentType: file.type || "application/octet-stream",
    size: file.size,
    storagePath: path,
    url,
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

// Remove from Flexweg first (best-effort), then drop the Firestore doc. A
// 404 on Flexweg is treated as success inside `deleteFile`, so re-running
// after a partial failure is safe.
export async function deleteMedia(media: Media): Promise<void> {
  try {
    await deleteFile(media.storagePath);
  } catch (err) {
    console.warn("Flexweg media delete failed (continuing):", err);
  }
  await deleteDoc(mediaDoc(media.id));
}
