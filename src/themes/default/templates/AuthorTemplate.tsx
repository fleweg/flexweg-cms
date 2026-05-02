import type { AuthorTemplateProps, SiteContext } from "../../types";
import { AuthorAvatar } from "../components/AuthorAvatar";
import { Card } from "../components/Card";

// Author archive: a portrait placeholder (initials) on the left, the
// author's name + email on the right, then a grid of their posts. We
// don't have an author bio field today; it's a clean fallback that's
// trivially upgradeable when one is added to UserRecord.
export function AuthorTemplate({
  author,
  posts,
}: AuthorTemplateProps & { site: SiteContext }) {
  return (
    <div className="page-author container">
      <header className="page-author__hero">
        <div className="page-author__portrait">
          <AuthorAvatar name={author.displayName} avatar={author.avatar} size="xl" />
        </div>
        <div className="page-author__body">
          <p className="page-author__eyebrow">Author</p>
          <h1 className="page-author__title">{author.displayName}</h1>
          {author.bio && <p className="page-author__bio">{author.bio}</p>}
          {author.email && !author.bio && (
            <p className="page-author__bio">{author.email}</p>
          )}
        </div>
      </header>
      {posts.length === 0 ? (
        <p className="empty-state">No posts by this author yet.</p>
      ) : (
        <ul className="post-grid">
          {posts.map((post) => (
            <li key={post.id}>
              <Card post={post} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
