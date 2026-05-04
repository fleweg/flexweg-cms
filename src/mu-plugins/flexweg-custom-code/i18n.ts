// Bundled translations for the flexweg-custom-code plugin. Loaded
// into a dedicated i18next namespace named "flexweg-custom-code"
// at module import time (see src/plugins/index.ts). Plugin UI calls
// useTranslation("flexweg-custom-code") to scope its keys.

export const en = {
  title: "Custom code",
  description:
    "Inject site-wide HTML / CSS / JS into the <head> or before the </body> of every published page.",
  warning:
    "Code is injected as-is on every page. No sanitisation — a broken <script> can take down the whole site until you fix it.",
  loadingEditor: "Loading code editor…",
  expand: "Expand",
  modalClose: "Close",
  head: {
    title: "Head",
    help:
      "Appended at the bottom of every page's <head>. Best for analytics, fonts, custom <style> overrides.",
    placeholder:
      "<!-- e.g. <script>...</script> for Google Analytics, <style>body{...}</style> for overrides -->",
  },
  body: {
    title: "Body end",
    help:
      "Appended just before </body>. Best for deferred scripts (chat widgets, late analytics) that need the DOM parsed.",
    placeholder:
      "<!-- e.g. <script>...</script> for a chat widget that needs the DOM ready -->",
  },
  save: "Save",
  saving: "Saving…",
  saved: "Custom code saved.",
  saveFailed: "Save failed.",
  republishHint:
    "Republish your posts and pages (Themes → Regenerate site) to push the new code to all already-online files.",
};

export const fr: typeof en = {
  title: "Code personnalisé",
  description:
    "Injectez du HTML / CSS / JS site-wide dans le <head> ou avant la fin du <body> de chaque page publiée.",
  warning:
    "Le code est injecté tel quel sur toutes les pages. Aucune sanitisation — un <script> cassé peut faire tomber tout le site jusqu'à correction.",
  loadingEditor: "Chargement de l'éditeur…",
  expand: "Agrandir",
  modalClose: "Fermer",
  head: {
    title: "Head",
    help:
      "Ajouté en bas du <head> de chaque page. Idéal pour les analytics, les fonts, les surcharges <style>.",
    placeholder:
      "<!-- ex. <script>...</script> pour Google Analytics, <style>body{...}</style> pour des surcharges -->",
  },
  body: {
    title: "Fin du body",
    help:
      "Ajouté juste avant </body>. Idéal pour les scripts différés (widgets chat, analytics tardifs) qui ont besoin du DOM parsé.",
    placeholder:
      "<!-- ex. <script>...</script> pour un widget chat qui a besoin du DOM prêt -->",
  },
  save: "Enregistrer",
  saving: "Enregistrement…",
  saved: "Code personnalisé enregistré.",
  saveFailed: "Échec de l'enregistrement.",
  republishHint:
    "Republiez vos articles et pages (Thèmes → Régénérer le site) pour pousser le nouveau code dans tous les fichiers déjà en ligne.",
};
