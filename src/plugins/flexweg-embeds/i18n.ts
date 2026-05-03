// Translations bundled with the plugin. Loaded into the
// "flexweg-embeds" i18next namespace at module import time (see
// src/plugins/index.ts → loadPluginTranslations). Plugin UI calls
// useTranslation("flexweg-embeds") to scope its keys; the editor's
// inserter resolves block titles via the manifest's `namespace` field.

export const en = {
  category: "Embeds",
  inspector: {
    urlLabel: "URL",
    urlPlaceholder: "Paste the URL",
    invalidUrl: "URL not recognised — double-check it matches the provider.",
    replaceUrl: "Change URL",
    emptyHint: "Paste a URL to load the embed.",
  },
  youtube: {
    title: "YouTube",
    hint: "https://www.youtube.com/watch?v=…",
  },
  vimeo: {
    title: "Vimeo",
    hint: "https://vimeo.com/12345",
  },
  twitter: {
    title: "Tweet (X)",
    hint: "https://x.com/<user>/status/…",
  },
  spotify: {
    title: "Spotify",
    hint: "https://open.spotify.com/track/…",
  },
};

export const fr: typeof en = {
  category: "Intégrations",
  inspector: {
    urlLabel: "URL",
    urlPlaceholder: "Collez l'URL",
    invalidUrl: "URL non reconnue — vérifiez qu'elle correspond au fournisseur.",
    replaceUrl: "Changer l'URL",
    emptyHint: "Collez une URL pour charger l'intégration.",
  },
  youtube: {
    title: "YouTube",
    hint: "https://www.youtube.com/watch?v=…",
  },
  vimeo: {
    title: "Vimeo",
    hint: "https://vimeo.com/12345",
  },
  twitter: {
    title: "Tweet (X)",
    hint: "https://x.com/<user>/status/…",
  },
  spotify: {
    title: "Spotify",
    hint: "https://open.spotify.com/track/…",
  },
};
