/**
 * Portfolio theme — Tailwind config.
 *
 * Compiled by scripts/build-theme-tailwind.mjs into ./theme.compiled.css.
 * The result is bundled into the admin via the manifest's
 * `import cssText from "./theme.compiled.css?inline"` and uploaded to
 * Flexweg as `/theme-assets/portfolio.css`.
 *
 * Content scan is intentionally LOCAL to this theme so the compiled CSS
 * stays free of admin-bundle utility classes. `.js` is included so the
 * runtime loaders (menu-loader, posts-loader, filters-loader) contribute
 * their DOM class names — otherwise Tailwind purges the matching
 * `@layer components` rules.
 *
 * Material 3 colors declared as `rgb(var(--color-X) / <alpha-value>)`
 * so `compileCss(config)` can override the variables in :root at upload
 * time without rebuilding the bundle.
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ["./src/themes/portfolio/**/*.{ts,tsx,html,js}"],
  // Utility classes whose presence is part of the theme's runtime
  // contract (emitted by markdown bodies, plugins, or runtime JS).
  safelist: [
    "material-symbols-outlined",
    "is-active",
    { pattern: /^archives(__[a-z-]+|-link)?$/ },
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        "on-primary": "rgb(var(--color-on-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        "on-secondary": "rgb(var(--color-on-secondary) / <alpha-value>)",
        "secondary-container": "rgb(var(--color-secondary-container) / <alpha-value>)",
        "on-secondary-container": "rgb(var(--color-on-secondary-container) / <alpha-value>)",
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-container-lowest": "rgb(var(--color-surface-container-lowest) / <alpha-value>)",
        "surface-container-low": "rgb(var(--color-surface-container-low) / <alpha-value>)",
        "surface-container": "rgb(var(--color-surface-container) / <alpha-value>)",
        "on-surface": "rgb(var(--color-on-surface) / <alpha-value>)",
        "on-surface-variant": "rgb(var(--color-on-surface-variant) / <alpha-value>)",
        outline: "rgb(var(--color-outline) / <alpha-value>)",
        "outline-variant": "rgb(var(--color-outline-variant) / <alpha-value>)",
        // Rose accent — used ONLY for interactive feedback (active
        // links, focus rings, hover-state highlights). Don't apply
        // to large surfaces; that's the whole minimalist contract.
        error: "rgb(var(--color-error) / <alpha-value>)",
      },
      fontFamily: {
        // Resolved via CSS variables so compileCss() can swap pairs.
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      // Spacing tokens taken directly from DESIGN.md.
      spacing: {
        gutter: "2rem",
        "margin-edge": "2.5rem",
        "margin-edge-mobile": "1.25rem",
        "section-gap": "8rem",
        "section-gap-mobile": "4rem",
        "container-max": "1440px",
      },
      maxWidth: {
        "container-max": "1440px",
      },
      fontSize: {
        "display-lg": ["80px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-lg-mobile": ["48px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-lg": ["48px", { lineHeight: "1.2", fontWeight: "600" }],
        "headline-lg-mobile": ["32px", { lineHeight: "1.3", fontWeight: "600" }],
        "headline-md": ["32px", { lineHeight: "1.3", fontWeight: "500" }],
        "body-lg": ["18px", { lineHeight: "1.7", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "label-sm": ["12px", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "600" }],
      },
      // Strong Minimalism — no border-radius anywhere. Override the
      // Tailwind defaults to enforce sharp corners even when an
      // accidental `rounded-*` utility slips through.
      borderRadius: {
        DEFAULT: "0",
        none: "0",
        sm: "0",
        md: "0",
        lg: "0",
        xl: "0",
        "2xl": "0",
        "3xl": "0",
        full: "0",
      },
      boxShadow: {
        // Flat design — no shadows. Provide a single explicit "none"
        // so any `shadow-*` utility resolves to nothing.
        DEFAULT: "none",
        sm: "none",
        md: "none",
        lg: "none",
        xl: "none",
        "2xl": "none",
        inner: "none",
        none: "none",
      },
    },
  },
  plugins: [],
};
