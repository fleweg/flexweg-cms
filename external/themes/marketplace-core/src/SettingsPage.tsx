import { useState } from "react";
import { Loader2, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import type { ThemeSettingsPageProps, FontOption } from "@flexweg/cms-runtime";
import { FontSelect } from "@flexweg/cms-runtime";
import {
  DEFAULT_MARKETPLACE_CONFIG,
  DEFAULT_MARKETPLACE_STYLE,
  type MarketplaceHomeConfig,
  type MarketplaceSidebarConfig,
  type MarketplaceSidebarItem,
  type MarketplaceSingleConfig,
  type MarketplaceThemeConfig,
} from "./config";
import {
  FONT_PRESETS,
  buildAllFontsPreviewUrl,
} from "./style";

// Marketplace settings page — five tabs (Home / Product page / Sidebar /
// Footer / Style) styled with admin-shared Tailwind tokens to match
// the other built-in themes (storefront, magazine, corporate).
type Tab = "home" | "single" | "sidebar" | "footer" | "style";

export function MarketplaceSettingsPage({
  config,
  save,
}: ThemeSettingsPageProps<MarketplaceThemeConfig>) {
  const merged: MarketplaceThemeConfig = {
    ...DEFAULT_MARKETPLACE_CONFIG,
    ...config,
    home: { ...DEFAULT_MARKETPLACE_CONFIG.home, ...(config.home ?? {}) },
    single: { ...DEFAULT_MARKETPLACE_CONFIG.single, ...(config.single ?? {}) },
    sidebar: { ...DEFAULT_MARKETPLACE_CONFIG.sidebar, ...(config.sidebar ?? {}) },
    footer: { ...DEFAULT_MARKETPLACE_CONFIG.footer, ...(config.footer ?? {}) },
    brand: { ...DEFAULT_MARKETPLACE_CONFIG.brand, ...(config.brand ?? {}) },
    style: { ...DEFAULT_MARKETPLACE_CONFIG.style, ...(config.style ?? {}) },
  };
  const [draft, setDraft] = useState<MarketplaceThemeConfig>(merged);
  const [tab, setTab] = useState<Tab>("home");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await save(draft);
    } finally {
      setSaving(false);
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "single", label: "Product page" },
    { id: "sidebar", label: "Sidebar" },
    { id: "footer", label: "Footer" },
    { id: "style", label: "Style" },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-surface-600 dark:text-surface-300">
        Marketplace Core — app-store style theme for listing your themes and plugins.
      </p>

      <nav
        className="flex flex-wrap gap-1 border-b border-surface-200 dark:border-surface-800"
        aria-label="Marketplace settings tabs"
      >
        {tabs.map((t) => (
          <TabButton
            key={t.id}
            active={tab === t.id}
            onClick={() => setTab(t.id)}
            label={t.label}
          />
        ))}
      </nav>

      {tab === "home" && (
        <HomeTab home={draft.home} onChange={(home) => setDraft({ ...draft, home })} />
      )}
      {tab === "single" && (
        <SingleTab
          single={draft.single}
          onChange={(single) => setDraft({ ...draft, single })}
        />
      )}
      {tab === "sidebar" && (
        <SidebarTab
          sidebar={draft.sidebar}
          onChange={(sidebar) => setDraft({ ...draft, sidebar })}
        />
      )}
      {tab === "footer" && (
        <FooterTab
          copyright={draft.footer.copyright}
          wordmark={draft.brand.wordmark}
          onChange={(footer, brand) =>
            setDraft({
              ...draft,
              footer: { ...draft.footer, ...footer },
              brand: { ...draft.brand, ...brand },
            })
          }
        />
      )}
      {tab === "style" && (
        <StyleTab style={draft.style} onChange={(style) => setDraft({ ...draft, style })} />
      )}

      <div className="card p-4 flex flex-wrap gap-3 justify-end">
        {tab === "style" && (() => {
          const styleDirty =
            draft.style.fontHeadline !== DEFAULT_MARKETPLACE_STYLE.fontHeadline ||
            draft.style.fontBody !== DEFAULT_MARKETPLACE_STYLE.fontBody ||
            Object.keys(draft.style.vars ?? {}).length > 0;
          return (
            <button
              type="button"
              onClick={() =>
                setDraft({ ...draft, style: { ...DEFAULT_MARKETPLACE_STYLE } })
              }
              disabled={!styleDirty}
              className="btn-ghost disabled:opacity-40 disabled:cursor-not-allowed"
              title="Reset fonts and palette to their defaults"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to defaults
            </button>
          );
        })()}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="btn-primary disabled:opacity-60 disabled:cursor-wait"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving…" : "Save & apply"}
        </button>
      </div>
    </div>
  );
}

