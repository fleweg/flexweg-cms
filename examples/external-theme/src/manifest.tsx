// External theme sample. Provides the six required templates (base,
// home, single, category, author, notFound) plus a minimal stylesheet.
//
// Build: `npm run build` produces ./dist/bundle.js and copies theme.css
// alongside it. `npm run pack` zips everything for upload.

import cssText from "./theme.css?raw";
import { BaseLayout } from "./templates/BaseLayout";
import { HomeTemplate } from "./templates/HomeTemplate";
import { SingleTemplate } from "./templates/SingleTemplate";
import { CategoryTemplate } from "./templates/CategoryTemplate";
import { AuthorTemplate } from "./templates/AuthorTemplate";
import { NotFoundTemplate } from "./templates/NotFoundTemplate";

const manifest = {
  id: "minimal-theme",
  name: "Minimal Theme",
  version: "1.0.0",
  description: "Minimal external theme — single column, system fonts.",
  scssEntry: "theme.css",
  cssText,
  templates: {
    base: BaseLayout,
    home: HomeTemplate,
    single: SingleTemplate,
    category: CategoryTemplate,
    author: AuthorTemplate,
    notFound: NotFoundTemplate,
  },
};

export default manifest;
