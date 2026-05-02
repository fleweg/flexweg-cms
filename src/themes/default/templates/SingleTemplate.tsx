import type { SingleTemplateProps, SiteContext } from "../../types";
import { AuthorAvatar } from "../components/AuthorAvatar";
import { Breadcrumb } from "../components/Breadcrumb";
import { buildTermUrl } from "../../../core/slug";
import { pickFormat } from "../../../core/media";

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
  const breadcrumbs: { label: string; href?: string }[] = [
    { label: "Home", href: "/index.html" },
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

        <header>
          <div className="page-single__meta-strip">
            {primaryTerm && <span className="label-caps">{primaryTerm.name}</span>}
            {primaryTerm && dateLabel && (
              <span className="page-single__meta-dot" aria-hidden="true" />
            )}
            {dateLabel && <span className="label-caps">{dateLabel}</span>}
          </div>
          <h1 className="page-single__title">{post.title}</h1>
          {post.excerpt && <p className="page-single__lede">{post.excerpt}</p>}
          {author && (
            <div className="page-single__author-strip">
              <AuthorAvatar name={author.displayName} avatar={author.avatar} />
              <div>
                <p className="page-single__author-name">{author.displayName}</p>
                {author.email && (
                  <p className="page-single__author-meta">{author.email}</p>
                )}
              </div>
            </div>
          )}
        </header>

        {hero && (
          <figure className="page-single__hero">
            {/* The single page is the most prominent surface for a hero
                image — request the largest variant the theme declares.
                pickFormat handles fallbacks if "large" doesn't exist. */}
            <img src={pickFormat(hero, "large")} alt={hero.alt ?? ""} />
            {hero.caption && <figcaption>{hero.caption}</figcaption>}
          </figure>
        )}

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
            data-cms-eyebrow={
              (site.settings.language || "en").toLowerCase().startsWith("fr")
                ? "À propos de l'auteur"
                : "About the author"
            }
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
          data-cms-label={
            (site.settings.language || "en").toLowerCase().startsWith("fr")
              ? "Lectures suggérées"
              : "Continue reading"
          }
          data-cms-fallback-label={
            (site.settings.language || "en").toLowerCase().startsWith("fr")
              ? "Derniers articles"
              : "Latest articles"
          }
        />
      </aside>
    </div>
  );
}
