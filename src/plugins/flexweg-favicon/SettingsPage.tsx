import { useEffect, useRef, useState } from "react";
import { Check, ImageIcon, Loader2, Save, Trash2, Upload, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCmsData } from "../../context/CmsDataContext";
import { toast } from "../../lib/toast";
import {
  FAVICON_FILES,
  FAVICON_FOLDER,
  generateAndUploadFavicons,
  regenerateManifest,
  removeAllFavicons,
} from "./generator";
import type { PluginSettingsPageProps } from "../index";

// Plugin config shape. Stored at
// settings.pluginConfigs["flexweg-favicon"]; merged with defaults by
// PluginSettingsRoute before being handed to this component.
export interface FaviconConfig {
  // Whether favicon files have been generated and the head <link>
  // tags should be injected on every published page.
  enabled: boolean;
  // Cache-bust query parameter component (`?v=<uploadedAt>`) appended
  // to every favicon URL so browsers pick up replacements.
  uploadedAt: number;
  // Per-format upload tracking — each `<link>` tag is only emitted
  // when the corresponding file actually exists on Flexweg.
  hasIco: boolean;
  hasSvg: boolean;
  hasPng96: boolean;
  hasAppleTouch: boolean;
  hasManifest192: boolean;
  hasManifest512: boolean;
  hasManifest: boolean;
  // PWA manifest customization fields. Default to safe values; the
  // user can refine them in the Settings page.
  pwaName: string;
  pwaShortName: string;
  pwaThemeColor: string;
  pwaBackgroundColor: string;
  pwaDisplay: "standalone" | "browser" | "fullscreen" | "minimal-ui";
}

export const DEFAULT_FAVICON_CONFIG: FaviconConfig = {
  enabled: false,
  uploadedAt: 0,
  hasIco: false,
  hasSvg: false,
  hasPng96: false,
  hasAppleTouch: false,
  hasManifest192: false,
  hasManifest512: false,
  hasManifest: false,
  pwaName: "",
  pwaShortName: "",
  pwaThemeColor: "#ffffff",
  pwaBackgroundColor: "#ffffff",
  pwaDisplay: "standalone",
};

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

