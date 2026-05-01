import type { ThemeManifest } from "../types";
import { BaseLayout } from "./templates/BaseLayout";
import { HomeTemplate } from "./templates/HomeTemplate";
import { SingleTemplate } from "./templates/SingleTemplate";
import { CategoryTemplate } from "./templates/CategoryTemplate";
import { AuthorTemplate } from "./templates/AuthorTemplate";
import { NotFoundTemplate } from "./templates/NotFoundTemplate";

export const manifest: ThemeManifest = {
  id: "default",
  name: "Default",
  version: "1.0.0",
  description: "Minimal blog/site theme that ships with Flexweg CMS.",
  scssEntry: "theme.scss",
  templates: {
    base: BaseLayout,
    home: HomeTemplate,
    single: SingleTemplate,
    category: CategoryTemplate,
    author: AuthorTemplate,
    notFound: NotFoundTemplate,
  },
};
