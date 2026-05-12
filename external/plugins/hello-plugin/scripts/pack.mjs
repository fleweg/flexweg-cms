#!/usr/bin/env node
// Packs dist/bundle.js + manifest.json + README.md (when present) into
// a single .zip ready for upload via the admin's "Install plugin" UI.
//
// Output: ./hello-plugin.zip in the project root.

import { createWriteStream, existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import JSZip from "jszip";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const manifestPath = resolve(root, "manifest.json");
if (!existsSync(manifestPath)) {
  console.error("manifest.json missing in project root");
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
const id = manifest.id;
if (!id) {
  console.error("manifest.id is required");
  process.exit(1);
}

const bundlePath = resolve(root, "dist/bundle.js");
if (!existsSync(bundlePath)) {
  console.error("dist/bundle.js missing — run `npm run build` first");
  process.exit(1);
}

const zip = new JSZip();
zip.file("manifest.json", readFileSync(manifestPath));
zip.file("bundle.js", readFileSync(bundlePath));
const readmePath = resolve(root, "README.md");
if (existsSync(readmePath)) {
  zip.file("README.md", readFileSync(readmePath));
}

const outPath = resolve(root, `${id}.zip`);
zip
  .generateNodeStream({ type: "nodebuffer", streamFiles: true })
  .pipe(createWriteStream(outPath))
  .on("finish", () => {
    console.log(`Packed: ${outPath}`);
  });
