import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { Editor } from "@tiptap/core";
import { MediaPicker, pickMediaUrl, type PickedMedia } from "@flexweg/cms-runtime";
import { sliderNodeName } from "./nodes";
import {
  SLIDERS,
  type CardSlide,
  type CardSliderAttrs,
  type HeroSlide,
  type HeroSliderAttrs,
  type ImageSlide,
  type ImageSliderAttrs,
  type LogoCarouselAttrs,
  type LogoEntry,
  type SliderAttrs,
  type SliderKind,
} from "./sliders";

// Block-tab inspector — one component, dispatches per slider kind.
// Each kind shares the same shape:
//   1. "Slides" group: add / remove / reorder + per-slide fields
//   2. "Options" group: kind-specific toggles (autoplay, dots, etc.)
//
// All attribute updates funnel through `update()` which calls Tiptap's
// updateAttributes — no local state for the attrs themselves, only for
// the active slide index (UI-only).

interface SliderInspectorProps {
  editor: Editor;
  kind: SliderKind;
}

export function SliderInspector({ editor, kind }: SliderInspectorProps) {
  const { t } = useTranslation("flexweg-sliders");
  const nodeName = sliderNodeName(kind);
  const raw = editor.getAttributes(nodeName) as { attrs?: SliderAttrs };
  const attrs = raw.attrs ?? SLIDERS[kind].defaults;

  function update(patch: Partial<SliderAttrs>): void {
    editor.chain().updateAttributes(nodeName, {
      attrs: { ...attrs, ...patch } as SliderAttrs,
    }).run();
  }

  return (
    <div className="space-y-4 text-sm">
      <Section title={t("inspector.slides")}>
        {kind === "image" && (
          <ImageSlidesEditor attrs={attrs as ImageSliderAttrs} update={update as (p: Partial<ImageSliderAttrs>) => void} />
        )}
        {kind === "hero" && (
          <HeroSlidesEditor attrs={attrs as HeroSliderAttrs} update={update as (p: Partial<HeroSliderAttrs>) => void} />
        )}
        {kind === "card" && (
          <CardSlidesEditor attrs={attrs as CardSliderAttrs} update={update as (p: Partial<CardSliderAttrs>) => void} />
        )}
        {kind === "logo" && (
          <LogoEntriesEditor attrs={attrs as LogoCarouselAttrs} update={update as (p: Partial<LogoCarouselAttrs>) => void} />
        )}
      </Section>
      <Section title={t("inspector.options")}>
        {kind === "image" && (
          <ImageOptions attrs={attrs as ImageSliderAttrs} update={update as (p: Partial<ImageSliderAttrs>) => void} />
        )}
        {kind === "hero" && (
          <HeroOptions attrs={attrs as HeroSliderAttrs} update={update as (p: Partial<HeroSliderAttrs>) => void} />
        )}
        {kind === "card" && (
          <CardOptions attrs={attrs as CardSliderAttrs} update={update as (p: Partial<CardSliderAttrs>) => void} />
        )}
        {kind === "logo" && (
          <LogoOptions attrs={attrs as LogoCarouselAttrs} update={update as (p: Partial<LogoCarouselAttrs>) => void} />
        )}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-semibold uppercase tracking-wide text-surface-500 dark:text-surface-400">{title}</legend>
      {children}
    </fieldset>
  );
}

// ───── Reusable controls ─────

function TextField({ label, value, onChange, placeholder }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-surface-600 dark:text-surface-300 mb-1">{label}</span>
      <input
        type="text"
        className="input w-full"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function NumberField({ label, value, onChange, min, max, step }: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-surface-600 dark:text-surface-300 mb-1">{label}</span>
      <input
        type="number"
        className="input w-full"
        value={value ?? 0}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
      />
    </label>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="text-sm">{label}</span>
    </label>
  );
}

