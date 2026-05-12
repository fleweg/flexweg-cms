// Marketplace Core — translations. EN + FR fully implemented; the
// other locales alias to English so missing-key warnings stay quiet.

const en = {
  title: "Theme settings",
  settings: {
    description:
      "Marketplace Core — app-store style theme for listing your themes and plugins. Wide cards, soft shadows, big rounded corners.",
    tabs: {
      home: "Home",
      single: "Product page",
      sidebar: "Sidebar",
      footer: "Footer",
      style: "Style & branding",
    },
    buttons: {
      save: "Save & apply",
      saving: "Saving…",
      saved: "Saved",
    },
  },
  publicBaked: {
    free: "Free",
    download: "Download",
    livePreview: "Live Preview",
    description: "Description",
    specifications: "Specifications",
    keyFeatures: "Key Features",
    nav: {
      home: "Home",
      themes: "Themes",
      plugins: "Plugins",
      authors: "Authors",
    },
    seeAll: "See all",
    by: "by",
    notFound: "Page not found",
    backHome: "Back to home",
    home: "Home",
  },
  blocks: {
    headerButtons: { title: "Download / Preview buttons", untitled: "(no URLs)" },
    gallery: { title: "Screenshot gallery", count: "{{n}} images" },
    specs: { title: "Specifications table", untitled: "Empty specs" },
    features: { title: "Key features bento", count: "{{n}} features" },
  },
};

const fr = {
  title: "Réglages du thème",
  settings: {
    description:
      "Marketplace Core — thème app-store pour répertorier vos thèmes et plugins. Cartes larges, ombres douces, coins arrondis XL.",
    tabs: {
      home: "Accueil",
      single: "Page produit",
      sidebar: "Sidebar",
      footer: "Pied de page",
      style: "Style & branding",
    },
    buttons: {
      save: "Enregistrer et appliquer",
      saving: "Enregistrement…",
      saved: "Enregistré",
    },
  },
  publicBaked: {
    free: "Gratuit",
    download: "Télécharger",
    livePreview: "Démo en ligne",
    description: "Description",
    specifications: "Spécifications",
    keyFeatures: "Fonctionnalités clés",
    nav: {
      home: "Accueil",
      themes: "Thèmes",
      plugins: "Plugins",
      authors: "Auteurs",
    },
    seeAll: "Voir tout",
    by: "par",
    notFound: "Page introuvable",
    backHome: "Retour à l'accueil",
    home: "Accueil",
  },
  blocks: {
    headerButtons: { title: "Boutons Télécharger / Démo", untitled: "(aucune URL)" },
    gallery: { title: "Galerie captures d'écran", count: "{{n}} images" },
    specs: { title: "Tableau de spécifications", untitled: "Vide" },
    features: { title: "Fonctionnalités clés", count: "{{n}} fonctionnalités" },
  },
};

export { en, fr };
export const de = en;
export const es = en;
export const nl = en;
export const pt = en;
export const ko = en;
