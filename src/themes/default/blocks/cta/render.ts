import { escapeAttr, escapeText } from "../util";

export interface CtaAttrs {
  title?: string;
  description?: string;
  buttonLabel?: string;
  buttonUrl?: string;
  variant?: "light" | "dark";
}

export function renderCta(attrs: CtaAttrs): string {
  if (!attrs.title && !attrs.description) return "";
  const variant = attrs.variant ?? "light";
  const titleHtml = attrs.title
    ? `<h3 class="cms-cta-title">${escapeText(attrs.title)}</h3>`
    : "";
  const descHtml = attrs.description
    ? `<p class="cms-cta-description">${escapeText(attrs.description)}</p>`
    : "";
  const button =
    attrs.buttonLabel && attrs.buttonUrl
      ? `<a class="cms-cta-button" href="${escapeAttr(attrs.buttonUrl)}">${escapeText(attrs.buttonLabel)}</a>`
      : "";
  return `<section class="cms-cta cms-cta-${variant}"><div class="cms-cta-body">${titleHtml}${descHtml}</div>${button}</section>`;
}
