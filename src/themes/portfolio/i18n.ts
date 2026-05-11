// Portfolio theme — translation bundle. Mirrors magazine's i18n.ts
// shape: top-level `title`, `settings`, `publicBaked` blocks.
//
// Phase 1 ships English-only content with the other locales aliased
// to English. Phase 5 fills in fr/de/es/nl/pt/ko.

const publicBakedEn = {
  work: "WORK",
  about: "ABOUT",
  journal: "JOURNAL",
  contact: "CONTACT",
  process: "PROCESS",
  menu: "Menu",
  primaryNavMobile: "Primary navigation",
  all: "ALL",
  // Single-post chrome
  servicesLabel: "SERVICES",
  yearLabel: "YEAR",
  awardsLabel: "AWARDS",
  nextProject: "NEXT PROJECT",
  viewCaseStudy: "VIEW CASE STUDY",
  // Author archive
  selectExperience: "Select Experience",
  recognition: "Recognition",
  // Pagination / loading
  loadMore: "LOAD MORE",
  // Footer
  rightsReserved: "ALL RIGHTS RESERVED.",
};

const blocksEn = {
  projectMeta: {
    title: "Project meta",
    untitled: "Untitled meta",
  },
  storytelling: {
    title: "Storytelling section",
    untitled: "(no headline)",
  },
  bentoGallery: {
    title: "Bento gallery",
    imagesFilled: "images filled",
  },
  nextProject: {
    title: "Next project teaser",
    untitled: "(no title)",
  },
};

const settingsEn = {
  description:
    "Strong-minimalism portfolio theme. Editorial canvas for designers, photographers and artists — charcoal-on-warm-white, sharp corners, zero shadows.",
  tabs: {
    home: "Home",
    single: "Project page",
    author: "Author archive",
    footer: "Footer",
    logo: "Logo & branding",
    style: "Style",
  },
  buttons: {
    save: "Save & apply",
    saving: "Saving…",
    reset: "Reset to defaults",
    resetting: "Resetting…",
    saved: "Saved",
  },
  vars: {
    background: "Background",
    surface: "Surface",
    surfaceLowest: "Surface — lowest",
    surfaceLow: "Surface — low",
    surfaceMid: "Surface — mid",
    onSurface: "Foreground",
    onSurfaceVariant: "Foreground variant",
    outline: "Outline",
    outlineVariant: "Outline variant",
    primary: "Primary (charcoal)",
    onPrimary: "On primary",
    secondary: "Secondary (mid-grey)",
    accent: "Accent (rose)",
  },
  groups: {
    surfaces: "Surfaces",
    foreground: "Text",
    outlines: "Outlines",
    accent: "Accent",
  },
  font: {
    serif: "Heading font",
    sans: "Body font",
  },
  home: {
    description:
      "Hero text section + project grid. Three layout variants available.",
    heroHeadline: "Hero headline",
    heroIntro: "Hero introduction paragraph",
    variant: "Grid layout",
    variantStaggered: "Staggered (offset rhythm)",
    variantMasonry: "Masonry (asymmetric)",
    variantStandard: "Standard (uniform grid)",
    cardLimit: "Maximum cards on home",
    cardLimitHelp: "0 = show all online posts.",
    showFilters: "Show category filter chips",
    showFiltersHelp:
      "Source filters from your categories. Empty when no posts are categorized.",
  },
  single: {
    description: "Single-project layout. Hero + meta + body + next-project teaser.",
    showHero: "Show full-bleed hero image",
    showNextProject: "Show next-project teaser at the bottom",
    defaultServicesLabel: "Services label",
    defaultYearLabel: "Year label",
    defaultAwardsLabel: "Awards label",
  },
  author: {
    description: "Author / studio page composition.",
    showExperience: "Show Select Experience list",
    showRecognition: "Show Recognition list",
  },
  footer: {
    description: "Footer composition.",
    copyright: "Copyright line",
    copyrightHelp:
      "Empty falls back to '© <year> <site title>. All rights reserved.'",
  },
  logo: {
    description:
      "Header wordmark. Defaults to your site title in uppercase. Upload a logo image to replace the text.",
    wordmark: "Wordmark text",
    wordmarkHelp: "Empty falls back to your site title in uppercase.",
    upload: "Upload logo",
    replace: "Replace logo",
    remove: "Remove logo",
  },
};

export const en = {
  title: "Theme settings",
  settings: settingsEn,
  publicBaked: publicBakedEn,
  blocks: blocksEn,
};

// ───── French ──────────────────────────────────────────────────────

