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
import { manifest as magazineManifest } from "./magazine/manifest";
import { manifest as corporateManifest } from "./corporate/manifest";
import i18n from "../i18n";
import { registerBlock } from "../core/blockRegistry";
import { pluginApi } from "../core/pluginRegistry";
import type { ThemeManifest } from "./types";

// Cast each typed manifest to the unknown-config base — same pattern
// as plugins/index.ts. The settings.save callback is contravariant in
// TConfig, which TypeScript can't reconcile against `unknown` without
// the explicit widening cast.
export const THEMES: ThemeManifest[] = [
  defaultManifest as ThemeManifest,
  magazineManifest as ThemeManifest,
  corporateManifest as ThemeManifest,
];

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

// Registers every block contributed by the currently-active theme and
// runs the theme's optional `register(api)` callback so theme-side
// hooks (e.g. `post.html.body` for block markers) re-attach after the
// pluginRegistry's reset. Mirrors plugins/index.ts'
// applyPluginRegistration but for theme-side concerns.
//
// The caller (the settings subscription in CmsDataContext) is
// expected to run applyPluginRegistration FIRST so the filters /
// blocks registry has been wiped of any previous theme's
// contributions before we re-add the active theme's set.
//
// A swallow-and-log try/catch keeps a single bad block / hook from
// taking down the whole admin — same defensive pattern as
// plugins/index.ts.
export function applyThemeRegistration(activeThemeId: string): void {
  const theme = getActiveTheme(activeThemeId);
  if (theme.blocks) {
    for (const block of theme.blocks) {
      try {
        registerBlock(block);
      } catch (err) {
        console.error(`Theme "${theme.id}" failed to register block "${block.id}":`, err);
      }
    }
  }
  if (theme.register) {
    try {
      theme.register(pluginApi);
    } catch (err) {
      console.error(`Theme "${theme.id}" failed in its register() callback:`, err);
    }
  }
}
