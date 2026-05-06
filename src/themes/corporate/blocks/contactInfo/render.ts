import { escapeAttr, escapeText } from "../util";

export interface ContactInfoAttrs {
  // Section heading rendered above the cards.
  heading?: string;
  // Address card (location pin).
  addressLines?: string;
  // Phone card.
  phoneLines?: string;
  // Email card.
  emailLines?: string;
  // Optional follow-our-progress section.
  socialsLabel?: string;
  // 0–N social icon links. Each entry: glyph (Material Symbols) +
  // link target. Defaults to 3 generic glyphs (share/language/hub) so
  // the row matches the contact_desktop mockup right after dropping
  // the block in.
  socials?: Array<{ icon?: string; href?: string; ariaLabel?: string }>;
}

export interface ContactInfoRenderResult {
  html: string;
}

function renderInfoRow(
  iconName: string,
  title: string,
  bodyHtml: string,
): string {
  return `<div class="flex items-start gap-4">
<div class="bg-secondary-fixed p-3 rounded-lg shrink-0">
<span class="material-symbols-outlined text-secondary">${escapeText(iconName)}</span>
</div>
<div><p class="font-bold text-primary">${escapeText(title)}</p><p class="text-on-surface-variant">${bodyHtml}</p></div>
</div>`;
}

function multilineHtml(value: string | undefined): string {
  if (!value) return "";
  return escapeText(value).replace(/\n/g, "<br/>");
}

// Contact info card — three info rows (address / phone / email) plus
// an optional socials strip. Side-by-side with the contact-form on
// desktop in the contact_desktop mockup. Stacks on mobile by default.
export function renderContactInfo(attrs: ContactInfoAttrs): ContactInfoRenderResult {
  const hasAddress = !!attrs.addressLines;
  const hasPhone = !!attrs.phoneLines;
  const hasEmail = !!attrs.emailLines;
  const socials = (attrs.socials ?? []).filter((s) => s && (s.icon || s.href));

  if (!hasAddress && !hasPhone && !hasEmail && socials.length === 0) {
    return { html: "" };
  }

  const headingHtml = attrs.heading
    ? `<h3 class="text-h3 font-semibold text-primary mb-stack-md">${escapeText(attrs.heading)}</h3>`
    : "";

  const rows: string[] = [];
  if (hasAddress) rows.push(renderInfoRow("location_on", "Address", multilineHtml(attrs.addressLines)));
  if (hasPhone) rows.push(renderInfoRow("call", "Phone", multilineHtml(attrs.phoneLines)));
  if (hasEmail) rows.push(renderInfoRow("mail", "Email", multilineHtml(attrs.emailLines)));

  const socialsBlock =
    socials.length > 0
      ? `<div class="mt-stack-lg pt-stack-lg border-t border-outline-variant/20">
${attrs.socialsLabel ? `<p class="text-label-caps font-semibold text-on-surface-variant uppercase tracking-wider mb-stack-md">${escapeText(attrs.socialsLabel)}</p>` : ""}
<div class="flex gap-4">
${socials
  .map(
    (s) =>
      `<a class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-secondary hover:text-on-secondary transition-colors" href="${escapeAttr(s.href ?? "#")}" target="_blank" rel="noopener noreferrer" aria-label="${escapeAttr(s.ariaLabel ?? "")}"><span class="material-symbols-outlined text-[1.25rem]">${escapeText(s.icon ?? "share")}</span></a>`,
  )
  .join("")}
</div>
</div>`
      : "";

  return {
    html: `<div class="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/20">
${headingHtml}
<div class="space-y-stack-lg">${rows.join("")}</div>
${socialsBlock}
</div>`,
  };
}
