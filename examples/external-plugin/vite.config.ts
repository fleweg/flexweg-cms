import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// External-plugin build config. Three things matter here:
//
//   1. Library mode: we emit a single ESM bundle (bundle.js) that
//      default-exports the plugin manifest. The admin imports() this
//      file at boot.
//
//   2. Externalised dependencies: react, react-i18next and
//      @flexweg/cms-runtime are NOT bundled — at runtime the import-map
//      in /admin/index.html redirects each bare specifier to a stub
//      under /admin/runtime/ that hands back the live admin instance.
//      This is what guarantees a single React copy across admin and
//      plugin (required for hooks integrity).
//
//   3. No code-splitting: Rollup might otherwise emit chunks like
//      `react-vendor-<hash>.js`, but our admin only loads `bundle.js`.
//      `output.inlineDynamicImports: true` collapses everything into
//      one file.
//
// Output goes to dist/, then scripts/pack.mjs zips it for upload.

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/manifest.tsx",
      formats: ["es"],
      fileName: () => "bundle.js",
    },
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      external: [
        "react",
        "react/jsx-runtime",
        "react-dom",
        "react-dom/client",
        "react-i18next",
        "@flexweg/cms-runtime",
      ],
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
