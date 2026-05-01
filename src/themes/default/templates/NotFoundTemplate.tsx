import type { NotFoundTemplateProps, SiteContext } from "../../types";

export function NotFoundTemplate({
  message,
}: NotFoundTemplateProps & { site: SiteContext }) {
  return (
    <div className="page-404 container">
      <h1 className="page-title">Page not found</h1>
      <p>{message ?? "The page you are looking for does not exist."}</p>
      <p>
        <a href="/index.html">Back to home</a>
      </p>
    </div>
  );
}
