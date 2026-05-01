import { useRef, useState } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../components/layout/PageHeader";
import { useAuth } from "../context/AuthContext";
import { useCmsData } from "../context/CmsDataContext";
import { deleteMedia, updateMedia, uploadMedia } from "../services/media";
import { formatBytes } from "../lib/utils";
import type { Media } from "../core/types";

export function MediaLibraryPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { media } = useCmsData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || !user) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        await uploadMedia(file, user.uid);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

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
              disabled={uploading}
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? t("media.uploading") : t("media.upload")}
            </button>
          </>
        }
      />

      {error && (
        <div className="rounded-lg bg-red-50 text-red-700 ring-1 ring-red-200 px-3 py-2 text-sm mb-4 dark:bg-red-900/30 dark:text-red-300 dark:ring-red-700/50">
          {error}
        </div>
      )}

      {media.length === 0 ? (
        <div className="card p-8 text-center text-sm text-surface-500 dark:text-surface-400">
          {t("media.noMedia")}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {media.map((m) => (
            <MediaCard key={m.id} media={m} />
          ))}
        </div>
      )}
    </div>
  );
}

function MediaCard({ media }: { media: Media }) {
  const { t } = useTranslation();
  const [alt, setAlt] = useState(media.alt ?? "");
  const [caption, setCaption] = useState(media.caption ?? "");
  const [busy, setBusy] = useState(false);

  async function handleSave() {
    setBusy(true);
    try {
      await updateMedia(media.id, { alt, caption });
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${media.name}"?`)) return;
    await deleteMedia(media);
  }

  return (
    <div className="card p-2 space-y-2">
      {media.contentType.startsWith("image/") ? (
        <img src={media.url} alt={media.alt ?? ""} className="w-full aspect-square object-cover rounded-md" />
      ) : (
        <div className="w-full aspect-square flex items-center justify-center bg-surface-100 rounded-md text-xs text-surface-500 dark:bg-surface-800 dark:text-surface-400">
          {media.contentType}
        </div>
      )}
      <p className="text-xs font-medium truncate">{media.name}</p>
      <p className="text-[10px] text-surface-500 dark:text-surface-400">
        {formatBytes(media.size)}
      </p>
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
        <button type="button" className="btn-secondary text-xs flex-1" onClick={handleSave} disabled={busy}>
          {t("common.save")}
        </button>
        <button type="button" className="btn-ghost text-xs" onClick={handleDelete}>
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
