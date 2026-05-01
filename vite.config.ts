import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative base so the same build works whether deployed at the root or
  // under /admin/ on Flexweg static hosting.
  base: "./",
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: "dist",
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
