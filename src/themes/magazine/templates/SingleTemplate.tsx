import type { SingleTemplateProps, SiteContext } from "../../types";
import { pickFormat } from "../../../core/media";
import { buildTermUrl } from "../../../core/slug";
import i18n, { pickPublicLocale } from "../../../i18n";

// Editorial single-post layout (mockup-faithful):
//
//   • Centered title block (max-w-3xl): eyebrow, display-xl serif
//     title, italic lede, then a thin metadata strip (author + date).
//   • Hero 21:9 with caption below (right-aligned).
//   • Body in a centered max-w-2xl column (~65ch reading width).
//     The first paragraph automatically gets a drop-cap via the
//     `.magazine-prose-drop-cap` selector in theme.css.
//   • A 4-col sidebar on lg+ for runtime widgets — author bio +
//     related posts. Both are populated by the theme's posts-loader.js
//     (added in a later phase) and stay hidden when empty.
//
// Social rail (share/bookmark/comment column on lg+) intentionally
// skipped — its icons in the mockup were decorative/non-functional.
// We can wire share/bookmark in via the Web Share API later if useful.
export function SingleTemplate({
  post,
  bodyHtml,
  author,
  hero,
  primaryTerm,
  tags,
  site,
}: SingleTemplateProps & { site: SiteContext }) {
  const t = i18n.getFixedT(pickPublicLocale(site.settings.language), "theme-magazine");

  const dateMs =
    post.publishedAt?.toMillis?.() ??
    post.updatedAt?.toMillis?.() ??
    post.createdAt?.toMillis?.();
  let dateLabel: string | undefined;
  if (dateMs) {
    try {
      dateLabel = new Intl.DateTimeFormat(site.settings.language || "en", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date(dateMs));
    } catch {
      dateLabel = new Date(dateMs).toDateString();
    }
  }

  const authorAvatarUrl = author?.avatar ? pickFormat(author.avatar, "small") : "";

  return (
    <article className="w-full">
      <header className="max-w-container-max mx-auto px-margin-mobile lg:px-gutter mb-stack-lg pt-stack-lg">
        <div className="max-w-3xl mx-auto text-center">
          {primaryTerm && (
            <a
              href={`/${buildTermUrl(primaryTerm)}`}
              className="inline-block text-secondary uppercase tracking-widest text-xs font-semibold mb-stack-sm"
            >
              {primaryTerm.name}
            </a>
          )}
          <h1 className="font-serif text-4xl md:text-6xl font-semibold text-primary leading-[1.05] mb-stack-md">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="font-serif text-xl md:text-2xl text-on-surface-variant italic font-light">
              {post.excerpt}
            </p>
          )}
          {(author || dateLabel) && (
            <div className="flex items-center justify-center flex-wrap gap-stack-md py-stack-md mt-stack-md border-y border-outline-variant text-sm text-on-surface-variant">
              {author && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden shrink-0">
                    {authorAvatarUrl && (
                      <img
                        src={authorAvatarUrl}
                        alt={author.displayName}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <span className="font-semibold text-on-surface">{author.displayName}</span>
                </div>
              )}
              {author && dateLabel && (
                <span className="h-4 w-px bg-outline-variant" aria-hidden="true" />
              )}
              {dateLabel && <time>{dateLabel}</time>}
            </div>
          )}
        </div>
        {hero && (
          <figure className="mt-stack-lg max-w-container-max mx-auto">
            {/* Aspect: 16:9 on mobile (the 21:9 cinemascope letterbox
                feels too thin on phones), 21:9 from md: up where the
                wider container makes the editorial cinemascope work. */}
            <div className="aspect-video md:aspect-[21/9] overflow-hidden bg-surface-container-high rounded-lg">
              <img
                src={pickFormat(hero, "large")}
                alt={hero.alt ?? ""}
                className="w-full h-full object-cover"
                fetchPriority="high"
              />
            </div>
            {hero.caption && (
              <figcaption className="text-right text-sm text-on-surface-variant mt-stack-sm">
                {hero.caption}
              </figcaption>
            )}
          </figure>
        )}
      </header>

      <div className="max-w-container-max mx-auto px-margin-mobile lg:px-gutter grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Centered article column. lg:col-start-2 leaves the leftmost
            slot empty (where the social rail would live in the mockup
            — kept blank for breathing room and possible future use). */}
        <div className="lg:col-span-7 lg:col-start-2 max-w-2xl">
          <div
            className="magazine-prose magazine-prose-drop-cap"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
          {tags.length > 0 && (
            <ul className="mt-stack-lg pt-stack-md border-t border-outline-variant flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li
                  key={tag.id}
                  className="px-3 py-1 bg-surface-container text-on-surface-variant text-xs uppercase tracking-wider rounded-full"
                >
                  {tag.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="lg:col-span-4 lg:col-start-9 space-y-section-gap pt-stack-sm">
          {/* AuthorBio: card with avatar + name + role + bio +
              optional mailto link. The host carries the card chrome
              (bg / border / rounded) — posts-loader.js fills the
              inner DOM and removes `hidden` once /data/authors.json
              resolves. The chrome stays empty (and hidden) when the
              fetch fails or the author entry is missing. */}
          {post.authorId && (
            <section
              className="p-6 bg-surface-container-low border border-outline-variant rounded-lg"
              data-cms-author-bio
              data-cms-author-id={post.authorId}
              hidden
            />
          )}
          {/* Related posts: NO card chrome — just a section heading
              and a vertical list with top-bordered items, matching
              the editorial mockup. */}
          <section
            data-cms-related
            data-cms-current-id={post.id}
            data-cms-term-id={post.primaryTermId ?? ""}
            data-cms-limit="3"
            data-cms-label={t("publicBaked.relatedFromSite", { site: site.settings.title })}
            data-cms-fallback-label={t("publicBaked.relatedFromSite", { site: site.settings.title })}
          />
        </aside>
      </div>
    </article>
  );
}
