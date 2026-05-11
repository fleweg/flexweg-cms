import type { AuthorTemplateProps, SiteContext } from "@flexweg/cms-runtime";
import { i18n, pickFormat, pickPublicLocale } from "@flexweg/cms-runtime";
import { ProjectCard } from "../components/ProjectCard";
import type { PortfolioThemeConfig } from "../config";
import { DEFAULT_PORTFOLIO_AUTHOR } from "../config";

// Author archive — 4-col avatar / 8-col bio split, then optional
// experience + recognition lists, then a uniform grid of the
// author's projects. Phase 1 ships the layout shell; experience /
// recognition lists are placeholders here and become editable in
// Phase 4 via the author's bio markdown or a dedicated theme block.
export function AuthorTemplate({
  author,
  posts,
  site,
}: AuthorTemplateProps & { site: SiteContext }) {
  const { settings } = site;
  const t = i18n.getFixedT(pickPublicLocale(settings.language), "theme-portfolio");
  const themeConfig = site.themeConfig as PortfolioThemeConfig | undefined;
  const config = { ...DEFAULT_PORTFOLIO_AUTHOR, ...(themeConfig?.author ?? {}) };
  const avatarUrl = author.avatar
    ? pickFormat(author.avatar, "portrait") || pickFormat(author.avatar)
    : "";

  return (
    <article className="max-w-container-max mx-auto px-margin-edge-mobile md:px-margin-edge py-section-gap-mobile md:py-section-gap">
      <section className="grid grid-cols-12 gap-gutter mb-section-gap-mobile md:mb-section-gap">
        <aside className="col-span-12 md:col-span-4">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={author.displayName}
              className="w-full aspect-[4/5] object-cover"
              loading="lazy"
            />
          )}
        </aside>

        <div className="col-span-12 md:col-span-8 flex flex-col">
          <h1 className="font-serif text-display-lg-mobile md:text-display-lg text-on-surface mb-12 display-serif">
            {author.displayName}
          </h1>
          {author.title && (
            <p className="font-sans text-label-sm uppercase tracking-widest text-secondary mb-6">
              {author.title}
            </p>
          )}
          {author.bio && (
            <div className="portfolio-prose">
              <p>{author.bio}</p>
            </div>
          )}

          {config.showExperience && (
            <section className="mt-16">
              <h2 className="font-sans text-label-sm uppercase tracking-widest text-secondary mb-6">
                {t("publicBaked.selectExperience")}
              </h2>
              {/* Phase 4: rendered from a portfolio/experience block */}
            </section>
          )}

          {config.showRecognition && (
            <section className="mt-16">
              <h2 className="font-sans text-label-sm uppercase tracking-widest text-secondary mb-6">
                {t("publicBaked.recognition")}
              </h2>
              {/* Phase 4: rendered from a portfolio/recognition block */}
            </section>
          )}
        </div>
      </section>

      {posts.length > 0 && (
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
          {posts.map((card) => (
            <ProjectCard key={card.id} card={card} />
          ))}
        </section>
      )}
    </article>
  );
}
