import type { CategoryTemplateProps, SiteContext } from "@flexweg/cms-runtime";
import { pickFormat } from "@flexweg/cms-runtime";
import { buildTermUrl } from "@flexweg/cms-runtime";
import { i18n, pickPublicLocale } from "@flexweg/cms-runtime";

// Editorial category archive (mockup-faithful):
//
//   • Breadcrumb strip (Home › Categories › <name>) + header card
//     with a `border-l-4` accent and a description.
//   • 3/9 grid: sticky left sidebar with a "Sections" nav (every
//     category, current one highlighted) and a "Popular Tags" pill
//     cloud, plus a 9-col main column rendering a 1/2/3-col grid of
//     post cards.
//
// Sidebar data (`allCategories`, `popularTags`) is resolved by the
// publisher in publisher.renderCategory — both are optional on the
// props so other themes can ignore them.
export function CategoryTemplate({
  term,
  posts,
  categoryRssUrl,
  archivesLink,
  allCategories,
  popularTags,
  site,
}: CategoryTemplateProps & { site: SiteContext }) {
  const t = i18n.getFixedT(pickPublicLocale(site.settings.language), "theme-magazine");

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile lg:px-gutter">
      {/* Breadcrumb */}
      <nav
        className="flex items-center gap-2 mb-stack-sm text-on-surface-variant text-xs uppercase tracking-widest"
        aria-label="Breadcrumb"
      >
        <a className="hover:text-primary transition-colors" href="/index.html">
          {t("publicBaked.home")}
        </a>
        <span className="material-symbols-outlined text-base" aria-hidden="true">chevron_right</span>
        <span>{t("publicBaked.categories")}</span>
        <span className="material-symbols-outlined text-base" aria-hidden="true">chevron_right</span>
        <span className="text-primary font-bold">{term.name}</span>
      </nav>

      {/* Header */}
      <header className="mb-stack-lg flex items-end justify-between gap-stack-md flex-wrap">
        <div className="border-l-4 border-primary pl-stack-md">
          <h1 className="font-serif text-5xl md:text-6xl text-primary mb-stack-sm">{term.name}</h1>
          {term.description && (
            <p className="text-lg text-on-surface-variant max-w-2xl">{term.description}</p>
          )}
        </div>
        {categoryRssUrl && (
          <a
            href={categoryRssUrl}
            className="inline-flex items-center gap-2 px-stack-md py-2 border border-on-surface text-xs uppercase tracking-widest font-semibold hover:bg-on-surface hover:text-on-primary transition-colors"
            aria-label={t("publicBaked.follow404", { name: term.name })}
          >
            <span className="material-symbols-outlined text-base">rss_feed</span>
            {t("publicBaked.follow")}
          </a>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <div className="sticky top-28 bg-surface border border-outline-variant rounded p-stack-md">
            <h2 className="font-serif text-xl text-primary mb-stack-md">
              {t("publicBaked.sections")}
            </h2>
            {allCategories && allCategories.length > 0 && (
              <nav className="flex flex-col gap-1">
                {allCategories.map((cat) => {
                  const isActive = cat.id === term.id;
                  return (
                    <a
                      key={cat.id}
                      href={`/${buildTermUrl(cat)}`}
                      className={
                        "block py-2 px-stack-md rounded text-base transition-colors " +
                        (isActive
                          ? "bg-surface-container text-primary font-bold"
                          : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface")
                      }
                    >
                      {cat.name}
                    </a>
                  );
                })}
              </nav>
            )}
            {popularTags && popularTags.length > 0 && (
              <div className="mt-stack-lg pt-stack-md border-t border-outline-variant">
                <h3 className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-stack-sm">
                  {t("publicBaked.popularTags")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 bg-surface-container text-on-surface-variant text-xs uppercase tracking-wider rounded-full"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main */}
        <div className="lg:col-span-9">
          {posts.length === 0 ? (
            <p className="text-on-surface-variant">{t("publicBaked.noPostsCategory")}</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
              {posts.map((post) => (
                <li key={post.id}>
                  <a href={`/${post.url}`} className="group block">
                    {post.hero && (
                      <div className="aspect-[4/3] overflow-hidden bg-surface-container mb-stack-md">
                        <img
                          src={pickFormat(post.hero, "medium")}
                          alt={post.hero.alt ?? ""}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      {post.category && (
                        <span className="block text-secondary uppercase tracking-widest text-xs font-semibold">
                          {post.category.name}
                        </span>
                      )}
                      <h3 className="font-serif text-xl font-medium text-primary group-hover:text-secondary transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-base text-on-surface-variant line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}

          {archivesLink && (
            <p className="mt-stack-lg">
              <a className="text-secondary hover:underline" href={archivesLink.href}>
                {archivesLink.label}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
