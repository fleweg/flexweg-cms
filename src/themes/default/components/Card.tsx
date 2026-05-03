import type { CardPost } from "../../types";
import { pickFormat } from "../../../core/media";

// Article card used by Home / Category / Author listings. Receives a
// fully resolved CardPost — no Firestore lookups happen here. Hero image
// is grayscale by default and recovers color on hover (CSS-only).
export function Card({ post }: { post: CardPost }) {
  // Cards in listings get the medium variant by default — small enough
  // to fit in a grid, large enough to look sharp on 2x screens.
  // pickFormat falls back gracefully if a media predates the active
  // theme's catalog.
  const heroSrc = post.hero ? pickFormat(post.hero, "medium") : "";
  return (
    <article className="card-post">
      <a className="card-post__link" href={`/${post.url}`}>
        {heroSrc && (
          <div className="card-post__media">
            <img src={heroSrc} alt={post.hero?.alt ?? ""} loading="lazy" />
          </div>
        )}
        {/* Body wrapper so the card's outer chrome (background +
            border + padding) frames the text content uniformly with
            the hero split variants and the cms-card-default block. */}
        <div className="card-post__body">
          {post.category && (
            <p className="card-post__eyebrow">{post.category.name}</p>
          )}
          <h3 className="card-post__title">{post.title}</h3>
          {post.excerpt && <p className="card-post__excerpt">{post.excerpt}</p>}
          {post.dateLabel && <p className="card-post__meta">{post.dateLabel}</p>}
        </div>
      </a>
    </article>
  );
}
