import type { HomeTemplateProps, SiteContext } from "../../types";
import { Card } from "../components/Card";
import { HeroFeatured } from "../components/HeroFeatured";

// Home page layout. When the site is configured to render a static page
// as home, we delegate to that page's bodyHtml. Otherwise the most
// recent post becomes the featured hero (21:9) and the rest fall into a
// 3-column grid below.
export function HomeTemplate({
  posts,
  staticPage,
  archivesLink,
}: HomeTemplateProps & { site: SiteContext }) {
  if (staticPage) {
    return (
      <article className="page-static container">
        <h1 className="page-title">{staticPage.post.title}</h1>
        <div
          className="page-body"
          dangerouslySetInnerHTML={{ __html: staticPage.bodyHtml }}
        />
      </article>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="page-home container">
        <p className="empty-state">No posts yet.</p>
      </div>
    );
  }

  // Featured slot uses the first (most recent) post; the remainder fills
  // the "Latest articles" grid below it.
  const [featured, ...rest] = posts;
  return (
    <>
      <div className="container">
        {featured && <HeroFeatured post={featured} />}
      </div>
      {rest.length > 0 && (
        <div className="container">
          <div className="page-home__title-row">
            <h3 className="page-home__title">Latest articles</h3>
          </div>
          <ul className="post-grid">
            {rest.map((post) => (
              <li key={post.id}>
                <Card post={post} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {archivesLink && (
        <div className="container">
          <p className="archives-link">
            <a href={archivesLink.href}>{archivesLink.label}</a>
          </p>
        </div>
      )}
    </>
  );
}