export function FaviconSettingsPage({
  config,
  save,
}: PluginSettingsPageProps<FaviconConfig>) {
  const { t } = useTranslation("flexweg-favicon");
  const { settings } = useCmsData();

  // PWA fields keep a local draft so saving doesn't fight with
  // Firestore subscription echoes. Manifest-only save uses this draft.
  const [draft, setDraft] = useState<FaviconConfig>(config);
  useEffect(() => setDraft(config), [config]);

  const [generating, setGenerating] = useState(false);
  const [savingManifest, setSavingManifest] = useState(false);
  const [removing, setRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Live preview URL of the largest generated PNG. Cache-busted via
  // `uploadedAt` so a fresh generation immediately swaps in the new
  // image without a hard refresh of the admin.
  const previewUrl =
    config.enabled && config.hasManifest512 && settings.baseUrl
      ? `${settings.baseUrl.replace(/\/+$/, "")}/${FAVICON_FOLDER}/${FAVICON_FILES.manifest512}?v=${config.uploadedAt}`
      : "";

  // Resolve the PWA name fields against the site title when the user
  // hasn't typed anything yet — mirrors what the generator will use
  // if pwaName/pwaShortName stay blank.
  const resolvedPwaName = draft.pwaName || settings.title || "";
  const resolvedPwaShortName =
    draft.pwaShortName ||
    (settings.title ? settings.title.slice(0, 12) : "");

  function patch(p: Partial<FaviconConfig>) {
    setDraft((d) => ({ ...d, ...p }));
  }

  async function handleUpload(file: File) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(t("upload.invalidType"));
      return;
    }
    setGenerating(true);
    try {
      const result = await generateAndUploadFavicons({
        file,
        pwa: {
          name: resolvedPwaName,
          shortName: resolvedPwaShortName,
          themeColor: draft.pwaThemeColor,
          backgroundColor: draft.pwaBackgroundColor,
          display: draft.pwaDisplay,
        },
      });
      const next: FaviconConfig = {
        ...draft,
        enabled: true,
        uploadedAt: Date.now(),
        ...result,
      };
      await save(next);
      setDraft(next);
      toast.success(t("upload.success"));
    } catch (err) {
      console.error("[flexweg-favicon] upload failed:", err);
      toast.error(t("upload.failed"));
    } finally {
      setGenerating(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleRemove() {
    setRemoving(true);
    try {
      await removeAllFavicons();
      const next: FaviconConfig = {
        ...DEFAULT_FAVICON_CONFIG,
        // Preserve PWA customization in case the user re-uploads later.
        pwaName: draft.pwaName,
        pwaShortName: draft.pwaShortName,
        pwaThemeColor: draft.pwaThemeColor,
        pwaBackgroundColor: draft.pwaBackgroundColor,
        pwaDisplay: draft.pwaDisplay,
      };
      await save(next);
      setDraft(next);
      toast.success(t("upload.removed"));
    } catch (err) {
      console.error("[flexweg-favicon] remove failed:", err);
      toast.error(t("upload.failed"));
    } finally {
      setRemoving(false);
    }
  }

  async function handleSaveManifest() {
    setSavingManifest(true);
    try {
      // Refresh the PWA manifest only — the existing PNG/ICO files
      // stay untouched. Useful when the user only tweaks the name or
      // colors after the initial upload.
      if (config.hasManifest || config.enabled) {
        await regenerateManifest({
          pwa: {
            name: resolvedPwaName,
            shortName: resolvedPwaShortName,
            themeColor: draft.pwaThemeColor,
            backgroundColor: draft.pwaBackgroundColor,
            display: draft.pwaDisplay,
          },
        });
      }
      const next: FaviconConfig = {
        ...draft,
        // Persist the PWA fields, refresh the cache-bust so the
        // updated manifest shows up immediately.
        uploadedAt: config.enabled ? Date.now() : draft.uploadedAt,
      };
      await save(next);
      toast.success(t("pwa.saved"));
    } catch (err) {
      console.error("[flexweg-favicon] manifest save failed:", err);
      toast.error(t("pwa.failed"));
    } finally {
      setSavingManifest(false);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-surface-600 dark:text-surface-300">
        {t("description")}
      </p>

      {/* ─── Upload section ────────────────────────────── */}
      <section className="card p-4 space-y-4">
        <h2 className="font-semibold">{t("upload.title")}</h2>
        <p className="text-xs text-surface-500 dark:text-surface-400">
          {t("upload.help")}
        </p>

        <div className="flex items-center gap-4">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt=""
              className="h-24 w-24 rounded ring-1 ring-surface-200 object-cover dark:ring-surface-700"
            />
          ) : (
            <div className="h-24 w-24 rounded bg-surface-100 flex items-center justify-center text-surface-400 text-xs dark:bg-surface-800">
              {t("upload.none")}
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
              disabled={generating || removing}
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : config.enabled ? (
                <ImageIcon className="h-4 w-4" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {generating
                ? t("upload.picking")
                : config.enabled
                  ? t("upload.change")
                  : t("upload.pick")}
            </button>
            {config.enabled && (
              <button
                type="button"
                className="btn-ghost"
                onClick={handleRemove}
                disabled={generating || removing}
              >
                {removing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {removing ? t("upload.removing") : t("upload.remove")}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ─── Status section ────────────────────────────── */}
      <section className="card p-4 space-y-3">
        <h2 className="font-semibold">{t("status.title")}</h2>
        <p className="text-xs text-surface-500 dark:text-surface-400">
          {config.enabled ? t("status.enabled") : t("status.disabled")}
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <FileStatus has={config.hasIco} label={t("status.files.ico")} />
          <FileStatus has={config.hasSvg} label={t("status.files.svg")} />
          <FileStatus has={config.hasPng96} label={t("status.files.png96")} />
          <FileStatus has={config.hasAppleTouch} label={t("status.files.apple")} />
          <FileStatus has={config.hasManifest192} label={t("status.files.manifest192")} />
          <FileStatus has={config.hasManifest512} label={t("status.files.manifest512")} />
          <FileStatus has={config.hasManifest} label={t("status.files.manifest")} />
        </ul>
      </section>

      {/* ─── PWA manifest section ──────────────────────── */}
      <section className="card p-4 space-y-3">
        <h2 className="font-semibold">{t("pwa.title")}</h2>
        <p className="text-xs text-surface-500 dark:text-surface-400">
          {t("pwa.help")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="label">{t("pwa.name")}</label>
            <input
              className="input"
              value={draft.pwaName}
              placeholder={settings.title}
              onChange={(e) => patch({ pwaName: e.target.value })}
            />
            <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
              {t("pwa.nameHelp")}
            </p>
          </div>
          <div>
            <label className="label">{t("pwa.shortName")}</label>
            <input
              className="input"
              maxLength={12}
              value={draft.pwaShortName}
              placeholder={(settings.title ?? "").slice(0, 12)}
              onChange={(e) => patch({ pwaShortName: e.target.value })}
            />
            <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
              {t("pwa.shortNameHelp")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="label">{t("pwa.themeColor")}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="h-9 w-12 rounded border border-surface-200 dark:border-surface-700 cursor-pointer"
                value={draft.pwaThemeColor}
                onChange={(e) => patch({ pwaThemeColor: e.target.value })}
              />
              <input
                type="text"
                className="input flex-1 font-mono text-xs"
                value={draft.pwaThemeColor}
                onChange={(e) => patch({ pwaThemeColor: e.target.value })}
              />
            </div>
            <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
              {t("pwa.themeColorHelp")}
            </p>
          </div>
          <div>
            <label className="label">{t("pwa.backgroundColor")}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="h-9 w-12 rounded border border-surface-200 dark:border-surface-700 cursor-pointer"
                value={draft.pwaBackgroundColor}
                onChange={(e) => patch({ pwaBackgroundColor: e.target.value })}
              />
              <input
                type="text"
                className="input flex-1 font-mono text-xs"
                value={draft.pwaBackgroundColor}
                onChange={(e) => patch({ pwaBackgroundColor: e.target.value })}
              />
            </div>
            <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
              {t("pwa.backgroundColorHelp")}
            </p>
          </div>
        </div>

        <div>
          <label className="label">{t("pwa.display")}</label>
          <select
            className="input max-w-xs"
            value={draft.pwaDisplay}
            onChange={(e) => patch({ pwaDisplay: e.target.value as FaviconConfig["pwaDisplay"] })}
          >
            <option value="standalone">{t("pwa.displayStandalone")}</option>
            <option value="browser">{t("pwa.displayBrowser")}</option>
            <option value="fullscreen">{t("pwa.displayFullscreen")}</option>
            <option value="minimal-ui">{t("pwa.displayMinimalUi")}</option>
          </select>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={handleSaveManifest}
          disabled={savingManifest}
        >
          {savingManifest ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {savingManifest ? t("pwa.saving") : t("pwa.save")}
        </button>
      </section>
    </div>
  );
}

function FileStatus({ has, label }: { has: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2">
      {has ? (
        <Check className="h-4 w-4 text-emerald-500" />
      ) : (
        <X className="h-4 w-4 text-surface-300 dark:text-surface-600" />
      )}
      <span
        className={
          has
            ? "text-surface-900 dark:text-surface-100"
            : "text-surface-400 dark:text-surface-500"
        }
      >
        {label}
      </span>
    </li>
  );
}
