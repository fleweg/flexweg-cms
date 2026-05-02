import { useRef, useState } from "react";
import {
  ImageIcon,
  Loader2,
  Palette,
  RotateCcw,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCmsData } from "../../context/CmsDataContext";
import { toast } from "../../lib/toast";
import { publishMenuJson } from "../../services/menuPublisher";
import type { ThemeSettingsPageProps } from "../types";
import { manifest } from "./manifest";
import { logoPath, removeThemeLogo, uploadThemeLogo } from "./logo";
import {
  applyAndUploadCustomCss,
  DEFAULT_FONT_SANS,
  DEFAULT_FONT_SERIF,
  DEFAULT_STYLE,
  FONT_PRESETS,
  THEME_VAR_GROUPS,
  THEME_VAR_SPECS,
  type StyleOverrides,
  type ThemeVarGroup,
  type ThemeVarSpec,
} from "./style";
import type { DefaultThemeConfig } from "./config";

// Logo box dimensions. Image is letterboxed inside this box (no
// cropping) so wide / tall logos both stay legible.
const LOGO_WIDTH = 480;
const LOGO_HEIGHT = 144;
const LOGO_FIT: "cover" | "contain" = "contain";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type ActiveTab = "general" | "style";

export function DefaultThemeSettingsPage({
  config,
  save,
}: ThemeSettingsPageProps<DefaultThemeConfig>) {
  const { t } = useTranslation("theme-default");
  const [activeTab, setActiveTab] = useState<ActiveTab>("general");

  return (
    <div className="space-y-6">
      <p className="text-sm text-surface-600 dark:text-surface-300">
        {t("description")}
      </p>

      <nav
        className="flex flex-wrap gap-1 border-b border-surface-200 dark:border-surface-800"
        aria-label={t("title")}
      >
        <TabButton
          active={activeTab === "general"}
          onClick={() => setActiveTab("general")}
          label={t("tabs.general")}
        />
        <TabButton
          active={activeTab === "style"}
          onClick={() => setActiveTab("style")}
          label={t("tabs.style")}
        />
      </nav>

      {activeTab === "general" && <GeneralTab config={config} save={save} />}
      {activeTab === "style" && <StyleTab config={config} save={save} />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "px-3 py-2 text-sm font-medium -mb-px border-b-2 border-blue-600 text-surface-900 dark:text-surface-50"
          : "px-3 py-2 text-sm font-medium -mb-px border-b-2 border-transparent text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100"
      }
    >
      {label}
    </button>
  );
}

// ─── General tab — logo upload ─────────────────────────────────────

function GeneralTab({
  config,
  save,
}: ThemeSettingsPageProps<DefaultThemeConfig>) {
  const { t } = useTranslation("theme-default");
  const { settings, posts, pages, terms } = useCmsData();
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const previewUrl =
    config.logoEnabled && settings.baseUrl
      ? `${settings.baseUrl.replace(/\/+$/, "")}/${logoPath("default")}?v=${config.logoUpdatedAt}`
      : "";

  // Re-publishes /data/menu.json so the public site picks up the new
  // branding block. Cheap (single small JSON upload) — much better UX
  // than asking the user to Force Regenerate.
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
        ...config,
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
        ...config,
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
  );
}

// ─── Style tab — colors + fonts + spacing + radius ────────────────

