/**
 * Corporate theme — Tailwind config.
 *
 * Compiled by scripts/build-theme-tailwind.mjs into ./theme.compiled.css.
 * The result is bundled into the admin via the manifest's
 * `import cssText from "./theme.compiled.css?inline"` and uploaded to
 * Flexweg as `/theme-assets/corporate.css`.
 *
 * Content scan is intentionally LOCAL to this theme so the compiled CSS
 * stays free of admin-bundle utility classes. Block render functions
 * (.ts files) emit class names as plain strings — Tailwind picks them
 * up from the same scan. The `.js` glob covers the runtime loaders
 * (`menu-loader.js`, `posts-loader.js`, `contact-form.js`) that inject
 * DOM whose class names are only referenced from those files —
 * required so Tailwind's purge step doesn't strip the matching
 * `@layer components` rules.
 *
 * Material 3 colors are declared as `rgb(var(--color-X) / <alpha-value>)`
 * so `compileCss(config)` can override the CSS variables in :root at
 * upload time without rebuilding the bundle.
 *
 * Palette is anchored on a deep navy primary + indigo secondary +
 * sky-blue tertiary, the corporate / modern SaaS aesthetic from
 * the Stitch mockup's DESIGN.md.
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ["./src/themes/corporate/**/*.{ts,tsx,html,js}"],
  // Utility classes whose presence is part of the theme's runtime
  // contract — emitted by the rendered Markdown body, by inline
  // strings the runtime loaders inject, or by plugins outside the
  // theme's content scan.
  // - `material-symbols-outlined`: every icon glyph in templates and blocks.
  // - archives BEM family: emitted by the `flexweg-archives` plugin's
  //   HTML which lives outside this directory; the regex keeps the
  //   matching `@layer components` rules from being purged.
  safelist: [
    "material-symbols-outlined",
    { pattern: /^archives(__[a-z-]+|-link)?$/ },
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        "on-primary": "rgb(var(--color-on-primary) / <alpha-value>)",
        "primary-container": "rgb(var(--color-primary-container) / <alpha-value>)",
        "on-primary-container": "rgb(var(--color-on-primary-container) / <alpha-value>)",
        "primary-fixed": "rgb(var(--color-primary-fixed) / <alpha-value>)",
        "primary-fixed-dim": "rgb(var(--color-primary-fixed-dim) / <alpha-value>)",
        "on-primary-fixed": "rgb(var(--color-on-primary-fixed) / <alpha-value>)",
        "on-primary-fixed-variant": "rgb(var(--color-on-primary-fixed-variant) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        "on-secondary": "rgb(var(--color-on-secondary) / <alpha-value>)",
        "secondary-container": "rgb(var(--color-secondary-container) / <alpha-value>)",
        "on-secondary-container": "rgb(var(--color-on-secondary-container) / <alpha-value>)",
        "secondary-fixed": "rgb(var(--color-secondary-fixed) / <alpha-value>)",
        "secondary-fixed-dim": "rgb(var(--color-secondary-fixed-dim) / <alpha-value>)",
        tertiary: "rgb(var(--color-tertiary) / <alpha-value>)",
        "on-tertiary": "rgb(var(--color-on-tertiary) / <alpha-value>)",
        "tertiary-container": "rgb(var(--color-tertiary-container) / <alpha-value>)",
        "on-tertiary-container": "rgb(var(--color-on-tertiary-container) / <alpha-value>)",
        "tertiary-fixed": "rgb(var(--color-tertiary-fixed) / <alpha-value>)",
        "tertiary-fixed-dim": "rgb(var(--color-tertiary-fixed-dim) / <alpha-value>)",
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-bright": "rgb(var(--color-surface-bright) / <alpha-value>)",
        "surface-container-lowest": "rgb(var(--color-surface-container-lowest) / <alpha-value>)",
        "surface-container-low": "rgb(var(--color-surface-container-low) / <alpha-value>)",
        "surface-container": "rgb(var(--color-surface-container) / <alpha-value>)",
        "surface-container-high": "rgb(var(--color-surface-container-high) / <alpha-value>)",
        "surface-container-highest": "rgb(var(--color-surface-container-highest) / <alpha-value>)",
        "on-surface": "rgb(var(--color-on-surface) / <alpha-value>)",
        "on-surface-variant": "rgb(var(--color-on-surface-variant) / <alpha-value>)",
        outline: "rgb(var(--color-outline) / <alpha-value>)",
        "outline-variant": "rgb(var(--color-outline-variant) / <alpha-value>)",
        error: "rgb(var(--color-error) / <alpha-value>)",
        "on-error": "rgb(var(--color-on-error) / <alpha-value>)",
      },
      fontFamily: {
        // Resolved via CSS variable so compileCss() can swap to another
        // single sans family. The mockup uses Inter exclusively.
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      // Spacing tokens lifted from the mockup design system.
      spacing: {
        "stack-sm": "0.5rem",
        "stack-md": "1rem",
        "stack-lg": "2rem",
        "section-padding": "5rem",
        gutter: "1.5rem",
        "container-max": "1280px",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      fontSize: {
        "label-caps": ["0.75rem", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "600" }],
        button: ["0.875rem", { lineHeight: "1.25", letterSpacing: "0", fontWeight: "600" }],
        "body-md": ["1rem", { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" }],
        "body-lg": ["1.125rem", { lineHeight: "1.75", letterSpacing: "0", fontWeight: "400" }],
        h3: ["1.5rem", { lineHeight: "1.4", letterSpacing: "0", fontWeight: "600" }],
        h2: ["2.25rem", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "700" }],
        h1: ["3rem", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
      },
    },
  },
  plugins: [],
};
