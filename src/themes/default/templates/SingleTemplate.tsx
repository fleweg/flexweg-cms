import type { SingleTemplateProps, SiteContext } from "../../types";
import { AuthorBio } from "../components/AuthorBio";
import { Breadcrumb } from "../components/Breadcrumb";
import { buildTermUrl } from "../../../core/slug";

export function SingleTemplate({
  post,
  bodyHtml,
  author,
  hero,
  primaryTerm,
  tags,
}: SingleTemplateProps & { site: SiteContext }) {
  const breadcrumbs = [{ label: "Home", href: "/index.html" }];
  if (primaryTerm && primaryTerm.type === "category") {
    breadcrumbs.push({
      label: primaryTerm.name,
      href: `/${buildTermUrl(primaryTerm)}`,
    });
  }
  breadcrumbs.push({ label: post.title, href: "" });

  return (
    <article className="page-single container">
      <Breadcrumb items={breadcrumbs} />
      <header className="page-single__header">
        <h1 className="page-title">{post.title}</h1>
        {post.excerpt && <p className="page-single__excerpt">{post.excerpt}</p>}
      </header>
      {hero && (
        <figure className="page-single__hero">
          <img src={hero.url} alt={hero.alt ?? ""} />
          {hero.caption && <figcaption>{hero.caption}</figcaption>}
        </figure>
      )}
      <div className="page-body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      {tags.length > 0 && (
        <ul className="tag-list">
          {tags.map((tag) => (
            <li key={tag.id} className="tag-list__item">
              #{tag.name}
            </li>
          ))}
        </ul>
      )}
      {author && <AuthorBio author={author} />}
    </article>
  );
}
