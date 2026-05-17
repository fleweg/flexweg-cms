// Registry of the four slider types. Each entry declares:
//   - id        : namespaced block id, used in marker attribute
//   - kind      : matches data-cms-slider on the public-side container
//   - defaults  : default attrs for a freshly-inserted block
//   - renderHtml: produces the published-page HTML from an attrs object
//
// transforms.ts iterates the registry to decide which marker to look
// for; the editor inspector (SliderInspector) dispatches on kind to
// render the right form fields.

// ───── Shared types ─────

export interface ImageSlide {
  src: string;
  alt?: string;
  caption?: string;
  link?: string;
}
export interface ImageSliderAttrs {
  slides: ImageSlide[];
  autoplay: boolean;
  interval: number;
  showDots: boolean;
  showArrows: boolean;
  loop: boolean;
  aspectRatio: "16/9" | "4/3" | "1/1" | "21/9";
}

export interface HeroSlide {
  backgroundSrc: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  overlay: "none" | "light" | "dark";
}
export interface HeroSliderAttrs {
  slides: HeroSlide[];
  height: "short" | "medium" | "tall";
  align: "left" | "center" | "right";
  autoplay: boolean;
  interval: number;
  showDots: boolean;
  showArrows: boolean;
}

export interface CardSlide {
  imageSrc?: string;
  imageAlt?: string;
  title?: string;
  text?: string;
  link?: string;
  linkLabel?: string;
}
export interface CardSliderAttrs {
  slides: CardSlide[];
  perView: 1 | 2 | 3 | 4;
  autoplay: boolean;
  interval: number;
  showDots: boolean;
  showArrows: boolean;
  loop: boolean;
}

export interface LogoEntry {
  src: string;
  alt?: string;
  link?: string;
}
export interface LogoCarouselAttrs {
  logos: LogoEntry[];
  speed: "slow" | "normal" | "fast";
  grayscale: boolean;
  height: number;
}

export type SliderKind = "image" | "hero" | "card" | "logo";
export type SliderAttrs =
  | ImageSliderAttrs
  | HeroSliderAttrs
  | CardSliderAttrs
  | LogoCarouselAttrs;

// ───── Defaults ─────

export const DEFAULT_IMAGE: ImageSliderAttrs = {
  slides: [],
  autoplay: false,
  interval: 5000,
  showDots: true,
  showArrows: true,
  loop: true,
  aspectRatio: "16/9",
};
export const DEFAULT_HERO: HeroSliderAttrs = {
  slides: [],
  height: "medium",
  align: "left",
  autoplay: true,
  interval: 6000,
  showDots: true,
  showArrows: true,
};
export const DEFAULT_CARD: CardSliderAttrs = {
  slides: [],
  perView: 3,
  autoplay: false,
  interval: 5000,
  showDots: true,
  showArrows: true,
  loop: true,
};
export const DEFAULT_LOGO: LogoCarouselAttrs = {
  logos: [],
  speed: "normal",
  grayscale: true,
  height: 40,
};

// ───── HTML escaping (minimal, safe for attribute + text contexts) ─────

function esc(value: string | undefined): string {
  if (!value) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function attr(name: string, value: string | number | boolean | undefined): string {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value === "boolean") return value ? ` ${name}="1"` : "";
  return ` ${name}="${esc(String(value))}"`;
}

function wrapLink(href: string | undefined, html: string): string {
  if (!href) return html;
  return `<a href="${esc(href)}" rel="noopener">${html}</a>`;
}

// ───── Renderers ─────

function renderControls(showArrows: boolean, showDots: boolean, slideCount: number): string {
  const arrows = showArrows && slideCount > 1
    ? `<div class="fws-arrows"><button type="button" class="fws-prev" aria-label="Previous"></button><button type="button" class="fws-next" aria-label="Next"></button></div>`
    : "";
  let dots = "";
  if (showDots && slideCount > 1) {
    const buttons: string[] = [];
    for (let i = 0; i < slideCount; i++) {
      buttons.push(`<button type="button" aria-label="Slide ${i + 1}"></button>`);
    }
    dots = `<div class="fws-dots">${buttons.join("")}</div>`;
  }
  return arrows + dots;
}

function renderImageSlider(attrs: ImageSliderAttrs): string {
  const slides = attrs.slides || [];
  if (slides.length === 0) return "";
  const containerAttrs = [
    'class="fws fws-image"',
    'data-cms-slider="image"',
    `data-aspect="${esc(attrs.aspectRatio)}"`,
    attr("data-autoplay", attrs.autoplay).trim(),
    attr("data-interval", attrs.interval).trim(),
    attr("data-loop", attrs.loop).trim(),
  ].filter(Boolean).join(" ");
  const slidesHtml = slides.map((s) => {
    const img = `<img src="${esc(s.src)}" alt="${esc(s.alt)}" loading="lazy" />`;
    const caption = s.caption ? `<div class="fws-caption">${esc(s.caption)}</div>` : "";
    return `<div class="fws-slide">${wrapLink(s.link, img)}${caption}</div>`;
  }).join("");
  return `<div ${containerAttrs}><div class="fws-viewport"><div class="fws-track">${slidesHtml}</div></div>${renderControls(attrs.showArrows, attrs.showDots, slides.length)}</div>`;
}

