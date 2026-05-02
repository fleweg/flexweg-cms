import { useRef, useState } from "react";
import { ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCmsData } from "../../context/CmsDataContext";
import { toast } from "../../lib/toast";
import { publishMenuJson } from "../../services/menuPublisher";
import type { ThemeSettingsPageProps } from "../types";
import { logoPath, removeThemeLogo, uploadThemeLogo } from "./logo";

// Default theme config shape. Stored at
// settings.themeConfigs["default"]; merged with these defaults by
// ThemeSettingsRoute before being handed to this component.
export interface DefaultThemeConfig {
  // Whether a logo has been uploaded. The header swaps the text
  // wordmark for the image when this is true.
  logoEnabled: boolean;
  // Milliseconds since epoch of the last logo upload — used as a
  // cache-bust query in the public-side logo URL so the new logo
  // shows up immediately after re-publishing /data/menu.json.
  logoUpdatedAt: number;
}

export const DEFAULT_THEME_CONFIG: DefaultThemeConfig = {
  logoEnabled: false,
  logoUpdatedAt: 0,
};

// Logo box dimensions. Image is letterboxed inside this box (no
// cropping) so wide / tall logos both stay legible.
const LOGO_WIDTH = 480;
const LOGO_HEIGHT = 144;
const LOGO_FIT: "cover" | "contain" = "contain";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function DefaultThemeSettingsPage({
  config,
  save,
}: ThemeSettingsPageProps<DefaultThemeConfig>) {
  const { t } = useTranslation("theme-default");
  const { settings, posts, pages, terms } = useCmsData();
  const [activeTab, setActiveTab] = useState<"general">("general");
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Live preview URL of the currently-stored logo. Cache-busted via
  // the same timestamp the publisher uses, so a fresh upload shows
  // the new image without needing a hard refresh of the admin.
  const previewUrl =
    config.logoEnabled && settings.baseUrl
      ? `${settings.baseUrl.replace(/\/+$/, "")}/${logoPath("default")}?v=${config.logoUpdatedAt}`
      : "";

  // Re-publishes /data/menu.json so the public site picks up the
  // new branding block. Cheap (single small JSON upload) — much
  // better UX than asking the user to Force Regenerate.
  async function refreshMenuJson(nextConfig: DefaultThemeConfig) {
    const patchedSettings = {
      ...settings,
      themeConfigs: { ...settings.themeConfigs, default: nextConfig },
    };
    try {
      await publishMenuJson(patchedSettings, posts, pages, terms);
    } catch (err) {
      console.error("[theme-default] menu.json refresh failed:", err);
    }
  }

  async function handleUpload(file: File) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(t("logo.invalidType"));
      return;
    }
    setUploading(true);
    try {
      await uploadThemeLogo({
        themeId: "default",
        file,
        width: LOGO_WIDTH,
        height: LOGO_HEIGHT,
        fit: LOGO_FIT,
      });
      const next: DefaultThemeConfig = {
        logoEnabled: true,
        logoUpdatedAt: Date.now(),
      };
      await save(next);
      await refreshMenuJson(next);
      toast.success(t("logo.saved"));
    } catch (err) {
      console.error("[theme-default] logo upload failed:", err);
      toast.error(t("logo.failed"));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleRemove() {
    setRemoving(true);
    try {
      await removeThemeLogo("default");
      const next: DefaultThemeConfig = {
        logoEnabled: false,
        logoUpdatedAt: 0,
      };
      await save(next);
      await refreshMenuJson(next);
      toast.success(t("logo.removed"));
    } catch (err) {
      console.error("[theme-default] logo remove failed:", err);
      toast.error(t("logo.failed"));
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-surface-600 dark:text-surface-300">
        {t("description")}
      </p>

      {/* Tab strip — single "General" tab today; structured this way
          so future settings sections (typography, layout, plugins…)
          plug in without restructuring the page. */}
      <nav
        className="flex flex-wrap gap-1 border-b border-surface-200 dark:border-surface-800"
        aria-label={t("title")}
      >
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={
            activeTab === "general"
              ? "px-3 py-2 text-sm font-medium -mb-px border-b-2 border-blue-600 text-surface-900 dark:text-surface-50"
              : "px-3 py-2 text-sm font-medium -mb-px border-b-2 border-transparent text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100"
          }
        >
          {t("tabs.general")}
        </button>
      </nav>

      {activeTab === "general" && (
        <section className="card p-4 space-y-4">
          <h2 className="font-semibold">{t("logo.title")}</h2>
          <p className="text-xs text-surface-500 dark:text-surface-400">
            {t("logo.help", { width: LOGO_WIDTH, height: LOGO_HEIGHT })}
          </p>

          <div className="flex items-center gap-4">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt=""
                className="h-20 w-auto max-w-[240px] rounded bg-white p-2 ring-1 ring-surface-200 object-contain dark:ring-surface-700"
              />
            ) : (
              <div className="h-20 w-40 rounded bg-surface-100 flex items-center justify-center text-surface-400 text-xs dark:bg-surface-800">
                {t("logo.none")}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_TYPES.join(",")}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleUpload(file);
                }}
              />
              <button
                type="button"
                className="btn-secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || removing}
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : config.logoEnabled ? (
                  <ImageIcon className="h-4 w-4" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {uploading
                  ? t("logo.uploading")
                  : config.logoEnabled
                    ? t("logo.change")
                    : t("logo.upload")}
              </button>
              {config.logoEnabled && (
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={handleRemove}
                  disabled={uploading || removing}
                >
                  {removing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  {removing ? t("logo.removing") : t("logo.remove")}
                </button>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
