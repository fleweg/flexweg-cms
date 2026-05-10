// Resolves the admin SPA's folder name on the deployment by inspecting
// the URL the page was loaded from. Used to prefix Flexweg API upload
// paths (config.js, external.json, plugins/<id>/, themes/<id>/) so the
// admin can be deployed under any folder name — not just the
// conventional /admin/ — for security-through-obscurity.
//
// The runtime loader (services/externalLoader.ts) doesn't need this
// helper because it uses URLs relative to document.baseURI which
// auto-resolve against whatever folder the admin is in. Only the
// upload side does — the Flexweg API path is absolute from the site
// root, not relative to the admin SPA's location.
//
// Conventions:
//   /erf34f654GH3/index.html  → "erf34f654GH3"
//   /admin/                    → "admin"
//   /sites/c1/admin/index.html → "sites/c1/admin"
//   /                          → ""  (root deployment — handled by callers)
//
// Root deployment ("") is intentionally NOT papered over with a default
// fallback. Callers (notably the SetupForm) check `isRootDeployment()`
// and refuse to proceed if true — rooting the admin at the site root
// would mix admin files with the public site's HTML pages, which is a
// footgun we'd rather make the user fix before going further.

const INDEX_FILE_RE = /^index\.[a-z0-9]+$/i;

export function getAdminFolder(): string {
  if (typeof window === "undefined") return "";
  const path = window.location.pathname;
  // Split on /, drop empty segments produced by leading/trailing /,
  // then drop a trailing index.html-like file if present (Vite preview
  // / dev server / Flexweg all serve directory URLs with or without
  // the explicit file).
  const segments = path.split("/").filter(Boolean);
  const last = segments[segments.length - 1];
  if (last && INDEX_FILE_RE.test(last)) segments.pop();
  return segments.join("/");
}

// Local dev hosts where root-deployment doesn't matter — Vite dev
// (port 5173) and Vite preview (port 4173) both serve the admin at "/"
// but uploads from there target a real Flexweg site (resolved via the
// SetupForm's flexwegSiteUrl input), not the localhost. So the
// "subfolder required" guard is irrelevant in dev and only confuses
// developers testing the form locally. Treat any localhost-like
// hostname as non-root regardless of the actual pathname.
function isLocalhost(): boolean {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return (
    h === "localhost" ||
    h === "127.0.0.1" ||
    h === "[::1]" ||
    h === "::1" ||
    h === "0.0.0.0" ||
    h.endsWith(".localhost")
  );
}

// True when the admin is being served at the site root (pathname "/").
// SetupForm consults this before letting the user submit — uploading
// admin files (config.js, external.json, plugins/, …) at the root
// would pollute the public site, so we ask them to move the admin
// into a subfolder first. Skipped on localhost so the form is testable
// during local dev (`npm run dev` / `npm run preview`) without first
// reverse-proxying or fiddling with the base path.
export function isRootDeployment(): boolean {
  if (isLocalhost()) return false;
  return getAdminFolder() === "";
}

// Prefixes a path with the admin folder. Pass paths WITHOUT a leading
// slash (`config.js`, `plugins/foo/bundle.js`). Returns the relative
// Flexweg API path (e.g. `admin/config.js` or `erf34f654GH3/config.js`).
//
// When at the root, returns the path unchanged — but in practice the
// SetupForm guard prevents that branch from being reached during the
// normal flow.
export function withAdminBase(relativePath: string): string {
  const folder = getAdminFolder();
  const clean = relativePath.replace(/^\/+/, "");
  return folder ? `${folder}/${clean}` : clean;
}