const publicBakedFr = {
  work: "PROJETS",
  about: "À PROPOS",
  journal: "JOURNAL",
  contact: "CONTACT",
  process: "MÉTHODE",
  menu: "Menu",
  primaryNavMobile: "Navigation principale",
  all: "TOUS",
  servicesLabel: "SERVICES",
  yearLabel: "ANNÉE",
  awardsLabel: "RÉCOMPENSES",
  nextProject: "PROJET SUIVANT",
  viewCaseStudy: "VOIR L'ÉTUDE DE CAS",
  selectExperience: "Expérience choisie",
  recognition: "Distinctions",
  loadMore: "VOIR PLUS",
  rightsReserved: "TOUS DROITS RÉSERVÉS.",
};

const blocksFr = {
  projectMeta: { title: "Métadonnées du projet", untitled: "Sans titre" },
  storytelling: { title: "Section narrative", untitled: "(pas de titre)" },
  bentoGallery: { title: "Galerie bento", imagesFilled: "images remplies" },
  nextProject: { title: "Annonce projet suivant", untitled: "(pas de titre)" },
};

const settingsFr = {
  description:
    "Thème portfolio strong-minimalism. Toile éditoriale pour designers, photographes et artistes — charbon sur blanc chaud, angles vifs, zéro ombre.",
  tabs: {
    home: "Accueil",
    single: "Page projet",
    author: "Archive auteur",
    footer: "Pied de page",
    logo: "Logo & branding",
    style: "Style",
  },
  buttons: {
    save: "Enregistrer et appliquer",
    saving: "Enregistrement…",
    reset: "Réinitialiser",
    resetting: "Réinitialisation…",
    saved: "Enregistré",
  },
  vars: {
    background: "Arrière-plan",
    surface: "Surface",
    surfaceLowest: "Surface — la plus basse",
    surfaceLow: "Surface — basse",
    surfaceMid: "Surface — moyenne",
    onSurface: "Texte",
    onSurfaceVariant: "Texte variante",
    outline: "Contour",
    outlineVariant: "Contour variante",
    primary: "Primaire (charbon)",
    onPrimary: "Sur primaire",
    secondary: "Secondaire (gris)",
    accent: "Accent (rose)",
  },
  groups: {
    surfaces: "Surfaces",
    foreground: "Texte",
    outlines: "Contours",
    accent: "Accent",
  },
  font: {
    serif: "Police des titres",
    sans: "Police du corps",
  },
  home: {
    description: "Section d'introduction + grille de projets. Trois variantes disponibles.",
    heroHeadline: "Titre d'accueil",
    heroIntro: "Paragraphe d'introduction",
    variant: "Disposition de la grille",
    variantStaggered: "Décalée (rythme alterné)",
    variantMasonry: "Masonry (asymétrique)",
    variantStandard: "Standard (grille uniforme)",
    cardLimit: "Nombre maximum de cartes",
    cardLimitHelp: "0 = afficher tous les projets publiés.",
    showFilters: "Afficher les filtres par catégorie",
    showFiltersHelp:
      "Les filtres sont générés depuis vos catégories. Vide tant qu'aucun projet n'est catégorisé.",
  },
  single: {
    description: "Page projet — hero + métadonnées + corps + annonce du suivant.",
    showHero: "Afficher l'image hero en pleine largeur",
    showNextProject: "Afficher l'annonce du projet suivant en bas",
    defaultServicesLabel: "Libellé Services",
    defaultYearLabel: "Libellé Année",
    defaultAwardsLabel: "Libellé Récompenses",
  },
  author: {
    description: "Composition de la page auteur / studio.",
    showExperience: "Afficher la liste Expérience choisie",
    showRecognition: "Afficher la liste Distinctions",
  },
  footer: {
    description: "Composition du pied de page.",
    copyright: "Ligne de copyright",
    copyrightHelp:
      "Vide retombe sur '© <année> <titre du site>. Tous droits réservés.'",
  },
  logo: {
    description:
      "Wordmark du header. Par défaut le titre du site en majuscules. Téléversez un logo pour remplacer le texte.",
    wordmark: "Texte du wordmark",
    wordmarkHelp: "Vide retombe sur le titre du site en majuscules.",
    upload: "Téléverser un logo",
    replace: "Remplacer le logo",
    remove: "Supprimer le logo",
  },
};

export const fr = {
  title: "Réglages du thème",
  settings: settingsFr,
  publicBaked: publicBakedFr,
  blocks: blocksFr,
};

// Other locales: alias to English for now — typed translations land
// in a later batch. Better than missing keys.
export const de = en;
export const es = en;
export const nl = en;
export const pt = en;
export const ko = en;
