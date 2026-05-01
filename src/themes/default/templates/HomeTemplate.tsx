import type { HomeTemplateProps, SiteContext } from "../../types";
import { Card } from "../components/Card";

export function HomeTemplate({
  posts,
  staticPage,
}: HomeTemplateProps & { site: SiteContext }) {
  if (staticPage) {
    return (
      <article className="page-static container">
        <h1 className="page-title">{staticPage.post.title}</h1>
        <div className="page-body" dangerouslySetInnerHTML={{ __html: staticPage.bodyHtml }} />
      </article>
    );
  }
  return (
    <div className="page-home container">
      <ul className="post-grid">
        {posts.map((post) => (
          <li key={post.id}>
            <Card post={post} url={post.url} hero={post.hero} />
          </li>
        ))}
      </ul>
    </div>
  );
}
