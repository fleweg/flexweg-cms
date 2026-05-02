interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Minimal label-caps breadcrumb above the single-post header. The last
// item renders as the current-page span (no link) and inherits the
// stronger color via .breadcrumb__current.
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null;
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} aria-current={isLast ? "page" : undefined}>
              {item.href && !isLast ? (
                <a href={item.href}>{item.label}</a>
              ) : (
                <span className="breadcrumb__current">{item.label}</span>
              )}
              {!isLast && (
                <span className="breadcrumb__sep" aria-hidden="true">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
