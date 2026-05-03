// Bundled translations for the flexweg-blocks plugin. Loaded into a
// dedicated i18next namespace named "flexweg-blocks" at module
// import time (see src/plugins/index.ts). Plugin UI calls
// useTranslation("flexweg-blocks") to scope its keys.

export const en = {
  blocks: {
    columns: {
      title: "Columns",
      description: "Split into 2 to 4 side-by-side columns. Stacks on mobile.",
      cols: "Number of columns",
      colsHelp: "2 to 4 columns. Reducing the count removes the trailing columns and their content.",
    },
  },
};

export const fr: typeof en = {
  blocks: {
    columns: {
      title: "Colonnes",
      description: "Divise en 2 à 4 colonnes côte à côte. Empile sur mobile.",
      cols: "Nombre de colonnes",
      colsHelp:
        "2 à 4 colonnes. Réduire le nombre supprime les colonnes finales et leur contenu.",
    },
  },
};
