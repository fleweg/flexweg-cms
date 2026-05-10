import { useRef, useState } from "react";
import { Image as ImageIcon, Loader2, Plus, RotateCcw, Save, Trash2, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  buildAuthorLookup,
  buildPublishContext,
  fetchAllPosts,
  FontSelect,
  type FontOption,
  logoPath,
  MediaPicker,
  pickMediaUrl,
  publishMenuJson,
  removeThemeLogo,
  toast,
  uploadThemeLogo,
  useCmsData,
} from "@flexweg/cms-runtime";
import type { ThemeSettingsPageProps } from "@flexweg/cms-runtime";
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
  type ThemeVarSpec,
} from "./style";
import { manifest } from "./manifest";
import {
  DEFAULT_STOREFRONT_BENTO,
  DEFAULT_STOREFRONT_CATALOG,
  DEFAULT_STOREFRONT_FOOTER,
  DEFAULT_STOREFRONT_HOME,
  DEFAULT_STOREFRONT_JOURNAL,
  DEFAULT_STOREFRONT_PRODUCT_DEFAULTS,
  DEFAULT_STOREFRONT_SINGLE,
  DEFAULT_STOREFRONT_STORE_INFO,
  DEFAULT_STOREFRONT_TRENDING,
  type CategoryRowLayout,
  type StorefrontBentoCard,
  type StorefrontCategoryRow,
  type StorefrontCatalogConfig,
  type StorefrontFooterConfig,
  type StorefrontHomeConfig,
  type StorefrontProductDefaults,
  type StorefrontSingleConfig,
  type StorefrontThemeConfig,
  type TrendingProductsMode,
} from "./config";
import {
  cleanupOldCatalogPath,
  republishCatalog,
} from "./services/catalogPublisher";

const THEME_ID = "storefront";
const LOGO_WIDTH = 480;
const LOGO_HEIGHT = 144;
const LOGO_FIT: "cover" | "contain" = "contain";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type ActiveTab =
  | "home"
  | "single"
  | "productDefaults"
  | "catalog"
  | "footer"
  | "logo"
  | "style";

