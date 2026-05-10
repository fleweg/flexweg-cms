import { escapeAttr, escapeText } from "../util";

export interface StoreInfoAttrs {
  eyebrow?: string;
  title?: string;
  imageUrl?: string;
  imageAlt?: string;
  addressLabel?: string;
  address?: string;
  hoursLabel?: string;
  hours?: string[];
  ctaLabel?: string;
  ctaHref?: string;
}

export interface StoreInfoRenderResult {
  html: string;
}

// Renders the address as a sequence of <br>-separated lines.
// `address` may contain newlines from the textarea input; each line
// becomes its own visual row in the rendered HTML.
function renderAddressLines(address: string): string {
  return address
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => escapeText(line))
    .join("<br/>");
}

// "Notre Boutique" home section — physical shop info.
// Layout:
//   - Mobile: vertical stack inside a rounded card
//   - Desktop: 2-col grid (image left, info right) inside the card
// When `imageUrl` is empty, renders a stylized placeholder card with
// a location pin so the section still looks intentional during
// initial setup.
export function renderStoreInfo(attrs: StoreInfoAttrs): StoreInfoRenderResult {
  const hasContent =
    !!attrs.title ||
    !!attrs.address ||
    (Array.isArray(attrs.hours) && attrs.hours.length > 0);
  if (!hasContent) return { html: "" };

  const eyebrowHtml = attrs.eyebrow
    ? `<p class="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-stack-sm">${escapeText(attrs.eyebrow)}</p>`
    : "";

  const titleHtml = attrs.title
    ? `<h2 class="display-serif text-headline-md md:text-display-md text-on-surface mb-stack-lg">${escapeText(attrs.title)}</h2>`
    : "";

  // Three states for the visual pane:
  //   1. imageUrl set → render the photo
  //   2. imageUrl empty + address set → embed a Google Maps iframe
  //      (no API key needed — uses the public `output=embed` URL).
  //   3. neither → render the on-brand sage placeholder card.
  let imagePane: string;
  if (attrs.imageUrl) {
    imagePane = `<div class="md:col-span-7 aspect-video md:aspect-auto md:min-h-[360px] overflow-hidden bg-surface-container">
<img src="${escapeAttr(attrs.imageUrl)}" alt="${escapeAttr(attrs.imageAlt ?? "")}" class="w-full h-full object-cover" loading="lazy" />
</div>`;
  } else if (attrs.address && attrs.address.trim()) {
    const query = encodeURIComponent(attrs.address.replace(/\r?\n/g, ", ").trim());
    imagePane = `<div class="md:col-span-7 aspect-video md:aspect-auto md:min-h-[360px] overflow-hidden bg-surface-container">
<iframe src="https://www.google.com/maps?q=${query}&z=15&output=embed" class="w-full h-full border-0" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="${escapeAttr(attrs.title ?? "Map")}"></iframe>
</div>`;
  } else {
    imagePane = `<div class="md:col-span-7 aspect-video md:aspect-auto md:min-h-[360px] bg-primary-fixed relative flex items-center justify-center overflow-hidden">
<div class="absolute inset-0 opacity-40" style="background-image: radial-gradient(rgb(var(--color-primary)) 1.5px, transparent 1.5px); background-size: 20px 20px;"></div>
<div class="relative z-10 flex flex-col items-center gap-3 text-primary">
<span class="material-symbols-outlined" style="font-size: 4rem;">location_on</span>
<span class="font-label-caps text-label-caps uppercase tracking-widest font-semibold">View map</span>
</div>
</div>`;
  }

  const addressLines = attrs.address ? renderAddressLines(attrs.address) : "";
  const addressHtml = addressLines
    ? `<div>
<h4 class="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-stack-sm">${escapeText(attrs.addressLabel ?? "")}</h4>
<p class="font-body-lg text-on-surface leading-relaxed">${addressLines}</p>
</div>`
    : "";

  const hoursList = (attrs.hours ?? []).filter(Boolean);
  const hoursHtml =
    hoursList.length > 0
      ? `<div>
<h4 class="font-label-caps text-label-caps text-secondary uppercase tracking-widest mb-stack-sm">${escapeText(attrs.hoursLabel ?? "")}</h4>
<ul class="text-on-surface-variant text-body-md space-y-1">${hoursList
          .map((h) => `<li>${escapeText(h)}</li>`)
          .join("")}</ul>
</div>`
      : "";

  const ctaHtml =
    attrs.ctaLabel && attrs.ctaHref
      ? `<a href="${escapeAttr(attrs.ctaHref)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 self-start bg-primary text-on-primary px-6 py-3 rounded-full font-label-caps text-label-caps uppercase tracking-widest hover:bg-primary-container hover:text-on-primary-container transition-all">
<span class="material-symbols-outlined text-base">directions</span>${escapeText(attrs.ctaLabel)}
</a>`
      : "";

  return {
    html: `<section class="py-section-gap-mobile md:py-section-gap-desktop max-w-container-max mx-auto px-gutter md:px-gutter-desktop">${eyebrowHtml}${titleHtml}
<div class="bg-surface-container-low overflow-hidden rounded-3xl border border-outline-variant/20 shadow-sm grid grid-cols-1 md:grid-cols-12">${imagePane}
<div class="md:col-span-5 p-6 md:p-8 flex flex-col gap-stack-lg">${addressHtml}${hoursHtml}${ctaHtml}</div>
</div>
</section>`,
  };
}
