import { decodeAttrs, escapeAttr, escapeText } from "../util";

export interface HeaderButtonsAttrs {
  downloadUrl: string;
  previewUrl: string;
  downloadLabel: string;
  previewLabel: string;
  freeLabel: string;
  creator: string;
  creatorPrefix: string;
}

export const DEFAULT_HEADER_BUTTONS: HeaderButtonsAttrs = {
  downloadUrl: "",
  previewUrl: "",
  downloadLabel: "Download",
  previewLabel: "Live Preview",
  freeLabel: "Free",
  creator: "",
  creatorPrefix: "by",
};

// Renders the byline (free-form creator) + Free badge + Download /
// Preview CTA pair. The output is NOT inlined into the body flow —
// instead we emit two hidden `<template>` data islands plus a tiny
// hydration script that relocates each into its slot inside the
// `.mp-product__info` column:
//   - byline goes into `[data-cms-mp-byline-slot]` (between title and
//     excerpt — where the old CMS-author block used to live)
//   - CTAs (badge + buttons) go into `[data-cms-mp-cta-slot]` (below
//     excerpt)
// Keeps the editor body's source markdown clean (just a marker), the
// info-column layout authoritative on the template side, and the
// `.mp-prose` body free of the marketing chrome.
export function renderHeaderButtons(attrs: HeaderButtonsAttrs): string {
  const hasCta = !!(attrs.downloadUrl || attrs.previewUrl);
  const hasCreator = !!attrs.creator?.trim();
  if (!hasCta && !hasCreator) return "";
  const byline = hasCreator
    ? `<div class="mp-product__author"><span>${escapeText(attrs.creatorPrefix || "by")} <strong>${escapeText(attrs.creator)}</strong></span></div>`
    : "";
  const free = hasCta ? `<span class="mp-badge-free">${escapeText(attrs.freeLabel)}</span>` : "";
  const dl = attrs.downloadUrl
    ? `<a class="mp-btn mp-btn--primary" href="${escapeAttr(attrs.downloadUrl)}" target="_blank" rel="noopener noreferrer"><span class="material-symbols-outlined">download</span>${escapeText(attrs.downloadLabel)}</a>`
    : "";
  const pv = attrs.previewUrl
    ? `<a class="mp-btn mp-btn--secondary" href="${escapeAttr(attrs.previewUrl)}" target="_blank" rel="noopener noreferrer"><span class="material-symbols-outlined">open_in_new</span>${escapeText(attrs.previewLabel)}</a>`
    : "";
  const cta = hasCta ? `${free}<div class="mp-product__cta-row">${dl}${pv}</div>` : "";

  const bylineTpl = byline
    ? `<template data-cms-mp-headerbuttons-byline>${byline}</template>`
    : "";
  const ctaTpl = cta
    ? `<template data-cms-mp-headerbuttons-cta>${cta}</template>`
    : "";
  const script = `<script>(function(){
function move(srcSel, dstSel){
  var tpl = document.querySelector(srcSel);
  if (!tpl) return;
  var dst = document.querySelector(dstSel);
  if (!dst) return;
  while (tpl.content.firstChild) dst.appendChild(tpl.content.firstChild);
  tpl.remove();
}
move('[data-cms-mp-headerbuttons-byline]','[data-cms-mp-byline-slot]');
move('[data-cms-mp-headerbuttons-cta]','[data-cms-mp-cta-slot]');
})();</script>`;

  return `${bylineTpl}${ctaTpl}${script}`;
}

const MARKER_RE =
  /<div\s+([^>]*data-cms-block="marketplace-core\/header-buttons"[^>]*)>\s*<\/div>/g;

export function transformHeaderButtons(bodyHtml: string): string {
  return bodyHtml.replace(MARKER_RE, (full, raw: string) => {
    const m = raw.match(/data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/);
    const enc = m ? (m[1] ?? m[2] ?? m[3] ?? "") : "";
    const attrs = decodeAttrs<HeaderButtonsAttrs>(enc, DEFAULT_HEADER_BUTTONS);
    return renderHeaderButtons(attrs) || "";
  });
}
