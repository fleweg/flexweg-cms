/**
 * Magazine theme — Tailwind config.
 *
 * Compiled by scripts/build-theme-tailwind.mjs into ./theme.compiled.css.
 * The result is bundled into the admin via the manifest's
 * `import cssText from "./theme.compiled.css?inline"` and uploaded to
 * Flexweg as `/theme-assets/magazine.css`.
 *
 * Content scan is intentionally LOCAL to this theme so the compiled CSS
 * stays free of admin-bundle utility classes. Block render functions
 * (.ts files) emit class names as plain strings — Tailwind picks them
 * up from the same scan.
 *
 * Material 3 colors are declared as `rgb(var(--color-X) / <alpha-value>)`
 * so `compileCss(config)` can override the CSS variables in :root at
 * upload time without rebuilding the bundle.
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  // `.js` is included so the runtime loaders (`menu-loader.js`,
  // `posts-loader.js`) contribute their DOM class names to the
  // content scan — otherwise Tailwind purges the matching `@layer
  // components` rules in `theme.css` and the runtime-injected
  // sidebar widgets render unstyled.
  content: ["./src/themes/magazine/**/*.{ts,tsx,html,js}"],
  // Utility classes whose presence is part of the theme's runtime
  // contract — emitted by the rendered Markdown body (drop-cap on the
  // first paragraph) or by inline icon strings — and therefore not
  // discoverable through the content scan alone.
  safelist: ["drop-cap", "material-symbols-outlined"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        "on-primary": "rgb(var(--color-on-primary) / <alpha-value>)",
        "primary-container": "rgb(var(--color-primary-container) / <alpha-value>)",
        "on-primary-container": "rgb(var(--color-on-primary-container) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-container-low": "rgb(var(--color-surface-container-low) / <alpha-value>)",
        "surface-container": "rgb(var(--color-surface-container) / <alpha-value>)",
        "surface-container-high": "rgb(var(--color-surface-container-high) / <alpha-value>)",
        "on-surface": "rgb(var(--color-on-surface) / <alpha-value>)",
        "on-surface-variant": "rgb(var(--color-on-surface-variant) / <alpha-value>)",
        outline: "rgb(var(--color-outline) / <alpha-value>)",
        "outline-variant": "rgb(var(--color-outline-variant) / <alpha-value>)",
      },
      fontFamily: {
        // Resolved via CSS variables so compileCss() can swap font pairs.
        serif: ["var(--font-serif)", "Newsreader", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Work Sans", "system-ui", "sans-serif"],
      },
      // Spacing tokens taken from the mockup design system.
      spacing: {
        unit: "4px",
        "stack-sm": "8px",
        "stack-md": "24px",
        "stack-lg": "48px",
        gutter: "24px",
        "section-gap": "80px",
        "margin-mobile": "16px",
        "container-max": "1280px",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
      },
    },
  },
  plugins: [],
};
