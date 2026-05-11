import type { SingleTemplateProps, SiteContext } from "@flexweg/cms-runtime";
import { i18n, pickFormat, pickPublicLocale } from "@flexweg/cms-runtime";
import type { PortfolioThemeConfig } from "../config";
import { DEFAULT_PORTFOLIO_SINGLE } from "../config";

// Portfolio single — full-bleed grayscale hero, 4-col meta + 8-col
// intro, body markdown below in `portfolio-prose`. Pages
// (`post.type === "page"`) bypass the hero / meta and render in a
// constrained `portfolio-page-body` container.
//
// Phase 1: minimal version without the bento gallery / storytelling
// / next-project teaser blocks — those come in Phase 3 as inserted
// blocks the user puts into the post body.
export function SingleTemplate({
  post,
  bodyHtml,
  hero,
  primaryTerm,
  site,
}: SingleTemplateProps & { site: SiteContext }) {
  const { settings } = site;
  const t = i18n.getFixedT(pickPublicLocale(settings.language), "theme-portfolio");
  const themeConfig = site.themeConfig as PortfolioThemeConfig | undefined;
  const single = { ...DEFAULT_PORTFOLIO_SINGLE, ...(themeConfig?.single ?? {}) };
  const isPage = post.type === "page";

  if (isPage) {
    return (
      <article className="pt-section-gap-mobile md:pt-section-gap pb-section-gap-mobile md:pb-section-gap">
        <div
          className="portfolio-page-body"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </article>
    );
  }

  const heroUrl = hero ? pickFormat(hero, "hero") || pickFormat(hero) : "";
  const ms =
    (post.publishedAt as { toMillis?: () => number } | undefined)?.toMillis?.() ??
    (post.createdAt as { toMillis?: () => number } | undefined)?.toMillis?.() ??
    null;
  const year = ms ? new Date(ms).getUTCFullYear() : "";
  const eyebrow = [primaryTerm?.name?.toUpperCase(), year ? String(year) : ""]
    .filter(Boolean)
    .join(" / ");

  return (
    <article>
      {single.showHero && heroUrl && (
        <section className="w-full relative h-[60vh] md:h-[80vh] overflow-hidden">
          <img
            src={heroUrl}
            alt={hero?.alt ?? post.title}
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex flex-col justify-end px-margin-edge-mobile md:px-margin-edge pb-section-gap-mobile md:pb-section-gap">
            <div className="max-w-container-max mx-auto w-full">
              {eyebrow && (
                <p className="font-sans text-label-sm uppercase tracking-[0.2em] text-on-primary/80 mb-4">
                  {eyebrow}
                </p>
              )}
              <h1 className="font-serif text-display-lg-mobile md:text-display-lg text-on-primary max-w-4xl display-serif">
                {post.title}
              </h1>
            </div>
          </div>
        </section>
      )}

      <section className="max-w-container-max mx-auto px-margin-edge-mobile md:px-margin-edge py-section-gap-mobile md:py-section-gap grid grid-cols-12 gap-gutter">
        <aside className="col-span-12 md:col-span-4 flex flex-col gap-8">
          {primaryTerm && (
            <div className="flex flex-col gap-2">
              <span className="font-sans text-label-sm uppercase text-secondary">
                {t("publicBaked.servicesLabel")}
              </span>
              <p className="font-sans text-body-md text-on-surface">
                {primaryTerm.name}
              </p>
            </div>
          )}
          {year && (
            <div className="flex flex-col gap-2">
              <span className="font-sans text-label-sm uppercase text-secondary">
                {t("publicBaked.yearLabel")}
              </span>
              <p className="font-sans text-body-md text-on-surface">{year}</p>
            </div>
          )}
        </aside>

        <div className="col-span-12 md:col-span-8">
          {post.excerpt && (
            <h2 className="font-serif text-headline-lg-mobile md:text-headline-lg text-on-surface mb-8">
              {post.excerpt}
            </h2>
          )}
          <div
            className="portfolio-prose"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        </div>
      </section>

      {/* Related projects placeholder — populated by posts-loader.js at
          runtime. Hidden by CSS when empty. Phase 2 wires this up. */}
      <section
        className="max-w-container-max mx-auto px-margin-edge-mobile md:px-margin-edge pb-section-gap-mobile md:pb-section-gap"
        data-cms-related
        data-cms-related-count="3"
        hidden
      />
    </article>
  );
}
