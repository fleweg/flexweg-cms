import type { CategoryTemplateProps, SiteContext } from "../../types";
import { Card } from "../components/Card";

export function CategoryTemplate({
  term,
  posts,
}: CategoryTemplateProps & { site: SiteContext }) {
  return (
    <div className="page-archive container">
      <header className="page-archive__header">
        <p className="page-archive__eyebrow">Category</p>
        <h1 className="page-title">{term.name}</h1>
        {term.description && <p className="page-archive__desc">{term.description}</p>}
      </header>
      {posts.length === 0 ? (
        <p className="empty-state">No posts in this category yet.</p>
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
