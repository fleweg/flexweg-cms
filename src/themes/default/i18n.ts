// Bundled translations for the default theme's settings page. Loaded
// into a dedicated i18next namespace named "theme-default" by the
// theme registry, so the settings page calls
// useTranslation("theme-default") to scope its keys.

export const en = {
  title: "Theme settings",
  description:
    "Customize the active theme. Changes affect every published page on the next load (browsers may cache the CSS — hard-refresh once to see the update).",
  tabs: {
    general: "General",
    style: "Style",
  },

  // ─── General tab ───────────────────────────────────────────────
  logo: {
    title: "Logo",
    help:
      "Upload a logo to replace the text wordmark in the header. Recommended dimensions: {{width}}×{{height}} px. Image is resized and stored as WebP.",
    none: "No logo set",
    upload: "Upload logo",
    uploading: "Uploading…",
    change: "Change logo",
    remove: "Remove logo",
    removing: "Removing…",
    saved: "Logo updated. Reload published pages to see the change.",
    removed: "Logo removed.",
    failed: "Logo upload failed.",
    invalidType: "Pick a JPG, PNG or WebP image.",
  },

  // ─── Style tab ─────────────────────────────────────────────────
  style: {
    help:
      "Tweak design tokens to customize colors, typography, spacing and corners. Save & apply pushes a regenerated theme CSS to your site.",
    save: "Save & apply",
    saving: "Applying…",
    saved: "Style applied. Hard-refresh published pages to see the changes.",
    failed: "Style update failed.",
    reset: "Reset to defaults",
    resetting: "Resetting…",
  },
  groups: {
    surfaces: "Surfaces",
    foreground: "Foreground (text)",
    outlines: "Outlines",
    accent: "Accent colors",
    typography: "Typography",
    weights: "Font weights",
    spacing: "Spacing & layout",
    radius: "Corner radius",
  },
  fonts: {
    serif: "Serif (headings & lede)",
    sans: "Sans-serif (body & metadata)",
    help:
      "Fonts ship via Google Fonts. The CSS @import line is rewritten on save so the right files load.",
  },
  vars: {
    bg: "Page background",
    surface: "Card / lifted surface",
    surfaceLow: "Surface — low",
    surfaceMid: "Surface — mid",
    surfaceHigh: "Surface — high",
    surfaceHighest: "Surface — highest",
    onSurface: "Body text",
    onSurfaceVariant: "Secondary text (excerpts)",
    onSurfaceMuted: "Muted text (metadata)",
    outline: "Outline",
    outlineVariant: "Outline — subtle",
    primary: "Primary (buttons)",
    onPrimary: "Text on primary",
    secondary: "Accent (links, hover)",
    secondaryContainer: "Pill background",
    onSecondaryContainer: "Pill text",
    weightDisplay: "Display (page titles, hero, h2 in body)",
    weightHeading: "Heading (h3 in body, card titles)",
    weightBody: "Body (paragraphs, default text)",
    weightMeta: "Meta (labels, eyebrows, dates, breadcrumb)",
    weightEmphasis: "Emphasis (strong, drop cap, brand, author name)",
    weightLede: "Lede (italic intro paragraph, blockquote)",
    containerMax: "Container max width",
    gutter: "Gutter (grid gap)",
    sectionGap: "Section gap",
    radiusSm: "Radius — small",
    radius: "Radius — default",
    radiusLg: "Radius — large",
    radiusXl: "Radius — extra large",
  },
};

export const fr: typeof en = {
  title: "Réglages du thème",
  description:
    "Personnalisez le thème actif. Les changements s'appliquent à toutes les pages publiées à leur prochain chargement (le navigateur peut mettre la CSS en cache — rafraîchissez une fois pour voir la mise à jour).",
  tabs: {
    general: "Général",
    style: "Style",
  },

  logo: {
    title: "Logo",
    help:
      "Téléversez un logo pour remplacer le wordmark texte dans l'en-tête. Dimensions recommandées : {{width}}×{{height}} px. L'image est redimensionnée et stockée en WebP.",
    none: "Aucun logo défini",
    upload: "Téléverser un logo",
    uploading: "Téléversement…",
    change: "Changer le logo",
    remove: "Supprimer le logo",
    removing: "Suppression…",
    saved: "Logo mis à jour. Rechargez les pages publiées pour voir le changement.",
    removed: "Logo supprimé.",
    failed: "Échec du téléversement du logo.",
    invalidType: "Choisissez une image JPG, PNG ou WebP.",
  },

  style: {
    help:
      "Ajustez les design tokens pour personnaliser couleurs, typographie, espacement et arrondis. Enregistrer & appliquer pousse une CSS régénérée sur votre site.",
    save: "Enregistrer & appliquer",
    saving: "Application…",
    saved: "Style appliqué. Rafraîchissez les pages publiées pour voir les changements.",
    failed: "Échec de la mise à jour du style.",
    reset: "Réinitialiser",
    resetting: "Réinitialisation…",
  },
  groups: {
    surfaces: "Surfaces",
    foreground: "Texte",
    outlines: "Contours",
    accent: "Couleurs d'accent",
    typography: "Typographie",
    weights: "Graisses",
    spacing: "Espacement & mise en page",
    radius: "Arrondis",
  },
  fonts: {
    serif: "Serif (titres & lede)",
    sans: "Sans-serif (corps & métadonnées)",
    help:
      "Les fonts sont chargées via Google Fonts. La ligne @import de la CSS est réécrite à la sauvegarde pour charger les bons fichiers.",
  },
  vars: {
    bg: "Fond de page",
    surface: "Carte / surface relevée",
    surfaceLow: "Surface — basse",
    surfaceMid: "Surface — moyenne",
    surfaceHigh: "Surface — haute",
    surfaceHighest: "Surface — la plus haute",
    onSurface: "Texte principal",
    onSurfaceVariant: "Texte secondaire (extraits)",
    onSurfaceMuted: "Texte estompé (métadonnées)",
    outline: "Bordure",
    outlineVariant: "Bordure — subtile",
    primary: "Primaire (boutons)",
    onPrimary: "Texte sur primaire",
    secondary: "Accent (liens, hover)",
    secondaryContainer: "Fond des pills",
    onSecondaryContainer: "Texte des pills",
    weightDisplay: "Display (titres de page, hero, h2 dans le corps)",
    weightHeading: "Heading (h3 dans le corps, titres de carte)",
    weightBody: "Body (paragraphes, texte courant)",
    weightMeta: "Meta (labels, eyebrows, dates, fil d'Ariane)",
    weightEmphasis: "Emphasis (strong, drop cap, marque, nom d'auteur)",
    weightLede: "Lede (paragraphe italique d'intro, citation)",
    containerMax: "Largeur max du conteneur",
    gutter: "Gouttière (grille)",
    sectionGap: "Espacement entre sections",
    radiusSm: "Arrondi — petit",
    radius: "Arrondi — défaut",
    radiusLg: "Arrondi — large",
    radiusXl: "Arrondi — extra-large",
  },
};
