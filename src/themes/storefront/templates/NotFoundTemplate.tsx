import type { NotFoundTemplateProps, SiteContext } from "@flexweg/cms-runtime";
import { i18n, pickPublicLocale } from "@flexweg/cms-runtime";

// Minimal 404 — centered serif headline + CTA back to home. Aligns
// with the storefront aesthetic (sage primary CTA, off-white surface).
export function NotFoundTemplate({
  message,
  site,
}: NotFoundTemplateProps & { site: SiteContext }) {
  const t = i18n.getFixedT(pickPublicLocale(site.settings.language), "theme-storefront");
  return (
    <section className="max-w-container-max mx-auto px-gutter md:px-gutter-desktop py-section-gap-mobile md:py-section-gap-desktop">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-label-caps font-semibold text-secondary uppercase tracking-widest mb-stack-md">
          {t("publicBaked.notFoundTitle")}
        </p>
        <h1 className="display-serif text-display-md md:text-display-lg text-on-surface mb-stack-md">
          {message ?? t("publicBaked.notFoundMessage")}
        </h1>
        <a
          href="/index.html"
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-full text-label-caps uppercase tracking-widest hover:bg-primary-container hover:text-on-primary-container transition-all"
        >
          {t("publicBaked.backToHome")}
          <span className="material-symbols-outlined">arrow_forward</span>
        </a>
      </div>
    </section>
  );
}
