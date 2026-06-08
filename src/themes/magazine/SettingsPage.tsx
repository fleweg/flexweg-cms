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
import { useCmsData } from "@flexweg/cms-runtime";
import { toast } from "@flexweg/cms-runtime";
import { publishMenuJson } from "@flexweg/cms-runtime";
import { fetchAllPosts } from "@flexweg/cms-runtime";
import { FontSelect, type FontOption } from "@flexweg/cms-runtime";
import type { ThemeSettingsPageProps } from "@flexweg/cms-runtime";
import { manifest } from "./manifest";
import { logoPath, removeThemeLogo, uploadThemeLogo } from "@flexweg/cms-runtime";
import {
  applyAndUploadCustomCss,
  buildAllFontsPreviewUrl,
  DEFAULT_FONT_SANS,
  DEFAULT_FONT_SERIF,
  DEFAULT_STYLE,
  detectActivePreset,
  FONT_PRESETS,
  resolveVar,
  STYLE_PRESETS,
  THEME_VAR_GROUPS,
  THEME_VAR_SPECS,
  fontGenericFallback,
  type StyleOverrides,
  type StylePreset,
  type ThemeVarGroup,
  type ThemeVarSpec,
} from "./style";
import {
  DEFAULT_MAGAZINE_HEADER,
  DEFAULT_MAGAZINE_HOME_LAYOUT,
  type MagazineBrandPosition,
  type MagazineSidebarVariant,
  type MagazineThemeConfig,
} from "./config";

const THEME_ID = "magazine";

// Logo box dimensions. Image is letterboxed (no cropping) so wide /
// tall logos both stay legible.
const LOGO_WIDTH = 480;
const LOGO_HEIGHT = 144;
const LOGO_FIT: "cover" | "contain" = "contain";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type ActiveTab = "logo" | "style" | "home" | "header";

