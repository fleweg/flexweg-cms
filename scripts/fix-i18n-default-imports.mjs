#!/usr/bin/env node
// Patch-up after rewrite-theme-imports.mjs. The themes used to do
// `import i18n, { pickPublicLocale } from "../../../i18n"`. Generic
// rewrite mapped the path to "@flexweg/cms-runtime" but kept the
// default-import form for `i18n`, which now collides with the runtime
// module's default export (the FlexwegRuntime object). The runtime
// exposes `i18n` as a NAMED export, so we move it into the named
// destructure.

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TARGETS = [
  resolve(root, "src/themes/magazine"),
  resolve(root, "src/themes/corporate"),
  resolve(root, "src/themes/storefront"),
  resolve(root, "src/themes/portfolio"),
];

// Match: import i18n[, { ... }] from "@flexweg/cms-runtime"
//   group 1: empty or `, { existing names }`
const RE = /import i18n(?:,\s*\{\s*([^}]*?)\s*\})?\s+from\s+"@flexweg\/cms-runtime"/g;

function patchFile(path) {
  const before = readFileSync(path, "utf8");
  const after = before.replace(RE, (_match, named) => {
    const trimmed = (named ?? "").trim().replace(/,$/, "").trim();
    return trimmed
      ? `import { i18n, ${trimmed} } from "@flexweg/cms-runtime"`
      : `import { i18n } from "@flexweg/cms-runtime"`;
  });
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
    if (patchFile(file)) changed++;
  }
}
console.log(`[fix-i18n] updated ${changed} file(s)`);