function Select<T extends string>({ label, value, options, onChange }: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-surface-600 dark:text-surface-300 mb-1">{label}</span>
      <select className="input w-full" value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

function ImageField({ label, url, alt, onPick, onClear }: {
  label: string;
  url?: string;
  alt?: string;
  onPick: (media: PickedMedia) => void;
  onClear: () => void;
}) {
  const { t } = useTranslation("flexweg-sliders");
  const [picking, setPicking] = useState(false);
  return (
    <div className="space-y-1.5">
      <span className="block text-xs text-surface-600 dark:text-surface-300">{label}</span>
      {url ? (
        <div className="flex items-center gap-2">
          <img src={url} alt={alt ?? ""} className="w-14 h-14 object-cover rounded border border-surface-200 dark:border-surface-700" />
          <div className="flex flex-col gap-1">
            <button type="button" className="btn btn-secondary text-xs" onClick={() => setPicking(true)}>{t("inspector.pickImage")}</button>
            <button type="button" className="btn btn-ghost text-xs" onClick={onClear}>{t("inspector.clearImage")}</button>
          </div>
        </div>
      ) : (
        <button type="button" className="btn btn-secondary text-xs" onClick={() => setPicking(true)}>
          {t("inspector.pickImage")}
        </button>
      )}
      {picking && (
        <MediaPicker
          onPick={(m) => { onPick(m); setPicking(false); }}
          onClose={() => setPicking(false)}
        />
      )}
    </div>
  );
}

// ───── Slides list scaffolding (shared across image/hero/card/logo) ─────

interface SlidesListProps<T> {
  items: T[];
  emptyKey: SliderKind;
  newItem: () => T;
  renderItem: (item: T, index: number, update: (patch: Partial<T>) => void) => ReactNode;
  onChange: (next: T[]) => void;
}

function SlidesList<T>({ items, emptyKey, newItem, renderItem, onChange }: SlidesListProps<T>) {
  const { t } = useTranslation("flexweg-sliders");
  const list = items ?? [];

  function patch(index: number, partial: Partial<T>) {
    const next = list.slice();
    next[index] = { ...next[index], ...partial } as T;
    onChange(next);
  }
  function remove(index: number) {
    const next = list.slice();
    next.splice(index, 1);
    onChange(next);
  }
  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= list.length) return;
    const next = list.slice();
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    onChange(next);
  }
  function duplicate(index: number) {
    const next = list.slice();
    next.splice(index + 1, 0, { ...next[index] } as T);
    onChange(next);
  }
  function add() {
    onChange(list.concat(newItem()));
  }

  return (
    <div className="space-y-3">
      {list.length === 0 && (
        <p className="text-xs text-surface-500 dark:text-surface-400">{t(`empty.${emptyKey}`)}</p>
      )}
      {list.map((item, i) => (
        <div key={i} className="rounded border border-surface-200 dark:border-surface-700 p-2 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-semibold uppercase opacity-60">#{i + 1}</span>
            <div className="flex gap-1">
              <IconButton title={t("inspector.moveUp")} onClick={() => move(i, -1)} disabled={i === 0}>↑</IconButton>
              <IconButton title={t("inspector.moveDown")} onClick={() => move(i, 1)} disabled={i === list.length - 1}>↓</IconButton>
              <IconButton title={t("inspector.duplicate")} onClick={() => duplicate(i)}>⎘</IconButton>
              <IconButton title={t("inspector.removeSlide")} onClick={() => remove(i)} variant="danger">×</IconButton>
            </div>
          </div>
          {renderItem(item, i, (p) => patch(i, p))}
        </div>
      ))}
      <button type="button" className="btn btn-secondary w-full" onClick={add}>{t("inspector.addSlide")}</button>
    </div>
  );
}

