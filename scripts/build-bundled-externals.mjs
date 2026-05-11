#!/usr/bin/env node
// Builds each in-tree plugin (under src/plugins/) and each non-default
// theme (under src/themes/) as a SEPARATE ESM bundle, output to
// dist/admin/{plugins,themes}/<id>/. The bundles externalise React,
// react-i18next and @flexweg/cms-runtime so they share the live admin
// instances at runtime via window.__FLEXWEG_RUNTIME__.
//
// At admin boot, services/externalLoader.ts reads dist/admin/external.json
// (also generated here) and dynamic-import()s each entry — same path as
// user-installed external plugins. The result: in-tree plugins and
// themes appear as "uninstallable" in the admin UI.
//
// `default` theme stays bundled inside the admin SPA (not handled here)
// — it's the fallback when the user uninstalls every external theme.
//
// Wired into `npm run build` after `vite build`. Each entry below
// triggers its own Vite library build (programmatic API), which adds
// ~1-2 s per entry. Currently sequential for clear stdout; could
// parallelise later if build time becomes a concern.

import { build as viteBuild } from "vite";
import react from "@vitejs/plugin-react";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, mkdirSync, writeFileSync, readFileSync, copyFileSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const distAdmin = resolve(root, "dist/admin");

// Mirrors src/core/flexwegRuntime.ts — bumped together. The build
// stamps this on every produced manifest.json + external.json entry
// so the admin's external loader can reject stale bundles built
// against an older API.
const FLEXWEG_API_VERSION = "1.1.0";

// Externalised at build time; resolved via the import-map at runtime.
// Keep in sync with the import-map in index.html.
const EXTERNAL_DEPS = [
  "react",
  "react/jsx-runtime",
  "react-dom",
  "react-dom/client",
  "react-i18next",
  "@flexweg/cms-runtime",
];

// Static metadata for each in-tree plugin/theme to externalise. We
// hardcode `id` + `name` + `version` here rather than parsing the
// source manifest because:
//   1. The metadata is stable; it changes rarely.
//   2. Reading the live manifest would require evaluating the bundle
//      first, which is what we're producing.
//   3. The bundle's runtime default export still carries the full
//      manifest for the admin's own use; this metadata is purely for
//      the install-side artefacts (manifest.json + external.json).
const PLUGINS = [
  { id: "core-seo", name: "Core SEO", version: "1.0.0" },
  { id: "flexweg-sitemaps", name: "Flexweg Sitemaps", version: "1.0.0" },
  { id: "flexweg-rss", name: "Flexweg RSS", version: "1.0.0" },
  { id: "flexweg-archives", name: "Flexweg Archives", version: "1.0.0" },
  { id: "flexweg-search", name: "Flexweg Search", version: "1.0.0" },
];

const THEMES = [
  { id: "magazine", name: "Magazine", version: "1.0.0" },
  { id: "corporate", name: "Corporate", version: "1.0.0" },
  { id: "storefront", name: "Storefront", version: "0.1.0" },
  { id: "portfolio", name: "Portfolio", version: "0.1.0" },
];

// Picks the manifest entry file name for a given plugin/theme. Most
// authors use manifest.tsx; some use manifest.ts. Returns the first
// extension that exists on disk.
function findManifestEntry(srcDir) {
  for (const ext of [".tsx", ".ts"]) {
    const candidate = resolve(srcDir, `manifest${ext}`);
    if (existsSync(candidate)) return candidate;
  }
  throw new Error(`No manifest.{ts,tsx} in ${srcDir}`);
}

