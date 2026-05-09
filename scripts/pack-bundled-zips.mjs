#!/usr/bin/env node
// Packs each in-tree plugin and theme (already built into
// dist/admin/{plugins,themes}/<id>/ by build-bundled-externals.mjs)
// into a single .zip per entry, ready for upload via the admin's
// "Install plugin" / "Install theme" UI.
//
// Output: dist/packs/{plugins,themes}/<id>.zip
//
// Use case: distribute these ZIPs on a platform so users can re-install
// a built-in plugin / theme after they've uninstalled it from their
// admin. The bundles inside are byte-identical to what ships in the
// admin's external.default.json, so re-installing produces the same
// behaviour as the original built-in.
//
// Wired into `npm run build` after build-bundled-externals.mjs.

import { createWriteStream, existsSync, mkdirSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import JSZip from "jszip";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const distAdmin = resolve(root, "dist/admin");
const distPacks = resolve(root, "dist/packs");

// Reads dist/admin/external.default.json — produced by
// build-bundled-externals.mjs — to know which plugins / themes were
// just built. Keeps this script in sync with the externals build
// without duplicating the PLUGINS / THEMES arrays.
function loadExternalsManifest() {
  const path = resolve(distAdmin, "external.default.json");
  if (!existsSync(path)) {
    console.error(
      "[pack] dist/admin/external.default.json missing — run build-bundled-externals.mjs first",
    );
    process.exit(1);
  }
  return JSON.parse(readFileSync(path, "utf-8"));
}

// Locates a README.md for the source-side <id> folder. Plugins live
// under src/plugins/<id>; themes under src/themes/<id>. Returns the
// path or null when none exists.
function findSourceReadme(kind, id) {
  const folder = kind === "plugins" ? "src/plugins" : "src/themes";
  const candidate = resolve(root, folder, id, "README.md");
  return existsSync(candidate) ? candidate : null;
}

// Zips one entry into <outDir>/<id>.zip. Mirrors the file layout the
// admin's installFromZip expects:
//   - manifest.json (required)
//   - bundle.js (required)
//   - theme.css (themes only — copied next to bundle.js by the
//     externals build)
//   - README.md (optional — plain documentation)
async function packEntry(kind, id, builtDir, outDir) {
  const manifestPath = resolve(builtDir, "manifest.json");
  const bundlePath = resolve(builtDir, "bundle.js");
  if (!existsSync(manifestPath) || !existsSync(bundlePath)) {
    console.warn(
      `[pack] skipping ${kind}/${id} — missing manifest.json or bundle.js in ${builtDir}`,
    );
    return null;
  }

  const zip = new JSZip();
  zip.file("manifest.json", readFileSync(manifestPath));
  zip.file("bundle.js", readFileSync(bundlePath));

  if (kind === "themes") {
    const cssPath = resolve(builtDir, "theme.css");
    if (existsSync(cssPath)) {
      zip.file("theme.css", readFileSync(cssPath));
    }
  }

  const readmePath = findSourceReadme(kind, id);
  if (readmePath) {
    zip.file("README.md", readFileSync(readmePath));
  }

  mkdirSync(outDir, { recursive: true });
  const outPath = resolve(outDir, `${id}.zip`);
  await new Promise((resolveStream, reject) => {
    zip
      .generateNodeStream({ type: "nodebuffer", streamFiles: true })
      .pipe(createWriteStream(outPath))
      .on("finish", resolveStream)
      .on("error", reject);
  });
  return outPath;
}

async function main() {
  const start = Date.now();
  const externals = loadExternalsManifest();
  const pluginsOut = resolve(distPacks, "plugins");
  const themesOut = resolve(distPacks, "themes");

  let count = 0;
  for (const entry of externals.plugins ?? []) {
    const builtDir = resolve(distAdmin, "plugins", entry.id);
    const outPath = await packEntry("plugins", entry.id, builtDir, pluginsOut);
    if (outPath) {
      console.log(`[pack] plugins/${entry.id}.zip`);
      count++;
    }
  }
  for (const entry of externals.themes ?? []) {
    const builtDir = resolve(distAdmin, "themes", entry.id);
    const outPath = await packEntry("themes", entry.id, builtDir, themesOut);
    if (outPath) {
      console.log(`[pack] themes/${entry.id}.zip`);
      count++;
    }
  }

  const ms = Date.now() - start;
  console.log(`[pack] ${count} zip(s) written to dist/packs/ in ${(ms / 1000).toFixed(1)}s`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
