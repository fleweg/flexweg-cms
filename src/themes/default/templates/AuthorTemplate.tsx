import type { AuthorTemplateProps, SiteContext } from "../../types";
import { Card } from "../components/Card";

export function AuthorTemplate({
  author,
  posts,
}: AuthorTemplateProps & { site: SiteContext }) {
  return (
    <div className="page-archive container">
      <header className="page-archive__header">
        <p className="page-archive__eyebrow">Author</p>
        <h1 className="page-title">{author.displayName}</h1>
      </header>
      {posts.length === 0 ? (
        <p className="empty-state">No posts by this author yet.</p>
      ) : (
        <ul className="post-grid">
          {posts.map((post) => (
            <li key={post.id}>
              <Card post={post} url={post.url} hero={post.hero} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
