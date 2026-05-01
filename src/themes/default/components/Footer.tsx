import type { SiteContext } from "../../types";

export function Footer({ site }: { site: SiteContext }) {
  const { settings, resolvedMenus } = site;
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        {resolvedMenus.footer.length > 0 && (
          <nav className="site-nav site-nav--footer" aria-label="Footer">
            <ul>
              {resolvedMenus.footer.map((item) => (
                <li key={item.id}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <p className="site-copy">
          © {year} {settings.title}
        </p>
      </div>
    </footer>
  );
}
