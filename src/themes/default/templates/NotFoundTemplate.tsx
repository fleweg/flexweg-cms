import type { NotFoundTemplateProps, SiteContext } from "../../types";

export function NotFoundTemplate({
  message,
}: NotFoundTemplateProps & { site: SiteContext }) {
  return (
    <div className="page-not-found container">
      <h1>404</h1>
      <p>{message ?? "The page you are looking for does not exist."}</p>
      <a href="/index.html">Back to home</a>
    </div>
  );
}
