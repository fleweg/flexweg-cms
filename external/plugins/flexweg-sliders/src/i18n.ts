// i18n bundles for the four slider blocks. Loaded by the admin into a
// dedicated namespace `flexweg-sliders` — every component calls
// useTranslation("flexweg-sliders"). Keys mirror the runtime structure
// (title per block, inspector field labels, validation messages).
//
// English is the source of truth; other locales fall back to en via
// i18next's standard fallback chain when a key is missing.

const en = {
  blocks: {
    image: { title: "Image slider" },
    hero: { title: "Hero slider" },
    card: { title: "Card slider" },
    logo: { title: "Logo carousel" },
  },
  inspector: {
    slides: "Slides",
    addSlide: "Add slide",
    removeSlide: "Remove",
    moveUp: "Move up",
    moveDown: "Move down",
    duplicate: "Duplicate",
    pickImage: "Pick image",
    clearImage: "Clear",
    noImage: "No image",
    options: "Options",
    autoplay: "Autoplay",
    interval: "Interval (ms)",
    showDots: "Show dots",
    showArrows: "Show arrows",
    loop: "Loop",
    aspectRatio: "Aspect ratio",
    perView: "Slides per view",
    height: "Height",
    overlay: "Overlay",
    align: "Alignment",
    speed: "Speed",
    grayscale: "Grayscale",
    logoHeight: "Logo height (px)",
    fields: {
      alt: "Alt text",
      caption: "Caption",
      link: "Link URL",
      eyebrow: "Eyebrow",
      title: "Title",
      subtitle: "Subtitle",
      ctaLabel: "Button label",
      ctaHref: "Button URL",
      text: "Text",
      linkLabel: "Link label",
    },
  },
  options: {
    aspect: { "16/9": "16:9", "4/3": "4:3", "1/1": "1:1", "21/9": "21:9" },
    height: { short: "Short (50vh)", medium: "Medium (70vh)", tall: "Tall (100vh)" },
    overlay: { none: "None", light: "Light", dark: "Dark" },
    align: { left: "Left", center: "Center", right: "Right" },
    speed: { slow: "Slow", normal: "Normal", fast: "Fast" },
  },
  empty: {
    image: "Add at least one slide to display the image slider.",
    hero: "Add at least one slide to display the hero slider.",
    card: "Add at least one card to display the card slider.",
    logo: "Add at least one logo to display the carousel.",
  },
  preview: {
    counter: "{{n}} slide(s)",
    blockLabel: "{{kind}} — {{n}} slide(s)",
  },
};

const fr = {
  blocks: {
    image: { title: "Diaporama d'images" },
    hero: { title: "Diaporama hero" },
    card: { title: "Diaporama de cartes" },
    logo: { title: "Carrousel de logos" },
  },
  inspector: {
    slides: "Diapositives",
    addSlide: "Ajouter une diapositive",
    removeSlide: "Supprimer",
    moveUp: "Monter",
    moveDown: "Descendre",
    duplicate: "Dupliquer",
    pickImage: "Choisir une image",
    clearImage: "Effacer",
    noImage: "Aucune image",
    options: "Options",
    autoplay: "Lecture automatique",
    interval: "Intervalle (ms)",
    showDots: "Afficher les points",
    showArrows: "Afficher les flèches",
    loop: "Boucle",
    aspectRatio: "Format",
    perView: "Diapositives visibles",
    height: "Hauteur",
    overlay: "Voile",
    align: "Alignement",
    speed: "Vitesse",
    grayscale: "Niveaux de gris",
    logoHeight: "Hauteur des logos (px)",
    fields: {
      alt: "Texte alternatif",
      caption: "Légende",
      link: "URL du lien",
      eyebrow: "Surtitre",
      title: "Titre",
      subtitle: "Sous-titre",
      ctaLabel: "Texte du bouton",
      ctaHref: "URL du bouton",
      text: "Texte",
      linkLabel: "Libellé du lien",
    },
  },
  options: {
    aspect: { "16/9": "16:9", "4/3": "4:3", "1/1": "1:1", "21/9": "21:9" },
    height: { short: "Petite (50vh)", medium: "Moyenne (70vh)", tall: "Grande (100vh)" },
    overlay: { none: "Aucun", light: "Clair", dark: "Sombre" },
    align: { left: "Gauche", center: "Centré", right: "Droite" },
    speed: { slow: "Lente", normal: "Normale", fast: "Rapide" },
  },
  empty: {
    image: "Ajoutez au moins une diapositive pour afficher le diaporama.",
    hero: "Ajoutez au moins une diapositive pour afficher le hero.",
    card: "Ajoutez au moins une carte pour afficher le diaporama.",
    logo: "Ajoutez au moins un logo pour afficher le carrousel.",
  },
  preview: {
    counter: "{{n}} diapositive(s)",
    blockLabel: "{{kind}} — {{n}} diapositive(s)",
  },
};

// Other locales: shallow shells that inherit English via i18next
// fallback. Translators can fill them in incrementally without
// breaking the admin.
const de = en;
const es = en;
const nl = en;
const pt = en;
const ko = en;

export { en, fr, de, es, nl, pt, ko };