export function StorefrontSettingsPage({
  config,
  save,
}: ThemeSettingsPageProps<StorefrontThemeConfig>) {
  const { t } = useTranslation("theme-storefront");
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
        <TabButton active={activeTab === "productDefaults"} onClick={() => setActiveTab("productDefaults")} label={t("settings.tabs.productDefaults")} />
        <TabButton active={activeTab === "catalog"} onClick={() => setActiveTab("catalog")} label={t("settings.tabs.catalog")} />
        <TabButton active={activeTab === "footer"} onClick={() => setActiveTab("footer")} label={t("settings.tabs.footer")} />
        <TabButton active={activeTab === "logo"} onClick={() => setActiveTab("logo")} label={t("settings.tabs.logo")} />
        <TabButton active={activeTab === "style"} onClick={() => setActiveTab("style")} label={t("settings.tabs.style")} />
      </nav>

      {activeTab === "home" && <HomeTab config={config} save={save} />}
      {activeTab === "single" && <SingleTab config={config} save={save} />}
      {activeTab === "productDefaults" && <ProductDefaultsTab config={config} save={save} />}
      {activeTab === "catalog" && <CatalogTab config={config} save={save} />}
      {activeTab === "footer" && <FooterTab config={config} save={save} />}
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

// ─── Home tab ──────────────────────────────────────────────────────
function HomeTab({ config, save }: ThemeSettingsPageProps<StorefrontThemeConfig>) {
  const { t } = useTranslation("theme-storefront");
  const { terms } = useCmsData();
  const [draft, setDraft] = useState<StorefrontHomeConfig>({
    ...DEFAULT_STOREFRONT_HOME,
    ...(config.home ?? {}),
    hero: { ...DEFAULT_STOREFRONT_HOME.hero, ...(config.home?.hero ?? {}) },
    bento: { ...DEFAULT_STOREFRONT_BENTO, ...(config.home?.bento ?? {}) },
    trending: { ...DEFAULT_STOREFRONT_TRENDING, ...(config.home?.trending ?? {}) },
    journal: { ...DEFAULT_STOREFRONT_JOURNAL, ...(config.home?.journal ?? {}) },
    storeInfo: {
      ...DEFAULT_STOREFRONT_STORE_INFO,
      ...(config.home?.storeInfo ?? {}),
      hours:
        config.home?.storeInfo?.hours ?? DEFAULT_STOREFRONT_STORE_INFO.hours,
    },
    reviews: { ...DEFAULT_STOREFRONT_HOME.reviews, ...(config.home?.reviews ?? {}) },
  });
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
    <div className="space-y-6">
      <Section title={t("settings.home.bento.heading")}>
        <ToggleField label={t("settings.home.bento.enabled")} value={draft.bento.enabled}
          onChange={(v) => setDraft({ ...draft, bento: { ...draft.bento, enabled: v } })} />
        <TextField label={t("settings.home.bento.eyebrow")} value={draft.bento.eyebrow}
          onChange={(v) => setDraft({ ...draft, bento: { ...draft.bento, eyebrow: v } })} />
        <TextField label={t("settings.home.bento.title")} value={draft.bento.title}
          onChange={(v) => setDraft({ ...draft, bento: { ...draft.bento, title: v } })} />
        <TextareaField label={t("settings.home.bento.subtitle")} value={draft.bento.subtitle}
          onChange={(v) => setDraft({ ...draft, bento: { ...draft.bento, subtitle: v } })} />
        <div className="grid grid-cols-2 gap-3">
          <TextField label={t("settings.home.bento.viewAllLabel")} value={draft.bento.viewAllLabel}
            onChange={(v) => setDraft({ ...draft, bento: { ...draft.bento, viewAllLabel: v } })} />
          <TextField label={t("settings.home.bento.viewAllHref")} value={draft.bento.viewAllHref}
            onChange={(v) => setDraft({ ...draft, bento: { ...draft.bento, viewAllHref: v } })} />
        </div>
        <BentoCardsEditor cards={draft.bento.cards}
          onChange={(cards) => setDraft({ ...draft, bento: { ...draft.bento, cards } })} />
      </Section>

      <Section title={t("settings.home.trending.heading")}>
        <ToggleField label={t("settings.home.trending.enabled")} value={draft.trending.enabled}
          onChange={(v) => setDraft({ ...draft, trending: { ...draft.trending, enabled: v } })} />
        <TextField label={t("settings.home.trending.eyebrow")} value={draft.trending.eyebrow}
          onChange={(v) => setDraft({ ...draft, trending: { ...draft.trending, eyebrow: v } })} />
        <TextField label={t("settings.home.trending.title")} value={draft.trending.title}
          onChange={(v) => setDraft({ ...draft, trending: { ...draft.trending, title: v } })} />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">{t("settings.home.trending.mode")}</label>
            <select className="input" value={draft.trending.mode}
              onChange={(e) => setDraft({ ...draft, trending: { ...draft.trending, mode: e.target.value as TrendingProductsMode } })}>
              <option value="all">{t("settings.home.trending.modeAll")}</option>
              <option value="category">{t("settings.home.trending.modeCategory")}</option>
            </select>
          </div>
          <NumberField label={t("settings.home.trending.count")} value={draft.trending.count}
            onChange={(v) => setDraft({ ...draft, trending: { ...draft.trending, count: v } })} />
        </div>
        {draft.trending.mode === "category" && (
          <div>
            <label className="label">{t("settings.home.trending.categoryId")}</label>
            <select className="input" value={draft.trending.categoryId}
              onChange={(e) => setDraft({ ...draft, trending: { ...draft.trending, categoryId: e.target.value } })}>
              <option value="">—</option>
              {terms.filter((tt) => tt.type === "category").map((tt) => (
                <option key={tt.id} value={tt.id}>{tt.name}</option>
              ))}
            </select>
          </div>
        )}
      </Section>

      <Section title={t("settings.home.categoryRows.heading")}>
        <p className="text-sm text-surface-600 dark:text-surface-300 -mt-2 mb-2">
          {t("settings.home.categoryRows.description")}
        </p>
        <CategoryRowsEditor
          rows={draft.categoryRows ?? []}
          terms={terms.filter((tt) => tt.type === "category")}
          onChange={(rows) => setDraft({ ...draft, categoryRows: rows })}
        />
      </Section>

      <Section title={t("settings.home.storeInfo.heading")}>
        <ToggleField label={t("settings.home.storeInfo.enabled")} value={draft.storeInfo.enabled}
          onChange={(v) => setDraft({ ...draft, storeInfo: { ...draft.storeInfo, enabled: v } })} />
        <TextField label={t("settings.home.storeInfo.eyebrow")} value={draft.storeInfo.eyebrow}
          onChange={(v) => setDraft({ ...draft, storeInfo: { ...draft.storeInfo, eyebrow: v } })} />
        <TextField label={t("settings.home.storeInfo.title")} value={draft.storeInfo.title}
          onChange={(v) => setDraft({ ...draft, storeInfo: { ...draft.storeInfo, title: v } })} />
        <ImageUrlField
          label={t("settings.home.storeInfo.imageUrl")}
          value={draft.storeInfo.imageUrl}
          onChange={(url, alt) =>
            setDraft({
              ...draft,
              storeInfo: {
                ...draft.storeInfo,
                imageUrl: url,
                imageAlt:
                  alt && alt.length > 0 ? alt : draft.storeInfo.imageAlt,
              },
            })
          }
          help={t("settings.home.storeInfo.imageHelp")}
        />
        <TextField label={t("settings.home.storeInfo.imageAlt")} value={draft.storeInfo.imageAlt}
          onChange={(v) => setDraft({ ...draft, storeInfo: { ...draft.storeInfo, imageAlt: v } })} />
        <div className="grid grid-cols-2 gap-3">
          <TextField label={t("settings.home.storeInfo.addressLabel")} value={draft.storeInfo.addressLabel}
            onChange={(v) => setDraft({ ...draft, storeInfo: { ...draft.storeInfo, addressLabel: v } })} />
          <TextField label={t("settings.home.storeInfo.hoursLabel")} value={draft.storeInfo.hoursLabel}
            onChange={(v) => setDraft({ ...draft, storeInfo: { ...draft.storeInfo, hoursLabel: v } })} />
        </div>
        <TextareaField label={t("settings.home.storeInfo.address")} value={draft.storeInfo.address}
          help={t("settings.home.storeInfo.addressHelp")}
          onChange={(v) => setDraft({ ...draft, storeInfo: { ...draft.storeInfo, address: v } })} />
        <TextareaField
          label={t("settings.home.storeInfo.hours")}
          value={(draft.storeInfo.hours ?? []).join("\n")}
          help={t("settings.home.storeInfo.hoursHelp")}
          onChange={(v) =>
            setDraft({
              ...draft,
              storeInfo: {
                ...draft.storeInfo,
                hours: v.split(/\r?\n/).map((s) => s.trim()).filter(Boolean),
              },
            })
          }
        />
        <div className="grid grid-cols-2 gap-3">
          <TextField label={t("settings.home.storeInfo.ctaLabel")} value={draft.storeInfo.ctaLabel}
            onChange={(v) => setDraft({ ...draft, storeInfo: { ...draft.storeInfo, ctaLabel: v } })} />
          <TextField label={t("settings.home.storeInfo.ctaHref")} value={draft.storeInfo.ctaHref}
            help={t("settings.home.storeInfo.ctaHelp")}
            onChange={(v) => setDraft({ ...draft, storeInfo: { ...draft.storeInfo, ctaHref: v } })} />
        </div>
      </Section>

      <Section title={t("settings.home.journal.heading")}>
        <ToggleField label={t("settings.home.journal.enabled")} value={draft.journal.enabled}
          onChange={(v) => setDraft({ ...draft, journal: { ...draft.journal, enabled: v } })} />
        <ImageUrlField
          label={t("settings.home.journal.imageUrl")}
          value={draft.journal.imageUrl}
          onChange={(url, alt) =>
            setDraft({
              ...draft,
              journal: {
                ...draft.journal,
                imageUrl: url,
                imageAlt: alt && alt.length > 0 ? alt : draft.journal.imageAlt,
              },
            })
          }
        />
        <TextField label={t("settings.home.journal.imageAlt")} value={draft.journal.imageAlt}
          onChange={(v) => setDraft({ ...draft, journal: { ...draft.journal, imageAlt: v } })} />
        <TextField label={t("settings.home.journal.eyebrow")} value={draft.journal.eyebrow}
          onChange={(v) => setDraft({ ...draft, journal: { ...draft.journal, eyebrow: v } })} />
        <div className="grid grid-cols-2 gap-3">
          <TextField label={t("settings.home.journal.title")} value={draft.journal.title}
            onChange={(v) => setDraft({ ...draft, journal: { ...draft.journal, title: v } })} />
          <TextField label={t("settings.home.journal.titleItalicTail")} value={draft.journal.titleItalicTail}
            onChange={(v) => setDraft({ ...draft, journal: { ...draft.journal, titleItalicTail: v } })} />
        </div>
        <TextareaField label={t("settings.home.journal.subtitle")} value={draft.journal.subtitle}
          onChange={(v) => setDraft({ ...draft, journal: { ...draft.journal, subtitle: v } })} />
        <div className="grid grid-cols-2 gap-3">
          <TextField label={t("settings.home.journal.ctaLabel")} value={draft.journal.ctaLabel}
            onChange={(v) => setDraft({ ...draft, journal: { ...draft.journal, ctaLabel: v } })} />
          <TextField label={t("settings.home.journal.ctaHref")} value={draft.journal.ctaHref}
            onChange={(v) => setDraft({ ...draft, journal: { ...draft.journal, ctaHref: v } })} />
        </div>
      </Section>

      <SaveBar onSave={handleSave} saving={saving} />
    </div>
  );
}

