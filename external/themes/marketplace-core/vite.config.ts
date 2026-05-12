import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Marketplace Core external theme — Vite library build. Same shape as
// the minimal external-theme example: single ESM bundle, React +
// react-dom + cms-runtime externalised, no CSS bundled into bundle.js
// (theme.css is shipped alongside via the pack script).
export default defineConfig({
  plugins: [react()],
  // Vite's lib mode does NOT replace `process.env.NODE_ENV` at build
  // time (unlike app mode, where it's automatic). React's production
  // shim, react-i18next, and several Tiptap deps reference it — without
  // this define, the browser throws "process is not defined" the moment
  // the bundle imports. We hard-code "production" because external
  // theme bundles ship only the production builds of their deps.
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
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
