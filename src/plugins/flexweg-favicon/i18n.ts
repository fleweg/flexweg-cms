// Bundled translations for the flexweg-favicon plugin. Loaded into a
// dedicated i18next namespace named "flexweg-favicon" by the plugin
// loader, so the settings page calls useTranslation("flexweg-favicon").

export const en = {
  title: "Favicons",
  description:
    "Upload one square image and the plugin generates every favicon variant (PNG, ICO, Apple touch, PWA manifest) and uploads them under /favicon/ on your public site. <link> tags are injected into every published page's <head>.",
  upload: {
    title: "Source image",
    help:
      "Upload a square image (recommended 512×512 or larger). PNG, JPG, WebP and SVG are accepted. Non-square images are center-cropped.",
    none: "No favicon set yet",
    pick: "Generate & upload",
    picking: "Generating & uploading…",
    change: "Replace favicon",
    invalidType: "Pick a JPG, PNG, WebP or SVG image.",
    success: "Favicon files uploaded. Reload published pages to see the change.",
    failed: "Favicon generation failed.",
    remove: "Remove all",
    removing: "Removing…",
    removed: "Favicon files removed.",
  },
  status: {
    title: "Generated files",
    enabled: "Active on the public site",
    disabled: "Not active",
    files: {
      ico: "favicon.ico (multi-size)",
      svg: "favicon.svg (vector)",
      png96: "favicon-96x96.png",
      apple: "apple-touch-icon.png (180×180)",
      manifest192: "web-app-manifest-192x192.png",
      manifest512: "web-app-manifest-512x512.png",
      manifest: "site.webmanifest (PWA)",
    },
  },
  pwa: {
    title: "PWA manifest",
    help:
      "Customizes how the site appears when installed as a Progressive Web App (Chrome/Android home-screen prompt). Saving here regenerates site.webmanifest only — no need to re-upload the source image.",
    name: "Application name",
    nameHelp: "Full name shown on the install prompt and the home screen.",
    shortName: "Short name",
    shortNameHelp: "Compact name shown under the icon (max ~12 characters).",
    themeColor: "Theme color",
    themeColorHelp: "Browser chrome color when the app launches.",
    backgroundColor: "Background color",
    backgroundColorHelp: "Splash screen background while the app loads.",
    display: "Display mode",
    displayStandalone: "Standalone (app-like, no browser UI)",
    displayBrowser: "Browser (regular tab)",
    displayFullscreen: "Fullscreen",
    displayMinimalUi: "Minimal UI",
    save: "Save & regenerate manifest",
    saving: "Regenerating…",
    saved: "Manifest regenerated.",
    failed: "Manifest regeneration failed.",
  },
};

export const fr: typeof en = {
  title: "Favicons",
  description:
    "Téléversez une image carrée et le plugin génère toutes les variantes (PNG, ICO, Apple touch, manifest PWA) puis les pousse dans /favicon/ sur votre site public. Les balises <link> sont injectées dans le <head> de chaque page publiée.",
  upload: {
    title: "Image source",
    help:
      "Téléversez une image carrée (512×512 minimum recommandé). Formats acceptés : PNG, JPG, WebP, SVG. Les images non carrées sont rognées au centre.",
    none: "Aucun favicon défini",
    pick: "Générer et téléverser",
    picking: "Génération et téléversement…",
    change: "Remplacer le favicon",
    invalidType: "Choisissez une image JPG, PNG, WebP ou SVG.",
    success: "Fichiers favicon téléversés. Rechargez les pages publiées pour voir le changement.",
    failed: "Échec de la génération des favicons.",
    remove: "Tout supprimer",
    removing: "Suppression…",
    removed: "Fichiers favicon supprimés.",
  },
  status: {
    title: "Fichiers générés",
    enabled: "Actif sur le site public",
    disabled: "Non actif",
    files: {
      ico: "favicon.ico (multi-tailles)",
      svg: "favicon.svg (vectoriel)",
      png96: "favicon-96x96.png",
      apple: "apple-touch-icon.png (180×180)",
      manifest192: "web-app-manifest-192x192.png",
      manifest512: "web-app-manifest-512x512.png",
      manifest: "site.webmanifest (PWA)",
    },
  },
  pwa: {
    title: "Manifest PWA",
    help:
      "Personnalise l'apparence du site quand il est installé en tant que Progressive Web App (proposition d'ajout à l'écran d'accueil sur Chrome / Android). Sauvegarder ici régénère uniquement site.webmanifest — pas besoin de re-téléverser l'image source.",
    name: "Nom de l'application",
    nameHelp: "Nom complet affiché lors de l'installation et sur l'écran d'accueil.",
    shortName: "Nom court",
    shortNameHelp: "Nom compact affiché sous l'icône (max ~12 caractères).",
    themeColor: "Couleur du thème",
    themeColorHelp: "Couleur du chrome navigateur quand l'application se lance.",
    backgroundColor: "Couleur d'arrière-plan",
    backgroundColorHelp: "Couleur du splash screen pendant le chargement.",
    display: "Mode d'affichage",
    displayStandalone: "Standalone (app native, sans UI navigateur)",
    displayBrowser: "Browser (onglet classique)",
    displayFullscreen: "Plein écran",
    displayMinimalUi: "UI minimale",
    save: "Enregistrer et régénérer le manifest",
    saving: "Régénération…",
    saved: "Manifest régénéré.",
    failed: "Échec de la régénération du manifest.",
  },
};
