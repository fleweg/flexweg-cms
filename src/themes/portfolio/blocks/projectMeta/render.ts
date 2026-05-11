import { decodeAttrs, escapeAttr, escapeText } from "../util";

export interface ProjectMetaAttrs {
  // Each row = a "label / value" pair shown in the meta column.
  // Common labels: SERVICES, YEAR, AWARDS, CLIENT, LOCATION.
  // The label is rendered in label-sm uppercase; the value is body-md
  // with multi-line support via newlines.
  rows: { label: string; value: string }[];
}

export interface ProjectMetaRenderResult {
  html: string;
}

export const DEFAULT_PROJECT_META_ATTRS: ProjectMetaAttrs = {
  rows: [
    { label: "SERVICES", value: "Creative Direction\nArt Direction" },
    { label: "YEAR", value: "2024" },
    { label: "AWARDS", value: "Gold Design Circle" },
  ],
};

// Renders the meta column block as a 3-up grid on desktop, stacked on
// mobile. Designed to drop into the right column of a single-post
// body — when the user wants to override the auto-rendered meta in
// SingleTemplate's left aside, they delete it from the sidebar and
// place a project-meta block in the body.
export function renderProjectMeta(attrs: ProjectMetaAttrs): ProjectMetaRenderResult {
  const rows = (attrs.rows ?? []).filter((r) => r.label || r.value);
  if (rows.length === 0) return { html: "" };
  const cells = rows
    .map((r) => {
      const valueLines = r.value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => escapeText(line))
        .join("<br/>");
      return `<div class="flex flex-col gap-2"><span class="font-sans text-label-sm uppercase tracking-widest text-secondary">${escapeText(r.label)}</span><p class="font-sans text-body-md text-on-surface">${valueLines}</p></div>`;
    })
    .join("");
  return {
    html: `<aside class="portfolio-project-meta max-w-container-max mx-auto px-margin-edge-mobile md:px-margin-edge py-section-gap-mobile md:py-section-gap grid grid-cols-1 md:grid-cols-${Math.min(rows.length, 4)} gap-gutter" data-attrs="${escapeAttr("")}">${cells}</aside>`,
  };
}

const PROJECT_META_MARKER_REGEX =
  /<div\s+([^>]*data-cms-block="portfolio\/project-meta"[^>]*)>\s*<\/div>/g;

export function transformProjectMeta(bodyHtml: string): string {
  return bodyHtml.replace(PROJECT_META_MARKER_REGEX, (full, raw) => {
    const m = raw.match(/data-attrs=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/);
    const enc = m ? m[1] ?? m[2] ?? m[3] ?? "" : "";
    const attrs = decodeAttrs<ProjectMetaAttrs>(enc, DEFAULT_PROJECT_META_ATTRS);
    return renderProjectMeta(attrs).html || full;
  });
}
