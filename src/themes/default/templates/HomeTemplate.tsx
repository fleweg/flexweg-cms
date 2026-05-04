import type { HomeTemplateProps, SiteContext } from "../../types";

// Home page layout. When the site is configured to render a static page
// as home, we delegate to that page's bodyHtml. Otherwise we render two
// pre-resolved HTML strings provided by the publisher:
//   • heroHtml — the featured post, produced by the Hero block render
//     function in the variant chosen via theme settings.
//   • listHtml — the latest-articles list, produced by the Posts list
//     block render function in the variant chosen via theme settings.
//
// This keeps the home in lockstep with the editor's content blocks: any
// variant the editor exposes (image-overlay / split / minimal for hero;
// cards / list / compact / numbered / slider for the grid) is available
// for the home page without per-template duplication.
export function HomeTemplate({
  staticPage,
  archivesLink,
  heroHtml,
  listHtml,
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

  // No posts yet — the publisher returns empty strings from both
  // block render functions when the corpus is empty. Show a friendly
  // empty state instead of two blank containers.
  const hasContent = (heroHtml && heroHtml.length > 0) || (listHtml && listHtml.length > 0);
  if (!hasContent) {
    return (
      <div className="page-home container">
        <p className="empty-state">No posts yet.</p>
      </div>
    );
  }

  return (
    <>
      {heroHtml && (
        <div
          className="container"
          dangerouslySetInnerHTML={{ __html: heroHtml }}
        />
      )}
      {listHtml && (
        <div
          className="container"
          dangerouslySetInnerHTML={{ __html: listHtml }}
        />
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
