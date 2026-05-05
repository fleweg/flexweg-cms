import type { NotFoundTemplateProps, SiteContext } from "../../types";
import i18n, { pickPublicLocale } from "../../../i18n";

// Sober editorial 404 — display-xl serif numeral + lede + CTA. Same
// breathing room as the other templates so the page doesn't feel
// abandoned compared to the rest of the site.
export function NotFoundTemplate({
  message,
  site,
}: NotFoundTemplateProps & { site: SiteContext }) {
  const t = i18n.getFixedT(pickPublicLocale(site.settings.language), "theme-magazine");
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile lg:px-gutter min-h-[60vh] flex flex-col items-center justify-center text-center py-stack-lg">
      <p className="text-secondary uppercase tracking-widest text-xs font-semibold mb-stack-sm">
        {t("publicBaked.notFoundTitle")}
      </p>
      <h1 className="font-serif text-6xl md:text-7xl font-semibold text-primary leading-[1.05] mb-stack-md">
        {t("publicBaked.notFoundMessage")}
      </h1>
      {message && (
        <p className="text-lg text-on-surface-variant max-w-2xl mb-stack-lg">
          {message}
        </p>
      )}
      <a
        href="/index.html"
        className="inline-block px-stack-lg py-stack-sm border border-on-surface text-xs uppercase tracking-widest font-semibold hover:bg-on-surface hover:text-on-primary transition-colors"
      >
        {t("publicBaked.backToHome")}
      </a>
    </div>
  );
}
