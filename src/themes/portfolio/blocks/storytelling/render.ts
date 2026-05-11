import { decodeAttrs, escapeAttr, escapeText } from "../util";

export interface StorytellingAttrs {
  eyebrow: string;
  // Headline rendered as italic serif (the "Silence is the ultimate
  // luxury" quote pattern from the mockup).
  headline: string;
  body: string;
  // Two numbered process steps shown as a 2-col grid below the body.
  step1Label: string;
  step1Text: string;
  step2Label: string;
  step2Text: string;
  // Companion image (right column on desktop, full-width on mobile).
  imageUrl: string;
  imageAlt: string;
}

export interface StorytellingRenderResult {
  html: string;
}

export const DEFAULT_STORYTELLING_ATTRS: StorytellingAttrs = {
  eyebrow: "THE PROCESS",
  headline: "Silence is the ultimate luxury.",
  body: "In a world of constant visual noise, we chose to embrace the void. Our curation process for the exhibition involved removing over 80% of the initial content to find the singular heart of the project.",
  step1Label: "01. RESEARCH",
  step1Text: "Deep architectural auditing and site mapping.",
  step2Label: "02. EXECUTION",
  step2Text: "High-precision photographic capture over 6 months.",
  imageUrl: "",
  imageAlt: "",
};

// Renders the storytelling section — 2-col grid (text left, image
// right on desktop, stacked on mobile). Italic serif headline.
// Numbered process steps in a 2-up grid with top borders to evoke
// architectural drawings.
export function renderStorytelling(attrs: StorytellingAttrs): StorytellingRenderResult {
  const hasText = !!(attrs.headline || attrs.body);
  if (!hasText && !attrs.imageUrl) return { html: "" };

  const eyebrowHtml = attrs.eyebrow
    ? `<span class="font-sans text-label-sm uppercase tracking-widest text-error mb-4 block">${escapeText(attrs.eyebrow)}</span>`
    : "";
  const headlineHtml = attrs.headline
    ? `<h3 class="font-serif text-headline-lg-mobile md:text-headline-lg text-on-surface mb-8 italic">${escapeText(attrs.headline)}</h3>`
    : "";
  const bodyHtml = attrs.body
    ? `<p class="font-sans text-body-lg text-on-surface mb-8">${escapeText(attrs.body)}</p>`
    : "";

  const stepHtml = (label: string, text: string) =>
    label || text
      ? `<div class="border-t border-outline-variant pt-4"><span class="font-sans text-label-sm uppercase tracking-widest text-on-surface block mb-1">${escapeText(label)}</span><p class="font-sans text-body-md text-on-surface-variant">${escapeText(text)}</p></div>`
      : "";

  const stepsHtml =
    (attrs.step1Label || attrs.step1Text || attrs.step2Label || attrs.step2Text)
      ? `<div class="grid grid-cols-2 gap-4">${stepHtml(attrs.step1Label, attrs.step1Text)}${stepHtml(attrs.step2Label, attrs.step2Text)}</div>`
      : "";

  const imageHtml = attrs.imageUrl
    ? `<div class="col-span-12 md:col-span-6"><img src="${escapeAttr(attrs.imageUrl)}" alt="${escapeAttr(attrs.imageAlt)}" class="w-full aspect-[4/5] object-cover" loading="lazy"/></div>`
    : "";

  const textCol = `<div class="col-span-12 md:col-span-6 pr-0 md:pr-16">${eyebrowHtml}${headlineHtml}${bodyHtml}${stepsHtml}</div>`;

  return {
    html: `<section class="portfolio-storytelling max-w-container-max mx-auto px-margin-edge-mobile md:px-margin-edge py-section-gap-mobile md:py-section-gap grid grid-cols-12 gap-gutter items-center">${textCol}${imageHtml}</section>`,
  };
}

const STORYTELLING_MARKER_REGEX =
  /<div\s+([^>]*data-cms-block="portfolio\/storytelling"[^>]*)>\s*<\/div>/g;

export function transformStorytelling(bodyHtml: string): string {
  return bodyHtml.replace(STORYTELLING_MARKER_REGEX, (full, raw) => {
    const m = raw.match(/data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/);
    const enc = m ? m[1] ?? m[2] ?? m[3] ?? "" : "";
    const attrs = decodeAttrs<StorytellingAttrs>(enc, DEFAULT_STORYTELLING_ATTRS);
    return renderStorytelling(attrs).html || full;
  });
}
