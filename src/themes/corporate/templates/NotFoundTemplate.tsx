import type { NotFoundTemplateProps, SiteContext } from "@flexweg/cms-runtime";
import { i18n, pickPublicLocale } from "@flexweg/cms-runtime";

// Minimal 404. Centered text + CTA back to home. Aligns with the
// corporate aesthetic (h1 in primary navy, button in secondary
// indigo) without being too playful.
export function NotFoundTemplate({
  message,
  site,
}: NotFoundTemplateProps & { site: SiteContext }) {
  const t = i18n.getFixedT(pickPublicLocale(site.settings.language), "theme-corporate");
  return (
    <section className="max-w-container-max mx-auto px-gutter py-section-padding">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-label-caps font-semibold text-secondary uppercase tracking-wider mb-stack-md">
          {t("publicBaked.notFoundTitle")}
        </p>
        <h1 className="text-h1 font-bold text-primary mb-stack-md">
          {message ?? t("publicBaked.notFoundMessage")}
        </h1>
        <a
          href="/index.html"
          className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-8 py-4 rounded-xl text-button font-semibold hover:bg-secondary/90 transition-all shadow-lg"
        >
          {t("publicBaked.backToHome")}
          <span className="material-symbols-outlined">arrow_forward</span>
        </a>
      </div>
    </section>
  );
}
