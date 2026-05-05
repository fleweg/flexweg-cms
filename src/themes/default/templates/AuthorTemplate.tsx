import type { AuthorTemplateProps, SiteContext } from "../../types";
import { AuthorAvatar } from "../components/AuthorAvatar";
import { Card } from "../components/Card";
import { SocialIcon, socialLabel } from "../../../core/socialIcons";

// Author archive: a portrait placeholder (initials) on the left, the
// author's name + title (job role) + bio on the right, then a row of
// social-icon links and a grid of their posts.
//
// Email is intentionally not surfaced here — it's admin-only data per
// the product convention; templates rely on `title` instead.
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
          {author.title && <p className="page-author__role">{author.title}</p>}
          {author.bio && <p className="page-author__bio">{author.bio}</p>}
          {author.socials && author.socials.length > 0 && (
            <div className="page-author__socials">
              {author.socials.map((s) => (
                <a
                  key={s.network}
                  className="page-author__social-link"
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={socialLabel(s.network)}
                  title={socialLabel(s.network)}
                >
                  <SocialIcon network={s.network} />
                </a>
              ))}
            </div>
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
