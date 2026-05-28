import type { SingleTemplateProps, SiteContext } from "../../types";
import { AuthorAvatar } from "../components/AuthorAvatar";
import { Breadcrumb } from "../components/Breadcrumb";
import { buildTermUrl } from "../../../core/slug";
import { pickFormat } from "../../../core/media";
import i18n, { pickPublicLocale } from "../../../i18n";

// Editorial single-post layout: 8/4 split on desktop with the article
// body on the left and an author/related sidebar on the right. Mobile
// stacks the sidebar below the article.
//
// The strip above the title shows the category as an accent label-caps
// followed by a separator dot and the formatted publication date — same
// silhouette as the Stitch reference, sourced from the resolved
// primaryTerm + post.publishedAt.
export function SingleTemplate({
  post,
  bodyHtml,
  author,
  hero,
  primaryTerm,
  tags,
  site,
}: SingleTemplateProps & { site: SiteContext }) {
  // Strings baked into the published HTML need to be in the public
  // site's language, not the admin's UI language. `getFixedT` pins the
  // lookup to the resolved public locale (see settings.language → 7
  // supported locales via prefix match, fallback EN).
  const publicT = i18n.getFixedT(pickPublicLocale(site.settings.language), "theme-default");

  // `site.homePath` (set by plugins like multilang) wins over the
  // hardcoded "/index.html" so a FR page's breadcrumb points at
  // /fr/index.html instead of /index.html. Same fallback as the
  // Header brand link.
  const breadcrumbs: { label: string; href?: string }[] = [
    {
      label: publicT("breadcrumb.home", { defaultValue: "Home" }),
      href: site.homePath ?? "/index.html",
    },
  ];
  if (primaryTerm && primaryTerm.type === "category") {
    breadcrumbs.push({
      label: primaryTerm.name,
      href: `/${buildTermUrl(primaryTerm)}`,
    });
  }
  breadcrumbs.push({ label: post.title });

  // Format the publication date in the site's language. Falls back to
  // updatedAt for posts that haven't been explicitly published yet (rare
  // for an online post but cheap to handle).
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

  return (
    <div className="page-single container">
      <article className="page-single__main">
        <Breadcrumb items={breadcrumbs} />

        {/* Header order: title → hero image → excerpt (lede) →
            date + category (meta-strip) → author. The hero <figure>
            lives INSIDE <header> so it sits between the title and the
            excerpt in the rendered flow. The meta-strip pairs the
            primary category with the publication date — kept
            together as one visual unit so the category badge doesn't
            float orphaned on the page. */}
        <header>
          <h1 className="page-single__title">{post.title}</h1>

          {hero && (
            <figure className="page-single__hero">
              {/* Above-the-fold hero — typically THE LCP element on
                  single posts. We deliberately skip `loading="lazy"`
                  (which would defer fetching) and ask the browser to
                  prioritize this resource via `fetchpriority="high"`,
                  so the image starts downloading as early as possible
                  in the request waterfall. */}
              <img
                src={pickFormat(hero, "large")}
                alt={hero.alt ?? ""}
                fetchPriority="high"
              />
              {hero.caption && <figcaption>{hero.caption}</figcaption>}
            </figure>
          )}

          {post.excerpt && <p className="page-single__lede">{post.excerpt}</p>}

          <div className="page-single__meta-strip">
            {primaryTerm && <span className="label-caps">{primaryTerm.name}</span>}
            {primaryTerm && dateLabel && (
              <span className="page-single__meta-dot" aria-hidden="true" />
            )}
            {dateLabel && <span className="label-caps">{dateLabel}</span>}
          </div>

          {author && (
            <div className="page-single__author-strip">
              <AuthorAvatar name={author.displayName} avatar={author.avatar} />
              <div>
                <p className="page-single__author-name">{author.displayName}</p>
              </div>
            </div>
          )}
        </header>

        <div
          className="page-body"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

        {tags.length > 0 && (
          <ul className="page-single__tags">
            {tags.map((tag) => (
              <li key={tag.id}>#{tag.name}</li>
            ))}
          </ul>
        )}
      </article>

      <aside className="page-single__sidebar">
        {/* AuthorBio is fully runtime-loaded. Empty placeholder here;
            /theme-assets/<id>-posts.js fetches /authors.json, looks up
            `data-cms-author-id`, builds the DOM (avatar + clickable
            name → /author/<slug>.html + email + bio) and removes the
            `hidden` attribute. So bio / name / avatar updates in
            /users → Edit profile reflect on every existing post HTML
            without re-publishing anything. If /authors.json is
            unreachable the section stays hidden. */}
        {post.authorId && (
          <section
            className="author-bio"
            data-cms-author-bio
            data-cms-author-id={post.authorId}
            data-cms-eyebrow={publicT("publicBaked.authorBioEyebrow")}
            hidden
          />
        )}
        {/* Populated at runtime by /theme-assets/<id>-posts.js, which
            fetches /posts.json once per page load and renders the
            right-category items here. Stays empty (and `hidden`) when
            the post has no category, no siblings exist yet, or
            posts.json is unreachable. The runtime script builds the
            DOM directly into this section so theme.scss styling
            (`.related-posts__*`) applies seamlessly. */}
        <section
          className="related-posts"
          data-cms-related
          data-cms-current-id={post.id}
          data-cms-term-id={post.primaryTermId ?? ""}
          data-cms-limit="3"
          data-cms-label={publicT("publicBaked.relatedPostsLabel")}
          data-cms-fallback-label={publicT("publicBaked.relatedPostsFallbackLabel")}
        />
      </aside>
    </div>
  );
}
