// Pre-build step: compile each theme's Tailwind config to
// `<theme>/theme.compiled.css` so the manifest's
// `import cssText from "./theme.compiled.css?inline"` resolves at the
// time Vite traverses the import graph.
//
// Discovery: walks src/themes/<id>/, looks for `tailwind.config.cjs`.
// Themes without it (e.g. the SCSS-based `default` theme) are skipped
// here — they fall back to the Sass pipeline run by build-themes.mjs.
//
// Output is later copied verbatim into dist/theme-assets/<id>.css by
// build-themes.mjs, which is the file every published page links to
// via `<link rel="stylesheet" href="/theme-assets/<id>.css">`.
//
// Wired into the build via `prebuild` (so prod builds always run it)
// and `predev` (so a fresh `npm run dev` doesn't crash on a missing
// import). For iterative theme work, run
// `npx tailwindcss -c <config> -i <input> -o <output> --watch` in a
// second terminal — Vite's `?inline` import is watched, so each
// rewrite of theme.compiled.css triggers HMR in the admin.

import { readdir, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, "..");
const themesDir = join(root, "src", "themes");
const cli = join(root, "node_modules", ".bin", "tailwindcss");

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const entries = await readdir(themesDir, { withFileTypes: true }).catch(() => []);
  let compiled = 0;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const id = entry.name;
    const themeDir = join(themesDir, id);
    const configPath = join(themeDir, "tailwind.config.cjs");
    const inputPath = join(themeDir, "theme.css");
    const outputPath = join(themeDir, "theme.compiled.css");

    if (!(await exists(configPath))) {
      // Theme uses the Sass pipeline; nothing to do here.
      continue;
    }
    if (!(await exists(inputPath))) {
      console.error(
        `[themes:tailwind] ${id}: tailwind.config.cjs found but theme.css is missing.`,
      );
      process.exit(1);
    }

    console.log(`[themes:tailwind] ${id}: compiling…`);
    const result = spawnSync(
      cli,
      ["-c", configPath, "-i", inputPath, "-o", outputPath, "--minify"],
      { stdio: "inherit", cwd: root },
    );
    if (result.status !== 0) {
      console.error(`[themes:tailwind] ${id}: compilation failed.`);
      process.exit(result.status ?? 1);
    }
    compiled++;
  }

  if (compiled === 0) {
    console.log("[themes:tailwind] no Tailwind-based themes found; skipping.");
  } else {
    console.log(`[themes:tailwind] done — ${compiled} theme(s) compiled.`);
  }
}

main().catch((err) => {
  console.error("[themes:tailwind] build failed:", err);
  process.exit(1);
});