function BentoCardsEditor({
  cards,
  onChange,
}: {
  cards: StorefrontBentoCard[];
  onChange: (next: StorefrontBentoCard[]) => void;
}) {
  function add() {
    onChange([
      ...cards,
      { imageUrl: "", imageAlt: "", label: "", ctaLabel: "Shop now", ctaHref: "", size: "small" },
    ]);
  }
  function remove(idx: number) {
    onChange(cards.filter((_, i) => i !== idx));
  }
  function patch(idx: number, next: Partial<StorefrontBentoCard>) {
    onChange(cards.map((c, i) => (i === idx ? { ...c, ...next } : c)));
  }
  return (
    <div className="border-t border-surface-200 pt-3 mt-3 dark:border-surface-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold">Bento cards ({cards.length})</span>
        <button type="button" onClick={add} className="text-xs flex items-center gap-1 text-blue-600">
          <Plus className="h-3.5 w-3.5" /> Add card
        </button>
      </div>
      <div className="space-y-3">
        {cards.map((card, idx) => (
          <div key={idx} className="rounded-md border border-surface-200 p-3 space-y-2 dark:border-surface-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">Card {idx + 1}</span>
              <button type="button" onClick={() => remove(idx)} className="p-1 text-red-500">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <ImageUrlField
              label="Image URL"
              value={card.imageUrl}
              onChange={(url, alt) =>
                patch(idx, {
                  imageUrl: url,
                  imageAlt: alt && alt.length > 0 ? alt : card.imageAlt,
                })
              }
              format="medium"
            />
            <input className="input" placeholder="Image alt" value={card.imageAlt}
              onChange={(e) => patch(idx, { imageAlt: e.target.value })} />
            <input className="input" placeholder="Label" value={card.label}
              onChange={(e) => patch(idx, { label: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <input className="input" placeholder="CTA label" value={card.ctaLabel}
                onChange={(e) => patch(idx, { ctaLabel: e.target.value })} />
              <input className="input" placeholder="CTA link" value={card.ctaHref}
                onChange={(e) => patch(idx, { ctaHref: e.target.value })} />
            </div>
            <select className="input" value={card.size}
              onChange={(e) => patch(idx, { size: e.target.value as StorefrontBentoCard["size"] })}>
              <option value="large">Large (8 cols)</option>
              <option value="small">Small (4 cols)</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Category rows editor ─────────────────────────────────────────
// Variable-length list of per-category product rows. Each row
// surfaces N products from a single category, in either a 4-col
// grid or a horizontal slider with chevrons. Rows render in order
// under the trending row on the home.
const DEFAULT_ROW: StorefrontCategoryRow = {
  enabled: true,
  eyebrow: "",
  title: "",
  categoryId: "",
  count: 4,
  layout: "grid",
  viewAllLabel: "",
  viewAllHref: "",
};

function CategoryRowsEditor({
  rows,
  terms,
  onChange,
}: {
  rows: StorefrontCategoryRow[];
  terms: { id: string; name: string }[];
  onChange: (next: StorefrontCategoryRow[]) => void;
}) {
  const { t } = useTranslation("theme-storefront");
  function add() {
    onChange([...rows, { ...DEFAULT_ROW }]);
  }
  function remove(idx: number) {
    onChange(rows.filter((_, i) => i !== idx));
  }
  function move(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= rows.length) return;
    const copy = rows.slice();
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    onChange(copy);
  }
  function patch(idx: number, next: Partial<StorefrontCategoryRow>) {
    onChange(rows.map((r, i) => (i === idx ? { ...r, ...next } : r)));
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold">
          {t("settings.home.categoryRows.count", { count: rows.length })}
        </span>
        <button
          type="button"
          onClick={add}
          className="text-xs flex items-center gap-1 text-blue-600"
        >
          <Plus className="h-3.5 w-3.5" /> {t("settings.home.categoryRows.add")}
        </button>
      </div>
      <div className="space-y-3">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="rounded-md border border-surface-200 p-3 space-y-2 dark:border-surface-700"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">
                {t("settings.home.categoryRows.row", { index: idx + 1 })}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(idx, -1)}
                  className="p-1 text-surface-500 hover:text-surface-900 dark:text-surface-400"
                  title={t("settings.home.categoryRows.moveUp")}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(idx, 1)}
                  className="p-1 text-surface-500 hover:text-surface-900 dark:text-surface-400"
                  title={t("settings.home.categoryRows.moveDown")}
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="p-1 text-red-500"
                  title={t("settings.home.categoryRows.remove")}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={row.enabled}
                onChange={(e) => patch(idx, { enabled: e.target.checked })}
              />
              <span>{t("settings.home.categoryRows.enabled")}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                className="input"
                placeholder={t("settings.home.categoryRows.eyebrow")}
                value={row.eyebrow}
                onChange={(e) => patch(idx, { eyebrow: e.target.value })}
              />
              <input
                className="input"
                placeholder={t("settings.home.categoryRows.title")}
                value={row.title}
                onChange={(e) => patch(idx, { title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                className="input"
                value={row.categoryId}
                onChange={(e) => patch(idx, { categoryId: e.target.value })}
              >
                <option value="">{t("settings.home.categoryRows.allProducts")}</option>
                {terms.map((tt) => (
                  <option key={tt.id} value={tt.id}>
                    {tt.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                className="input"
                min="1"
                max="20"
                value={row.count}
                onChange={(e) =>
                  patch(idx, { count: parseInt(e.target.value, 10) || 4 })
                }
              />
            </div>
            <select
              className="input"
              value={row.layout}
              onChange={(e) =>
                patch(idx, { layout: e.target.value as CategoryRowLayout })
              }
            >
              <option value="grid">{t("settings.home.categoryRows.layoutGrid")}</option>
              <option value="slider">{t("settings.home.categoryRows.layoutSlider")}</option>
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input
                className="input"
                placeholder={t("settings.home.categoryRows.viewAllLabel")}
                value={row.viewAllLabel}
                onChange={(e) => patch(idx, { viewAllLabel: e.target.value })}
              />
              <input
                className="input"
                placeholder={t("settings.home.categoryRows.viewAllHref")}
                value={row.viewAllHref}
                onChange={(e) => patch(idx, { viewAllHref: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Single tab ───────────────────────────────────────────────────
function SingleTab({ config, save }: ThemeSettingsPageProps<StorefrontThemeConfig>) {
  const { t } = useTranslation("theme-storefront");
  const [draft, setDraft] = useState<StorefrontSingleConfig>({
    ...DEFAULT_STOREFRONT_SINGLE,
    ...(config.single ?? {}),
  });
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

  function patchItem(idx: number, value: string) {
    const items = [...draft.careKitItems];
    items[idx] = value;
    setDraft({ ...draft, careKitItems: items });
  }
  function removeItem(idx: number) {
    setDraft({ ...draft, careKitItems: draft.careKitItems.filter((_, i) => i !== idx) });
  }
  function addItem() {
    setDraft({ ...draft, careKitItems: [...draft.careKitItems, ""] });
  }

  return (
    <div className="space-y-6">
      <Section title={t("settings.tabs.single")}>
        <p className="text-sm text-surface-600 dark:text-surface-300 -mt-2 mb-2">
          {t("settings.single.description")}
        </p>
        <ToggleField label={t("settings.single.showAuthorBio")} value={draft.showAuthorBio}
          onChange={(v) => setDraft({ ...draft, showAuthorBio: v })} />
        <ToggleField label={t("settings.single.showRelatedProducts")} value={draft.showRelatedProducts}
          onChange={(v) => setDraft({ ...draft, showRelatedProducts: v })} />
        <TextField label={t("settings.single.relatedTitle")} value={draft.relatedTitle}
          onChange={(v) => setDraft({ ...draft, relatedTitle: v })} />
        <ToggleField label={t("settings.single.showCareKit")} value={draft.showCareKit}
          onChange={(v) => setDraft({ ...draft, showCareKit: v })} />
        {draft.showCareKit && (
          <>
            <TextField label={t("settings.single.careKitTitle")} value={draft.careKitTitle}
              onChange={(v) => setDraft({ ...draft, careKitTitle: v })} />
            <TextareaField label={t("settings.single.careKitDescription")} value={draft.careKitDescription}
              onChange={(v) => setDraft({ ...draft, careKitDescription: v })} />
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="label !mb-0">{t("settings.single.careKitItems")} ({draft.careKitItems.length})</span>
                <button type="button" onClick={addItem} className="text-xs flex items-center gap-1 text-blue-600">
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {draft.careKitItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input className="input flex-1" value={item}
                      onChange={(e) => patchItem(idx, e.target.value)} />
                    <button type="button" onClick={() => removeItem(idx)} className="p-1 text-red-500">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </Section>
      <SaveBar onSave={handleSave} saving={saving} />
    </div>
  );
}

// ─── Product defaults tab ─────────────────────────────────────────
function ProductDefaultsTab({ config, save }: ThemeSettingsPageProps<StorefrontThemeConfig>) {
  const { t } = useTranslation("theme-storefront");
  const [draft, setDraft] = useState<StorefrontProductDefaults>({
    ...DEFAULT_STOREFRONT_PRODUCT_DEFAULTS,
    ...(config.productDefaults ?? {}),
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await save({ ...config, productDefaults: draft });
      toast.success(t("settings.buttons.saved"));
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Section title={t("settings.tabs.productDefaults")}>
        <p className="text-sm text-surface-600 dark:text-surface-300 -mt-2 mb-2">
          {t("settings.productDefaults.description")}
        </p>
        <TextField label={t("settings.productDefaults.currency")} value={draft.currency}
          onChange={(v) => setDraft({ ...draft, currency: v.toUpperCase() })} />
        <div className="grid grid-cols-2 gap-3">
          <TextField label={t("settings.productDefaults.ctaLabel")} value={draft.ctaLabel}
            onChange={(v) => setDraft({ ...draft, ctaLabel: v })} />
          <TextField label={t("settings.productDefaults.ctaHref")} value={draft.ctaHref}
            onChange={(v) => setDraft({ ...draft, ctaHref: v })} />
        </div>
        <ToggleField label={t("settings.productDefaults.inquiryOnly")} value={draft.inquiryOnly}
          onChange={(v) => setDraft({ ...draft, inquiryOnly: v })} />
      </Section>
      <SaveBar onSave={handleSave} saving={saving} />
    </div>
  );
}

// ─── Catalog tab ──────────────────────────────────────────────────
function CatalogTab({ config, save }: ThemeSettingsPageProps<StorefrontThemeConfig>) {
  const { t } = useTranslation("theme-storefront");
  const { settings, terms, users, media } = useCmsData();
  const [draft, setDraft] = useState<StorefrontCatalogConfig>({
    ...DEFAULT_STOREFRONT_CATALOG,
    ...(config.catalog ?? {}),
    filters: {
      ...DEFAULT_STOREFRONT_CATALOG.filters,
      ...(config.catalog?.filters ?? {}),
    },
  });
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const cleanedSlug = (draft.slug || "catalog.html").replace(/^\/+/, "");
      const oldPath = config.catalog?.lastPublishedPath ?? "";
      const newPath = cleanedSlug;
      const next: StorefrontCatalogConfig = {
        ...draft,
        slug: cleanedSlug,
        lastPublishedPath: newPath,
      };
      await save({ ...config, catalog: next });
      await cleanupOldCatalogPath(oldPath, newPath);
      const [posts, pages] = await Promise.all([
        fetchAllPosts({ type: "post" }),
        fetchAllPosts({ type: "page" }),
      ]);
      const patchedSettings = {
        ...settings,
        themeConfigs: { ...settings.themeConfigs, [THEME_ID]: { ...config, catalog: next } },
      };
      await publishMenuJson(patchedSettings, posts, pages, terms);
      toast.success(t("settings.buttons.saved"));
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleForceRegenerate() {
    setRegenerating(true);
    try {
      const authorLookup = buildAuthorLookup(users, media);
      const ctx = await buildPublishContext({ settings, terms, users, authorLookup });
      await republishCatalog(ctx);
      const next: StorefrontCatalogConfig = { ...draft, jsonLastGeneratedAt: Date.now() };
      setDraft(next);
      await save({ ...config, catalog: next });
      toast.success(t("settings.buttons.saved"));
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setRegenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <Section title={t("settings.tabs.catalog")}>
        <p className="text-sm text-surface-600 dark:text-surface-300 -mt-2 mb-2">
          {t("settings.catalog.description")}
        </p>
        <ToggleField label={t("settings.catalog.enabled")} value={draft.enabled}
          help={t("settings.catalog.enabledHelp")}
          onChange={(v) => setDraft({ ...draft, enabled: v })} />
        <TextField label={t("settings.catalog.slug")} value={draft.slug}
          help={t("settings.catalog.slugHelp")}
          onChange={(v) => setDraft({ ...draft, slug: v })} />
        <div className="grid grid-cols-2 gap-3">
          <TextField label={t("settings.catalog.pageTitle")} value={draft.pageTitle}
            onChange={(v) => setDraft({ ...draft, pageTitle: v })} />
          <TextField label={t("settings.catalog.pageHeading")} value={draft.pageHeading}
            onChange={(v) => setDraft({ ...draft, pageHeading: v })} />
        </div>
        <TextareaField label={t("settings.catalog.pageSubtitle")} value={draft.pageSubtitle}
          onChange={(v) => setDraft({ ...draft, pageSubtitle: v })} />
        <div className="grid grid-cols-2 gap-3">
          <ToggleField label={t("settings.catalog.addToMenu")} value={draft.addToMenu}
            onChange={(v) => setDraft({ ...draft, addToMenu: v })} />
          <TextField label={t("settings.catalog.menuLabel")} value={draft.menuLabel}
            onChange={(v) => setDraft({ ...draft, menuLabel: v })} />
        </div>
      </Section>

      <Section title={t("settings.catalog.filtersHeading")}>
        <ToggleField label={t("settings.catalog.showSearch")} value={draft.filters.showSearch}
          onChange={(v) => setDraft({ ...draft, filters: { ...draft.filters, showSearch: v } })} />
        <ToggleField label={t("settings.catalog.showCategoryFilter")} value={draft.filters.showCategoryFilter}
          onChange={(v) => setDraft({ ...draft, filters: { ...draft.filters, showCategoryFilter: v } })} />
        <ToggleField label={t("settings.catalog.showTagFilter")} value={draft.filters.showTagFilter}
          onChange={(v) => setDraft({ ...draft, filters: { ...draft.filters, showTagFilter: v } })} />
        <ToggleField label={t("settings.catalog.showPriceRange")} value={draft.filters.showPriceRange}
          onChange={(v) => setDraft({ ...draft, filters: { ...draft.filters, showPriceRange: v } })} />
        <ToggleField label={t("settings.catalog.showStockFilter")} value={draft.filters.showStockFilter}
          onChange={(v) => setDraft({ ...draft, filters: { ...draft.filters, showStockFilter: v } })} />
        <ToggleField label={t("settings.catalog.showSortBy")} value={draft.filters.showSortBy}
          onChange={(v) => setDraft({ ...draft, filters: { ...draft.filters, showSortBy: v } })} />
        <div>
          <label className="label">{t("settings.catalog.initialColumns")}</label>
          <select className="input" value={String(draft.initialColumns)}
            onChange={(e) => setDraft({ ...draft, initialColumns: parseInt(e.target.value, 10) as 2 | 3 | 4 })}>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
      </Section>

      <Section title={t("settings.catalog.forceRegenerate")}>
        <p className="text-sm text-surface-600 dark:text-surface-300">
          {t("settings.catalog.forceRegenerateHelp")}
        </p>
        <p className="text-xs text-surface-500">
          {t("settings.catalog.lastGenerated")}:{" "}
          {draft.jsonLastGeneratedAt
            ? new Date(draft.jsonLastGeneratedAt).toLocaleString()
            : t("settings.catalog.never")}
        </p>
        <button type="button" onClick={handleForceRegenerate} disabled={regenerating || !draft.enabled}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-low border border-outline-variant text-sm font-medium hover:bg-surface-container disabled:opacity-50">
          {regenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
          {regenerating ? t("settings.buttons.regenerating") : t("settings.buttons.forceRegenerate")}
        </button>
      </Section>

      <SaveBar onSave={handleSave} saving={saving} />
    </div>
  );
}

// ─── Footer tab ───────────────────────────────────────────────────
function FooterTab({ config, save }: ThemeSettingsPageProps<StorefrontThemeConfig>) {
  const { t } = useTranslation("theme-storefront");
  const [draft, setDraft] = useState<StorefrontFooterConfig>({
    ...DEFAULT_STOREFRONT_FOOTER,
    ...(config.footer ?? {}),
  });
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
    <div className="space-y-6">
      <Section title={t("settings.tabs.footer")}>
        <TextareaField label={t("settings.footer.tagline")} value={draft.tagline}
          help={t("settings.footer.taglineHelp")}
          onChange={(v) => setDraft({ ...draft, tagline: v })} />
        <ToggleField label={t("settings.footer.showSocials")} value={draft.showSocials}
          onChange={(v) => setDraft({ ...draft, showSocials: v })} />
      </Section>

      <SaveBar onSave={handleSave} saving={saving} />
    </div>
  );
}

// ─── Logo tab ─────────────────────────────────────────────────────
function LogoTab({ config, save }: ThemeSettingsPageProps<StorefrontThemeConfig>) {
  const { t } = useTranslation("theme-storefront");
  const { settings, terms } = useCmsData();
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const previewUrl =
    config.logoEnabled && settings.baseUrl
      ? `${settings.baseUrl.replace(/\/+$/, "")}/${logoPath(THEME_ID)}?v=${config.logoUpdatedAt}`
      : "";

  async function refreshMenuJson(nextConfig: StorefrontThemeConfig) {
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
      console.error("[theme-storefront] menu.json refresh failed:", err);
    }
  }

  async function handleUpload(file: File) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(t("settings.logo.invalidType"));
      return;
    }
    setUploading(true);
    try {
      await uploadThemeLogo({ themeId: THEME_ID, file, width: LOGO_WIDTH, height: LOGO_HEIGHT, fit: LOGO_FIT });
      const next: StorefrontThemeConfig = { ...config, logoEnabled: true, logoUpdatedAt: Date.now() };
      await save(next);
      await refreshMenuJson(next);
      toast.success(t("settings.logo.saved"));
    } catch (err) {
      console.error("[theme-storefront] logo upload failed:", err);
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
      const next: StorefrontThemeConfig = { ...config, logoEnabled: false, logoUpdatedAt: Date.now() };
      await save(next);
      await refreshMenuJson(next);
      toast.success(t("settings.logo.removed"));
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Section title={t("settings.tabs.logo")}>
        <p className="text-sm text-surface-600 dark:text-surface-300 -mt-2 mb-2">
          {t("settings.logo.description")}
        </p>
        {previewUrl && (
          <div className="rounded-lg border border-surface-200 bg-surface-50 p-4 dark:border-surface-800 dark:bg-surface-900">
            <img src={previewUrl} alt="Logo preview" className="max-h-24 w-auto" />
          </div>
        )}
        <div className="flex items-center gap-3">
          <input ref={fileInputRef} type="file" accept={ALLOWED_TYPES.join(",")} className="hidden"
            onChange={(e) => { const file = e.target.files?.[0]; if (file) handleUpload(file); }} />
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {config.logoEnabled ? t("settings.logo.replace") : t("settings.logo.upload")}
          </button>
          {config.logoEnabled && (
            <button type="button" onClick={handleRemove} disabled={removing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 disabled:opacity-50">
              {removing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              {t("settings.logo.remove")}
            </button>
          )}
        </div>
      </Section>
    </div>
  );
}

// ─── Style tab ────────────────────────────────────────────────────
function StyleTab({ config, save }: ThemeSettingsPageProps<StorefrontThemeConfig>) {
  const { t } = useTranslation("theme-storefront");
  const [draft, setDraft] = useState<StyleOverrides>({
    ...DEFAULT_STYLE,
    ...(config.style ?? {}),
    vars: { ...(config.style?.vars ?? {}) },
  });
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

  function patchVar(name: string, value: string) {
    const next = { ...draft.vars };
    if (value && value.trim()) next[name] = value;
    else delete next[name];
    setDraft({ ...draft, vars: next });
  }
  function clearVar(name: string) {
    const next = { ...draft.vars };
    delete next[name];
    setDraft({ ...draft, vars: next });
  }

  const fontSerifOptions: FontOption[] = Object.keys(FONT_PRESETS.serif).map((name) => ({
    name,
    fallback: "serif",
  }));
  const fontSansOptions: FontOption[] = Object.keys(FONT_PRESETS.sans).map((name) => ({
    name,
    fallback: "sans-serif",
  }));

  return (
    <div className="space-y-6">
      <Section title={t("settings.tabs.style")}>
        <link rel="stylesheet" href={buildAllFontsPreviewUrl()} />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">{t("settings.font.serif")}</label>
            <FontSelect
              options={fontSerifOptions}
              value={draft.fontSerif || DEFAULT_FONT_SERIF}
              onChange={(value) => setDraft({ ...draft, fontSerif: value })}
            />
          </div>
          <div>
            <label className="label">{t("settings.font.sans")}</label>
            <FontSelect
              options={fontSansOptions}
              value={draft.fontSans || DEFAULT_FONT_SANS}
              onChange={(value) => setDraft({ ...draft, fontSans: value })}
            />
          </div>
        </div>
      </Section>

      {THEME_VAR_GROUPS.map((group) => (
        <Section key={group} title={t(`settings.groups.${group}`)}>
          {THEME_VAR_SPECS.filter((s) => s.group === group).map((spec) => (
            <VarRow key={spec.name} spec={spec}
              value={draft.vars[spec.name] ?? ""}
              onChange={(v) => patchVar(spec.name, v)}
              onClear={() => clearVar(spec.name)}
              labelText={t(`settings.${spec.labelKey}`)} />
          ))}
        </Section>
      ))}

      <SaveBar onSave={handleSave} saving={saving} />
    </div>
  );
}

function VarRow({
  spec,
  value,
  onChange,
  onClear,
  labelText,
}: {
  spec: ThemeVarSpec;
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  labelText: string;
}) {
  const effective = value || spec.defaultValue;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <label className="text-sm text-surface-700 dark:text-surface-300">{labelText}</label>
      </div>
      {spec.type === "color" ? (
        <input type="color"
          className="h-8 w-14 rounded border border-surface-300 dark:border-surface-700 cursor-pointer"
          value={effective}
          onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input type="text" className="input flex-1 max-w-xs" placeholder={spec.defaultValue}
          value={value}
          onChange={(e) => onChange(e.target.value)} />
      )}
      <button type="button" onClick={onClear} title="Reset to default"
        className="p-1 text-surface-400 hover:text-surface-700">
        <RotateCcw className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ─── Shared widgets ───────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-surface-200 dark:border-surface-800 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-50">{title}</h3>
      {children}
    </section>
  );
}

// Image URL field with optional "Pick from media library" button.
// onChange receives both the URL and the picked media's alt text so
// the parent can patch both fields at once. The picker modal is
// mounted conditionally per-instance — multiple ImageUrlFields on
// the same screen don't collide.
function ImageUrlField({
  label,
  value,
  onChange,
  help,
  format = "large",
}: {
  label: string;
  value: string;
  onChange: (url: string, alt?: string) => void;
  help?: string;
  format?: string;
}) {
  const [showPicker, setShowPicker] = useState(false);
  return (
    <>
      <div>
        <label className="label">{label}</label>
        <div className="flex items-center gap-2">
          <input
            type="url"
            className="input flex-1"
            placeholder="https://…"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-700 text-xs font-medium text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 shrink-0"
            title="Pick from media library"
          >
            <ImageIcon className="h-3.5 w-3.5" />
            Media
          </button>
        </div>
        {help && <p className="text-xs text-surface-500 mt-1">{help}</p>}
      </div>
      {showPicker && (
        <MediaPicker
          onPick={(m) => {
            const url = pickMediaUrl(m, format);
            onChange(url, m.alt ?? "");
            setShowPicker(false);
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  );
}

function ToggleField({ label, value, onChange, help }: {
  label: string; value: boolean; onChange: (v: boolean) => void; help?: string;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 cursor-pointer text-sm text-surface-900 dark:text-surface-50">
        <input type="checkbox" className="h-4 w-4 rounded border-surface-300"
          checked={value}
          onChange={(e) => onChange(e.target.checked)} />
        <span>{label}</span>
      </label>
      {help && <p className="text-xs text-surface-500 mt-1">{help}</p>}
    </div>
  );
}

function TextField({ label, value, onChange, help }: {
  label: string; value: string; onChange: (v: string) => void; help?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input type="text" className="input" value={value}
        onChange={(e) => onChange(e.target.value)} />
      {help && <p className="text-xs text-surface-500 mt-1">{help}</p>}
    </div>
  );
}

function TextareaField({ label, value, onChange, help }: {
  label: string; value: string; onChange: (v: string) => void; help?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <textarea className="input" rows={3} value={value}
        onChange={(e) => onChange(e.target.value)} />
      {help && <p className="text-xs text-surface-500 mt-1">{help}</p>}
    </div>
  );
}

function NumberField({ label, value, onChange }: {
  label: string; value: number; onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input type="number" step="any" className="input" value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)} />
    </div>
  );
}

function SaveBar({ onSave, saving }: { onSave: () => void; saving: boolean }) {
  const { t } = useTranslation("theme-storefront");
  return (
    <div className="flex justify-end gap-2 pt-3 border-t border-surface-200 dark:border-surface-800">
      <button type="button" onClick={onSave} disabled={saving}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {saving ? t("settings.buttons.saving") : t("settings.buttons.save")}
      </button>
    </div>
  );
}
