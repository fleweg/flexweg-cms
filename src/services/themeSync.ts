import { uploadFile } from "./flexwegApi";
import { listThemes } from "../themes";
import type { ThemeManifest } from "../themes/types";

export interface ThemeSyncLogger {
  (entry: { level: "info" | "success" | "warn" | "error"; message: string }): void;
}

// Uploads each theme's CSS bundle (with the `compileCss` hook applied
// when present) plus its companion JS files (menu loader, posts loader)
// to /theme-assets/<id>.css | -menu.js | -posts.js on Flexweg. Used by
// the standard "Sync theme assets" button on ThemesPage and by the
// SetupForm's auto-sync step (so a fresh deployment ends up with both
// the admin AND the public theme assets in one go).
//
// The publisher relies on these files existing for any subsequent
// publish to render correctly — every published page references
// `/theme-assets/<id>.css`. Without a sync, the first published post
// would 404 on its stylesheet.
export async function syncThemeAssets(
  themes: ThemeManifest[] = listThemes(),
  themeConfigs: Record<string, unknown> | undefined,
  log: ThemeSyncLogger = () => {},
): Promise<void> {
  for (const theme of themes) {
    if (!theme.cssText) {
      log({
        level: "warn",
        message: `Theme "${theme.id}" has no embedded CSS, skipping.`,
      });
    } else {
      const cssPath = `theme-assets/${theme.id}.css`;
      let cssContent = theme.cssText;
      if (theme.compileCss && theme.settings) {
        const stored = themeConfigs?.[theme.id];
        const resolvedConfig = {
          ...(theme.settings.defaultConfig as object),
          ...((stored as object) ?? {}),
        };
        try {
          cssContent = theme.compileCss(resolvedConfig);
        } catch (err) {
          // Non-fatal: fall back to the bundled baseline CSS so the sync
          // still produces a working file. The user's customizations
          // won't apply until they fix whatever broke compileCss.
          console.error(`[themes] compileCss for "${theme.id}" failed:`, err);
        }
      }
      log({ level: "info", message: `Uploading ${cssPath}…` });
      await uploadFile({ path: cssPath, content: cssContent });
    }
    if (theme.jsText) {
      const jsPath = `theme-assets/${theme.id}-menu.js`;
      log({ level: "info", message: `Uploading ${jsPath}…` });
      await uploadFile({ path: jsPath, content: theme.jsText });
    }
    if (theme.jsTextPosts) {
      const jsPath = `theme-assets/${theme.id}-posts.js`;
      log({ level: "info", message: `Uploading ${jsPath}…` });
      await uploadFile({ path: jsPath, content: theme.jsTextPosts });
    }
    // Optional catalog loader (currently storefront-only). Read via
    // an extension-property cast so we don't have to widen
    // ThemeManifest for a single consumer — same convention as the
    // manifest emits it.
    const jsTextCatalog = (theme as { jsTextCatalog?: string }).jsTextCatalog;
    if (jsTextCatalog) {
      const jsPath = `theme-assets/${theme.id}-catalog.js`;
      log({ level: "info", message: `Uploading ${jsPath}…` });
      await uploadFile({ path: jsPath, content: jsTextCatalog });
    }
    // Optional filters loader (currently portfolio-only). Same
    // extension-property convention as jsTextCatalog above.
    const jsTextFilters = (theme as { jsTextFilters?: string }).jsTextFilters;
    if (jsTextFilters) {
      const jsPath = `theme-assets/${theme.id}-filters.js`;
      log({ level: "info", message: `Uploading ${jsPath}…` });
      await uploadFile({ path: jsPath, content: jsTextFilters });
    }
  }
  log({ level: "success", message: "Theme assets synced." });
}
