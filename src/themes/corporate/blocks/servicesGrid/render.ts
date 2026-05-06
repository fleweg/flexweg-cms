import { escapeAttr, escapeText } from "../util";

export interface ServiceItem {
  // Material Symbols Outlined glyph name (e.g. "analytics", "cloud_sync").
  icon?: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  // When true, the card uses the dark navy accent style (white text on
  // primary background) — used for the highlighted middle card in the
  // mockup. Default false = light card on surface-container-lowest.
  accent?: boolean;
}

export interface ServicesGridAttrs {
  // Section heading + lede.
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  // 1+ services. Editor inspector lets the user add / remove / reorder.
  // Three is the canonical mockup count; the grid auto-adapts when
  // there are fewer or more.
  services?: ServiceItem[];
}

export interface ServicesGridRenderResult {
  html: string;
}

const DEFAULT_SERVICE: ServiceItem = {
  icon: "auto_awesome",
  title: "",
  description: "",
  ctaLabel: "",
  ctaHref: "",
  accent: false,
};

function renderCard(service: ServiceItem): string {
  const merged = { ...DEFAULT_SERVICE, ...service };
  const isAccent = !!merged.accent;
  const cardClass = isAccent
    ? "bg-primary p-8 rounded-xl shadow-xl hover:-translate-y-1 transition-all flex flex-col h-full text-on-primary"
    : "bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/30 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col h-full";

  const iconBgClass = isAccent
    ? "w-14 h-14 rounded-lg bg-secondary flex items-center justify-center mb-6"
    : "w-14 h-14 rounded-lg bg-secondary/10 flex items-center justify-center mb-6";
  const iconColorClass = isAccent ? "text-on-secondary text-h3" : "text-secondary text-h3";

  const titleClass = isAccent
    ? "text-h3 font-semibold mb-4"
    : "text-h3 font-semibold text-primary mb-4";
  const descClass = isAccent
    ? "text-on-primary-container mb-8 flex-grow"
    : "text-on-surface-variant mb-8 flex-grow";
  const linkClass = isAccent
    ? "text-secondary-fixed font-semibold text-button flex items-center gap-2 group"
    : "text-secondary font-semibold text-button flex items-center gap-2 group";

  const iconHtml = merged.icon
    ? `<div class="${iconBgClass}"><span class="material-symbols-outlined ${iconColorClass}">${escapeText(merged.icon)}</span></div>`
    : "";

  const cta =
    merged.ctaLabel && merged.ctaHref
      ? `<a class="${linkClass}" href="${escapeAttr(merged.ctaHref)}">${escapeText(merged.ctaLabel)}<span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">trending_flat</span></a>`
      : "";

  return `<div class="${cardClass}">${iconHtml}<h3 class="${titleClass}">${escapeText(merged.title)}</h3><p class="${descClass}">${escapeText(merged.description)}</p>${cta}</div>`;
}

// Three-card services grid. The middle card defaults to the dark navy
// accent style — same visual rhythm as the home_desktop mockup.
// When >3 services are configured, the grid wraps to a second row;
// when <3, the grid auto-fits whatever exists.
export function renderServicesGrid(attrs: ServicesGridAttrs): ServicesGridRenderResult {
  const services = (attrs.services ?? []).filter((s) => s && (s.title || s.description));
  if (services.length === 0 && !attrs.title) return { html: "" };

  const eyebrowHtml = attrs.eyebrow
    ? `<span class="text-label-caps font-semibold text-secondary uppercase tracking-wider mb-2 block">${escapeText(attrs.eyebrow)}</span>`
    : "";
  const titleHtml = attrs.title
    ? `<h2 class="text-h2 font-bold text-primary mb-4">${escapeText(attrs.title)}</h2>`
    : "";
  const subtitleHtml = attrs.subtitle
    ? `<p class="text-on-surface-variant text-body-md max-w-xl">${escapeText(attrs.subtitle)}</p>`
    : "";

  const headerHtml =
    eyebrowHtml || titleHtml || subtitleHtml
      ? `<div class="mb-stack-lg max-w-xl">${eyebrowHtml}${titleHtml}${subtitleHtml}</div>`
      : "";

  const cardsHtml = services.map(renderCard).join("");

  return {
    html: `<section class="py-section-padding px-gutter max-w-container-max mx-auto">
${headerHtml}
<div class="grid grid-cols-1 md:grid-cols-3 gap-stack-lg">${cardsHtml}</div>
</section>`,
  };
}
