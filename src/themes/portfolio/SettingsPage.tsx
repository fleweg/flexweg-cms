import { useRef, useState } from "react";
import { Loader2, RotateCcw, Save, Trash2, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  fetchAllPosts,
  FontSelect,
  logoPath,
  publishMenuJson,
  removeThemeLogo,
  toast,
  uploadThemeLogo,
  useCmsData,
  type FontOption,
  type ThemeSettingsPageProps,
} from "@flexweg/cms-runtime";
import {
  applyAndUploadCustomCss,
  buildAllFontsPreviewUrl,
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
import {
  DEFAULT_PORTFOLIO_AUTHOR,
  DEFAULT_PORTFOLIO_BRAND,
  DEFAULT_PORTFOLIO_FOOTER,
  DEFAULT_PORTFOLIO_HOME,
  DEFAULT_PORTFOLIO_SINGLE,
  type PortfolioAuthorConfig,
  type PortfolioBrandConfig,
  type PortfolioFooterConfig,
  type PortfolioHomeConfig,
  type PortfolioSingleConfig,
  type PortfolioThemeConfig,
} from "./config";
import { manifest } from "./manifest";

type ActiveTab = "home" | "single" | "author" | "footer" | "logo" | "style";

const THEME_ID = "portfolio";
const LOGO_WIDTH = 480;
const LOGO_HEIGHT = 144;
const LOGO_FIT: "cover" | "contain" = "contain";
const ALLOWED_LOGO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

export function PortfolioSettingsPage({
  config,
  save,
}: ThemeSettingsPageProps<PortfolioThemeConfig>) {
  const { t } = useTranslation("theme-portfolio");
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
        <TabButton active={activeTab === "home"} onClick={() => setActiveTab("home")} label={t("settings.tabs.home")} />
        <TabButton active={activeTab === "single"} onClick={() => setActiveTab("single")} label={t("settings.tabs.single")} />
        <TabButton active={activeTab === "author"} onClick={() => setActiveTab("author")} label={t("settings.tabs.author")} />
        <TabButton active={activeTab === "footer"} onClick={() => setActiveTab("footer")} label={t("settings.tabs.footer")} />
        <TabButton active={activeTab === "logo"} onClick={() => setActiveTab("logo")} label={t("settings.tabs.logo")} />
        <TabButton active={activeTab === "style"} onClick={() => setActiveTab("style")} label={t("settings.tabs.style")} />
      </nav>

      {activeTab === "home" && <HomeTab config={config} save={save} />}
      {activeTab === "single" && <SingleTab config={config} save={save} />}
      {activeTab === "author" && <AuthorTab config={config} save={save} />}
      {activeTab === "footer" && <FooterTab config={config} save={save} />}
      {activeTab === "logo" && <LogoTab config={config} save={save} />}
      {activeTab === "style" && <StyleTab config={config} save={save} />}
    </div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
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

// ───── Section helpers ─────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card p-4 space-y-3">
      <h3 className="font-semibold">{title}</h3>
      {children}
    </section>
  );
}

function TextField({ label, value, onChange, help, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; help?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type="text"
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {help && <p className="text-xs text-surface-500 mt-1">{help}</p>}
    </div>
  );
}

function TextareaField({ label, value, onChange, help, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; help?: string; rows?: number;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <textarea
        className="input"
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {help && <p className="text-xs text-surface-500 mt-1">{help}</p>}
    </div>
  );
}

function NumberField({ label, value, onChange, help, min = 0 }: {
  label: string; value: number; onChange: (v: number) => void; help?: string; min?: number;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type="number"
        className="input"
        min={min}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
      />
      {help && <p className="text-xs text-surface-500 mt-1">{help}</p>}
    </div>
  );
}

function ToggleField({ label, value, onChange, help }: {
  label: string; value: boolean; onChange: (v: boolean) => void; help?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1"
      />
      <div className="flex-1">
        <label className="block text-sm">{label}</label>
        {help && <p className="text-xs text-surface-500">{help}</p>}
      </div>
    </div>
  );
}

function SaveBar({ onSave, saving }: { onSave: () => void; saving: boolean }) {
  const { t } = useTranslation("theme-portfolio");
  return (
    <div className="flex justify-end gap-2 pt-3 border-t border-surface-200 dark:border-surface-800">
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        <Loader2 className={saving ? "h-4 w-4 animate-spin" : "hidden"} />
        <Save className={saving ? "hidden" : "h-4 w-4"} />
        <span>{saving ? t("settings.buttons.saving") : t("settings.buttons.save")}</span>
      </button>
    </div>
  );
}

