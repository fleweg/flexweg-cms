import type { CategoryTemplateProps, SiteContext } from "../../types";
import { pickFormat } from "../../../core/media";
import { buildTermUrl } from "../../../core/slug";
import i18n, { pickPublicLocale } from "../../../i18n";

// Corporate category archive — closely follows the Stitch mockup.
//
// Hero band: dark navy primary background with breadcrumb + h1 +
// description. Below: 3-col grid of cards (aspect-video image with
// the category name as a badge overlay, date eyebrow, h3 title,
// 3-line excerpt, "Read more" CTA). Sidebar lists every category +
// recent posts thumbs widgets — populated server-side from
// allCategories prop.
//
// FAB search button bottom-right (when flexweg-search plugin is
// active) sits in BaseLayout as a `data-cms-search` button — kept
// out of this template.
export function CategoryTemplate({
  term,
  posts,
  categoryRssUrl,
  archivesLink,
  allCategories,
  site,
}: CategoryTemplateProps & { site: SiteContext }) {
  const t = i18n.getFixedT(pickPublicLocale(site.settings.language), "theme-corporate");

  return (
    <>
      <section className="relative overflow-hidden bg-primary py-section-padding">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary to-transparent"></div>
        </div>
        <div className="max-w-container-max mx-auto px-gutter relative z-10">
          <nav className="flex items-center gap-2 mb-6 text-on-primary-container text-label-caps font-semibold uppercase tracking-wider">
            <a className="hover:text-secondary-fixed" href="/index.html">
              {t("publicBaked.home")}
            </a>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-secondary-fixed">{term.name}</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="text-h1 font-bold text-on-primary mb-6">{term.name}</h1>
            {term.description && (
              <p className="text-body-lg text-on-primary-container leading-relaxed">
                {term.description}
              </p>
            )}
            {categoryRssUrl && (
              <a
                href={categoryRssUrl}
                className="inline-flex items-center gap-2 mt-stack-md text-secondary-fixed hover:text-on-primary"
              >
                <span className="material-symbols-outlined">rss_feed</span>
                {t("publicBaked.follow")}
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-container-max mx-auto px-gutter py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            {posts.length === 0 ? (
              <p className="text-on-surface-variant">{t("publicBaked.noPostsCategory")}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-stack-lg">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col group"
                  >
                    {post.hero && (
                      <a
                        href={`/${post.url}`}
                        className="relative aspect-video overflow-hidden block"
                      >
                        <img
                          src={pickFormat(post.hero, "medium")}
                          alt={post.hero.alt ?? post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-secondary/90 text-on-secondary text-label-caps font-semibold px-3 py-1 rounded-full backdrop-blur">
                            {term.name}
                          </span>
                        </div>
                      </a>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      {post.dateLabel && (
                        <span className="text-label-caps font-semibold text-on-primary-container mb-2">
                          {post.dateLabel}
                        </span>
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
                        className="inline-flex items-center gap-2 text-button font-semibold text-secondary group-hover:gap-3 transition-all"
                      >
                        {t("publicBaked.readMore")}
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
            {archivesLink && (
              <div className="mt-stack-lg flex justify-center">
                <a className="archives-link" href={archivesLink.href}>
                  {archivesLink.label}
                </a>
              </div>
            )}
          </div>

          <aside className="w-full lg:w-80 shrink-0 space-y-stack-lg">
            {allCategories && allCategories.length > 0 && (
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm">
                <h4 className="text-h3 font-semibold text-primary mb-stack-md">
                  {t("publicBaked.section")}
                </h4>
                <ul className="space-y-3">
                  {allCategories.map((cat) => {
                    const isActive = cat.id === term.id;
                    return (
                      <li key={cat.id}>
                        <a
                          href={`/${buildTermUrl(cat)}`}
                          className="flex justify-between items-center group"
                        >
                          <span
                            className={
                              isActive
                                ? "text-secondary font-bold"
                                : "text-on-surface-variant group-hover:text-secondary transition-colors"
                            }
                          >
                            {cat.name}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
