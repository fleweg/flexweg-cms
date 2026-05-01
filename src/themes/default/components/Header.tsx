import type { SiteContext } from "../../types";

export function Header({ site }: { site: SiteContext }) {
  const { settings, resolvedMenus } = site;
  return (
    <header className="site-header">
      <div className="container">
        <a className="site-brand" href="/index.html">
          {settings.title}
        </a>
        {resolvedMenus.header.length > 0 && (
          <nav className="site-nav" aria-label="Primary">
            <ul>
              {resolvedMenus.header.map((item) => (
                <li key={item.id}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
