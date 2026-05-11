import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { AlertCircle, Loader2, RotateCcw, Trash2, Upload, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../components/layout/PageHeader";
import { useAuth } from "../context/AuthContext";
import { useCmsData } from "../context/CmsDataContext";
import { deleteMedia, updateMedia, uploadMedia } from "../services/media";
import { ADMIN_THUMB_KEY } from "../services/imageFormats";
import { pickMediaUrl } from "../core/media";
import { formatBytes } from "../lib/utils";
import type { Media, SiteSettings } from "../core/types";

// Locally-tracked upload that hasn't (yet) made it into Firestore. Each
// pending entry stays in state until the page unmounts — its only purpose
// is to provide a stable React key for the card from the moment the user
// picks the file all the way through to the moment the real Firestore doc
// arrives. Keeping the same key across the whole lifecycle is what lets
// React reconcile the card in-place, swapping the loader for the final
// image without unmounting the DOM node (and avoiding the "two cards"
// flicker we saw with two parallel lists).
interface PendingUpload {
  id: string;
  name: string;
  // Raw File so the Retry button can re-run uploadMedia without forcing
  // the user to re-pick the file from their disk.
  file: File;
  status: "uploading" | "uploaded" | "error";
  // Firestore doc id once uploadMedia returned. Looked up against the
  // global media list to surface the final image inside this same card.
  resolvedMediaId?: string;
  errorMessage?: string;
}

// Unified entry rendered as a card. Either the pending side, the media
// side, or both — only the latter for media uploaded by another admin.
interface CardEntry {
  key: string;
  pending?: PendingUpload;
  media?: Media;
}

function newPendingId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function MediaLibraryPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { media, settings } = useCmsData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<PendingUpload[]>([]);

  // Compose the rendered list. Pending entries lead (newest at the top);
  // any media that's already linked to a pending is "claimed" and won't
  // also render as a standalone card. Old media without a pending claim
  // renders below the pending block in upload-time order.
  const entries = useMemo<CardEntry[]>(() => {
    const claimed = new Set<string>();
    const out: CardEntry[] = [];
    for (const p of pending) {
      const linked = p.resolvedMediaId
        ? media.find((m) => m.id === p.resolvedMediaId)
        : undefined;
      if (linked) claimed.add(linked.id);
      out.push({ key: p.id, pending: p, media: linked });
    }
    for (const m of media) {
      if (claimed.has(m.id)) continue;
      out.push({ key: m.id, media: m });
    }
    return out;
  }, [pending, media]);

  async function handleFiles(files: FileList | null) {
    if (!files || !user) return;
    const items: PendingUpload[] = Array.from(files).map((f) => ({
      id: newPendingId(),
      name: f.name,
      file: f,
      status: "uploading",
    }));
    // flushSync forces React to commit this state update before we kick
    // off the uploads. Without it React 18 auto-batches the placeholder
    // insertion together with the Firestore-driven media list update,
    // skipping the "loading" render entirely.
    flushSync(() => {
      setPending((prev) => [...items, ...prev]);
    });

    for (const item of items) {
      await runUpload(item, settings);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function runUpload(item: PendingUpload, currentSettings: SiteSettings | undefined) {
    if (!user) return;
    try {
      const created = await uploadMedia(item.file, user.uid, currentSettings);
      // Flag the pending entry as resolved. The card stays mounted at the
      // same React key — `entries` recomputes and the same card now
      // surfaces the real image instead of the spinner. No unmount, no
      // "two cards" flicker.
      setPending((prev) =>
        prev.map((p) =>
          p.id === item.id ? { ...p, status: "uploaded", resolvedMediaId: created.id } : p,
        ),
      );
    } catch (err) {
      const message = (err as Error).message;
      setPending((prev) =>
        prev.map((p) =>
          p.id === item.id ? { ...p, status: "error", errorMessage: message } : p,
        ),
      );
    }
  }

  function dismissPending(id: string) {
    setPending((prev) => prev.filter((p) => p.id !== id));
  }

  async function retryPending(id: string) {
    const item = pending.find((p) => p.id === id);
    if (!item) return;
    setPending((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "uploading", errorMessage: undefined } : p)),
    );
    await runUpload(item, settings);
  }

  // After a real card is saved/edited/deleted from inside MediaCard, we
  // want the corresponding pending entry to disappear too — otherwise a
  // deleted media would resurrect as a "loading" placeholder because its
  // pending claim no longer matches anything.
  function forgetPending(mediaId: string) {
    setPending((prev) => prev.filter((p) => p.resolvedMediaId !== mediaId));
  }

  const isUploading = pending.some((p) => p.status === "uploading");
  const isEmpty = entries.length === 0;

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title={t("media.title")}
        actions={
          <>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <button
              type="button"
              className="btn-primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Loader2 className={isUploading ? "h-4 w-4 animate-spin" : "hidden"} />
              <Upload className={isUploading ? "hidden" : "h-4 w-4"} />
              <span>{isUploading ? t("media.uploading") : t("media.upload")}</span>
            </button>
          </>
        }
      />

      {isEmpty ? (
        <div className="card p-8 text-center text-sm text-surface-500 dark:text-surface-400">
          {t("media.noMedia")}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {entries.map((entry) => (
            <MediaCard
              key={entry.key}
              entry={entry}
              onRetry={() => entry.pending && retryPending(entry.pending.id)}
              onDismissError={() => entry.pending && dismissPending(entry.pending.id)}
              onDelete={(m) => forgetPending(m.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Single card component handling every state of an upload + media slot:
//   - uploading        : grey square + spinner + filename + "Uploading…"
//   - uploaded         : same shell, but the image fades in inside it as
//                        soon as the linked media doc arrives
//   - error            : red square + message + Retry / Dismiss buttons
//   - committed (pure) : standard editable card with alt/caption inputs
//
// The card is keyed by the pending id (when there is one) for its entire
// lifecycle, so React reconciles the inner content rather than swapping
// out the whole node — the loader literally turns into an image without
// unmounting.
interface MediaCardProps {
  entry: CardEntry;
  onRetry: () => void;
  onDismissError: () => void;
  onDelete: (media: Media) => void;
}

function MediaCard({ entry, onRetry, onDismissError, onDelete }: MediaCardProps) {
  const { t } = useTranslation();
  const m = entry.media;
  const p = entry.pending;
  const isErrored = p?.status === "error";
  const isLoading = !!p && !m && p.status !== "error";
  const displayName = m?.name ?? p?.name ?? "";

  const [alt, setAlt] = useState(m?.alt ?? "");
  const [caption, setCaption] = useState(m?.caption ?? "");
  const [busy, setBusy] = useState(false);

  // Hydrate the editable fields when the linked media first arrives
  // (the card transitions from "uploading" to "committed" without
  // unmounting). Only seeds the inputs when they're still untouched —
  // never clobbers something the user has typed mid-transition.
  useEffect(() => {
    if (!m) return;
    setAlt((cur) => (cur === "" && m.alt ? m.alt : cur));
    setCaption((cur) => (cur === "" && m.caption ? m.caption : cur));
  }, [m?.id]);

  async function handleSave() {
    if (!m) return;
    setBusy(true);
    try {
      await updateMedia(m.id, { alt, caption });
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!m) return;
    if (!window.confirm(`Delete "${m.name}"?`)) return;
    onDelete(m);
    await deleteMedia(m);
  }

  const thumbUrl = m ? pickMediaUrl(m, ADMIN_THUMB_KEY) : "";

  return (
    <div className="card p-2 space-y-2 animate-fade-in">
      <div
        className={
          "relative w-full aspect-square rounded-md overflow-hidden flex items-center justify-center " +
          (isErrored
            ? "bg-red-50 ring-1 ring-red-200 dark:bg-red-900/20 dark:ring-red-800/40"
            : "bg-surface-100 dark:bg-surface-800")
        }
      >
        {/* Image first — once the media is committed it covers the
            placeholder. We render both layers and let the image's
            opacity/coverage hide the spinner. */}
        {m && m.contentType.startsWith("image/") && thumbUrl && (
          <img
            src={thumbUrl}
            alt={m.alt ?? ""}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {isLoading && <Loader2 className="relative h-6 w-6 text-surface-400 animate-spin" />}
        {isErrored && <AlertCircle className="relative h-6 w-6 text-red-500" />}
        {/* Non-image MIME or media without a thumb */}
        {m && !m.contentType.startsWith("image/") && (
          <span className="relative text-xs text-surface-500 dark:text-surface-400 px-2 text-center">
            {m.contentType}
          </span>
        )}
      </div>

      <p className="text-xs font-medium truncate" title={displayName}>
        {displayName}
      </p>
      <p
        className={
          "text-[10px] " +
          (isErrored
            ? "text-red-600 dark:text-red-300"
            : "text-surface-500 dark:text-surface-400")
        }
        title={p?.errorMessage}
      >
        {isErrored
          ? p?.errorMessage ?? t("media.uploadFailed")
          : isLoading
            ? p?.status === "uploaded"
              ? t("media.finalizing")
              : t("media.uploading")
            : m
              ? formatBytes(m.size)
              : ""}
      </p>

      {/* Error controls override the editing controls when the upload
          failed. Once the user dismisses or retries, this branch goes
          away and the loader / committed UI takes over. */}
      {isErrored ? (
        <div className="flex gap-1">
          <button type="button" className="btn-secondary text-xs flex-1" onClick={onRetry}>
            <RotateCcw className="h-3 w-3" />
            {t("media.retry")}
          </button>
          <button type="button" className="btn-ghost text-xs" onClick={onDismissError}>
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : m ? (
        <>
          <input
            type="text"
            className="input text-xs"
            placeholder={t("media.alt")}
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
          />
          <input
            type="text"
            className="input text-xs"
            placeholder={t("media.caption")}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <div className="flex gap-1">
            <button
              type="button"
              className="btn-secondary text-xs flex-1"
              onClick={handleSave}
              disabled={busy}
            >
              {t("common.save")}
            </button>
            <button type="button" className="btn-ghost text-xs" onClick={handleDelete}>
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
