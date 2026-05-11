import type { HomeTemplateProps, SiteContext } from "@flexweg/cms-runtime";
import { i18n, pickPublicLocale } from "@flexweg/cms-runtime";
import { ProjectCard } from "../components/ProjectCard";
import type { PortfolioThemeConfig } from "../config";
import { DEFAULT_PORTFOLIO_HOME } from "../config";

// Portfolio home — hero text section above a project grid in one
// of three layout variants (staggered / masonry / standard). Project
// cells are ProjectCards keyed on the publisher's pre-resolved
// CardPost (url + hero + category already filled in).
//
// `staticPage` branch covers the case where the site uses a static
// page as the home — we render the page's body inside the portfolio
// page wrapper. The post / project grid path is the default.
export function HomeTemplate({
  posts,
  staticPage,
  site,
}: HomeTemplateProps & { site: SiteContext }) {
  const { settings } = site;
  const t = i18n.getFixedT(pickPublicLocale(settings.language), "theme-portfolio");
  const themeConfig = site.themeConfig as PortfolioThemeConfig | undefined;
  const home = { ...DEFAULT_PORTFOLIO_HOME, ...(themeConfig?.home ?? {}) };

  if (staticPage) {
    return (
      <article className="pt-section-gap-mobile md:pt-section-gap pb-section-gap-mobile md:pb-section-gap">
        <div
          className="portfolio-page-body"
          dangerouslySetInnerHTML={{ __html: staticPage.bodyHtml }}
        />
      </article>
    );
  }

  const capped =
    home.cardLimit > 0 ? posts.slice(0, home.cardLimit) : posts;

  const gridClass =
    home.variant === "masonry"
      ? "portfolio-masonry"
      : home.variant === "staggered"
        ? "portfolio-staggered grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter"
        : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter";

  return (
    <div className="max-w-container-max mx-auto px-margin-edge-mobile md:px-margin-edge">
      {(home.heroHeadline || home.heroIntro) && (
        <section className="py-section-gap-mobile md:py-section-gap flex flex-col justify-center min-h-[40vh]">
          <div className="max-w-4xl">
            {home.heroHeadline && (
              <h1 className="font-serif text-display-lg-mobile md:text-display-lg text-on-surface mb-8 display-serif">
                {home.heroHeadline}
              </h1>
            )}
            {home.heroIntro && (
              <p className="font-sans text-body-lg text-secondary max-w-2xl">
                {home.heroIntro}
              </p>
            )}
          </div>
        </section>
      )}

      {home.showFilters && (
        <section className="pb-12">
          <div
            className="flex flex-wrap gap-2"
            data-cms-portfolio-filters
            aria-label="Project filters"
          >
            <button
              type="button"
              className="portfolio-btn-outline is-active"
              data-cms-filter="*"
            >
              {t("publicBaked.all")}
            </button>
            {/* Loader fills in <button data-cms-filter="<slug>"> chips */}
          </div>
        </section>
      )}

      <section className="pb-section-gap-mobile md:pb-section-gap">
        <div className={gridClass}>
          {capped.map((card) => (
            <ProjectCard key={card.id} card={card} />
          ))}
        </div>
      </section>
    </div>
  );
}
