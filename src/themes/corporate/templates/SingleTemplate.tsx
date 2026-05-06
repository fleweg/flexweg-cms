import type { SingleTemplateProps, SiteContext } from "../../types";
import { pickFormat } from "../../../core/media";
import { buildTermUrl } from "../../../core/slug";
import i18n, { pickPublicLocale } from "../../../i18n";
import { DEFAULT_CORPORATE_SINGLE, type CorporateThemeConfig } from "../config";

// Corporate single-post layout — applies the Stitch mockup rigorously.
//
// Layout:
//   1. Hero image FULL-BLEED at top (no container padding, no
//      rounding) — aspect-[16/10] on mobile per the mobile mockup,
//      aspect-[21/9] on md+ per the cinemascope feel of the desktop
//      mockup.
//   2. Inline meta row (chip-style category badge + date with
//      calendar icon + author with person icon) — matches the mobile
//      mockup's compact metadata strip; same row on every viewport.
//   3. Title (h2 size on mobile, h1 on md+).
//   4. Two-column 8/4 grid below: prose body / sidebar (author bio,
//      popular articles, CTA card). Single column on mobile —
//      sidebar drops below the body naturally.
//
// Pages (post.type === "page") render WITHOUT hero / meta / sidebar
// so admins can compose them freely with theme blocks (e.g. the
// contact page).
export function SingleTemplate({
  post,
  bodyHtml,
  author,
  hero,
  primaryTerm,
  tags,
  site,
}: SingleTemplateProps & { site: SiteContext }) {
  const t = i18n.getFixedT(pickPublicLocale(site.settings.language), "theme-corporate");
  const isPage = post.type === "page";

  // Resolve single-post sidebar config. Defaults guarantee author
  // bio off, popular articles on, even on a fresh install with no
  // stored themeConfig.
  const themeConfig = site.themeConfig as CorporateThemeConfig | undefined;
  const singleConfig = {
    ...DEFAULT_CORPORATE_SINGLE,
    ...(themeConfig?.single ?? {}),
  };
  const popularLabel =
    singleConfig.popularArticlesTitle.trim() || t("publicBaked.popularArticles");
  // CTA card values resolve through the existing fallback chain
  // (config override → site settings → localised default) so leaving
  // any field empty preserves the previous behavior.
  const ctaTitle =
    singleConfig.ctaTitle.trim() ||
    (site.settings.description ? site.settings.title : t("publicBaked.getStarted"));
  const ctaButtonLabel =
    singleConfig.ctaButtonLabel.trim() || t("publicBaked.getStarted");
  const ctaButtonHref = singleConfig.ctaButtonHref.trim() || "/contact.html";

  const dateMs =
    post.publishedAt?.toMillis?.() ??
    post.updatedAt?.toMillis?.() ??
    post.createdAt?.toMillis?.();
  let dateLabel: string | undefined;
  if (dateMs) {
    try {
      dateLabel = new Intl.DateTimeFormat(site.settings.language || "en", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(dateMs));
    } catch {
      dateLabel = new Date(dateMs).toDateString();
    }
  }

  // Page composition — no hero, no meta, no sidebar. The body is
  // expected to carry its own composition (hero block, services,
  // contact form, …).
  if (isPage) {
    return (
      <article className="pt-stack-md pb-section-padding">
        <div
          className="corporate-page-body"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </article>
    );
  }

  return (
    <article>
      {/* Full-bleed hero image — sits immediately under the fixed
          header (BaseLayout's <main pt-20> spaces it correctly).
          Edge-to-edge horizontally, no rounding, no shadow. */}
      {hero && (
        <div className="relative w-full aspect-[16/10] md:aspect-[21/9] overflow-hidden">
          <img
            src={pickFormat(hero, "large")}
            alt={hero.alt ?? ""}
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
        </div>
      )}

      {/* Meta + title — single column max-w-3xl on mobile, container
          width on lg+ so the title aligns with the body column. */}
      <div className="px-gutter mt-stack-lg pb-stack-lg max-w-container-max mx-auto">
        <div className="lg:grid lg:grid-cols-12 lg:gap-stack-lg">
          <header className="lg:col-span-8 max-w-3xl">
            <div className="flex flex-wrap items-center gap-stack-md mb-stack-md">
              {primaryTerm && (
                <a
                  href={`/${buildTermUrl(primaryTerm)}`}
                  className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-caps font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  {primaryTerm.name}
                </a>
              )}
              {dateLabel && (
                <div className="flex items-center text-on-surface-variant text-body-md">
                  <span className="material-symbols-outlined text-[18px] mr-1">
                    calendar_today
                  </span>
                  <span>{dateLabel}</span>
                </div>
              )}
              {author && (
                <div className="flex items-center text-on-surface-variant text-body-md">
                  <span className="material-symbols-outlined text-[18px] mr-1">
                    person
                  </span>
                  <span>{author.displayName}</span>
                </div>
              )}
            </div>
            <h1 className="text-h2 md:text-h1 font-bold text-primary leading-tight">
              {post.title}
            </h1>
          </header>
        </div>
      </div>

      {/* Body + sidebar grid */}
      <div className="px-gutter pb-section-padding max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
        <div className="lg:col-span-8 max-w-3xl">
          <div
            className="corporate-prose"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
          {tags.length > 0 && (
            <div className="mt-stack-lg pt-stack-md border-t border-outline-variant/30 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-surface-container-high rounded-full text-label-caps font-semibold text-primary"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
          {/* Share row — matches the mobile mockup. Wired by
              posts-loader.js: native share API → clipboard fallback. */}
          <div className="mt-section-padding pt-stack-lg border-t border-outline-variant/50">
            <h4 className="text-label-caps font-semibold text-on-surface-variant uppercase tracking-wider mb-stack-md">
              {t("publicBaked.shareThisArticle")}
            </h4>
            <div className="flex gap-4">
              <button
                type="button"
                data-cms-share="native"
                className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary transition-all hover:bg-secondary hover:text-on-secondary"
              >
                <span className="material-symbols-outlined">share</span>
              </button>
              <button
                type="button"
                data-cms-share="copy"
                className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary transition-all hover:bg-secondary hover:text-on-secondary"
              >
                <span className="material-symbols-outlined">link</span>
              </button>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-stack-lg">
          {singleConfig.showAuthorBio && post.authorId && (
            <section
              className="corporate-bio-card"
              data-cms-author-bio
              data-cms-author-id={post.authorId}
              data-cms-bio-label={t("publicBaked.author")}
              hidden
            />
          )}
          {singleConfig.showPopularArticles && (
            <section
              className="corporate-related-card"
              data-cms-related
              data-cms-current-id={post.id}
              data-cms-term-id={post.primaryTermId ?? ""}
              data-cms-limit="3"
              data-cms-label={popularLabel}
              data-cms-fallback-label={popularLabel}
            />
          )}
          {singleConfig.showCta && (
            <div className="corporate-cta-card">
              <div className="relative z-10">
                <h4 className="text-h2 font-bold mb-stack-sm">{ctaTitle}</h4>
                {site.settings.description && (
                  <p className="text-body-md opacity-80 mb-stack-lg">
                    {site.settings.description}
                  </p>
                )}
                <a
                  href={ctaButtonHref}
                  className="block w-full text-center bg-secondary text-on-secondary py-3 rounded-lg text-button font-semibold hover:bg-secondary/90 transition-all shadow-lg"
                >
                  {ctaButtonLabel}
                </a>
              </div>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
