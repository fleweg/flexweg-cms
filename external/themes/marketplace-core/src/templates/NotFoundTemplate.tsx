import type { NotFoundTemplateProps, SiteContext } from "@flexweg/cms-runtime";
import { i18n, pickPublicLocale } from "@flexweg/cms-runtime";

export function NotFoundTemplate({ site }: NotFoundTemplateProps & { site: SiteContext }) {
  const t = i18n.getFixedT(pickPublicLocale(site.settings.language), "theme-marketplace-core");
  return (
    <div className="mp-404">
      <span className="material-symbols-outlined">search_off</span>
      <h1>404</h1>
      <p className="text-body-lg" style={{ color: "rgb(var(--color-on-surface-variant))" }}>
        {t("publicBaked.notFound")}
      </p>
      <a href="/index.html" className="mp-btn mp-btn--primary">
        {t("publicBaked.backHome")}
      </a>
    </div>
  );
}
