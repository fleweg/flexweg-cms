// Bundled translations for the default theme's settings page. Loaded
// into a dedicated i18next namespace named "theme-default" by the
// theme registry, so the settings page calls
// useTranslation("theme-default") to scope its keys.

export const en = {
  title: "Theme settings",
  description:
    "Customize the active theme. Tabs let you split settings by section as the catalog grows.",
  tabs: {
    general: "General",
  },
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
};

export const fr: typeof en = {
  title: "Réglages du thème",
  description:
    "Personnalisez le thème actif. Les onglets permettent de séparer les réglages par section au fur et à mesure que le catalogue grandit.",
  tabs: {
    general: "Général",
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
};