function renderHeroSlider(attrs: HeroSliderAttrs): string {
  const slides = attrs.slides || [];
  if (slides.length === 0) return "";
  const containerAttrs = [
    'class="fws fws-hero"',
    'data-cms-slider="hero"',
    `data-height="${esc(attrs.height)}"`,
    `data-align="${esc(attrs.align)}"`,
    attr("data-autoplay", attrs.autoplay).trim(),
    attr("data-interval", attrs.interval).trim(),
    attr("data-loop", true).trim(),
  ].filter(Boolean).join(" ");
  const slidesHtml = slides.map((s) => {
    const overlayClass = s.overlay === "light" ? "fws-overlay-light" : s.overlay === "dark" ? "fws-overlay-dark" : "";
    const style = s.backgroundSrc ? ` style="background-image:url('${esc(s.backgroundSrc)}')"` : "";
    const eyebrow = s.eyebrow ? `<div class="fws-eyebrow">${esc(s.eyebrow)}</div>` : "";
    const title = s.title ? `<h2 class="fws-title">${esc(s.title)}</h2>` : "";
    const subtitle = s.subtitle ? `<p class="fws-subtitle">${esc(s.subtitle)}</p>` : "";
    const cta = s.ctaLabel && s.ctaHref
      ? `<a class="fws-cta" href="${esc(s.ctaHref)}" rel="noopener">${esc(s.ctaLabel)}</a>`
      : "";
    return `<div class="fws-slide ${overlayClass}"${style}><div class="fws-hero-content">${eyebrow}${title}${subtitle}${cta}</div></div>`;
  }).join("");
  return `<div ${containerAttrs}><div class="fws-viewport"><div class="fws-track">${slidesHtml}</div></div>${renderControls(attrs.showArrows, attrs.showDots, slides.length)}</div>`;
}

function renderCardSlider(attrs: CardSliderAttrs): string {
  const slides = attrs.slides || [];
  if (slides.length === 0) return "";
  const perView = Math.min(4, Math.max(1, attrs.perView || 3));
  const containerAttrs = [
    'class="fws fws-card"',
    'data-cms-slider="card"',
    `data-per-view="${perView}"`,
    attr("data-autoplay", attrs.autoplay).trim(),
    attr("data-interval", attrs.interval).trim(),
    attr("data-loop", attrs.loop).trim(),
  ].filter(Boolean).join(" ");
  const slidesHtml = slides.map((s) => {
    const img = s.imageSrc
      ? `<div class="fws-card-image"><img src="${esc(s.imageSrc)}" alt="${esc(s.imageAlt)}" loading="lazy" /></div>`
      : "";
    const title = s.title ? `<h3 class="fws-card-title">${esc(s.title)}</h3>` : "";
    const text = s.text ? `<p class="fws-card-text">${esc(s.text)}</p>` : "";
    const linkLabel = s.linkLabel || s.link;
    const link = s.link
      ? `<a class="fws-card-link" href="${esc(s.link)}" rel="noopener">${esc(linkLabel)}</a>`
      : "";
    return `<div class="fws-slide">${img}<div class="fws-card-body">${title}${text}${link}</div></div>`;
  }).join("");
  return `<div ${containerAttrs}><div class="fws-viewport"><div class="fws-track">${slidesHtml}</div></div>${renderControls(attrs.showArrows, attrs.showDots, slides.length)}</div>`;
}

function renderLogoCarousel(attrs: LogoCarouselAttrs): string {
  const logos = attrs.logos || [];
  if (logos.length === 0) return "";
  const height = Math.max(20, Math.min(120, Math.floor(attrs.height || 40)));
  const containerAttrs = [
    'class="fws fws-logo"',
    'data-cms-slider="logo"',
    `data-speed="${esc(attrs.speed)}"`,
    attr("data-grayscale", attrs.grayscale).trim(),
  ].filter(Boolean).join(" ");
  const logosHtml = logos.map((l) => {
    const img = `<img src="${esc(l.src)}" alt="${esc(l.alt)}" style="height:${height}px" loading="lazy" />`;
    return wrapLink(l.link, img);
  }).join("");
  return `<div ${containerAttrs}><div class="fws-logo-viewport"><div class="fws-logo-track">${logosHtml}</div></div></div>`;
}

// ───── Registry ─────

export interface SliderDef<TAttrs extends SliderAttrs = SliderAttrs> {
  id: string;
  kind: SliderKind;
  defaults: TAttrs;
  renderHtml: (attrs: TAttrs) => string;
}

export const PLUGIN_ID = "flexweg-sliders";

export const SLIDERS: Record<SliderKind, SliderDef> = {
  image: {
    id: `${PLUGIN_ID}/image`,
    kind: "image",
    defaults: DEFAULT_IMAGE,
    renderHtml: (a) => renderImageSlider(a as ImageSliderAttrs),
  },
  hero: {
    id: `${PLUGIN_ID}/hero`,
    kind: "hero",
    defaults: DEFAULT_HERO,
    renderHtml: (a) => renderHeroSlider(a as HeroSliderAttrs),
  },
  card: {
    id: `${PLUGIN_ID}/card`,
    kind: "card",
    defaults: DEFAULT_CARD,
    renderHtml: (a) => renderCardSlider(a as CardSliderAttrs),
  },
  logo: {
    id: `${PLUGIN_ID}/logo`,
    kind: "logo",
    defaults: DEFAULT_LOGO,
    renderHtml: (a) => renderLogoCarousel(a as LogoCarouselAttrs),
  },
};

export const SLIDER_LIST: SliderDef[] = Object.values(SLIDERS);
