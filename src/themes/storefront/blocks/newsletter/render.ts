import { escapeAttr, escapeText } from "../util";

export interface NewsletterAttrs {
  variant?: "card" | "banner";
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  ctaLabel?: string;
  // Form mode — same contract as the contact-form / footer newsletter:
  //   "endpoint" → POST urlencoded to `endpoint`
  //   "mailto"   → mailto: with prefilled subject/body
  mode?: "endpoint" | "mailto";
  endpoint?: string;
  mailto?: string;
  successMessage?: string;
  errorMessage?: string;
}

export interface NewsletterRenderResult {
  html: string;
}

// Newsletter block — two visual variants:
//   - "card" (default): centered card on a light surface, generous
//     padding, big serif headline. Drops well anywhere in the body.
//   - "banner": full-width primary-colored band with the form on
//     one side and the headline on the other. For end-of-page CTAs.
export function renderNewsletter(attrs: NewsletterAttrs): NewsletterRenderResult {
  const variant = attrs.variant ?? "card";
  const placeholder = attrs.placeholder || "Email address";
  const ctaLabel = attrs.ctaLabel || "Subscribe";
  const mode = attrs.mode === "mailto" ? "mailto" : "endpoint";

  const eyebrowHtml = attrs.eyebrow
    ? `<p class="font-label-caps text-label-caps uppercase tracking-widest mb-stack-sm ${variant === "banner" ? "text-on-primary/80" : "text-secondary"}">${escapeText(attrs.eyebrow)}</p>`
    : "";
  const titleHtml = attrs.title
    ? `<h3 class="display-serif text-headline-md md:text-display-md mb-stack-sm leading-tight ${variant === "banner" ? "text-on-primary" : "text-on-surface"}">${escapeText(attrs.title)}</h3>`
    : "";
  const subtitleHtml = attrs.subtitle
    ? `<p class="font-body-md text-body-md ${variant === "banner" ? "text-on-primary/80" : "text-on-surface-variant"} mb-stack-md">${escapeText(attrs.subtitle)}</p>`
    : "";

  const successHtml = `<p class="text-xs ${variant === "banner" ? "text-on-primary/90" : "text-primary"}" data-cms-form-success hidden>${escapeText(attrs.successMessage ?? "Thanks — you're on the list.")}</p>`;
  const errorHtml = `<p class="text-xs text-error" data-cms-form-error hidden>${escapeText(attrs.errorMessage ?? "Something went wrong. Please try again.")}</p>`;

  const formHtml = `<form class="flex flex-col sm:flex-row gap-stack-sm" data-cms-form="${mode}" data-cms-form-endpoint="${escapeAttr(attrs.endpoint ?? "")}" data-cms-form-mailto="${escapeAttr(attrs.mailto ?? "")}">
<input type="email" name="email" required placeholder="${escapeAttr(placeholder)}" class="${variant === "banner" ? "bg-on-primary/10 border border-on-primary/30 text-on-primary placeholder-on-primary/60" : "bg-surface border border-outline-variant"} flex-1 rounded-full px-5 py-3 focus:ring-primary focus:border-primary outline-none" />
<button type="submit" class="${variant === "banner" ? "bg-on-primary text-primary hover:bg-on-primary/90" : "bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container"} px-8 py-3 rounded-full font-label-caps text-label-caps uppercase tracking-widest transition-all">${escapeText(ctaLabel)}</button>
</form>${successHtml}${errorHtml}`;

  if (variant === "banner") {
    return {
      html: `<section class="bg-primary text-on-primary py-section-gap-mobile md:py-section-gap-desktop">
<div class="max-w-container-max mx-auto px-gutter md:px-gutter-desktop grid grid-cols-1 md:grid-cols-2 gap-stack-lg items-center">
<div>${eyebrowHtml}${titleHtml}${subtitleHtml}</div>
<div class="space-y-stack-sm">${formHtml}</div>
</div>
</section>`,
    };
  }

  return {
    html: `<section class="py-section-gap-mobile md:py-section-gap-desktop max-w-container-max mx-auto px-gutter md:px-gutter-desktop">
<div class="max-w-3xl mx-auto bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/30 p-8 md:p-12 text-center">${eyebrowHtml}${titleHtml}${subtitleHtml}<div class="max-w-md mx-auto space-y-stack-sm">${formHtml}</div></div>
</section>`,
  };
}
