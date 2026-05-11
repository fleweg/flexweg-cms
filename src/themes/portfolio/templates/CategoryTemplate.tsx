import type { CategoryTemplateProps, SiteContext } from "@flexweg/cms-runtime";
import { ProjectCard } from "../components/ProjectCard";
import type { PortfolioThemeConfig } from "../config";
import { DEFAULT_PORTFOLIO_HOME } from "../config";

// Category archive — editorial display headline above a project grid.
// Honors the same `home.variant` choice as the home page so a site
// gets consistent rhythm across home + category. Masonry uses the
// same column-count CSS pattern declared in theme.css.
export function CategoryTemplate({
  term,
  posts,
  site,
}: CategoryTemplateProps & { site: SiteContext }) {
  const themeConfig = site.themeConfig as PortfolioThemeConfig | undefined;
  const home = { ...DEFAULT_PORTFOLIO_HOME, ...(themeConfig?.home ?? {}) };
  const gridClass =
    home.variant === "masonry"
      ? "portfolio-masonry"
      : home.variant === "staggered"
        ? "portfolio-staggered grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter"
        : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter";
  return (
    <div className="max-w-container-max mx-auto px-margin-edge-mobile md:px-margin-edge py-section-gap-mobile md:py-section-gap">
      <header className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <h1 className="font-serif text-display-lg-mobile md:text-display-lg text-on-surface leading-none display-serif">
          {term.name}
        </h1>
        {term.description && (
          <p className="font-sans text-body-md text-secondary max-w-md">
            {term.description}
          </p>
        )}
      </header>

      <section className={`${gridClass} pb-section-gap-mobile md:pb-section-gap`}>
        {posts.map((card) => (
          <ProjectCard key={card.id} card={card} />
        ))}
      </section>
    </div>
  );
}
