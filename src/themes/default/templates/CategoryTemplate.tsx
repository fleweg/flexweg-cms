import type { CategoryTemplateProps, SiteContext } from "../../types";
import { Card } from "../components/Card";

// Category archive page. Eyebrow + h1 + description on the left, optional
// "Follow" RSS button on the right. The button only renders when the
// flexweg-rss plugin has a feed configured for this term — the publisher
// passes `categoryRssUrl` as undefined otherwise so we can hide it.
export function CategoryTemplate({
  term,
  posts,
  categoryRssUrl,
  archivesLink,
}: CategoryTemplateProps & { site: SiteContext }) {
  return (
    <div className="page-archive container">
      <header className="page-archive__header">
        <div className="page-archive__head">
          <p className="page-archive__eyebrow">Section</p>
          <h1 className="page-archive__title">{term.name}</h1>
          {term.description && (
            <p className="page-archive__desc">{term.description}</p>
          )}
        </div>
        {categoryRssUrl && (
          <a
            className="page-archive__rss"
            href={categoryRssUrl}
            aria-label={`RSS feed for ${term.name}`}
          >
            <RssIcon />
            Follow
          </a>
        )}
      </header>
      {posts.length === 0 ? (
        <p className="empty-state">No posts in this category yet.</p>
      ) : (
        <ul className="post-grid">
          {posts.map((post) => (
            <li key={post.id}>
              <Card post={post} />
            </li>
          ))}
        </ul>
      )}
      {archivesLink && (
        <p className="archives-link">
          <a href={archivesLink.href}>{archivesLink.label}</a>
        </p>
      )}
    </div>
  );
}

function RssIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 4a16 16 0 0 1 16 16" />
      <circle cx="5" cy="19" r="1.5" fill="currentColor" />
    </svg>
  );
}
