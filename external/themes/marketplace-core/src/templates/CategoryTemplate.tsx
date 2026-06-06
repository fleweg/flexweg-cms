import type { CategoryTemplateProps, SiteContext } from "@flexweg/cms-runtime";
import { i18n, pickPublicLocale } from "@flexweg/cms-runtime";
import { ProductCard } from "../components/ProductCard";

// Category archive — breadcrumb + category title/description + 3-col
// grid of cards. The mockup category page doesn't have filter tabs
// (that's the author template). Pagination is left to the publisher.
//
// `site.settings.language` is the active locale on per-locale renders
// (the multilang plugin swaps it into a shadow ctx for renderLocalizedCategory),
// so the i18n bundle picks the right "Home" label. The breadcrumb
// "Home" link uses `site.homePath` so it resolves to `/<lang>/index.html`
// on localized archives.
export function CategoryTemplate({
  term,
  posts,
  site,
}: CategoryTemplateProps & { site: SiteContext }) {
  const t = i18n.getFixedT(
    pickPublicLocale(site.settings.language),
    "theme-marketplace-core",
  );
  const homeHref = site.homePath ?? "/index.html";

  return (
    <article>
      <nav className="mp-breadcrumb" aria-label="Breadcrumb">
        <a href={homeHref}>{t("publicBaked.home")}</a>
        <span className="mp-breadcrumb__sep">/</span>
        <span>{term.name}</span>
      </nav>

      <header className="mp-section">
        <h1 className="text-display-lg font-headline">{term.name}</h1>
        {term.description && (
          <p className="text-body-lg" style={{ color: "rgb(var(--color-on-surface-variant))", maxWidth: "640px", marginTop: 8 }}>
            {term.description}
          </p>
        )}
      </header>

      <section className="mp-section">
        <div className="mp-grid mp-grid--3">
          {posts.map((card) => (
            <ProductCard key={card.id} card={card} site={site} />
          ))}
        </div>
      </section>
    </article>
  );
}
