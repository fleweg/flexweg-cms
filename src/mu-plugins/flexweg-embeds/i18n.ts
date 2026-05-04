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
  youtube: { title: "YouTube", hint: "https://www.youtube.com/watch?v=…" },
  vimeo: { title: "Vimeo", hint: "https://vimeo.com/12345" },
  twitter: { title: "Tweet (X)", hint: "https://x.com/<user>/status/…" },
  spotify: { title: "Spotify", hint: "https://open.spotify.com/track/…" },
};

export const de: typeof en = {
  category: "Einbettungen",
  inspector: {
    urlLabel: "URL",
    urlPlaceholder: "URL einfügen",
    invalidUrl: "URL nicht erkannt — prüfen Sie, ob sie zum Anbieter passt.",
    replaceUrl: "URL ändern",
    emptyHint: "URL einfügen, um die Einbettung zu laden.",
  },
  youtube: { title: "YouTube", hint: "https://www.youtube.com/watch?v=…" },
  vimeo: { title: "Vimeo", hint: "https://vimeo.com/12345" },
  twitter: { title: "Tweet (X)", hint: "https://x.com/<user>/status/…" },
  spotify: { title: "Spotify", hint: "https://open.spotify.com/track/…" },
};

export const es: typeof en = {
  category: "Incrustaciones",
  inspector: {
    urlLabel: "URL",
    urlPlaceholder: "Pega la URL",
    invalidUrl: "URL no reconocida — comprueba que coincide con el proveedor.",
    replaceUrl: "Cambiar URL",
    emptyHint: "Pega una URL para cargar la incrustación.",
  },
  youtube: { title: "YouTube", hint: "https://www.youtube.com/watch?v=…" },
  vimeo: { title: "Vimeo", hint: "https://vimeo.com/12345" },
  twitter: { title: "Tweet (X)", hint: "https://x.com/<user>/status/…" },
  spotify: { title: "Spotify", hint: "https://open.spotify.com/track/…" },
};

export const nl: typeof en = {
  category: "Insluitingen",
  inspector: {
    urlLabel: "URL",
    urlPlaceholder: "Plak de URL",
    invalidUrl: "URL niet herkend — controleer of deze bij de provider hoort.",
    replaceUrl: "URL wijzigen",
    emptyHint: "Plak een URL om de insluiting te laden.",
  },
  youtube: { title: "YouTube", hint: "https://www.youtube.com/watch?v=…" },
  vimeo: { title: "Vimeo", hint: "https://vimeo.com/12345" },
  twitter: { title: "Tweet (X)", hint: "https://x.com/<user>/status/…" },
  spotify: { title: "Spotify", hint: "https://open.spotify.com/track/…" },
};

export const pt: typeof en = {
  category: "Incorporações",
  inspector: {
    urlLabel: "URL",
    urlPlaceholder: "Cola o URL",
    invalidUrl: "URL não reconhecido — verifica se corresponde ao fornecedor.",
    replaceUrl: "Mudar URL",
    emptyHint: "Cola um URL para carregar a incorporação.",
  },
  youtube: { title: "YouTube", hint: "https://www.youtube.com/watch?v=…" },
  vimeo: { title: "Vimeo", hint: "https://vimeo.com/12345" },
  twitter: { title: "Tweet (X)", hint: "https://x.com/<user>/status/…" },
  spotify: { title: "Spotify", hint: "https://open.spotify.com/track/…" },
};

export const ko: typeof en = {
  category: "임베드",
  inspector: {
    urlLabel: "URL",
    urlPlaceholder: "URL을 붙여넣으세요",
    invalidUrl: "URL을 인식할 수 없습니다 — 제공업체와 일치하는지 확인하세요.",
    replaceUrl: "URL 변경",
    emptyHint: "URL을 붙여넣어 임베드를 불러오세요.",
  },
  youtube: { title: "YouTube", hint: "https://www.youtube.com/watch?v=…" },
  vimeo: { title: "Vimeo", hint: "https://vimeo.com/12345" },
  twitter: { title: "Tweet (X)", hint: "https://x.com/<user>/status/…" },
  spotify: { title: "Spotify", hint: "https://open.spotify.com/track/…" },
};
