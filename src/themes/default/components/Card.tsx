import type { Post } from "../../../core/types";
import { pickFormat } from "../../../core/media";
import type { MediaView } from "../../types";

interface CardProps {
  post: Post;
  url: string;
  hero?: MediaView;
}

export function Card({ post, url, hero }: CardProps) {
  // Cards in listings (home, category, author) get the medium variant by
  // default — small enough to fit in a grid, large enough to look sharp on
  // 2x screens. pickFormat falls back gracefully if a media predates the
  // active theme's catalog.
  const heroSrc = hero ? pickFormat(hero, "medium") : "";
  return (
    <article className="card-post">
      <a className="card-post__link" href={`/${url}`}>
        {heroSrc && (
          <div className="card-post__media">
            <img src={heroSrc} alt={hero?.alt ?? ""} />
          </div>
        )}
        <div className="card-post__body">
          <h3 className="card-post__title">{post.title}</h3>
          {post.excerpt && <p className="card-post__excerpt">{post.excerpt}</p>}
        </div>
      </a>
    </article>
  );
}
