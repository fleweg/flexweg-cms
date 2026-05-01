// Bundled translations for the flexweg-rss plugin. Loaded into a
// dedicated i18next namespace named "flexweg-rss" by the plugin loader,
// so the settings page calls useTranslation("flexweg-rss") and uses these
// short keys without colliding with the global admin keys.

export const en = {
  title: "RSS feeds",
  description:
    "Generates an RSS 2.0 feed at /rss.xml plus optional per-category feeds. Each feed can be added to the site footer.",
  sections: {
    site: "Site feed",
    categoryFeeds: "Category feeds",
    actions: "Actions",
  },
  site: {
    enabled: "Generate /rss.xml",
    enabledHelp:
      "When enabled, an RSS file is published at the site root listing the most recent online posts.",
    itemCount: "Items in feed",
    itemCountHelp: "Number of most-recent posts to include (1–100).",
    excluded: "Excluded categories",
    excludedHelp:
      "Posts in checked categories are skipped from the site feed. Leave empty to include everything.",
    addToFooter: "Show in footer",
  },
  category: {
    addLabel: "Add a category feed",
    placeholder: "Search a category…",
    add: "Add",
    itemCount: "Items",
    addToFooter: "Show in footer",
    remove: "Remove",
    pathHint: "Published at /{{path}}",
    none: "No category feeds yet.",
  },
  actions: {
    save: "Save settings",
    saving: "Saving…",
    saved: "Settings saved.",
    uploadXsl: "Upload stylesheet",
    uploadingXsl: "Uploading…",
    xslUploaded: "Stylesheet uploaded.",
    xslFailed: "Stylesheet upload failed.",
    forceRegenerate: "Force regenerate all feeds",
    forceRegenerating: "Regenerating…",
    regenerated: "Feeds regenerated ({{count}} files).",
    regenerateFailed: "Feed regeneration failed.",
  },
  footerLabels: {
    site: "RSS",
    // Used as "RSS — <category>"; rendered with `name` interpolated.
    category: "RSS — {{name}}",
  },
  baseUrlMissing:
    "Set the public site URL in Settings → General before regenerating feeds.",
};

export const fr: typeof en = {
  title: "Flux RSS",
  description:
    "Génère un flux RSS 2.0 à /rss.xml ainsi que des flux par catégorie optionnels. Chaque flux peut être ajouté au pied de page du site.",
  sections: {
    site: "Flux du site",
    categoryFeeds: "Flux par catégorie",
    actions: "Actions",
  },
  site: {
    enabled: "Générer /rss.xml",
    enabledHelp:
      "Quand activé, un fichier RSS est publié à la racine du site listant les derniers articles en ligne.",
    itemCount: "Éléments dans le flux",
    itemCountHelp: "Nombre d'articles récents à inclure (1–100).",
    excluded: "Catégories à exclure",
    excludedHelp:
      "Les articles des catégories cochées sont écartés du flux du site. Laissez vide pour tout inclure.",
    addToFooter: "Afficher dans le pied de page",
  },
  category: {
    addLabel: "Ajouter un flux de catégorie",
    placeholder: "Rechercher une catégorie…",
    add: "Ajouter",
    itemCount: "Éléments",
    addToFooter: "Afficher dans le pied de page",
    remove: "Retirer",
    pathHint: "Publié à /{{path}}",
    none: "Aucun flux de catégorie.",
  },
  actions: {
    save: "Enregistrer les réglages",
    saving: "Enregistrement…",
    saved: "Réglages enregistrés.",
    uploadXsl: "Envoyer la feuille de style",
    uploadingXsl: "Envoi…",
    xslUploaded: "Feuille de style envoyée.",
    xslFailed: "Échec de l'envoi de la feuille de style.",
    forceRegenerate: "Forcer la régénération",
    forceRegenerating: "Régénération…",
    regenerated: "Flux régénérés ({{count}} fichiers).",
    regenerateFailed: "Échec de la régénération.",
  },
  footerLabels: {
    site: "RSS",
    category: "RSS — {{name}}",
  },
  baseUrlMissing:
    "Définissez l'URL publique du site dans Réglages → Général avant de régénérer les flux.",
};