export function MagazineSettingsPage({
  config,
  save,
}: ThemeSettingsPageProps<MagazineThemeConfig>) {
  const { t } = useTranslation("theme-magazine");
  const [activeTab, setActiveTab] = useState<ActiveTab>("logo");

  return (
    <div className="space-y-6">
      <p className="text-sm text-surface-600 dark:text-surface-300">
        {t("settings.description")}
      </p>

      <nav
        className="flex flex-wrap gap-1 border-b border-surface-200 dark:border-surface-800"
        aria-label={t("title")}
      >
        <TabButton active={activeTab === "logo"} onClick={() => setActiveTab("logo")} label={t("settings.tabs.logo")} />
        <TabButton active={activeTab === "style"} onClick={() => setActiveTab("style")} label={t("settings.tabs.style")} />
        <TabButton active={activeTab === "home"} onClick={() => setActiveTab("home")} label={t("settings.tabs.home")} />
        <TabButton active={activeTab === "header"} onClick={() => setActiveTab("header")} label={t("settings.tabs.header")} />
      </nav>

      {activeTab === "logo" && <LogoTab config={config} save={save} />}
      {activeTab === "style" && <StyleTab config={config} save={save} />}
      {activeTab === "home" && <HomeTab config={config} save={save} />}
      {activeTab === "header" && <HeaderTab config={config} save={save} />}
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

// ─── Logo tab ──────────────────────────────────────────────────────

function LogoTab({
  config,
  save,
}: ThemeSettingsPageProps<MagazineThemeConfig>) {
  const { t } = useTranslation("theme-magazine");
  const { settings, terms } = useCmsData();
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const previewUrl =
    config.logoEnabled && settings.baseUrl
      ? `${settings.baseUrl.replace(/\/+$/, "")}/${logoPath(THEME_ID)}?v=${config.logoUpdatedAt}`
      : "";

  async function refreshMenuJson(nextConfig: MagazineThemeConfig) {
    const patchedSettings = {
      ...settings,
      themeConfigs: { ...settings.themeConfigs, [THEME_ID]: nextConfig },
    };
    try {
      const [posts, pages] = await Promise.all([
        fetchAllPosts({ type: "post" }),
        fetchAllPosts({ type: "page" }),
      ]);
      await publishMenuJson(patchedSettings, posts, pages, terms);
    } catch (err) {
      console.error("[theme-magazine] menu.json refresh failed:", err);
    }
  }

  async function handleUpload(file: File) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(t("settings.logo.invalidType"));
      return;
    }
    setUploading(true);
    try {
      await uploadThemeLogo({
        themeId: THEME_ID,
        file,
        width: LOGO_WIDTH,
        height: LOGO_HEIGHT,
        fit: LOGO_FIT,
      });
      const next: MagazineThemeConfig = {
        ...config,
        logoEnabled: true,
        logoUpdatedAt: Date.now(),
      };
      await save(next);
      await refreshMenuJson(next);
      toast.success(t("settings.logo.saved"));
    } catch (err) {
      console.error("[theme-magazine] logo upload failed:", err);
      toast.error(t("settings.logo.failed"));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleRemove() {
    setRemoving(true);
    try {
      await removeThemeLogo(THEME_ID);
      const next: MagazineThemeConfig = {
        ...config,
        logoEnabled: false,
        logoUpdatedAt: 0,
      };
      await save(next);
      await refreshMenuJson(next);
      toast.success(t("settings.logo.removed"));
    } catch (err) {
      console.error("[theme-magazine] logo remove failed:", err);
      toast.error(t("settings.logo.failed"));
    } finally {
      setRemoving(false);
    }
  }

  return (
    <section className="card p-4 space-y-4">
      <p className="text-xs text-surface-500 dark:text-surface-400">
        {t("settings.logo.help", { width: LOGO_WIDTH, height: LOGO_HEIGHT })}
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
            {t("settings.logo.none")}
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
              ? t("settings.logo.uploading")
              : config.logoEnabled
                ? t("settings.logo.change")
                : t("settings.logo.upload")}
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
              {removing ? t("settings.logo.removing") : t("settings.logo.remove")}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Style tab ─────────────────────────────────────────────────────

function StyleTab({
  config,
  save,
}: ThemeSettingsPageProps<MagazineThemeConfig>) {
  const { t } = useTranslation("theme-magazine");
  const [draft, setDraft] = useState<StyleOverrides>(config.style ?? DEFAULT_STYLE);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  function patchVar(name: string, value: string) {
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
    setSaving(true);
    try {
      await applyAndUploadCustomCss({
        baseCssText: manifest.cssText,
        style: draft,
      });
      // Bump cssUpdatedAt so the public-page `<link href=...?v=N>`
      // changes and visitors' browsers refetch the CSS on next load.
      const next: MagazineThemeConfig = {
        ...config,
        style: draft,
        cssUpdatedAt: Date.now(),
      };
      await save(next);
      toast.success(t("settings.style.saved"));
    } catch (err) {
      console.error("[theme-magazine] style save failed:", err);
      toast.error(t("settings.style.failed"));
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    setResetting(true);
    try {
      await applyAndUploadCustomCss({
        baseCssText: manifest.cssText,
        style: DEFAULT_STYLE,
      });
      const next: MagazineThemeConfig = {
        ...config,
        style: DEFAULT_STYLE,
        cssUpdatedAt: Date.now(),
      };
      await save(next);
      setDraft(DEFAULT_STYLE);
      toast.success(t("settings.style.saved"));
    } catch (err) {
      console.error("[theme-magazine] style reset failed:", err);
      toast.error(t("settings.style.failed"));
    } finally {
      setResetting(false);
    }
  }

  // Group specs by group key for rendering. Order follows
  // THEME_VAR_GROUPS so the form mirrors the visual hierarchy
  // (surfaces → foreground → outlines → accent).
  const byGroup = new Map<ThemeVarGroup, ThemeVarSpec[]>();
  for (const spec of THEME_VAR_SPECS) {
    const list = byGroup.get(spec.group) ?? [];
    list.push(spec);
    byGroup.set(spec.group, list);
  }

  // FontSelect option list. Each name is rendered in its own face via
  // a single Google Fonts URL loaded once at the top of the panel.
  const fontPreviewUrl = buildAllFontsPreviewUrl();
  const serifOptions: FontOption[] = Object.keys(FONT_PRESETS.serif).map((name) => ({
    name,
    fallback: fontGenericFallback(name),
  }));
  const sansOptions: FontOption[] = Object.keys(FONT_PRESETS.sans).map((name) => ({
    name,
    fallback: fontGenericFallback(name),
  }));

  return (
    <div className="space-y-6">
      <p className="text-xs text-surface-500 dark:text-surface-400">
        {t("settings.style.help")}
      </p>

      <PresetPicker draft={draft} setDraft={setDraft} />

      {/* Typography */}
      <section className="card p-4 space-y-4">
        <h2 className="font-semibold">{t("settings.groups.typography")}</h2>
        <p className="text-xs text-surface-500 dark:text-surface-400">
          {t("settings.fonts.help")}
        </p>
        <link rel="stylesheet" href={fontPreviewUrl} />
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">{t("settings.fonts.serif")}</label>
            <FontSelect
              options={serifOptions}
              value={draft.fontSerif || DEFAULT_FONT_SERIF}
              onChange={(v) => setDraft((d) => ({ ...d, fontSerif: v }))}
            />
          </div>
          <div>
            <label className="label">{t("settings.fonts.sans")}</label>
            <FontSelect
              options={sansOptions}
              value={draft.fontSans || DEFAULT_FONT_SANS}
              onChange={(v) => setDraft((d) => ({ ...d, fontSans: v }))}
            />
          </div>
        </div>
      </section>

      {/* Color tokens */}
      {THEME_VAR_GROUPS.map((group) => {
        const specs = byGroup.get(group) ?? [];
        if (specs.length === 0) return null;
        return (
          <section key={group} className="card p-4 space-y-3">
            <h2 className="font-semibold">{t(`settings.groups.${group}`)}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {specs.map((spec) => (
                <VarRow
                  key={spec.name}
                  spec={spec}
                  value={draft.vars[spec.name] ?? ""}
                  onChange={(v) => patchVar(spec.name, v)}
                  onClear={() => clearVar(spec.name)}
                  label={t(`settings.${spec.labelKey}`)}
                />
              ))}
            </div>
          </section>
        );
      })}

      <div className="card p-4 flex flex-wrap gap-3 justify-end">
        <button
          type="button"
          className="btn-ghost"
          onClick={handleReset}
          disabled={saving || resetting}
        >
          <Loader2 className={resetting ? "h-4 w-4 animate-spin" : "hidden"} />
          <RotateCcw className={resetting ? "hidden" : "h-4 w-4"} />
          <span>{resetting ? t("settings.style.resetting") : t("settings.style.reset")}</span>
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={handleSave}
          disabled={saving || resetting}
        >
          <Loader2 className={saving ? "h-4 w-4 animate-spin" : "hidden"} />
          <Save className={saving ? "hidden" : "h-4 w-4"} />
          <span>{saving ? t("settings.style.saving") : t("settings.style.save")}</span>
        </button>
      </div>
    </div>
  );
}

function VarRow({
  spec,
  value,
  onChange,
  onClear,
  label,
}: {
  spec: ThemeVarSpec;
  value: string;
  onChange: (next: string) => void;
  onClear: () => void;
  label: string;
}) {
  const effective = value || spec.defaultValue;
  return (
    <div>
      <label className="label flex items-center justify-between gap-2">
        <span>{label}</span>
        {value && (
          <button
            type="button"
            className="text-xs text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100"
            onClick={onClear}
            title="Reset to default"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        )}
      </label>
      {spec.type === "color" ? (
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={effective}
            onChange={(e) => onChange(e.target.value)}
            className="h-8 w-12 cursor-pointer rounded border border-surface-200 dark:border-surface-700"
          />
          <input
            type="text"
            value={value}
            placeholder={spec.defaultValue}
            onChange={(e) => onChange(e.target.value)}
            className="input flex-1 font-mono text-xs"
          />
        </div>
      ) : (
        <input
          type="text"
          value={value}
          placeholder={spec.defaultValue}
          onChange={(e) => onChange(e.target.value)}
          className="input font-mono text-xs"
        />
      )}
    </div>
  );
}

// ─── Home tab ──────────────────────────────────────────────────────

function HomeTab({
  config,
  save,
}: ThemeSettingsPageProps<MagazineThemeConfig>) {
  const { t } = useTranslation("theme-magazine");
  const [draft, setDraft] = useState(config.home ?? DEFAULT_MAGAZINE_HOME_LAYOUT);
  const [saving, setSaving] = useState(false);

  function patch(p: Partial<typeof draft>) {
    setDraft((d) => ({ ...d, ...p }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const next: MagazineThemeConfig = { ...config, home: draft };
      await save(next);
      toast.success(t("settings.home.saved"));
    } catch (err) {
      console.error("[theme-magazine] home save failed:", err);
      toast.error(t("settings.home.failed"));
    } finally {
      setSaving(false);
    }
  }

  const sidebarVariants: MagazineSidebarVariant[] = ["most-read", "promo", "none"];

  function variantLabel(v: MagazineSidebarVariant): string {
    return t(`settings.home.sidebarVariants.${v === "most-read" ? "mostRead" : v}`);
  }

  return (
    <div className="space-y-6">
      <p className="text-xs text-surface-500 dark:text-surface-400">
        {t("settings.home.help")}
      </p>

      <section className="card p-4 space-y-4">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label">{t("settings.home.mostReadCount")}</label>
            <input
              type="number"
              min={1}
              max={10}
              value={draft.mostReadCount}
              onChange={(e) =>
                patch({
                  mostReadCount: Math.max(1, Math.min(10, Number.parseInt(e.target.value, 10) || 4)),
                })
              }
              className="input"
            />
            <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
              {t("settings.home.mostReadCountHelp")}
            </p>
          </div>
          <div>
            <label className="label">{t("settings.home.sidebarTop")}</label>
            <select
              className="input"
              value={draft.sidebarTop}
              onChange={(e) => patch({ sidebarTop: e.target.value as MagazineSidebarVariant })}
            >
              {sidebarVariants.map((v) => (
                <option key={v} value={v}>{variantLabel(v)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">{t("settings.home.sidebarBottom")}</label>
            <select
              className="input"
              value={draft.sidebarBottom}
              onChange={(e) => patch({ sidebarBottom: e.target.value as MagazineSidebarVariant })}
            >
              {sidebarVariants.map((v) => (
                <option key={v} value={v}>{variantLabel(v)}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {(draft.sidebarTop === "promo" || draft.sidebarBottom === "promo") && (
        <section className="card p-4 space-y-3">
          <header className="space-y-1">
            <h2 className="font-semibold">{t("settings.home.promoSection")}</h2>
            <p className="text-xs text-surface-500 dark:text-surface-400">
              {t("settings.home.promoSectionHelp")}
            </p>
          </header>
          <div>
            <label className="label">{t("settings.home.promoImage")}</label>
            <input
              type="url"
              className="input"
              placeholder="https://…"
              value={draft.promoImageUrl}
              onChange={(e) => patch({ promoImageUrl: e.target.value })}
            />
            <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
              {t("settings.home.promoImageHelp")}
            </p>
          </div>
          <div>
            <label className="label">{t("settings.home.promoImageAlt")}</label>
            <input
              type="text"
              className="input"
              value={draft.promoImageAlt}
              onChange={(e) => patch({ promoImageAlt: e.target.value })}
            />
          </div>
          <div>
            <label className="label">{t("settings.home.promoEyebrow")}</label>
            <input
              type="text"
              className="input"
              value={draft.promoEyebrow}
              onChange={(e) => patch({ promoEyebrow: e.target.value })}
            />
          </div>
          <div>
            <label className="label">{t("settings.home.promoTitle")}</label>
            <input
              type="text"
              className="input"
              value={draft.promoTitle}
              onChange={(e) => patch({ promoTitle: e.target.value })}
            />
          </div>
          <div>
            <label className="label">{t("settings.home.promoHref")}</label>
            <input
              type="url"
              className="input"
              placeholder="https://…"
              value={draft.promoHref}
              onChange={(e) => patch({ promoHref: e.target.value })}
            />
          </div>
        </section>
      )}

      <div className="card p-4 flex justify-end">
        <button
          type="button"
          className="btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          <Loader2 className={saving ? "h-4 w-4 animate-spin" : "hidden"} />
          <Save className={saving ? "hidden" : "h-4 w-4"} />
          <span>{saving ? t("settings.home.saving") : t("settings.home.save")}</span>
        </button>
      </div>
    </div>
  );
}

// ─── Header tab ────────────────────────────────────────────────────

function HeaderTab({
  config,
  save,
}: ThemeSettingsPageProps<MagazineThemeConfig>) {
  const { t } = useTranslation("theme-magazine");
  const [draft, setDraft] = useState(config.header ?? DEFAULT_MAGAZINE_HEADER);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const next: MagazineThemeConfig = { ...config, header: draft };
      await save(next);
      toast.success(t("settings.header.saved"));
    } catch (err) {
      console.error("[theme-magazine] header save failed:", err);
      toast.error(t("settings.header.failed"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-xs text-surface-500 dark:text-surface-400">
        {t("settings.header.help")}
      </p>

      <section className="card p-4 space-y-4">
        <div>
          <label className="label">{t("settings.header.brandPosition")}</label>
          <select
            className="input max-w-xs"
            value={draft.brandPosition}
            onChange={(e) => setDraft((d) => ({ ...d, brandPosition: e.target.value as MagazineBrandPosition }))}
          >
            <option value="centered">{t("settings.header.brandPositions.centered")}</option>
            <option value="left">{t("settings.header.brandPositions.left")}</option>
          </select>
        </div>

        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            className="mt-1"
            checked={draft.showSearch}
            onChange={(e) => setDraft((d) => ({ ...d, showSearch: e.target.checked }))}
          />
          <span>
            <span className="text-sm font-medium block">{t("settings.header.showSearch")}</span>
            <span className="text-xs text-surface-500 dark:text-surface-400">
              {t("settings.header.showSearchHelp")}
            </span>
          </span>
        </label>
      </section>

      <div className="card p-4 flex justify-end">
        <button
          type="button"
          className="btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          <Loader2 className={saving ? "h-4 w-4 animate-spin" : "hidden"} />
          <Save className={saving ? "hidden" : "h-4 w-4"} />
          <span>{saving ? t("settings.header.saving") : t("settings.header.save")}</span>
        </button>
      </div>
    </div>
  );
}

// Preset picker — fills draft.vars / fontSerif / fontSans from a
// curated preset in one click. Active preset is derived from the
// current draft; fine-tuning any field drops back to "custom"
// automatically. Selection doesn't save — the user still clicks
// "Save & apply" to commit + upload the regenerated CSS.
function PresetPicker({
  draft,
  setDraft,
}: {
  draft: StyleOverrides;
  setDraft: (next: StyleOverrides) => void;
}) {
  const { t } = useTranslation("theme-magazine");
  const activeId = detectActivePreset(draft);

  function applyPreset(preset: StylePreset) {
    setDraft({
      vars: { ...preset.vars },
      fontSerif: preset.fontSerif,
      fontSans: preset.fontSans,
    });
  }

  return (
    <section className="card p-4 space-y-3">
      <header className="space-y-1">
        <h2 className="font-semibold flex items-center gap-2">
          <Palette className="h-4 w-4 text-surface-400" />
          {t("settings.presets.title")}
        </h2>
        <p className="text-xs text-surface-500 dark:text-surface-400">
          {t("settings.presets.help")}
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {STYLE_PRESETS.map((preset) => {
          const active = preset.id === activeId;
          const presetStyle: StyleOverrides = {
            vars: preset.vars,
            fontSerif: preset.fontSerif,
            fontSans: preset.fontSans,
          };
          const swatchColors = preset.swatch.map((v) =>
            resolveVar(presetStyle, v),
          );
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset)}
              className={
                "text-left p-3 rounded border transition focus:outline-none focus:ring-2 focus:ring-blue-500 " +
                (active
                  ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/30"
                  : "border-surface-200 hover:border-surface-400 dark:border-surface-700 dark:hover:border-surface-500")
              }
              aria-pressed={active}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-sm font-medium">
                  {t(`settings.presets.${preset.id}.label`)}
                </span>
                <div className="flex -space-x-1" aria-hidden="true">
                  {swatchColors.map((color, i) => (
                    <span
                      key={i}
                      className="h-4 w-4 rounded-full ring-1 ring-surface-200 dark:ring-surface-700"
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-surface-500 dark:text-surface-400 line-clamp-2">
                {t(`settings.presets.${preset.id}.description`)}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
