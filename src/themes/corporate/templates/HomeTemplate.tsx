import type { HomeTemplateProps, SiteContext } from "../../types";
import i18n, { pickPublicLocale } from "../../../i18n";
import { pickFormat } from "../../../core/media";
import { renderHeroOverlay } from "../blocks/heroOverlay/render";
import { renderTestimonials } from "../blocks/testimonials/render";
import {
  DEFAULT_CORPORATE_HOME,
  type CorporateHomeConfig,
  type CorporateThemeConfig,
} from "../config";

// Corporate home — two modes:
//
//   1. Static-page mode: when `staticPage` is provided (admin set
//      `homeMode: "static-page"` and pointed at a `page`), we render
//      the page body verbatim (block markers already resolved).
//
//   2. Default mode: render hero + featured-posts + testimonials,
//      all configurable from /theme-settings → Home tab. Each
//      section can be toggled off independently. Out of the box,
//      defaults seed credible placeholder content for every section
//      so the home reads as a vitrine site after the first publish.
export function HomeTemplate({
  posts,
  staticPage,
  archivesLink,
  site,
}: HomeTemplateProps & { site: SiteContext }) {
  const t = i18n.getFixedT(pickPublicLocale(site.settings.language), "theme-corporate");

  if (staticPage) {
    return (
      <div
        className="corporate-static-home"
        dangerouslySetInnerHTML={{ __html: staticPage.bodyHtml }}
      />
    );
  }

  // Resolve home config. The themeConfig prop is unknown-typed —
  // cast to the corporate shape and merge with defaults so a fresh
  // install still gets the full home out of the box.
  const themeConfig = site.themeConfig as CorporateThemeConfig | undefined;
  const homeConfig: CorporateHomeConfig = {
    ...DEFAULT_CORPORATE_HOME,
    ...(themeConfig?.home ?? {}),
    hero: { ...DEFAULT_CORPORATE_HOME.hero, ...(themeConfig?.home?.hero ?? {}) },
    featuredPosts: {
      ...DEFAULT_CORPORATE_HOME.featuredPosts,
      ...(themeConfig?.home?.featuredPosts ?? {}),
    },
    testimonials: {
      ...DEFAULT_CORPORATE_HOME.testimonials,
      ...(themeConfig?.home?.testimonials ?? {}),
    },
  };

  const heroHtml = homeConfig.showHero ? renderHeroOverlay(homeConfig.hero).html : "";

  // Resolve featured posts. When `mode === "category"`, filter by
  // primaryTermId. An empty / unmatched categoryId silently falls
  // back to "all" so the section never renders empty after a term
  // gets renamed or deleted.
  const fp = homeConfig.featuredPosts;
  let featuredPosts = posts;
  if (fp.enabled && fp.mode === "category" && fp.categoryId) {
    const filtered = posts.filter((p) => p.primaryTermId === fp.categoryId);
    if (filtered.length > 0) featuredPosts = filtered;
  }
  featuredPosts = featuredPosts.slice(0, Math.max(1, fp.count));

  // Pre-render testimonials section to a single HTML string. Lets
  // us reuse the corporate/testimonials block exactly — no parallel
  // markup to keep in sync.
  const testimonialsHtml = homeConfig.testimonials.enabled
    ? renderTestimonials({
        eyebrow: homeConfig.testimonials.eyebrow,
        title: homeConfig.testimonials.title,
        subtitle: homeConfig.testimonials.subtitle,
        variant: homeConfig.testimonials.variant,
        testimonials: homeConfig.testimonials.items,
      }).html
    : "";

  return (
    <>
      {heroHtml && <div dangerouslySetInnerHTML={{ __html: heroHtml }} />}

      {fp.enabled && featuredPosts.length > 0 && (
        <section className="px-gutter py-section-padding" id="featured">
          <div className="max-w-container-max mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-stack-lg gap-stack-md">
              <div className="max-w-xl">
                {fp.title && (
                  <h2 className="text-h2 font-bold text-primary mb-2">{fp.title}</h2>
                )}
                {fp.subtitle && (
                  <p className="text-on-surface-variant text-body-md">{fp.subtitle}</p>
                )}
              </div>
              {/* Decorative chevrons matching the mockup. They're inert
                  on first paint — clicking them scrolls the snap
                  container by one card width. Wired by posts-loader.js
                  via `[data-cms-featured-prev]` / `[data-cms-featured-next]`. */}
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  data-cms-featured-prev
                  aria-label={t("publicBaked.previous")}
                  className="p-3 rounded-full border border-outline hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                  type="button"
                  data-cms-featured-next
                  aria-label={t("publicBaked.next")}
                  className="p-3 rounded-full border border-outline hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
            <div
              data-cms-featured-track
              className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-stack-lg corporate-no-scrollbar"
            >
              {featuredPosts.map((post) => (
                <article
                  key={post.id}
                  className="snap-start corporate-slide bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col group"
                >
                  {post.hero && (
                    <a href={`/${post.url}`} className="block aspect-video overflow-hidden">
                      <img
                        src={pickFormat(post.hero, "medium")}
                        alt={post.hero.alt ?? post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </a>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    {post.category && (
                      <p className="text-label-caps font-semibold text-secondary uppercase tracking-wider mb-2">
                        {post.category.name}
                      </p>
                    )}
                    {post.dateLabel && (
                      <p className="text-label-caps font-semibold text-on-surface-variant mb-2">
                        {post.dateLabel}
                      </p>
                    )}
                    <h3 className="text-h3 font-semibold text-primary mb-3 group-hover:text-secondary transition-colors">
                      <a href={`/${post.url}`}>{post.title}</a>
                    </h3>
                    {post.excerpt && (
                      <p className="text-body-md text-on-surface-variant mb-6 flex-1">
                        {post.excerpt}
                      </p>
                    )}
                    <a
                      href={`/${post.url}`}
                      className="inline-flex items-center gap-2 text-button font-semibold text-secondary"
                    >
                      {t("publicBaked.readMore")}
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
            {archivesLink && (
              <div className="mt-stack-lg">
                <a className="archives-link" href={archivesLink.href}>
                  {archivesLink.label}
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {testimonialsHtml && (
        <div dangerouslySetInnerHTML={{ __html: testimonialsHtml }} />
      )}
    </>
  );
}
