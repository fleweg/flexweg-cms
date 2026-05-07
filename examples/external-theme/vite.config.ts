import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// External theme build config. Same shape as the plugin example —
// library mode + single ESM bundle + externalised runtime deps.
//
// Themes have an extra wrinkle: their CSS isn't bundled into bundle.js.
// Instead we ship `theme.css` alongside `bundle.js` and the theme's
// manifest declares `cssText` by importing it via `?raw` so the admin's
// "Sync theme assets" path uploads the verbatim string. Build the CSS
// however you prefer (Tailwind, SCSS, hand-written) — the admin only
// cares that you ship a `theme.css` file with the bundle.

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
        "@flexweg/cms-runtime",
      ],
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