// ───── Tabs ────────────────────────────────────────────────────────

function HomeTab({
  home,
  onChange,
}: {
  home: MarketplaceHomeConfig;
  onChange: (h: MarketplaceHomeConfig) => void;
}) {
  return (
    <div className="space-y-4">
      <Section title="Hero">
        <Field label="Eyebrow">
          <input
            className="input"
            value={home.heroEyebrow}
            onChange={(e) => onChange({ ...home, heroEyebrow: e.target.value })}
          />
        </Field>
        <Field label="Headline">
          <input
            className="input"
            value={home.heroHeadline}
            onChange={(e) => onChange({ ...home, heroHeadline: e.target.value })}
          />
        </Field>
        <Field label="Intro">
          <textarea
            className="input"
            rows={3}
            value={home.heroIntro}
            onChange={(e) => onChange({ ...home, heroIntro: e.target.value })}
          />
        </Field>
      </Section>

      <Section title="Featured section">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Category slug">
            <input
              className="input"
              value={home.featuredCategorySlug}
              onChange={(e) => onChange({ ...home, featuredCategorySlug: e.target.value })}
            />
          </Field>
          <Field label="Heading">
            <input
              className="input"
              value={home.featuredHeading}
              onChange={(e) => onChange({ ...home, featuredHeading: e.target.value })}
            />
          </Field>
          <Field label="Item count">
            <input
              type="number"
              min={0}
              className="input"
              value={home.featuredCount}
              onChange={(e) => onChange({ ...home, featuredCount: parseInt(e.target.value, 10) || 0 })}
            />
          </Field>
        </div>
      </Section>

      <Section title="New section">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Category slug">
            <input
              className="input"
              value={home.newCategorySlug}
              onChange={(e) => onChange({ ...home, newCategorySlug: e.target.value })}
            />
          </Field>
          <Field label="Heading">
            <input
              className="input"
              value={home.newHeading}
              onChange={(e) => onChange({ ...home, newHeading: e.target.value })}
            />
          </Field>
          <Field label="Item count">
            <input
              type="number"
              min={0}
              className="input"
              value={home.newCount}
              onChange={(e) => onChange({ ...home, newCount: parseInt(e.target.value, 10) || 0 })}
            />
          </Field>
        </div>
      </Section>

      <Section title="Recently Updated">
        <CheckboxRow
          label="Show this section"
          value={home.showRecentlyUpdated}
          onChange={(v) => onChange({ ...home, showRecentlyUpdated: v })}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Heading">
            <input
              className="input"
              value={home.recentlyUpdatedHeading}
              onChange={(e) => onChange({ ...home, recentlyUpdatedHeading: e.target.value })}
            />
          </Field>
          <Field label="Item count">
            <input
              type="number"
              min={0}
              className="input"
              value={home.recentlyUpdatedCount}
              onChange={(e) => onChange({ ...home, recentlyUpdatedCount: parseInt(e.target.value, 10) || 0 })}
            />
          </Field>
        </div>
      </Section>
    </div>
  );
}