// ───── Home tab ────────────────────────────────────────────────────

function HomeTab({ config, save }: ThemeSettingsPageProps<PortfolioThemeConfig>) {
  const { t } = useTranslation("theme-portfolio");
  const [draft, setDraft] = useState<PortfolioHomeConfig>({ ...DEFAULT_PORTFOLIO_HOME, ...config.home });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await save({ ...config, home: draft });
      toast.success(t("settings.buttons.saved"));
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <Section title={t("settings.home.description")}>
        <TextField
          label={t("settings.home.heroHeadline")}
          value={draft.heroHeadline}
          onChange={(v) => setDraft({ ...draft, heroHeadline: v })}
        />
        <TextareaField
          label={t("settings.home.heroIntro")}
          value={draft.heroIntro}
          onChange={(v) => setDraft({ ...draft, heroIntro: v })}
          rows={4}
        />
        <div>
          <label className="label">{t("settings.home.variant")}</label>
          <select
            className="input"
            value={draft.variant}
            onChange={(e) => setDraft({ ...draft, variant: e.target.value as PortfolioHomeConfig["variant"] })}
          >
            <option value="staggered">{t("settings.home.variantStaggered")}</option>
            <option value="masonry">{t("settings.home.variantMasonry")}</option>
            <option value="standard">{t("settings.home.variantStandard")}</option>
          </select>
        </div>
        <NumberField
          label={t("settings.home.cardLimit")}
          value={draft.cardLimit}
          onChange={(v) => setDraft({ ...draft, cardLimit: v })}
          help={t("settings.home.cardLimitHelp")}
        />
        <ToggleField
          label={t("settings.home.showFilters")}
          value={draft.showFilters}
          onChange={(v) => setDraft({ ...draft, showFilters: v })}
          help={t("settings.home.showFiltersHelp")}
        />
      </Section>
      <SaveBar onSave={handleSave} saving={saving} />
    </div>
  );
}

// ───── Single tab ──────────────────────────────────────────────────

function SingleTab({ config, save }: ThemeSettingsPageProps<PortfolioThemeConfig>) {
  const { t } = useTranslation("theme-portfolio");
  const [draft, setDraft] = useState<PortfolioSingleConfig>({ ...DEFAULT_PORTFOLIO_SINGLE, ...config.single });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await save({ ...config, single: draft });
      toast.success(t("settings.buttons.saved"));
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <Section title={t("settings.single.description")}>
        <ToggleField
          label={t("settings.single.showHero")}
          value={draft.showHero}
          onChange={(v) => setDraft({ ...draft, showHero: v })}
        />
        <ToggleField
          label={t("settings.single.showNextProject")}
          value={draft.showNextProject}
          onChange={(v) => setDraft({ ...draft, showNextProject: v })}
        />
        <div className="grid grid-cols-3 gap-3">
          <TextField label={t("settings.single.defaultServicesLabel")} value={draft.defaultServicesLabel}
            onChange={(v) => setDraft({ ...draft, defaultServicesLabel: v })} />
          <TextField label={t("settings.single.defaultYearLabel")} value={draft.defaultYearLabel}
            onChange={(v) => setDraft({ ...draft, defaultYearLabel: v })} />
          <TextField label={t("settings.single.defaultAwardsLabel")} value={draft.defaultAwardsLabel}
            onChange={(v) => setDraft({ ...draft, defaultAwardsLabel: v })} />
        </div>
      </Section>
      <SaveBar onSave={handleSave} saving={saving} />
    </div>
  );
}

// ───── Author tab ──────────────────────────────────────────────────

function AuthorTab({ config, save }: ThemeSettingsPageProps<PortfolioThemeConfig>) {
  const { t } = useTranslation("theme-portfolio");
  const [draft, setDraft] = useState<PortfolioAuthorConfig>({ ...DEFAULT_PORTFOLIO_AUTHOR, ...config.author });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await save({ ...config, author: draft });
      toast.success(t("settings.buttons.saved"));
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <Section title={t("settings.author.description")}>
        <ToggleField
          label={t("settings.author.showExperience")}
          value={draft.showExperience}
          onChange={(v) => setDraft({ ...draft, showExperience: v })}
        />
        <ToggleField
          label={t("settings.author.showRecognition")}
          value={draft.showRecognition}
          onChange={(v) => setDraft({ ...draft, showRecognition: v })}
        />
      </Section>
      <SaveBar onSave={handleSave} saving={saving} />
    </div>
  );
}

// ───── Footer tab ──────────────────────────────────────────────────

