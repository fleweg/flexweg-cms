import type { ThemeManifest } from "../types";
import { BaseLayout } from "./templates/BaseLayout";
import { HomeTemplate } from "./templates/HomeTemplate";
import { SingleTemplate } from "./templates/SingleTemplate";
import { CategoryTemplate } from "./templates/CategoryTemplate";
import { AuthorTemplate } from "./templates/AuthorTemplate";
import { NotFoundTemplate } from "./templates/NotFoundTemplate";
// Vite compiles the SCSS at build time and the `?inline` suffix returns the
// resulting CSS as a string instead of injecting a <style> tag. This is what
// the "Sync theme assets" button uploads to Flexweg.
import cssText from "./theme.scss?inline";

export const manifest: ThemeManifest = {
  id: "default",
  name: "Default",
  version: "1.0.0",
  description: "Minimal blog/site theme that ships with Flexweg CMS.",
  scssEntry: "theme.scss",
  cssText,
  // Image catalog used by the upload pipeline. WebP at 80 strikes a fair
  // balance between weight and quality for blog imagery; raise the quality
  // here (or override per-format) if your site is photo-heavy.
  imageFormats: {
    inputFormats: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
    outputFormat: "webp",
    quality: 80,
    formats: {
      // Square teaser used in listings (home + category + author).
      small: { width: 480, height: 480, fit: "cover" },
      // Default size — used by Card.tsx and any template that calls
      // pickFormat(view) without a specific name.
      medium: { width: 800, height: 800, fit: "cover" },
      // Wide hero shown at the top of single posts.
      large: { width: 1600, height: 900, fit: "cover" },
    },
    defaultFormat: "medium",
  },
  templates: {
    base: BaseLayout,
    home: HomeTemplate,
    single: SingleTemplate,
    category: CategoryTemplate,
    author: AuthorTemplate,
    notFound: NotFoundTemplate,
  },
};
