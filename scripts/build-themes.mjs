// Compiles every theme's SCSS entry into dist/theme-assets/<id>.css.
// Run as part of `npm run build` after Vite finishes producing dist/.
//
// Discovery: walks src/themes/<id>/, looks for the `scssEntry` declared in
// its manifest.ts. We don't actually parse the manifest (would require
// loading TS at runtime); instead we follow the convention that each
// manifest exports `scssEntry: 'theme.scss'` (or similar) and compile any
// .scss file listed at the top level of the theme directory. If a theme
// uses a different entry name, add a `theme.config.json` next to manifest.ts.

import { readdir, mkdir, writeFile, readFile, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as sass from "sass";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, "..");
const themesDir = join(root, "src", "themes");
// Public theme CSS lives at the top level of dist/ — it maps 1:1 to the
// /theme-assets/ path on the public site root, exactly where every
// generated page's <link rel="stylesheet"> points. Upload `dist/theme-assets/`
// alongside `dist/admin/` on Flexweg, OR rely on the admin's "Sync theme
// assets" button which re-uploads the same content via the Files API
// (the SCSS is also embedded in the admin bundle via Vite `?inline` imports).
const outDir = join(root, "dist", "theme-assets");

async function findScssEntry(themeDir) {
  // 1. Optional theme.config.json override.
  try {
    const configPath = join(themeDir, "theme.config.json");
    const raw = await readFile(configPath, "utf8");
    const json = JSON.parse(raw);
    if (json.scssEntry) return json.scssEntry;
  } catch {
    // No config file — fall through.
  }
  // 2. Default convention: theme.scss.
  try {
    await stat(join(themeDir, "theme.scss"));
    return "theme.scss";
  } catch {
    return null;
  }
}

async function main() {
  const entries = await readdir(themesDir, { withFileTypes: true }).catch(() => []);
  await mkdir(outDir, { recursive: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const id = entry.name;
    const themeDir = join(themesDir, id);
    const scssEntry = await findScssEntry(themeDir);
    if (!scssEntry) {
      console.log(`[themes] ${id}: no scss entry, skipping.`);
      continue;
    }
    const inputPath = join(themeDir, scssEntry);
    const outputPath = join(outDir, `${id}.css`);
    const result = sass.compile(inputPath, {
      style: "compressed",
      sourceMap: false,
    });
    await writeFile(outputPath, result.css, "utf8");
    console.log(`[themes] ${id}.css written (${result.css.length} bytes)`);
  }
}

main().catch((err) => {
  console.error("[themes] build failed:", err);
  process.exit(1);
});