function SingleTab({
  single,
  onChange,
}: {
  single: MarketplaceSingleConfig;
  onChange: (s: MarketplaceSingleConfig) => void;
}) {
  return (
    <div className="space-y-4">
      <Section title="Section labels">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Description">
            <input
              className="input"
              value={single.descriptionLabel}
              onChange={(e) => onChange({ ...single, descriptionLabel: e.target.value })}
            />
          </Field>
          <Field label="Specifications">
            <input
              className="input"
              value={single.specificationsLabel}
              onChange={(e) => onChange({ ...single, specificationsLabel: e.target.value })}
            />
          </Field>
          <Field label="Features">
            <input
              className="input"
              value={single.featuresLabel}
              onChange={(e) => onChange({ ...single, featuresLabel: e.target.value })}
            />
          </Field>
        </div>
      </Section>

      <Section title="Call-to-action labels">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Download button">
            <input
              className="input"
              value={single.downloadLabel}
              onChange={(e) => onChange({ ...single, downloadLabel: e.target.value })}
            />
          </Field>
          <Field label="Preview button">
            <input
              className="input"
              value={single.previewLabel}
              onChange={(e) => onChange({ ...single, previewLabel: e.target.value })}
            />
          </Field>
          <Field label="Free badge">
            <input
              className="input"
              value={single.freeBadgeLabel}
              onChange={(e) => onChange({ ...single, freeBadgeLabel: e.target.value })}
            />
          </Field>
        </div>
      </Section>

      <Section title="Block visibility">
        <CheckboxRow
          label="Show specs block when present in body"
          value={single.showSpecs}
          onChange={(v) => onChange({ ...single, showSpecs: v })}
        />
        <CheckboxRow
          label="Show features block when present in body"
          value={single.showFeatures}
          onChange={(v) => onChange({ ...single, showFeatures: v })}
        />
      </Section>
    </div>
  );
}

function SidebarTab({
  sidebar,
  onChange,
}: {
  sidebar: MarketplaceSidebarConfig;
  onChange: (s: MarketplaceSidebarConfig) => void;
}) {
  return (
    <div className="space-y-4">
      <Section title="Top section">
        <Field label="Heading">
          <input
            className="input"
            value={sidebar.heading}
            onChange={(e) => onChange({ ...sidebar, heading: e.target.value })}
          />
        </Field>
        <ItemList
          items={sidebar.topItems}
          onChange={(items) => onChange({ ...sidebar, topItems: items })}
        />
      </Section>

      <Section title="Categories">
        <Field label="Heading">
          <input
            className="input"
            value={sidebar.categoriesHeading}
            onChange={(e) => onChange({ ...sidebar, categoriesHeading: e.target.value })}
          />
        </Field>
        <ItemList
          items={sidebar.categoriesItems}
          onChange={(items) => onChange({ ...sidebar, categoriesItems: items })}
        />
      </Section>
    </div>
  );
}

function FooterTab({
  copyright,
  wordmark,
  onChange,
}: {
  copyright: string;
  wordmark: string;
  onChange: (f: { copyright: string }, b: { wordmark: string }) => void;
}) {
  return (
    <div className="space-y-4">
      <Section title="Brand">
        <Field label="Wordmark">
          <input
            className="input"
            value={wordmark}
            onChange={(e) => onChange({ copyright }, { wordmark: e.target.value })}
          />
          <p className="text-xs text-surface-500 mt-1">
            Leave empty to fall back to the site title.
          </p>
        </Field>
      </Section>

      <Section title="Footer">
        <Field label="Copyright line">
          <input
            className="input"
            value={copyright}
            onChange={(e) => onChange({ copyright: e.target.value }, { wordmark })}
          />
          <p className="text-xs text-surface-500 mt-1">
            Empty falls back to <code>© &lt;year&gt; &lt;site title&gt;.</code>
          </p>
        </Field>
      </Section>
    </div>
  );
}

