import { useRef, useState } from "react";
import {
  ImageIcon,
  Loader2,
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
import { MediaPicker } from "@flexweg/cms-runtime";
import { pickMediaUrl } from "@flexweg/cms-runtime";
import type { ThemeSettingsPageProps } from "@flexweg/cms-runtime";
import { manifest } from "./manifest";
// The default theme owns the shared logo upload helpers
// (logoPath / uploadThemeLogo / removeThemeLogo). Both magazine and
// corporate reuse them — single canonical implementation, themed
// callers just pass their own theme id.
import { logoPath, removeThemeLogo, uploadThemeLogo } from "@flexweg/cms-runtime";
import {
  applyAndUploadCustomCss,
  buildAllFontsPreviewUrl,
  DEFAULT_FONT_SANS,
  DEFAULT_STYLE,
  FONT_PRESETS,
  THEME_VAR_GROUPS,
  THEME_VAR_SPECS,
  type StyleOverrides,
  type ThemeVarGroup,
  type ThemeVarSpec,
} from "./style";
import {
  DEFAULT_CORPORATE_HOME,
  DEFAULT_CORPORATE_SINGLE,
  type CorporateFeaturedPostsConfig,
  type CorporateHomeConfig,
  type CorporateSingleConfig,
  type CorporateTestimonialsHomeConfig,
  type CorporateThemeConfig,
  type FeaturedPostsMode,
} from "./config";
import type { HeroOverlayAttrs } from "./blocks/heroOverlay/render";
import type {
  Testimonial,
  TestimonialsVariant,
} from "./blocks/testimonials/render";
import { Plus, ArrowUp, ArrowDown } from "lucide-react";

const THEME_ID = "corporate";

// Logo box dimensions. Image is letterboxed (no cropping) so wide /
// tall logos both stay legible. The 480×144 ratio matches the
// magazine theme — the corporate header has the same h-20 bar.
const LOGO_WIDTH = 480;
const LOGO_HEIGHT = 144;
const LOGO_FIT: "cover" | "contain" = "contain";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type ActiveTab = "logo" | "style" | "home" | "single";

export function CorporateSettingsPage({
  config,
  save,
}: ThemeSettingsPageProps<CorporateThemeConfig>) {
  const { t } = useTranslation("theme-corporate");
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");

  return (
    <div className="space-y-6">
      <p className="text-sm text-surface-600 dark:text-surface-300">
        {t("settings.description")}
      </p>

      <nav
        className="flex flex-wrap gap-1 border-b border-surface-200 dark:border-surface-800"
        aria-label={t("title")}
      >
        <TabButton
          active={activeTab === "home"}
          onClick={() => setActiveTab("home")}
          label={t("settings.tabs.home")}
        />
        <TabButton
          active={activeTab === "single"}
          onClick={() => setActiveTab("single")}
          label={t("settings.tabs.single")}
        />
        <TabButton
          active={activeTab === "logo"}
          onClick={() => setActiveTab("logo")}
          label={t("settings.tabs.logo")}
        />
        <TabButton
          active={activeTab === "style"}
          onClick={() => setActiveTab("style")}
          label={t("settings.tabs.style")}
        />
      </nav>

      {activeTab === "home" && <HomeTab config={config} save={save} />}
      {activeTab === "single" && <SingleTab config={config} save={save} />}
      {activeTab === "logo" && <LogoTab config={config} save={save} />}
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

// ─── Logo tab ──────────────────────────────────────────────────────

function LogoTab({
  config,
  save,
}: ThemeSettingsPageProps<CorporateThemeConfig>) {
  const { t } = useTranslation("theme-corporate");
  const { settings, terms } = useCmsData();
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const previewUrl =
    config.logoEnabled && settings.baseUrl
      ? `${settings.baseUrl.replace(/\/+$/, "")}/${logoPath(THEME_ID)}?v=${config.logoUpdatedAt}`
      : "";

  // Re-publishes /data/menu.json so the runtime loader picks up the
  // new branding URL (or its absence) without waiting for the next
  // post publish. Same pattern as the magazine LogoTab.
  async function refreshMenuJson(nextConfig: CorporateThemeConfig) {
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
      console.error("[theme-corporate] menu.json refresh failed:", err);
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
      const next: CorporateThemeConfig = {
        ...config,
        logoEnabled: true,
        logoUpdatedAt: Date.now(),
      };
      await save(next);
      await refreshMenuJson(next);
      toast.success(t("settings.logo.saved"));
    } catch (err) {
      console.error("[theme-corporate] logo upload failed:", err);
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
      const next: CorporateThemeConfig = {
        ...config,
        logoEnabled: false,
        logoUpdatedAt: 0,
      };
      await save(next);
      await refreshMenuJson(next);
      toast.success(t("settings.logo.removed"));
    } catch (err) {
      console.error("[theme-corporate] logo remove failed:", err);
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
}: ThemeSettingsPageProps<CorporateThemeConfig>) {
  const { t } = useTranslation("theme-corporate");
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
      const next: CorporateThemeConfig = { ...config, style: draft };
      await save(next);
      toast.success(t("settings.style.saved"));
    } catch (err) {
      console.error("[theme-corporate] style save failed:", err);
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
      const next: CorporateThemeConfig = { ...config, style: DEFAULT_STYLE };
      await save(next);
      setDraft(DEFAULT_STYLE);
      toast.success(t("settings.style.saved"));
    } catch (err) {
      console.error("[theme-corporate] style reset failed:", err);
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

  // FontSelect option list. The corporate theme uses one font for
  // everything — the SCSS @import line carries the active sans family
  // and `body { font-family: var(--font-sans) }` is the only consumer.
  const fontPreviewUrl = buildAllFontsPreviewUrl();
  const sansOptions: FontOption[] = Object.keys(FONT_PRESETS.sans).map((name) => ({
    name,
    fallback: "sans-serif",
  }));

  return (
    <div className="space-y-6">
      <p className="text-xs text-surface-500 dark:text-surface-400">
        {t("settings.style.help")}
      </p>

      {/* Typography */}
      <section className="card p-4 space-y-4">
        <h2 className="font-semibold">{t("settings.groups.typography")}</h2>
        <p className="text-xs text-surface-500 dark:text-surface-400">
          {t("settings.fonts.help")}
        </p>
        <link rel="stylesheet" href={fontPreviewUrl} />
        <div>
          <label className="label">{t("settings.fonts.sans")}</label>
          <FontSelect
            options={sansOptions}
            value={draft.fontSans || DEFAULT_FONT_SANS}
            onChange={(v) => setDraft((d) => ({ ...d, fontSans: v }))}
          />
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
}: ThemeSettingsPageProps<CorporateThemeConfig>) {
  const { t } = useTranslation("theme-corporate");
  // Categories list — used to populate the featured-posts category
  // dropdown. Filtered to type === "category" only (tags shouldn't
  // be selectable as a post-archive source).
  const { terms } = useCmsData();
  const categories = terms.filter((term) => term.type === "category");
  // Merge stored config with defaults so a fresh install (no
  // themeConfigs.corporate.home stored yet) shows the placeholder
  // values rather than empty fields. Each sub-object spreads
  // defaults first so partial stored configs (e.g. an old install
  // that predates `featuredPosts`) still surface every field.
  const initial: CorporateHomeConfig = {
    ...DEFAULT_CORPORATE_HOME,
    ...(config.home ?? {}),
    hero: { ...DEFAULT_CORPORATE_HOME.hero, ...(config.home?.hero ?? {}) },
    featuredPosts: {
      ...DEFAULT_CORPORATE_HOME.featuredPosts,
      ...(config.home?.featuredPosts ?? {}),
    },
    testimonials: {
      ...DEFAULT_CORPORATE_HOME.testimonials,
      ...(config.home?.testimonials ?? {}),
      // Items are an array — explicitly fall back to defaults when
      // the stored config has none (rather than spreading undefined).
      items:
        config.home?.testimonials?.items ?? DEFAULT_CORPORATE_HOME.testimonials.items,
    },
  };
  const [draft, setDraft] = useState<CorporateHomeConfig>(initial);
  const [saving, setSaving] = useState(false);
  // Modal toggle for the media library picker. Picking a media
  // resolves to its `large` URL (corporate's hero is full-width and
  // benefits from the largest available variant) and falls back
  // gracefully through pickFormat's chain when `large` doesn't exist
  // for legacy assets.
  const [showImagePicker, setShowImagePicker] = useState(false);

  function patch(next: Partial<CorporateHomeConfig>) {
    setDraft((d) => ({ ...d, ...next }));
  }
  function patchHero(next: Partial<HeroOverlayAttrs>) {
    setDraft((d) => ({ ...d, hero: { ...d.hero, ...next } }));
  }
  function patchFeatured(next: Partial<CorporateFeaturedPostsConfig>) {
    setDraft((d) => ({ ...d, featuredPosts: { ...d.featuredPosts, ...next } }));
  }
  function patchTestimonials(next: Partial<CorporateTestimonialsHomeConfig>) {
    setDraft((d) => ({ ...d, testimonials: { ...d.testimonials, ...next } }));
  }
  function patchTestimonialItem(index: number, next: Partial<Testimonial>) {
    setDraft((d) => ({
      ...d,
      testimonials: {
        ...d.testimonials,
        items: d.testimonials.items.map((it, i) =>
          i === index ? { ...it, ...next } : it,
        ),
      },
    }));
  }
  function addTestimonial() {
    setDraft((d) => ({
      ...d,
      testimonials: {
        ...d.testimonials,
        items: [
          ...d.testimonials.items,
          {
            rating: 5,
            quote: "",
            authorName: "",
            authorTitle: "",
            authorAvatarUrl: "",
            authorAvatarAlt: "",
          },
        ],
      },
    }));
  }
  function removeTestimonial(index: number) {
    setDraft((d) => ({
      ...d,
      testimonials: {
        ...d.testimonials,
        items: d.testimonials.items.filter((_, i) => i !== index),
      },
    }));
  }
  function moveTestimonial(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= draft.testimonials.items.length) return;
    setDraft((d) => {
      const list = [...d.testimonials.items];
      [list[index], list[target]] = [list[target], list[index]];
      return { ...d, testimonials: { ...d.testimonials, items: list } };
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const next: CorporateThemeConfig = { ...config, home: draft };
      await save(next);
      toast.success(t("settings.home.saved"));
    } catch (err) {
      console.error("[theme-corporate] home save failed:", err);
      toast.error(t("settings.home.failed"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
    <div className="space-y-6">
      <p className="text-xs text-surface-500 dark:text-surface-400">
        {t("settings.home.help")}
      </p>

      <section className="card p-4 space-y-3">
        <label className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-200">
          <input
            type="checkbox"
            checked={draft.showHero}
            onChange={(e) => patch({ showHero: e.target.checked })}
          />
          {t("settings.home.showHero")}
        </label>
        <p className="text-xs text-surface-500 dark:text-surface-400">
          {t("settings.home.showHeroHelp")}
        </p>
      </section>

      <section className="card p-4 space-y-3">
        <h2 className="font-semibold">{t("settings.home.heroHeading")}</h2>
        <div>
          <label className="label">{t("settings.home.heroImage")}</label>
          <div className="flex items-start gap-3">
            {draft.hero.imageUrl ? (
              <img
                src={draft.hero.imageUrl}
                alt=""
                className="h-16 w-24 rounded object-cover ring-1 ring-surface-200 shrink-0 dark:ring-surface-700"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="h-16 w-24 rounded bg-surface-100 flex items-center justify-center text-surface-400 shrink-0 dark:bg-surface-800">
                <ImageIcon className="h-5 w-5" />
              </div>
            )}
            <div className="flex-1 space-y-2">
              <input
                type="url"
                className="input"
                placeholder="https://…"
                value={draft.hero.imageUrl ?? ""}
                onChange={(e) => patchHero({ imageUrl: e.target.value })}
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn-ghost btn-sm flex items-center gap-1"
                  onClick={() => setShowImagePicker(true)}
                >
                  <ImageIcon className="h-3 w-3" />
                  {t("settings.home.heroImagePick")}
                </button>
                {draft.hero.imageUrl && (
                  <button
                    type="button"
                    className="btn-ghost btn-sm flex items-center gap-1 text-red-600"
                    onClick={() => patchHero({ imageUrl: "" })}
                  >
                    <Trash2 className="h-3 w-3" />
                    {t("settings.home.heroImageClear")}
                  </button>
                )}
              </div>
            </div>
          </div>
          <p className="text-xs text-surface-500 mt-2 dark:text-surface-400">
            {t("settings.home.heroImageHelp")}
          </p>
        </div>
        <div>
          <label className="label">{t("settings.home.heroImageAlt")}</label>
          <input
            type="text"
            className="input"
            value={draft.hero.imageAlt ?? ""}
            onChange={(e) => patchHero({ imageAlt: e.target.value })}
          />
        </div>
        <div>
          <label className="label">{t("settings.home.heroEyebrow")}</label>
          <input
            type="text"
            className="input"
            value={draft.hero.eyebrow ?? ""}
            onChange={(e) => patchHero({ eyebrow: e.target.value })}
          />
        </div>
        <div>
          <label className="label">{t("settings.home.heroTitle")}</label>
          <input
            type="text"
            className="input"
            value={draft.hero.title ?? ""}
            onChange={(e) => patchHero({ title: e.target.value })}
          />
        </div>
        <div>
          <label className="label">{t("settings.home.heroSubtitle")}</label>
          <textarea
            className="input"
            rows={3}
            value={draft.hero.subtitle ?? ""}
            onChange={(e) => patchHero({ subtitle: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">{t("settings.home.primaryCtaLabel")}</label>
            <input
              type="text"
              className="input"
              value={draft.hero.primaryCtaLabel ?? ""}
              onChange={(e) => patchHero({ primaryCtaLabel: e.target.value })}
            />
          </div>
          <div>
            <label className="label">{t("settings.home.primaryCtaHref")}</label>
            <input
              type="text"
              className="input"
              placeholder="/contact.html"
              value={draft.hero.primaryCtaHref ?? ""}
              onChange={(e) => patchHero({ primaryCtaHref: e.target.value })}
            />
          </div>
          <div>
            <label className="label">{t("settings.home.secondaryCtaLabel")}</label>
            <input
              type="text"
              className="input"
              value={draft.hero.secondaryCtaLabel ?? ""}
              onChange={(e) => patchHero({ secondaryCtaLabel: e.target.value })}
            />
          </div>
          <div>
            <label className="label">{t("settings.home.secondaryCtaHref")}</label>
            <input
              type="text"
              className="input"
              value={draft.hero.secondaryCtaHref ?? ""}
              onChange={(e) => patchHero({ secondaryCtaHref: e.target.value })}
            />
          </div>
        </div>
      </section>

      {/* ─── Featured posts section ──────────────────────────── */}
      <section className="card p-4 space-y-3">
        <h2 className="font-semibold">{t("settings.home.featuredHeading")}</h2>
        <label className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-200">
          <input
            type="checkbox"
            checked={draft.featuredPosts.enabled}
            onChange={(e) => patchFeatured({ enabled: e.target.checked })}
          />
          {t("settings.home.featuredEnabled")}
        </label>
        <p className="text-xs text-surface-500 dark:text-surface-400">
          {t("settings.home.featuredHelp")}
        </p>
        <div>
          <label className="label">{t("settings.home.featuredTitle")}</label>
          <input
            type="text"
            className="input"
            value={draft.featuredPosts.title}
            onChange={(e) => patchFeatured({ title: e.target.value })}
          />
        </div>
        <div>
          <label className="label">{t("settings.home.featuredSubtitle")}</label>
          <textarea
            className="input"
            rows={2}
            value={draft.featuredPosts.subtitle}
            onChange={(e) => patchFeatured({ subtitle: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">{t("settings.home.featuredMode")}</label>
            <select
              className="input"
              value={draft.featuredPosts.mode}
              onChange={(e) =>
                patchFeatured({ mode: e.target.value as FeaturedPostsMode })
              }
            >
              <option value="all">{t("settings.home.featuredModes.all")}</option>
              <option value="category">
                {t("settings.home.featuredModes.category")}
              </option>
            </select>
          </div>
          <div>
            <label className="label">{t("settings.home.featuredCount")}</label>
            <input
              type="number"
              min={1}
              max={12}
              className="input"
              value={draft.featuredPosts.count}
              onChange={(e) =>
                patchFeatured({ count: Math.max(1, Number(e.target.value) || 3) })
              }
            />
          </div>
        </div>
        {draft.featuredPosts.mode === "category" && (
          <div>
            <label className="label">{t("settings.home.featuredCategory")}</label>
            <select
              className="input"
              value={draft.featuredPosts.categoryId}
              onChange={(e) => patchFeatured({ categoryId: e.target.value })}
            >
              <option value="">{t("settings.home.featuredCategoryPlaceholder")}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
                {t("settings.home.featuredCategoryEmpty")}
              </p>
            )}
          </div>
        )}
      </section>

      {/* ─── Testimonials section ────────────────────────────── */}
      <section className="card p-4 space-y-3">
        <h2 className="font-semibold">{t("settings.home.testimonialsHeading")}</h2>
        <label className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-200">
          <input
            type="checkbox"
            checked={draft.testimonials.enabled}
            onChange={(e) => patchTestimonials({ enabled: e.target.checked })}
          />
          {t("settings.home.testimonialsEnabled")}
        </label>
        <p className="text-xs text-surface-500 dark:text-surface-400">
          {t("settings.home.testimonialsHelp")}
        </p>
        <div>
          <label className="label">{t("settings.home.testimonialsVariant")}</label>
          <select
            className="input"
            value={draft.testimonials.variant}
            onChange={(e) =>
              patchTestimonials({ variant: e.target.value as TestimonialsVariant })
            }
          >
            <option value="glass">{t("settings.home.testimonialsVariants.glass")}</option>
            <option value="navy">{t("settings.home.testimonialsVariants.navy")}</option>
          </select>
        </div>
        <div>
          <label className="label">{t("settings.home.testimonialsEyebrow")}</label>
          <input
            type="text"
            className="input"
            value={draft.testimonials.eyebrow}
            onChange={(e) => patchTestimonials({ eyebrow: e.target.value })}
          />
        </div>
        <div>
          <label className="label">{t("settings.home.testimonialsTitle")}</label>
          <input
            type="text"
            className="input"
            value={draft.testimonials.title}
            onChange={(e) => patchTestimonials({ title: e.target.value })}
          />
        </div>
        <div>
          <label className="label">{t("settings.home.testimonialsSubtitle")}</label>
          <textarea
            className="input"
            rows={2}
            value={draft.testimonials.subtitle}
            onChange={(e) => patchTestimonials({ subtitle: e.target.value })}
          />
        </div>

        <div className="space-y-3 pt-3 border-t border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">
              {t("settings.home.testimonialsItemsHeading")}
            </p>
            <button
              type="button"
              className="btn-ghost btn-sm flex items-center gap-1"
              onClick={addTestimonial}
            >
              <Plus className="h-3 w-3" />
              {t("settings.home.testimonialsAdd")}
            </button>
          </div>
          {draft.testimonials.items.map((item, index) => (
            <div
              key={index}
              className="rounded-md border border-surface-200 bg-surface-50 p-3 space-y-2 dark:border-surface-700 dark:bg-surface-800"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-surface-600 dark:text-surface-300">
                  {t("settings.home.testimonialsItemIndex", { index: index + 1 })}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="btn-ghost btn-icon"
                    onClick={() => moveTestimonial(index, -1)}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    className="btn-ghost btn-icon"
                    onClick={() => moveTestimonial(index, 1)}
                    disabled={index === draft.testimonials.items.length - 1}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    className="btn-ghost btn-icon text-red-600"
                    onClick={() => removeTestimonial(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div>
                <label className="label text-xs">{t("settings.home.testimonialsQuote")}</label>
                <textarea
                  className="input"
                  rows={3}
                  value={item.quote}
                  onChange={(e) => patchTestimonialItem(index, { quote: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="label text-xs">{t("settings.home.testimonialsAuthorName")}</label>
                  <input
                    type="text"
                    className="input"
                    value={item.authorName}
                    onChange={(e) =>
                      patchTestimonialItem(index, { authorName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label text-xs">{t("settings.home.testimonialsAuthorTitle")}</label>
                  <input
                    type="text"
                    className="input"
                    value={item.authorTitle ?? ""}
                    onChange={(e) =>
                      patchTestimonialItem(index, { authorTitle: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label text-xs">{t("settings.home.testimonialsAvatarUrl")}</label>
                  <input
                    type="url"
                    className="input"
                    placeholder="https://…"
                    value={item.authorAvatarUrl ?? ""}
                    onChange={(e) =>
                      patchTestimonialItem(index, { authorAvatarUrl: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label text-xs">{t("settings.home.testimonialsRating")}</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    className="input"
                    value={item.rating ?? 5}
                    onChange={(e) =>
                      patchTestimonialItem(index, { rating: Number(e.target.value) || 5 })
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="card p-4 flex flex-wrap gap-3 justify-end">
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
    {showImagePicker && (
      <MediaPicker
        onPick={(m) => {
          // Resolve the picked Media doc to its `large` variant URL
          // (or whatever pickFormat falls back to). Stays a plain
          // string so the same field can still hold pasted external
          // URLs after a media pick.
          const url = pickMediaUrl(m, "large");
          patchHero({ imageUrl: url, imageAlt: m.alt ?? "" });
          setShowImagePicker(false);
        }}
        onClose={() => setShowImagePicker(false)}
      />
    )}
    </>
  );
}

// ─── Single tab ────────────────────────────────────────────────────

function SingleTab({
  config,
  save,
}: ThemeSettingsPageProps<CorporateThemeConfig>) {
  const { t } = useTranslation("theme-corporate");
  // Same merge pattern as the Home tab — defaults guarantee every
  // field exists on a fresh install.
  const initial: CorporateSingleConfig = {
    ...DEFAULT_CORPORATE_SINGLE,
    ...(config.single ?? {}),
  };
  const [draft, setDraft] = useState<CorporateSingleConfig>(initial);
  const [saving, setSaving] = useState(false);

  function patch(next: Partial<CorporateSingleConfig>) {
    setDraft((d) => ({ ...d, ...next }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const next: CorporateThemeConfig = { ...config, single: draft };
      await save(next);
      toast.success(t("settings.single.saved"));
    } catch (err) {
      console.error("[theme-corporate] single save failed:", err);
      toast.error(t("settings.single.failed"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-xs text-surface-500 dark:text-surface-400">
        {t("settings.single.help")}
      </p>

      <section className="card p-4 space-y-3">
        <h2 className="font-semibold">{t("settings.single.sidebarHeading")}</h2>

        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-200">
            <input
              type="checkbox"
              checked={draft.showAuthorBio}
              onChange={(e) => patch({ showAuthorBio: e.target.checked })}
            />
            {t("settings.single.showAuthorBio")}
          </label>
          <p className="text-xs text-surface-500 ml-6 dark:text-surface-400">
            {t("settings.single.showAuthorBioHelp")}
          </p>
        </div>

        <div className="space-y-1 pt-2 border-t border-surface-200 dark:border-surface-700">
          <label className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-200 mt-3">
            <input
              type="checkbox"
              checked={draft.showPopularArticles}
              onChange={(e) => patch({ showPopularArticles: e.target.checked })}
            />
            {t("settings.single.showPopular")}
          </label>
          <p className="text-xs text-surface-500 ml-6 dark:text-surface-400">
            {t("settings.single.showPopularHelp")}
          </p>
        </div>

        {draft.showPopularArticles && (
          <div className="ml-6 mt-2">
            <label className="label">{t("settings.single.popularTitle")}</label>
            <input
              type="text"
              className="input"
              placeholder={t("publicBaked.popularArticles")}
              value={draft.popularArticlesTitle}
              onChange={(e) => patch({ popularArticlesTitle: e.target.value })}
            />
            <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
              {t("settings.single.popularTitleHelp")}
            </p>
          </div>
        )}

        <div className="space-y-1 pt-2 border-t border-surface-200 dark:border-surface-700">
          <label className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-200 mt-3">
            <input
              type="checkbox"
              checked={draft.showCta}
              onChange={(e) => patch({ showCta: e.target.checked })}
            />
            {t("settings.single.showCta")}
          </label>
          <p className="text-xs text-surface-500 ml-6 dark:text-surface-400">
            {t("settings.single.showCtaHelp")}
          </p>
        </div>

        {draft.showCta && (
          <div className="ml-6 mt-2 space-y-3">
            <div>
              <label className="label">{t("settings.single.ctaTitle")}</label>
              <input
                type="text"
                className="input"
                placeholder={t("publicBaked.getStarted")}
                value={draft.ctaTitle}
                onChange={(e) => patch({ ctaTitle: e.target.value })}
              />
              <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
                {t("settings.single.ctaTitleHelp")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">{t("settings.single.ctaButtonLabel")}</label>
                <input
                  type="text"
                  className="input"
                  placeholder={t("publicBaked.getStarted")}
                  value={draft.ctaButtonLabel}
                  onChange={(e) => patch({ ctaButtonLabel: e.target.value })}
                />
              </div>
              <div>
                <label className="label">{t("settings.single.ctaButtonHref")}</label>
                <input
                  type="text"
                  className="input"
                  placeholder="/contact.html"
                  value={draft.ctaButtonHref}
                  onChange={(e) => patch({ ctaButtonHref: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="card p-4 flex flex-wrap gap-3 justify-end">
        <button
          type="button"
          className="btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          <Loader2 className={saving ? "h-4 w-4 animate-spin" : "hidden"} />
          <Save className={saving ? "hidden" : "h-4 w-4"} />
          <span>{saving ? t("settings.single.saving") : t("settings.single.save")}</span>
        </button>
      </div>
    </div>
  );
}
