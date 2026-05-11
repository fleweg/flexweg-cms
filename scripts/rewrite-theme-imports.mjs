#!/usr/bin/env node
// One-shot helper that rewrites theme files' internal imports to use
// "@flexweg/cms-runtime". Exists to convert the magazine + corporate
// in-tree themes into externally-buildable bundles in a single pass —
// otherwise each theme has 20-30 files to edit by hand. Idempotent:
// running twice is a no-op once everything has been rewritten.
//
// Conservative — only rewrites import paths that match the runtime API
// surface (core, services, hooks, lib, context, i18n, components/ui,
// themes/types, themes-relative `../../types`). Other relative imports
// (sibling files inside the theme tree like `./SettingsPage` or
// `../components/Header`) are left untouched.
//
// After running, re-run `npm run typecheck` — any unmapped symbol will
// surface there. The runtime API surface lives in src/core/flexwegRuntime.ts.

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Directories whose theme files should be rewritten. Pass these as
// args to override (e.g. `node rewrite-theme-imports.mjs custom-theme`).
const TARGETS = process.argv.slice(2).length
  ? process.argv.slice(2).map((id) => resolve(root, "src/themes", id))
  : [
      resolve(root, "src/themes/magazine"),
      resolve(root, "src/themes/corporate"),
      resolve(root, "src/themes/storefront"),
      resolve(root, "src/themes/portfolio"),
    ];

const RUNTIME_BASES = [
  "core",
  "services",
  "hooks",
  "i18n",
  "lib",
  "context",
  "components/ui",
];

// Pattern for a relative import that points OUT of the theme folder
// into admin-internal modules covered by @flexweg/cms-runtime. Matches
// any depth of `../`, then one of the runtime bases. Captures the
// portion after `from "` so the replacement keeps surrounding quotes.
const INTERNAL_IMPORT_RE = new RegExp(
  `(from\\s+["'])(?:\\.\\./)+(?:${RUNTIME_BASES.join("|")})(/[^"']*)?(["'])`,
  "g",
);

// Themes also import from the shared themes/types.ts via `../../types`
// or `../types` depending on file depth. Both resolve to types covered
// by the runtime. We anchor on the trailing `types"` to avoid touching
// sibling theme files like `../themes/types/SomethingElse`.
const THEME_TYPES_IMPORT_RE = /(from\s+["'])(?:\.\.\/)+types(["'])/g;

// Replace `../default/logo` with `@flexweg/cms-runtime` (logoPath +
// uploadThemeLogo + removeThemeLogo are exposed there now). Cross-theme
// imports were the only legitimate use of this pattern.
const DEFAULT_LOGO_IMPORT_RE = /(from\s+["'])\.\.\/default\/logo(["'])/g;

function rewriteFile(path) {
  const before = readFileSync(path, "utf8");
  let after = before;
  after = after.replace(INTERNAL_IMPORT_RE, '$1@flexweg/cms-runtime$3');
  after = after.replace(THEME_TYPES_IMPORT_RE, '$1@flexweg/cms-runtime$2');
  after = after.replace(DEFAULT_LOGO_IMPORT_RE, '$1@flexweg/cms-runtime$2');
  if (before === after) return false;
  writeFileSync(path, after);
  return true;
}

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (/\.(ts|tsx)$/.test(name)) out.push(full);
  }
  return out;
}

let changed = 0;
for (const target of TARGETS) {
  for (const file of walk(target)) {
    if (rewriteFile(file)) changed++;
  }
}
console.log(`[rewrite] updated ${changed} file(s)`);
