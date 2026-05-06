import { escapeAttr, escapeText } from "../util";

// Submission destinations.
//   "endpoint" — POST a JSON body to a third-party form service
//     (Formspree, Web3Forms, Getform, Basin, etc.). The runtime
//     loader (contact-form.js) wires the submit handler with
//     fetch + fallback to a mailto: link if the endpoint is empty.
//   "mailto" — opens the user's mail client with a preformatted
//     mailto: URL. No JS dependency, works on every static host.
export type ContactFormMode = "endpoint" | "mailto";

export interface ContactFormAttrs {
  // Card chrome heading + lede.
  heading?: string;
  subtitle?: string;
  // Submit destination.
  mode?: ContactFormMode;
  // Endpoint URL (Formspree etc.). Required when mode === "endpoint".
  endpointUrl?: string;
  // Recipient email when mode === "mailto" — the form's mailto:
  // submit URL gets built from this address.
  mailtoAddress?: string;

  // Field labels (admin-controlled — surfaces stay in the configured
  // admin language at edit time but the published page is in the
  // public language so we let the user override every label).
  labelName?: string;
  labelEmail?: string;
  labelCompany?: string;
  labelSubject?: string;
  labelMessage?: string;
  // Subject dropdown options. One per line. Empty = no subject
  // dropdown (the form is plain name / email / company / message).
  subjectOptions?: string;
  // Submit button label.
  submitLabel?: string;
  // Privacy consent text. Empty = no checkbox shown.
  privacyText?: string;
  // Free-form HTML link target appended to the privacy text. The
  // user enters a URL and the inline placeholder `[link]…[/link]` in
  // privacyText becomes an <a> wrapping the text between the tags.
  // Documented in the inspector help line so non-technical users
  // can wire a Privacy page link without touching markdown.
  privacyHref?: string;
  // Success message shown by the JS handler when the submission
  // succeeds. Inert when mode === "mailto".
  successMessage?: string;
  // Error message shown by the JS handler on any non-2xx response.
  errorMessage?: string;
}

export interface ContactFormRenderResult {
  html: string;
}

function renderField(
  id: string,
  label: string,
  type: "text" | "email" | "textarea" | "select",
  required = true,
  options?: string[],
): string {
  const baseInput = `class="w-full h-14 px-4 pt-2 border border-outline rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all bg-surface-container-lowest"`;
  if (type === "textarea") {
    return `<div class="floating-label-group">
<textarea id="${escapeAttr(id)}" name="${escapeAttr(id)}" rows="5" placeholder=" "${required ? " required" : ""} class="w-full px-4 pt-6 border border-outline rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all resize-none bg-surface-container-lowest"></textarea>
<label for="${escapeAttr(id)}">${escapeText(label)}</label>
</div>`;
  }
  if (type === "select") {
    const opts = (options ?? [])
      .map((o) => `<option value="${escapeAttr(o)}">${escapeText(o)}</option>`)
      .join("");
    return `<div class="floating-label-group">
<select id="${escapeAttr(id)}" name="${escapeAttr(id)}"${required ? " required" : ""} class="w-full h-14 px-4 pt-2 pr-10 border border-outline rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all appearance-none bg-surface-container-lowest">
<option value="" disabled selected hidden></option>
${opts}
</select>
<label for="${escapeAttr(id)}">${escapeText(label)}</label>
<div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
<span class="material-symbols-outlined text-outline">expand_more</span>
</div>
</div>`;
  }
  return `<div class="floating-label-group">
<input type="${escapeAttr(type)}" id="${escapeAttr(id)}" name="${escapeAttr(id)}" placeholder=" "${required ? " required" : ""} ${baseInput} />
<label for="${escapeAttr(id)}">${escapeText(label)}</label>
</div>`;
}

function privacyLineHtml(text: string, href?: string): string {
  if (!text) return "";
  // Replace [link]…[/link] with an <a>. We only allow a single span
  // for simplicity — multiple instances re-use the same href.
  const escaped = escapeText(text);
  const linkWrapped = href
    ? escaped.replace(
        /\[link\](.*?)\[\/link\]/g,
        `<a class="text-secondary font-medium underline" href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer">$1</a>`,
      )
    : escaped.replace(/\[link\](.*?)\[\/link\]/g, "$1");
  return `<div class="flex items-start gap-3 py-2">
<input class="w-5 h-5 mt-0.5 text-secondary border-outline rounded focus:ring-secondary" id="cms-form-consent" name="consent" type="checkbox" required />
<label class="text-body-md text-on-surface-variant" for="cms-form-consent">${linkWrapped}</label>
</div>`;
}