// Programmatic Vite build for a single plugin/theme. Outputs bundle.js
// + manifest.json under <distOutDir>/<id>/.
async function buildOneEntry(kind, meta, srcDir, distOutDir) {
  const entry = findManifestEntry(srcDir);
  const outDir = resolve(distOutDir, meta.id);
  mkdirSync(outDir, { recursive: true });

  console.log(`[externals] building ${kind}/${meta.id}…`);

  await viteBuild({
    configFile: false,
    root,
    // Vite's default `publicDir: "public"` copies every file under
    // public/ into outDir. For per-plugin/per-theme builds this would
    // dump config.js, external.json, runtime/* into each entry folder,
    // which we don't want. Disable.
    publicDir: false,
    plugins: [react()],
    resolve: {
      alias: {
        "@flexweg/cms-runtime": resolve(root, "src/core/flexwegRuntime.ts"),
      },
    },
    // Replace `process.env.NODE_ENV` at build time. Vite's lib mode
    // doesn't do this automatically (libraries are expected to be
    // env-agnostic), but we're targeting browsers where `process` is
    // undefined. Bundled libraries like react-redux / classnames /
    // dompurify branch on this — without the replace, the bundle
    // throws "process is not defined" on first load.
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
      "process.env": "{}",
    },
    build: {
      lib: {
        entry,
        formats: ["es"],
        fileName: () => "bundle.js",
      },
      outDir,
      emptyOutDir: false, // dist/admin/ already has files we want to keep
      sourcemap: false,
      minify: "esbuild",
      rollupOptions: {
        external: EXTERNAL_DEPS,
        output: {
          // The admin loader fetches a single bundle.js. Disabling
          // chunk splitting collapses any potential code-split chunks
          // back into bundle.js so dynamic import()s within the bundle
          // are inlined.
          inlineDynamicImports: true,
        },
      },
    },
    logLevel: "warn",
  });

  // Per-entry manifest.json — read by the admin's installFromZip
  // when a user re-zips and re-uploads, and a useful piece of
  // documentation regardless. The bundle's runtime default export
  // still carries the full manifest for the admin's runtime registry.
  const manifestJson = {
    id: meta.id,
    name: meta.name,
    version: meta.version,
    apiVersion: FLEXWEG_API_VERSION,
    entry: "bundle.js",
  };
  writeFileSync(
    resolve(outDir, "manifest.json"),
    JSON.stringify(manifestJson, null, 2) + "\n",
  );

  // Themes also ship their compiled CSS as a sibling file so
  // user-installed external themes (which we scaffold this way in
  // examples/external-theme/) keep parity with build-time externals.
  // The CSS comes from src/themes/<id>/theme.compiled.css when the
  // theme uses Tailwind (already produced by build-theme-tailwind.mjs
  // at prebuild) or from theme.scss compiled output otherwise.
  if (kind === "themes") {
    const tailwindCss = resolve(srcDir, "theme.compiled.css");
    const scssCss = resolve(distAdmin, `../theme-assets/${meta.id}.css`);
    let cssSource = null;
    if (existsSync(tailwindCss)) cssSource = tailwindCss;
    else if (existsSync(scssCss)) cssSource = scssCss;
    if (cssSource) {
      copyFileSync(cssSource, resolve(outDir, "theme.css"));
    }
  }
}

// Assembles dist/admin/external.default.json after all per-entry
// builds have finished. This file is the immutable baseline of what
// shipped with this admin version — used by externalRegistryStore on
// fresh boots (when Firestore has no registry yet) and by the admin
// UI's "Reinstall bundled defaults" button.
//
// We deliberately DO NOT write dist/admin/external.json — the runtime
// registry now lives in Firestore (settings/externalRegistry), so
// dropping a fresh dist/admin/ on Flexweg never overwrites user state.
// On a fresh boot the store reads from Firestore first; if that's
// empty it migrates from the legacy on-disk external.json (older
// deployments) and otherwise seeds itself from external.default.json.
function writeExternalManifests() {
  const manifest = {
    plugins: PLUGINS.map((m) => ({
      id: m.id,
      version: m.version,
      apiVersion: FLEXWEG_API_VERSION,
      entryPath: `plugins/${m.id}/bundle.js`,
    })),
    themes: THEMES.map((m) => ({
      id: m.id,
      version: m.version,
      apiVersion: FLEXWEG_API_VERSION,
      entryPath: `themes/${m.id}/bundle.js`,
    })),
  };
  const json = JSON.stringify(manifest, null, 2) + "\n";
  writeFileSync(resolve(distAdmin, "external.default.json"), json);
  console.log(
    `[externals] wrote external.default.json (${PLUGINS.length} plugins, ${THEMES.length} themes)`,
  );
}

async function main() {
  const start = Date.now();
  const pluginsDist = resolve(distAdmin, "plugins");
  const themesDist = resolve(distAdmin, "themes");
  mkdirSync(pluginsDist, { recursive: true });
  mkdirSync(themesDist, { recursive: true });

  for (const meta of PLUGINS) {
    const srcDir = resolve(root, "src/plugins", meta.id);
    await buildOneEntry("plugins", meta, srcDir, pluginsDist);
  }
  for (const meta of THEMES) {
    const srcDir = resolve(root, "src/themes", meta.id);
    await buildOneEntry("themes", meta, srcDir, themesDist);
  }

  writeExternalManifests();
  const ms = Date.now() - start;
  console.log(`[externals] done in ${(ms / 1000).toFixed(1)}s`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
