import { decodeAttrs, escapeAttr, escapeText } from "../util";

export interface NextProjectAttrs {
  eyebrow: string;
  title: string;
  href: string;
  ctaLabel: string;
}

export interface NextProjectRenderResult {
  html: string;
}

export const DEFAULT_NEXT_PROJECT_ATTRS: NextProjectAttrs = {
  eyebrow: "NEXT PROJECT",
  title: "",
  href: "",
  ctaLabel: "VIEW CASE STUDY",
};

// Full-width hover-invert banner that sits at the bottom of single
// posts. On hover the whole banner turns charcoal — pure CSS via
// group-hover utility classes, no JS.
export function renderNextProject(attrs: NextProjectAttrs): NextProjectRenderResult {
  if (!attrs.title) return { html: "" };
  const href = attrs.href || "#";
  return {
    html: `<section class="portfolio-next-project border-t border-primary mt-section-gap-mobile md:mt-section-gap"><a class="group flex flex-col md:flex-row justify-between items-start md:items-center w-full px-margin-edge-mobile md:px-margin-edge py-section-gap-mobile md:py-section-gap max-w-container-max mx-auto hover:bg-primary transition-colors duration-500 overflow-hidden relative" href="${escapeAttr(href)}"><div class="z-10 flex flex-col gap-2"><span class="font-sans text-label-sm uppercase tracking-[0.3em] text-secondary group-hover:text-on-primary/60 transition-colors">${escapeText(attrs.eyebrow)}</span><h2 class="font-serif text-display-lg-mobile md:text-display-lg group-hover:text-on-primary transition-colors display-serif">${escapeText(attrs.title)}</h2></div><div class="z-10 mt-8 md:mt-0 flex items-center gap-4 text-primary group-hover:text-on-primary transition-colors"><span class="font-sans text-label-sm uppercase tracking-widest">${escapeText(attrs.ctaLabel)}</span><span class="material-symbols-outlined">arrow_forward</span></div></a></section>`,
  };
}

const NEXT_PROJECT_MARKER_REGEX =
  /<div\s+([^>]*data-cms-block="portfolio\/next-project"[^>]*)>\s*<\/div>/g;

export function transformNextProject(bodyHtml: string): string {
  return bodyHtml.replace(NEXT_PROJECT_MARKER_REGEX, (full, raw) => {
    const m = raw.match(/data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/);
    const enc = m ? m[1] ?? m[2] ?? m[3] ?? "" : "";
    const attrs = decodeAttrs<NextProjectAttrs>(enc, DEFAULT_NEXT_PROJECT_ATTRS);
    return renderNextProject(attrs).html || full;
  });
}
