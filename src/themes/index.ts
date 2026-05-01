// Theme registry. Adding a new theme means:
//   1. Create src/themes/<id>/ with manifest.ts, theme.scss and templates/.
//   2. Import it here and append the manifest to THEMES.
//   3. The build pipeline (scripts/build-themes.mjs) compiles every theme's
//      SCSS into dist/theme-assets/<id>.css.
//
// We import statically (not dynamically) so all themes are bundled into the
// admin SPA — that's what enables instant preview when an admin switches
// themes, and matches the static-only constraint of Flexweg hosting.

import { manifest as defaultManifest } from "./default/manifest";
import type { ThemeManifest } from "./types";

export const THEMES: ThemeManifest[] = [defaultManifest];

export function getTheme(id: string): ThemeManifest {
  const found = THEMES.find((t) => t.id === id);
  if (!found) throw new Error(`Unknown theme: ${id}`);
  return found;
}

export function getActiveTheme(activeId: string): ThemeManifest {
  return THEMES.find((t) => t.id === activeId) ?? THEMES[0];
}

export function listThemes(): ThemeManifest[] {
  return THEMES;
}
