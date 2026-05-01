// Bundled translations for the flexweg-sitemaps plugin. Loaded into a
// dedicated i18next namespace named "flexweg-sitemaps" by the plugin
// loader, so the settings page can call useTranslation("flexweg-sitemaps")
// and use these short keys.

export const en = {
  title: "Sitemaps",
  description:
    "Generates sitemap-<year>.xml files, a sitemap-index.xml referencing them, an optional News sitemap, and a customizable robots.txt.",
  sections: {
    general: "General",
    robots: "robots.txt",
    actions: "Regeneration",
  },
  contentTypes: {
    label: "Content types in sitemaps",
    posts: "Posts only",
    postsPages: "Posts and pages",
  },
  news: {
    enabled: "Generate sitemap-news.xml",
    enabledHelp: "Enable to publish a Google News sitemap alongside the index.",
    windowDays: "News window (days)",
    windowDaysHelp:
      "Articles modified within this many days appear in sitemap-news.xml. Google recommends 2.",
  },
  robots: {
    label: "robots.txt content",
    help:
      "Leave empty to use a generated default that points to your sitemap-index.xml (and sitemap-news.xml when News is enabled).",
    resetDefault: "Insert default",
    saveAndRegenerate: "Save & regenerate robots.txt",
    saving: "Saving…",
    saved: "robots.txt saved and regenerated.",
  },
  saveSettings: "Save settings",
  saved: "Settings saved.",
  forceRegenerate: "Force regenerate sitemaps",
  forceRegenerating: "Regenerating…",
  regenerated: "Sitemaps regenerated.",
  regenerateFailed: "Sitemap regeneration failed.",
  baseUrlMissing:
    "Set the public site URL in Settings → General before regenerating sitemaps.",
  uploaded: "Uploaded {{count}} files.",
};

export const fr: typeof en = {
  title: "Sitemaps",
  description:
    "Génère les fichiers sitemap-<année>.xml, un sitemap-index.xml qui les référence, un sitemap News optionnel et un robots.txt personnalisable.",
  sections: {
    general: "Général",
    robots: "robots.txt",
    actions: "Régénération",
  },
  contentTypes: {
    label: "Types de contenu dans les sitemaps",
    posts: "Articles uniquement",
    postsPages: "Articles et pages",
  },
  news: {
    enabled: "Générer sitemap-news.xml",
    enabledHelp:
      "Activez pour publier un sitemap Google News à côté de l'index.",
    windowDays: "Fenêtre News (jours)",
    windowDaysHelp:
      "Les articles modifiés dans cet intervalle apparaissent dans sitemap-news.xml. Google recommande 2.",
  },
  robots: {
    label: "Contenu de robots.txt",
    help:
      "Laissez vide pour utiliser un robots.txt par défaut généré, qui pointe vers votre sitemap-index.xml (et sitemap-news.xml si News est activé).",
    resetDefault: "Insérer le défaut",
    saveAndRegenerate: "Enregistrer & régénérer robots.txt",
    saving: "Enregistrement…",
    saved: "robots.txt enregistré et régénéré.",
  },
  saveSettings: "Enregistrer les réglages",
  saved: "Réglages enregistrés.",
  forceRegenerate: "Forcer la régénération",
  forceRegenerating: "Régénération…",
  regenerated: "Sitemaps régénérés.",
  regenerateFailed: "Échec de la régénération des sitemaps.",
  baseUrlMissing:
    "Définissez l'URL publique du site dans Réglages → Général avant de régénérer les sitemaps.",
  uploaded: "{{count}} fichiers envoyés.",
};