// Contact form. Right-side card in the contact_desktop mockup,
// floating-label fields with focus ring → secondary. The form's
// `data-cms-form` attribute carries the submit mode + endpoint;
// contact-form.js (theme runtime loader) intercepts submit and
// either POSTs to the endpoint or builds a mailto: URL.
export function renderContactForm(attrs: ContactFormAttrs): ContactFormRenderResult {
  const heading = attrs.heading ?? "";
  const subtitle = attrs.subtitle ?? "";
  const mode: ContactFormMode = attrs.mode === "mailto" ? "mailto" : "endpoint";

  const labelName = attrs.labelName ?? "Full name";
  const labelEmail = attrs.labelEmail ?? "Email";
  const labelCompany = attrs.labelCompany ?? "Company";
  const labelSubject = attrs.labelSubject ?? "Subject";
  const labelMessage = attrs.labelMessage ?? "Message";
  const submitLabel = attrs.submitLabel ?? "Send inquiry";
  const successMessage =
    attrs.successMessage ?? "Thanks — we'll get back to you within 24 business hours.";
  const errorMessage = attrs.errorMessage ?? "Something went wrong. Please try again or email us directly.";

  const subjectOptionsRaw = (attrs.subjectOptions ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const hasSubject = subjectOptionsRaw.length > 0;

  const headingHtml = heading
    ? `<h3 class="text-h3 font-semibold text-primary mb-2">${escapeText(heading)}</h3>`
    : "";
  const subtitleHtml = subtitle
    ? `<p class="text-body-md text-on-surface-variant mb-stack-lg">${escapeText(subtitle)}</p>`
    : "";

  // Pair fields side-by-side on md+.
  const row1 = `<div class="grid grid-cols-1 md:grid-cols-2 gap-stack-md">${renderField("name", labelName, "text")}${renderField("email", labelEmail, "email")}</div>`;
  const row2Fields: string[] = [renderField("company", labelCompany, "text", false)];
  if (hasSubject) row2Fields.push(renderField("subject", labelSubject, "select", true, subjectOptionsRaw));
  const row2 = `<div class="grid grid-cols-1 md:grid-cols-2 gap-stack-md">${row2Fields.join("")}</div>`;

  const message = renderField("message", labelMessage, "textarea");
  const privacy = privacyLineHtml(attrs.privacyText ?? "", attrs.privacyHref);

  const submit = `<button type="submit" class="w-full md:w-auto px-10 py-4 bg-secondary text-on-secondary rounded-lg text-button font-semibold shadow-lg shadow-secondary/20 hover:bg-secondary/90 hover:shadow-xl transition-all active:scale-[0.98] inline-flex items-center gap-2">${escapeText(submitLabel)}<span class="material-symbols-outlined">send</span></button>`;

  // Status messages — hidden on first paint, contact-form.js
  // toggles them after submit.
  const status = `<div class="cms-form-status mt-stack-md text-body-md" data-cms-form-success hidden>${escapeText(successMessage)}</div>
<div class="cms-form-status mt-stack-md text-body-md text-error" data-cms-form-error hidden>${escapeText(errorMessage)}</div>`;

  return {
    html: `<div class="bg-surface-container-lowest p-8 lg:p-12 rounded-xl shadow-xl border border-outline-variant/10">
${headingHtml}${subtitleHtml}
<form data-cms-form="${escapeAttr(mode)}" data-cms-form-endpoint="${escapeAttr(attrs.endpointUrl ?? "")}" data-cms-form-mailto="${escapeAttr(attrs.mailtoAddress ?? "")}" class="space-y-stack-md" action="${mode === "mailto" && attrs.mailtoAddress ? `mailto:${escapeAttr(attrs.mailtoAddress)}` : "#"}" method="post" novalidate>
${row1}
${row2}
${message}
${privacy}
${submit}
${status}
</form>
</div>`,
  };
}
