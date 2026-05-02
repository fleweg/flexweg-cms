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
import i18n from "../i18n";
import type { ThemeManifest } from "./types";

// Cast each typed manifest to the unknown-config base — same pattern
// as plugins/index.ts. The settings.save callback is contravariant in
// TConfig, which TypeScript can't reconcile against `unknown` without
// the explicit widening cast.
export const THEMES: ThemeManifest[] = [defaultManifest as ThemeManifest];

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

// Translation bundles ship inline on each manifest. Loaded at module
// import time into a dedicated i18next namespace named `theme-<id>`,
// so a theme's settings page calls `useTranslation("theme-<id>")` to
// scope its keys. Mirrors the plugin pattern in plugins/index.ts.
function loadThemeTranslations(): void {
  for (const theme of THEMES) {
    if (!theme.i18n) continue;
    const ns = `theme-${theme.id}`;
    for (const [locale, resources] of Object.entries(theme.i18n)) {
      if (!resources) continue;
      i18n.addResourceBundle(locale, ns, resources, true, true);
    }
  }
}

loadThemeTranslations();
