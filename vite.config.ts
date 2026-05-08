import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  // Resolve @flexweg/cms-runtime to the in-tree implementation. In dev
  // and the main admin build, plugins/themes that `import { uploadFile }
  // from "@flexweg/cms-runtime"` get the live functions directly. The
  // separate plugin/theme bundles produced by build-bundled-externals.mjs
  // EXTERNALIZE this specifier so it's left as a bare import in their
  // output — at runtime the import-map in index.html redirects to
  // /admin/runtime/cms-runtime.js which reads from window.__FLEXWEG_RUNTIME__.
  resolve: {
    alias: {
      "@flexweg/cms-runtime": fileURLToPath(
        new URL("./src/core/flexwegRuntime.ts", import.meta.url),
      ),
    },
  },
  // Relative base so the same build works whether deployed at the root or
  // under /admin/ on Flexweg static hosting.
  base: "./",
  server: {
    port: 5173,
    open: true,
  },
  build: {
    // Output directly under dist/admin/ so the folder maps 1:1 to the
    // /admin/ path on Flexweg static hosting. Uploading dist/admin/ as-is
    // (zip-and-drop or via the Files API) makes the admin reachable at
    // monsite.com/admin/.
    outDir: "dist/admin",
    emptyOutDir: true,
    sourcemap: false,
  },
  test: {
    // Pure-logic tests run faster against the Node environment. Switch to
    // jsdom on a per-file basis (// @vitest-environment jsdom) when needed.
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
