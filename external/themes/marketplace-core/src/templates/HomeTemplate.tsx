import type { CardPost, HomeTemplateProps, SiteContext } from "@flexweg/cms-runtime";
import { i18n, pickPublicLocale } from "@flexweg/cms-runtime";
import { ProductCard } from "../components/ProductCard";
import type { MarketplaceThemeConfig } from "../config";
import { DEFAULT_MARKETPLACE_HOME } from "../config";

// Home — hero banner + Featured Plugins (2-wide cards) + New Themes
// (3-col grid) + optional Recently Updated section. Posts are
// filtered by their `category.url` slug so admins control what
// shows up in each row via the Theme Settings → Home tab.
//
// `staticPage` branch: when the home is wired to a static page in
// site settings, render that page's body inside a constrained
// container instead of the product layout.
export function HomeTemplate({
  posts,
  staticPage,
  site,
}: HomeTemplateProps & { site: SiteContext }) {
  const t = i18n.getFixedT(pickPublicLocale(site.settings.language), "theme-marketplace-core");
  const themeConfig = site.themeConfig as MarketplaceThemeConfig | undefined;
  const home = { ...DEFAULT_MARKETPLACE_HOME, ...(themeConfig?.home ?? {}) };

  if (staticPage) {
    return (
      <article className="mp-page-body">
        <div
          className="mp-prose"
          dangerouslySetInnerHTML={{ __html: staticPage.bodyHtml }}
        />
      </article>
    );
  }

  function bySlug(slug: string, max: number): CardPost[] {
    if (!slug || max <= 0) return [];
    return posts
      .filter((p) => {
        if (!p.category) return false;
        const seg = p.category.url.replace(/^\/+/, "").split("/")[0];
        return seg === slug;
      })
      .slice(0, max);
  }

  const featured = bySlug(home.featuredCategorySlug, home.featuredCount);
  const newest = bySlug(home.newCategorySlug, home.newCount);
  const recent = home.showRecentlyUpdated
    ? posts.slice(0, home.recentlyUpdatedCount)
    : [];

  return (
    <div>
      {(home.heroHeadline || home.heroIntro) && (
        <section className="mp-hero">
          {home.heroEyebrow && <p className="mp-hero__eyebrow">{home.heroEyebrow}</p>}
          {home.heroHeadline && <h1>{home.heroHeadline}</h1>}
          {home.heroIntro && <p>{home.heroIntro}</p>}
        </section>
      )}

      {featured.length > 0 && (
        <section className="mp-section">
          <div className="mp-section__heading">
            <h2>{home.featuredHeading}</h2>
            {home.featuredCategorySlug && (
              <a
                className="mp-section__see-all"
                href={`/${home.featuredCategorySlug}/index.html`}
              >
                {t("publicBaked.seeAll")} →
              </a>
            )}
          </div>
          <div className="mp-grid mp-grid--2">
            {featured.map((card) => (
              <ProductCard key={card.id} card={card} site={site} />
            ))}
          </div>
        </section>
      )}

      {newest.length > 0 && (
        <section className="mp-section">
          <div className="mp-section__heading">
            <h2>{home.newHeading}</h2>
            {home.newCategorySlug && (
              <a
                className="mp-section__see-all"
                href={`/${home.newCategorySlug}/index.html`}
              >
                {t("publicBaked.seeAll")} →
              </a>
            )}
          </div>
          <div className="mp-grid mp-grid--3">
            {newest.map((card) => (
              <ProductCard key={card.id} card={card} site={site} />
            ))}
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className="mp-section">
          <div className="mp-section__heading">
            <h2>{home.recentlyUpdatedHeading}</h2>
          </div>
          <div className="mp-grid mp-grid--3">
            {recent.map((card) => (
              <ProductCard key={card.id} card={card} site={site} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
