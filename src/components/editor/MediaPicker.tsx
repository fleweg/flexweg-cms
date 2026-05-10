import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { useCmsData } from "../../context/CmsDataContext";
import { ADMIN_THUMB_KEY } from "../../services/imageFormats";
import { uploadMedia } from "../../services/media";
import { pickMediaUrl } from "../../core/media";
import { toast } from "../../lib/toast";
import type { Media } from "../../core/types";

interface MediaPickerProps {
  onPick: (media: Media) => void;
  onClose: () => void;
}

export function MediaPicker({ onPick, onClose }: MediaPickerProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { media, settings } = useCmsData();
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = search
    ? media.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
    : media;

  // Inline upload — uploads sequentially, picks the LAST committed media
  // automatically so the user lands back in their post with the new
  // image already inserted. Failures toast through the standard funnel.
  async function handleFiles(files: FileList | null) {
    if (!files || !user || files.length === 0) return;
    setUploading(true);
    let lastUploaded: Media | undefined;
    try {
      for (const file of Array.from(files)) {
        try {
          lastUploaded = await uploadMedia(file, user.uid, settings);
        } catch (err) {
          toast.error((err as Error).message);
        }
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    if (lastUploaded) onPick(lastUploaded);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in">
      <div className="card w-full max-w-3xl max-h-[80vh] flex flex-col animate-scale-in">
        <div className="flex items-center justify-between gap-3 border-b border-surface-200 px-4 py-3 dark:border-surface-700">
          <h2 className="text-sm font-semibold">{t("media.title")}</h2>
          <input
            type="text"
            className="input max-w-xs"
            placeholder={t("common.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploading ? t("media.uploading") : t("media.upload")}
          </button>
          <button type="button" className="btn-ghost" onClick={onClose}>
            {t("common.close")}
          </button>
        </div>
        <div className="overflow-y-auto p-3">
          {filtered.length === 0 ? (
            <p className="text-sm text-surface-500 text-center py-12 dark:text-surface-400">
              {t("media.noMedia")}
            </p>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {filtered.map((m) => {
                const thumbUrl = pickMediaUrl(m, ADMIN_THUMB_KEY);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onPick(m)}
                    className="relative aspect-square overflow-hidden rounded-lg ring-1 ring-surface-200 hover:ring-blue-500 transition-all dark:ring-surface-700"
                  >
                    {m.contentType.startsWith("image/") && thumbUrl ? (
                      <img src={thumbUrl} alt={m.alt ?? m.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center text-xs text-surface-500 bg-surface-100 dark:bg-surface-800">
                        {m.name}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