function IconButton({ children, onClick, disabled, title, variant }: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title: string;
  variant?: "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs ${variant === "danger" ? "hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400" : "hover:bg-surface-100 dark:hover:bg-surface-700"} disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

// ───── Per-kind slides editors ─────

function ImageSlidesEditor({ attrs, update }: { attrs: ImageSliderAttrs; update: (p: Partial<ImageSliderAttrs>) => void }) {
  const { t } = useTranslation("flexweg-sliders");
  return (
    <SlidesList<ImageSlide>
      items={attrs.slides ?? []}
      emptyKey="image"
      newItem={() => ({ src: "", alt: "", caption: "", link: "" })}
      onChange={(slides) => update({ slides })}
      renderItem={(slide, _i, patch) => (
        <div className="space-y-2">
          <ImageField
            label={t("inspector.pickImage")}
            url={slide.src}
            alt={slide.alt}
            onPick={(m) => patch({ src: pickMediaUrl(m, "large") || m.url || "", alt: slide.alt || m.alt || m.name })}
            onClear={() => patch({ src: "" })}
          />
          <TextField label={t("inspector.fields.alt")} value={slide.alt ?? ""} onChange={(v) => patch({ alt: v })} />
          <TextField label={t("inspector.fields.caption")} value={slide.caption ?? ""} onChange={(v) => patch({ caption: v })} />
          <TextField label={t("inspector.fields.link")} value={slide.link ?? ""} onChange={(v) => patch({ link: v })} placeholder="https://" />
        </div>
      )}
    />
  );
}

function HeroSlidesEditor({ attrs, update }: { attrs: HeroSliderAttrs; update: (p: Partial<HeroSliderAttrs>) => void }) {
  const { t } = useTranslation("flexweg-sliders");
  return (
    <SlidesList<HeroSlide>
      items={attrs.slides ?? []}
      emptyKey="hero"
      newItem={() => ({ backgroundSrc: "", eyebrow: "", title: "", subtitle: "", ctaLabel: "", ctaHref: "", overlay: "dark" })}
      onChange={(slides) => update({ slides })}
      renderItem={(slide, _i, patch) => (
        <div className="space-y-2">
          <ImageField
            label={t("inspector.pickImage")}
            url={slide.backgroundSrc}
            onPick={(m) => patch({ backgroundSrc: pickMediaUrl(m, "large") || m.url || "" })}
            onClear={() => patch({ backgroundSrc: "" })}
          />
          <TextField label={t("inspector.fields.eyebrow")} value={slide.eyebrow ?? ""} onChange={(v) => patch({ eyebrow: v })} />
          <TextField label={t("inspector.fields.title")} value={slide.title ?? ""} onChange={(v) => patch({ title: v })} />
          <TextField label={t("inspector.fields.subtitle")} value={slide.subtitle ?? ""} onChange={(v) => patch({ subtitle: v })} />
          <TextField label={t("inspector.fields.ctaLabel")} value={slide.ctaLabel ?? ""} onChange={(v) => patch({ ctaLabel: v })} />
          <TextField label={t("inspector.fields.ctaHref")} value={slide.ctaHref ?? ""} onChange={(v) => patch({ ctaHref: v })} placeholder="https://" />
          <Select<HeroSlide["overlay"]>
            label={t("inspector.overlay")}
            value={slide.overlay ?? "none"}
            onChange={(v) => patch({ overlay: v })}
            options={[
              { value: "none", label: t("options.overlay.none") },
              { value: "light", label: t("options.overlay.light") },
              { value: "dark", label: t("options.overlay.dark") },
            ]}
          />
        </div>
      )}
    />
  );
}

function CardSlidesEditor({ attrs, update }: { attrs: CardSliderAttrs; update: (p: Partial<CardSliderAttrs>) => void }) {
  const { t } = useTranslation("flexweg-sliders");
  return (
    <SlidesList<CardSlide>
      items={attrs.slides ?? []}
      emptyKey="card"
      newItem={() => ({ imageSrc: "", imageAlt: "", title: "", text: "", link: "", linkLabel: "" })}
      onChange={(slides) => update({ slides })}
      renderItem={(slide, _i, patch) => (
        <div className="space-y-2">
          <ImageField
            label={t("inspector.pickImage")}
            url={slide.imageSrc}
            alt={slide.imageAlt}
            onPick={(m) => patch({ imageSrc: pickMediaUrl(m, "medium") || m.url || "", imageAlt: slide.imageAlt || m.alt || m.name })}
            onClear={() => patch({ imageSrc: "" })}
          />
          <TextField label={t("inspector.fields.alt")} value={slide.imageAlt ?? ""} onChange={(v) => patch({ imageAlt: v })} />
          <TextField label={t("inspector.fields.title")} value={slide.title ?? ""} onChange={(v) => patch({ title: v })} />
          <TextField label={t("inspector.fields.text")} value={slide.text ?? ""} onChange={(v) => patch({ text: v })} />
          <TextField label={t("inspector.fields.link")} value={slide.link ?? ""} onChange={(v) => patch({ link: v })} placeholder="https://" />
          <TextField label={t("inspector.fields.linkLabel")} value={slide.linkLabel ?? ""} onChange={(v) => patch({ linkLabel: v })} />
        </div>
      )}
    />
  );
}

function LogoEntriesEditor({ attrs, update }: { attrs: LogoCarouselAttrs; update: (p: Partial<LogoCarouselAttrs>) => void }) {
  const { t } = useTranslation("flexweg-sliders");
  return (
    <SlidesList<LogoEntry>
      items={attrs.logos ?? []}
      emptyKey="logo"
      newItem={() => ({ src: "", alt: "", link: "" })}
      onChange={(logos) => update({ logos })}
      renderItem={(logo, _i, patch) => (
        <div className="space-y-2">
          <ImageField
            label={t("inspector.pickImage")}
            url={logo.src}
            alt={logo.alt}
            onPick={(m) => patch({ src: pickMediaUrl(m, "medium") || m.url || "", alt: logo.alt || m.alt || m.name })}
            onClear={() => patch({ src: "" })}
          />
          <TextField label={t("inspector.fields.alt")} value={logo.alt ?? ""} onChange={(v) => patch({ alt: v })} />
          <TextField label={t("inspector.fields.link")} value={logo.link ?? ""} onChange={(v) => patch({ link: v })} placeholder="https://" />
        </div>
      )}
    />
  );
}

// ───── Per-kind option panels ─────

function ImageOptions({ attrs, update }: { attrs: ImageSliderAttrs; update: (p: Partial<ImageSliderAttrs>) => void }) {
  const { t } = useTranslation("flexweg-sliders");
  return (
    <div className="space-y-2">
      <Select<ImageSliderAttrs["aspectRatio"]>
        label={t("inspector.aspectRatio")}
        value={attrs.aspectRatio}
        onChange={(v) => update({ aspectRatio: v })}
        options={[
          { value: "16/9", label: t("options.aspect.16/9") },
          { value: "4/3", label: t("options.aspect.4/3") },
          { value: "1/1", label: t("options.aspect.1/1") },
          { value: "21/9", label: t("options.aspect.21/9") },
        ]}
      />
      <Checkbox label={t("inspector.autoplay")} checked={attrs.autoplay} onChange={(v) => update({ autoplay: v })} />
      {attrs.autoplay && (
        <NumberField label={t("inspector.interval")} value={attrs.interval} onChange={(v) => update({ interval: v })} min={1500} step={500} />
      )}
      <Checkbox label={t("inspector.showDots")} checked={attrs.showDots} onChange={(v) => update({ showDots: v })} />
      <Checkbox label={t("inspector.showArrows")} checked={attrs.showArrows} onChange={(v) => update({ showArrows: v })} />
      <Checkbox label={t("inspector.loop")} checked={attrs.loop} onChange={(v) => update({ loop: v })} />
    </div>
  );
}

function HeroOptions({ attrs, update }: { attrs: HeroSliderAttrs; update: (p: Partial<HeroSliderAttrs>) => void }) {
  const { t } = useTranslation("flexweg-sliders");
  return (
    <div className="space-y-2">
      <Select<HeroSliderAttrs["height"]>
        label={t("inspector.height")}
        value={attrs.height}
        onChange={(v) => update({ height: v })}
        options={[
          { value: "short", label: t("options.height.short") },
          { value: "medium", label: t("options.height.medium") },
          { value: "tall", label: t("options.height.tall") },
        ]}
      />
      <Select<HeroSliderAttrs["align"]>
        label={t("inspector.align")}
        value={attrs.align}
        onChange={(v) => update({ align: v })}
        options={[
          { value: "left", label: t("options.align.left") },
          { value: "center", label: t("options.align.center") },
          { value: "right", label: t("options.align.right") },
        ]}
      />
      <Checkbox label={t("inspector.autoplay")} checked={attrs.autoplay} onChange={(v) => update({ autoplay: v })} />
      {attrs.autoplay && (
        <NumberField label={t("inspector.interval")} value={attrs.interval} onChange={(v) => update({ interval: v })} min={1500} step={500} />
      )}
      <Checkbox label={t("inspector.showDots")} checked={attrs.showDots} onChange={(v) => update({ showDots: v })} />
      <Checkbox label={t("inspector.showArrows")} checked={attrs.showArrows} onChange={(v) => update({ showArrows: v })} />
    </div>
  );
}

function CardOptions({ attrs, update }: { attrs: CardSliderAttrs; update: (p: Partial<CardSliderAttrs>) => void }) {
  const { t } = useTranslation("flexweg-sliders");
  return (
    <div className="space-y-2">
      <Select<string>
        label={t("inspector.perView")}
        value={String(attrs.perView)}
        onChange={(v) => update({ perView: Number(v) as 1 | 2 | 3 | 4 })}
        options={[
          { value: "1", label: "1" },
          { value: "2", label: "2" },
          { value: "3", label: "3" },
          { value: "4", label: "4" },
        ]}
      />
      <Checkbox label={t("inspector.autoplay")} checked={attrs.autoplay} onChange={(v) => update({ autoplay: v })} />
      {attrs.autoplay && (
        <NumberField label={t("inspector.interval")} value={attrs.interval} onChange={(v) => update({ interval: v })} min={1500} step={500} />
      )}
      <Checkbox label={t("inspector.showDots")} checked={attrs.showDots} onChange={(v) => update({ showDots: v })} />
      <Checkbox label={t("inspector.showArrows")} checked={attrs.showArrows} onChange={(v) => update({ showArrows: v })} />
      <Checkbox label={t("inspector.loop")} checked={attrs.loop} onChange={(v) => update({ loop: v })} />
    </div>
  );
}

function LogoOptions({ attrs, update }: { attrs: LogoCarouselAttrs; update: (p: Partial<LogoCarouselAttrs>) => void }) {
  const { t } = useTranslation("flexweg-sliders");
  return (
    <div className="space-y-2">
      <Select<LogoCarouselAttrs["speed"]>
        label={t("inspector.speed")}
        value={attrs.speed}
        onChange={(v) => update({ speed: v })}
        options={[
          { value: "slow", label: t("options.speed.slow") },
          { value: "normal", label: t("options.speed.normal") },
          { value: "fast", label: t("options.speed.fast") },
        ]}
      />
      <NumberField label={t("inspector.logoHeight")} value={attrs.height} onChange={(v) => update({ height: v })} min={20} max={120} step={4} />
      <Checkbox label={t("inspector.grayscale")} checked={attrs.grayscale} onChange={(v) => update({ grayscale: v })} />
    </div>
  );
}