function FooterTab({ config, save }: ThemeSettingsPageProps<PortfolioThemeConfig>) {
  const { t } = useTranslation("theme-portfolio");
  const [draft, setDraft] = useState<PortfolioFooterConfig>({ ...DEFAULT_PORTFOLIO_FOOTER, ...config.footer });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await save({ ...config, footer: draft });
      toast.success(t("settings.buttons.saved"));
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <Section title={t("settings.footer.description")}>
        <TextField
          label={t("settings.footer.copyright")}
          value={draft.copyright}
          onChange={(v) => setDraft({ ...draft, copyright: v })}
          help={t("settings.footer.copyrightHelp")}
        />
      </Section>
      <SaveBar onSave={handleSave} saving={saving} />
    </div>
  );
}

// ───── Logo tab ────────────────────────────────────────────────────

function LogoTab({ config, save }: ThemeSettingsPageProps<PortfolioThemeConfig>) {
  const { t } = useTranslation("theme-portfolio");
  const { settings, terms } = useCmsData();
  const [draft, setDraft] = useState<PortfolioBrandConfig>({ ...DEFAULT_PORTFOLIO_BRAND, ...config.brand });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const previewUrl =
    draft.logoEnabled && settings.baseUrl
      ? `${settings.baseUrl.replace(/\/+$/, "")}/${logoPath(THEME_ID)}?v=${draft.logoUpdatedAt}`
      : "";

  // Re-publishes /data/menu.json so the menu-loader's paintBranding
  // pass picks up the new (or removed) logo URL without waiting for
  // the next post publish.
  async function refreshMenuJson(nextBrand: PortfolioBrandConfig) {
    const patchedSettings = {
      ...settings,
      themeConfigs: {
        ...settings.themeConfigs,
        [THEME_ID]: { ...config, brand: nextBrand },
      },
    };
    try {
      const [posts, pages] = await Promise.all([
        fetchAllPosts({ type: "post" }),
        fetchAllPosts({ type: "page" }),
      ]);
      await publishMenuJson(patchedSettings, posts, pages, terms);
    } catch (err) {
      console.error("[theme-portfolio] menu.json refresh failed:", err);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await save({ ...config, brand: draft });
      toast.success(t("settings.buttons.saved"));
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(file: File) {
    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      toast.error("Unsupported file type. Use JPG, PNG, WebP, or SVG.");
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
      const nextBrand: PortfolioBrandConfig = {
        ...draft,
        logoEnabled: true,
        logoUpdatedAt: Date.now(),
      };
      setDraft(nextBrand);
      await save({ ...config, brand: nextBrand });
      await refreshMenuJson(nextBrand);
      toast.success("Logo uploaded.");
    } catch (err) {
      console.error("[theme-portfolio] logo upload failed:", err);
      toast.error("Logo upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleRemove() {
    setRemoving(true);
    try {
      await removeThemeLogo(THEME_ID);
      const nextBrand: PortfolioBrandConfig = {
        ...draft,
        logoEnabled: false,
        logoUpdatedAt: 0,
      };
      setDraft(nextBrand);
      await save({ ...config, brand: nextBrand });
      await refreshMenuJson(nextBrand);
      toast.success("Logo removed.");
    } catch (err) {
      console.error("[theme-portfolio] logo remove failed:", err);
      toast.error("Logo remove failed.");
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="space-y-4">
      <Section title={t("settings.logo.description")}>
        <TextField
          label={t("settings.logo.wordmark")}
          value={draft.wordmark}
          onChange={(v) => setDraft({ ...draft, wordmark: v })}
          help={t("settings.logo.wordmarkHelp")}
          placeholder="ARCHIVE"
        />
      </Section>

      <Section title="Logo image (optional)">
        <p className="text-xs text-surface-500">
          Recommended {LOGO_WIDTH}×{LOGO_HEIGHT}, transparent PNG / WebP / SVG.
          When set, the wordmark text is replaced by the image in the header.
        </p>
        <div className="flex items-center gap-4">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt=""
              className="h-20 w-auto max-w-[240px] bg-white p-2 ring-1 ring-surface-200 object-contain dark:ring-surface-700"
            />
          ) : (
            <div className="h-20 w-40 bg-surface-100 flex items-center justify-center text-surface-400 text-xs dark:bg-surface-800">
              No logo
            </div>
          )}
          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_LOGO_TYPES.join(",")}
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
              <Loader2 className={uploading ? "h-4 w-4 animate-spin" : "hidden"} />
              <Upload className={uploading ? "hidden" : "h-4 w-4"} />
              <span>{draft.logoEnabled ? t("settings.logo.replace") : t("settings.logo.upload")}</span>
            </button>
            {draft.logoEnabled && (
              <button
                type="button"
                className="btn-ghost text-red-600 hover:bg-red-50"
                onClick={handleRemove}
                disabled={uploading || removing}
              >
                <Loader2 className={removing ? "h-4 w-4 animate-spin" : "hidden"} />
                <Trash2 className={removing ? "hidden" : "h-4 w-4"} />
                <span>{t("settings.logo.remove")}</span>
              </button>
            )}
          </div>
        </div>
      </Section>

      <SaveBar onSave={handleSave} saving={saving} />
    </div>
  );
}

// ───── Style tab ───────────────────────────────────────────────────

function StyleTab({ config, save }: ThemeSettingsPageProps<PortfolioThemeConfig>) {
  const { t } = useTranslation("theme-portfolio");
  const [draft, setDraft] = useState<StyleOverrides>({ ...DEFAULT_STYLE, ...config.style });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await save({ ...config, style: draft });
      await applyAndUploadCustomCss({
        baseCssText: manifest.cssText ?? "",
        style: draft,
      });
      toast.success(t("settings.buttons.saved"));
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    setSaving(true);
    try {
      setDraft(DEFAULT_STYLE);
      await save({ ...config, style: DEFAULT_STYLE });
      await applyAndUploadCustomCss({
        baseCssText: manifest.cssText ?? "",
        style: DEFAULT_STYLE,
      });
      toast.success(t("settings.buttons.saved"));
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  function patchVar(name: string, value: string) {
    setDraft({ ...draft, vars: { ...draft.vars, [name]: value } });
  }
  function resetVar(name: string) {
    const next = { ...draft.vars };
    delete next[name];
    setDraft({ ...draft, vars: next });
  }

  const allFontOptions: FontOption[] = [
    ...Object.keys(FONT_PRESETS.serif).map((name) => ({ name, fallback: "serif" as const })),
    ...Object.keys(FONT_PRESETS.sans).map((name) => ({ name, fallback: "sans-serif" as const })),
  ];

  return (
    <div className="space-y-4">
      <Section title={t("settings.tabs.style")}>
        <link rel="stylesheet" href={buildAllFontsPreviewUrl()} />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">{t("settings.font.serif")}</label>
            <FontSelect
              options={allFontOptions}
              value={draft.fontSerif || DEFAULT_FONT_SERIF}
              onChange={(value) => setDraft({ ...draft, fontSerif: value })}
            />
          </div>
          <div>
            <label className="label">{t("settings.font.sans")}</label>
            <FontSelect
              options={allFontOptions}
              value={draft.fontSans || DEFAULT_FONT_SANS}
              onChange={(value) => setDraft({ ...draft, fontSans: value })}
            />
          </div>
        </div>
      </Section>

      {THEME_VAR_GROUPS.map((group: ThemeVarGroup) => (
        <Section key={group} title={t(`settings.groups.${group}`)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {THEME_VAR_SPECS.filter((s) => s.group === group).map((spec: ThemeVarSpec) => {
              const value = draft.vars[spec.name] ?? spec.defaultValue;
              const isOverride = draft.vars[spec.name] !== undefined;
              return (
                <div key={spec.name} className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="label">{t(`settings.${spec.labelKey}`)}</label>
                    {spec.type === "color" ? (
                      <input
                        type="color"
                        value={/^#/.test(value) ? value : spec.defaultValue}
                        onChange={(e) => patchVar(spec.name, e.target.value)}
                        className="input h-10 p-1"
                      />
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => patchVar(spec.name, e.target.value)}
                        className="input"
                      />
                    )}
                  </div>
                  {isOverride && (
                    <button
                      type="button"
                      onClick={() => resetVar(spec.name)}
                      className="p-2 text-surface-500 hover:text-surface-900 dark:hover:text-surface-100"
                      title={t("settings.buttons.reset")}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      ))}

      <div className="flex justify-end gap-2 pt-3 border-t border-surface-200 dark:border-surface-800">
        <button
          type="button"
          onClick={handleReset}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-200 dark:bg-surface-800 text-sm font-medium hover:bg-surface-300 dark:hover:bg-surface-700 disabled:opacity-50"
        >
          <Loader2 className={saving ? "h-4 w-4 animate-spin" : "hidden"} />
          <RotateCcw className={saving ? "hidden" : "h-4 w-4"} />
          <span>{saving ? t("settings.buttons.resetting") : t("settings.buttons.reset")}</span>
        </button>
        <SaveBar onSave={handleSave} saving={saving} />
      </div>
    </div>
  );
}