function StyleTab({
  style,
  onChange,
}: {
  style: MarketplaceThemeConfig["style"];
  onChange: (s: MarketplaceThemeConfig["style"]) => void;
}) {
  const COLOR_VARS: { name: string; label: string }[] = [
    { name: "--color-primary", label: "Primary (action color)" },
    { name: "--color-secondary", label: "Secondary" },
    { name: "--color-tertiary", label: "Tertiary" },
    { name: "--color-background", label: "Background" },
    { name: "--color-on-surface", label: "Text" },
  ];

  const fontOptions: FontOption[] = [
    ...Object.keys(FONT_PRESETS.sans).map((name) => ({
      name,
      fallback: "sans-serif" as const,
    })),
    ...Object.keys(FONT_PRESETS.serif).map((name) => ({
      name,
      fallback: "serif" as const,
    })),
  ];

  function patchVar(name: string, value: string) {
    const next = { ...style.vars };
    if (value && value.trim()) next[name] = value;
    else delete next[name];
    onChange({ ...style, vars: next });
  }
  function clearVar(name: string) {
    const next = { ...style.vars };
    delete next[name];
    onChange({ ...style, vars: next });
  }

  return (
    <div className="space-y-4">
      {/* Loads every preset font face so dropdown rows preview in
          their own font before any selection is made. */}
      <link rel="stylesheet" href={buildAllFontsPreviewUrl()} />

      <Section title="Typography">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Headline font">
            <FontSelect
              options={fontOptions}
              value={style.fontHeadline}
              onChange={(v) => onChange({ ...style, fontHeadline: v })}
              ariaLabel="Headline font"
            />
          </Field>
          <Field label="Body font">
            <FontSelect
              options={fontOptions}
              value={style.fontBody}
              onChange={(v) => onChange({ ...style, fontBody: v })}
              ariaLabel="Body font"
            />
          </Field>
        </div>
      </Section>

      <Section title="Palette overrides">
        <p className="text-xs text-surface-500">
          Leave a field empty to keep the bundled default. Click ↺ to clear an override.
        </p>
        <div className="space-y-2">
          {COLOR_VARS.map((c) => (
            <ColorRow
              key={c.name}
              label={c.label}
              value={style.vars[c.name] ?? ""}
              onChange={(v) => patchVar(c.name, v)}
              onClear={() => clearVar(c.name)}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}

// ───── Shared atoms ──────────────────────────────────────────────

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card p-4 space-y-3">
      <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-50">{title}</h3>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}

function CheckboxRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-300 cursor-pointer">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-surface-300 text-blue-600 focus:ring-blue-500"
      />
      <span>{label}</span>
    </label>
  );
}

function ColorRow({
  label,
  value,
  onChange,
  onClear,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
}) {
  const isSet = !!value;
  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={/^#/.test(value) ? value : "#0037b0"}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-10 rounded border border-surface-300 dark:border-surface-700 cursor-pointer shrink-0"
      />
      <span className="flex-1 text-sm text-surface-700 dark:text-surface-300">{label}</span>
      <code className="text-xs text-surface-500 tabular-nums">{value || "default"}</code>
      <button
        type="button"
        onClick={onClear}
        disabled={!isSet}
        className="p-1 rounded text-surface-500 hover:text-surface-900 hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Clear override"
        aria-label="Clear override"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function ItemList({
  items,
  onChange,
}: {
  items: MarketplaceSidebarItem[];
  onChange: (items: MarketplaceSidebarItem[]) => void;
}) {
  function update(i: number, patch: Partial<MarketplaceSidebarItem>) {
    const next = [...items];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...items, { icon: "", label: "", href: "" }]);
  }

  return (
    <div className="space-y-2">
      {items.length === 0 && (
        <p className="text-xs text-surface-500">No items yet.</p>
      )}
      {items.map((item, i) => (
        <div
          key={i}
          className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_3fr_auto] gap-2 items-center p-2 rounded border border-surface-200 dark:border-surface-800"
        >
          <input
            className="input text-xs"
            placeholder="Icon"
            value={item.icon}
            onChange={(e) => update(i, { icon: e.target.value })}
          />
          <input
            className="input text-xs"
            placeholder="Label"
            value={item.label}
            onChange={(e) => update(i, { label: e.target.value })}
          />
          <input
            className="input text-xs"
            placeholder="/path/to/page.html"
            value={item.href}
            onChange={(e) => update(i, { href: e.target.value })}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="p-1.5 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
            aria-label="Remove item"
            title="Remove item"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="btn-secondary text-xs"
      >
        <Plus className="h-3.5 w-3.5" />
        Add item
      </button>
    </div>
  );
}