function StyleTab({
  config,
  save,
}: ThemeSettingsPageProps<DefaultThemeConfig>) {
  const { t } = useTranslation("theme-default");
  // Local draft so the form doesn't fight with Firestore subscription
  // echoes. Save & apply commits this back to the config.
  const [draft, setDraft] = useState<StyleOverrides>(config.style ?? DEFAULT_STYLE);
  const [busy, setBusy] = useState(false);
  const [resetting, setResetting] = useState(false);

  function setVar(name: string, value: string) {
    setDraft((d) => ({ ...d, vars: { ...d.vars, [name]: value } }));
  }

  function clearVar(name: string) {
    setDraft((d) => {
      const next = { ...d.vars };
      delete next[name];
      return { ...d, vars: next };
    });
  }

  async function handleSave() {
    setBusy(true);
    try {
      const next: DefaultThemeConfig = { ...config, style: draft };
      await save(next);
      // Regenerate and upload the public CSS using the new overrides.
      // Path is the same as the baseline so every published page
      // picks up the change on its next load (modulo browser cache).
      await applyAndUploadCustomCss({
        themeId: "default",
        baseCssText: manifest.cssText,
        style: draft,
      });
      toast.success(t("style.saved"));
    } catch (err) {
      console.error("[theme-default] style save failed:", err);
      toast.error(t("style.failed"));
    } finally {
      setBusy(false);
    }
  }

  async function handleReset() {
    setResetting(true);
    try {
      const next: DefaultThemeConfig = { ...config, style: DEFAULT_STYLE };
      setDraft(DEFAULT_STYLE);
      await save(next);
      // Push the baseline CSS — buildCustomCss returns it untouched
      // when style equals defaults.
      await applyAndUploadCustomCss({
        themeId: "default",
        baseCssText: manifest.cssText,
        style: DEFAULT_STYLE,
      });
      toast.success(t("style.reset"));
    } catch (err) {
      console.error("[theme-default] style reset failed:", err);
      toast.error(t("style.failed"));
    } finally {
      setResetting(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-surface-500 dark:text-surface-400">
        {t("style.help")}
      </p>

      {THEME_VAR_GROUPS.map((group) => (
        <VarGroup
          key={group}
          group={group}
          draft={draft}
          setVar={setVar}
          clearVar={clearVar}
        />
      ))}

      <FontGroup draft={draft} setDraft={setDraft} />

      <div className="flex flex-wrap items-center gap-2 pt-2">
        <button
          type="button"
          className="btn-primary"
          onClick={handleSave}
          disabled={busy || resetting}
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {busy ? t("style.saving") : t("style.save")}
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={handleReset}
          disabled={busy || resetting}
        >
          {resetting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RotateCcw className="h-4 w-4" />
          )}
          {resetting ? t("style.resetting") : t("style.reset")}
        </button>
      </div>
    </div>
  );
}

function VarGroup({
  group,
  draft,
  setVar,
  clearVar,
}: {
  group: ThemeVarGroup;
  draft: StyleOverrides;
  setVar: (name: string, value: string) => void;
  clearVar: (name: string) => void;
}) {
  const { t } = useTranslation("theme-default");
  const specs = THEME_VAR_SPECS.filter((s) => s.group === group);
  if (specs.length === 0) return null;
  return (
    <section className="card p-4 space-y-3">
      <h3 className="font-semibold flex items-center gap-2">
        <Palette className="h-4 w-4 text-surface-400" />
        {t(`groups.${group}`)}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {specs.map((spec) => (
          <VarField
            key={spec.name}
            spec={spec}
            value={draft.vars[spec.name] ?? ""}
            onChange={(v) => (v ? setVar(spec.name, v) : clearVar(spec.name))}
          />
        ))}
      </div>
    </section>
  );
}

function VarField({
  spec,
  value,
  onChange,
}: {
  spec: ThemeVarSpec;
  value: string;
  onChange: (next: string) => void;
}) {
  const { t } = useTranslation("theme-default");
  const effective = value || spec.defaultValue;
  const isOverridden = !!value && value !== spec.defaultValue;
  return (
    <div className="space-y-1">
      <label className="label flex items-center justify-between gap-2 text-xs">
        <span>{t(spec.labelKey)}</span>
        {isOverridden && (
          <button
            type="button"
            className="text-[10px] text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100"
            onClick={() => onChange("")}
            title={spec.defaultValue}
          >
            ↺
          </button>
        )}
      </label>
      {spec.type === "color" ? (
        <div className="flex items-center gap-2">
          <input
            type="color"
            className="h-9 w-12 rounded border border-surface-200 dark:border-surface-700 cursor-pointer"
            value={effective}
            onChange={(e) => onChange(e.target.value)}
          />
          <input
            type="text"
            className="input flex-1 font-mono text-xs"
            value={value}
            placeholder={spec.defaultValue}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      ) : (
        <input
          type="text"
          className="input font-mono text-xs"
          value={value}
          placeholder={spec.defaultValue}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function FontGroup({
  draft,
  setDraft,
}: {
  draft: StyleOverrides;
  setDraft: (next: StyleOverrides) => void;
}) {
  const { t } = useTranslation("theme-default");
  const serifNames = Object.keys(FONT_PRESETS.serif);
  const sansNames = Object.keys(FONT_PRESETS.sans);
  return (
    <section className="card p-4 space-y-3">
      <h3 className="font-semibold flex items-center gap-2">
        <Palette className="h-4 w-4 text-surface-400" />
        {t("groups.typography")}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="label">{t("fonts.serif")}</label>
          <select
            className="input"
            value={draft.fontSerif}
            onChange={(e) =>
              setDraft({ ...draft, fontSerif: e.target.value || DEFAULT_FONT_SERIF })
            }
          >
            {serifNames.map((name) => (
              <option key={name} value={name} style={{ fontFamily: `"${name}", serif` }}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">{t("fonts.sans")}</label>
          <select
            className="input"
            value={draft.fontSans}
            onChange={(e) =>
              setDraft({ ...draft, fontSans: e.target.value || DEFAULT_FONT_SANS })
            }
          >
            {sansNames.map((name) => (
              <option
                key={name}
                value={name}
                style={{ fontFamily: `"${name}", sans-serif` }}
              >
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="text-xs text-surface-500 dark:text-surface-400">{t("fonts.help")}</p>
    </section>
  );
}
