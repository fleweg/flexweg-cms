// Bundled translations for the flexweg-rss plugin. Loaded into a
// dedicated i18next namespace named "flexweg-rss" by the plugin loader,
// so the settings page calls useTranslation("flexweg-rss") and uses these
// short keys without colliding with the global admin keys.

export const en = {
  title: "RSS feeds",
  description:
    "Generates an RSS 2.0 feed at /rss.xml plus optional per-category feeds. Each feed can be added to the site footer.",
  regenerationTarget: {
    label: "RSS feeds",
    description: "Site feed + per-category feeds + XSL stylesheet + footer menu refresh",
  },
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
  regenerationTarget: {
    label: "Flux RSS",
    description: "Flux site + flux par catégorie + feuille XSL + rafraîchissement du menu pied de page",
  },
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

export const de: typeof en = {
  title: "RSS-Feeds",
  description:
    "Erzeugt einen RSS-2.0-Feed unter /rss.xml sowie optionale Feeds pro Kategorie. Jeder Feed kann zur Fußzeile der Website hinzugefügt werden.",
  regenerationTarget: {
    label: "RSS-Feeds",
    description: "Site-Feed + Kategorie-Feeds + XSL-Stylesheet + Footer-Menü-Refresh",
  },
  sections: {
    site: "Website-Feed",
    categoryFeeds: "Kategorie-Feeds",
    actions: "Aktionen",
  },
  site: {
    enabled: "/rss.xml erzeugen",
    enabledHelp:
      "Wenn aktiviert, wird im Stammverzeichnis der Website eine RSS-Datei mit den neuesten Online-Artikeln veröffentlicht.",
    itemCount: "Einträge im Feed",
    itemCountHelp: "Anzahl der jüngsten Artikel, die einbezogen werden (1–100).",
    excluded: "Ausgeschlossene Kategorien",
    excludedHelp:
      "Artikel in markierten Kategorien werden vom Website-Feed übersprungen. Leer lassen, um alle einzubeziehen.",
    addToFooter: "In Fußzeile anzeigen",
  },
  category: {
    addLabel: "Einen Kategorie-Feed hinzufügen",
    placeholder: "Kategorie suchen…",
    add: "Hinzufügen",
    itemCount: "Einträge",
    addToFooter: "In Fußzeile anzeigen",
    remove: "Entfernen",
    pathHint: "Veröffentlicht unter /{{path}}",
    none: "Noch keine Kategorie-Feeds.",
  },
  actions: {
    save: "Einstellungen speichern",
    saving: "Speichert…",
    saved: "Einstellungen gespeichert.",
    uploadXsl: "Stylesheet hochladen",
    uploadingXsl: "Lädt hoch…",
    xslUploaded: "Stylesheet hochgeladen.",
    xslFailed: "Stylesheet-Upload fehlgeschlagen.",
    forceRegenerate: "Alle Feeds zwangsweise neu erzeugen",
    forceRegenerating: "Neu erzeugen…",
    regenerated: "Feeds neu erzeugt ({{count}} Dateien).",
    regenerateFailed: "Feed-Neuerzeugung fehlgeschlagen.",
  },
  footerLabels: {
    site: "RSS",
    category: "RSS — {{name}}",
  },
  baseUrlMissing:
    "Legen Sie die öffentliche Website-URL unter Einstellungen → Allgemein fest, bevor Sie Feeds neu erzeugen.",
};

export const es: typeof en = {
  title: "Feeds RSS",
  description:
    "Genera un feed RSS 2.0 en /rss.xml más feeds opcionales por categoría. Cada feed se puede añadir al pie del sitio.",
  regenerationTarget: {
    label: "Feeds RSS",
    description: "Feed del sitio + feeds por categoría + hoja XSL + actualización del menú del pie",
  },
  sections: {
    site: "Feed del sitio",
    categoryFeeds: "Feeds de categoría",
    actions: "Acciones",
  },
  site: {
    enabled: "Generar /rss.xml",
    enabledHelp:
      "Cuando está activado, se publica un archivo RSS en la raíz del sitio con las entradas más recientes en línea.",
    itemCount: "Elementos en el feed",
    itemCountHelp: "Número de entradas más recientes a incluir (1–100).",
    excluded: "Categorías excluidas",
    excludedHelp:
      "Las entradas de las categorías marcadas se omiten del feed del sitio. Déjalo vacío para incluir todo.",
    addToFooter: "Mostrar en el pie",
  },
  category: {
    addLabel: "Añadir un feed de categoría",
    placeholder: "Buscar una categoría…",
    add: "Añadir",
    itemCount: "Elementos",
    addToFooter: "Mostrar en el pie",
    remove: "Eliminar",
    pathHint: "Publicado en /{{path}}",
    none: "Aún no hay feeds de categoría.",
  },
  actions: {
    save: "Guardar ajustes",
    saving: "Guardando…",
    saved: "Ajustes guardados.",
    uploadXsl: "Subir hoja de estilo",
    uploadingXsl: "Subiendo…",
    xslUploaded: "Hoja de estilo subida.",
    xslFailed: "Error al subir la hoja de estilo.",
    forceRegenerate: "Forzar regeneración de todos los feeds",
    forceRegenerating: "Regenerando…",
    regenerated: "Feeds regenerados ({{count}} archivos).",
    regenerateFailed: "La regeneración de feeds falló.",
  },
  footerLabels: {
    site: "RSS",
    category: "RSS — {{name}}",
  },
  baseUrlMissing:
    "Define la URL pública del sitio en Ajustes → General antes de regenerar los feeds.",
};

export const nl: typeof en = {
  title: "RSS-feeds",
  description:
    "Genereert een RSS 2.0-feed op /rss.xml plus optionele feeds per categorie. Elke feed kan aan de footer van de site worden toegevoegd.",
  regenerationTarget: {
    label: "RSS-feeds",
    description: "Site-feed + categorie-feeds + XSL-stylesheet + footermenu-vernieuwing",
  },
  sections: {
    site: "Site-feed",
    categoryFeeds: "Categoriefeeds",
    actions: "Acties",
  },
  site: {
    enabled: "/rss.xml genereren",
    enabledHelp:
      "Wanneer ingeschakeld wordt op de root van de site een RSS-bestand gepubliceerd met de meest recente online berichten.",
    itemCount: "Items in feed",
    itemCountHelp: "Aantal meest recente berichten om op te nemen (1–100).",
    excluded: "Uitgesloten categorieën",
    excludedHelp:
      "Berichten in aangevinkte categorieën worden overgeslagen in de site-feed. Laat leeg om alles op te nemen.",
    addToFooter: "Tonen in footer",
  },
  category: {
    addLabel: "Een categoriefeed toevoegen",
    placeholder: "Een categorie zoeken…",
    add: "Toevoegen",
    itemCount: "Items",
    addToFooter: "Tonen in footer",
    remove: "Verwijderen",
    pathHint: "Gepubliceerd op /{{path}}",
    none: "Nog geen categoriefeeds.",
  },
  actions: {
    save: "Instellingen opslaan",
    saving: "Opslaan…",
    saved: "Instellingen opgeslagen.",
    uploadXsl: "Stylesheet uploaden",
    uploadingXsl: "Uploaden…",
    xslUploaded: "Stylesheet geüpload.",
    xslFailed: "Stylesheet-upload mislukt.",
    forceRegenerate: "Alle feeds geforceerd regenereren",
    forceRegenerating: "Regenereren…",
    regenerated: "Feeds geregenereerd ({{count}} bestanden).",
    regenerateFailed: "Feed-regeneratie mislukt.",
  },
  footerLabels: {
    site: "RSS",
    category: "RSS — {{name}}",
  },
  baseUrlMissing:
    "Stel de publieke site-URL in via Instellingen → Algemeen voordat je feeds regenereert.",
};

export const pt: typeof en = {
  title: "Feeds RSS",
  description:
    "Gera um feed RSS 2.0 em /rss.xml mais feeds opcionais por categoria. Cada feed pode ser adicionado ao rodapé do site.",
  regenerationTarget: {
    label: "Feeds RSS",
    description: "Feed do site + feeds por categoria + folha XSL + atualização do menu do rodapé",
  },
  sections: {
    site: "Feed do site",
    categoryFeeds: "Feeds de categoria",
    actions: "Ações",
  },
  site: {
    enabled: "Gerar /rss.xml",
    enabledHelp:
      "Quando ativo, é publicado um ficheiro RSS na raiz do site com os artigos online mais recentes.",
    itemCount: "Itens no feed",
    itemCountHelp: "Número de artigos mais recentes a incluir (1–100).",
    excluded: "Categorias excluídas",
    excludedHelp:
      "Os artigos das categorias marcadas são ignorados no feed do site. Deixa vazio para incluir tudo.",
    addToFooter: "Mostrar no rodapé",
  },
  category: {
    addLabel: "Adicionar um feed de categoria",
    placeholder: "Pesquisar uma categoria…",
    add: "Adicionar",
    itemCount: "Itens",
    addToFooter: "Mostrar no rodapé",
    remove: "Remover",
    pathHint: "Publicado em /{{path}}",
    none: "Ainda não há feeds de categoria.",
  },
  actions: {
    save: "Guardar definições",
    saving: "A guardar…",
    saved: "Definições guardadas.",
    uploadXsl: "Enviar folha de estilo",
    uploadingXsl: "A enviar…",
    xslUploaded: "Folha de estilo enviada.",
    xslFailed: "Falha ao enviar folha de estilo.",
    forceRegenerate: "Forçar regeneração de todos os feeds",
    forceRegenerating: "A regenerar…",
    regenerated: "Feeds regenerados ({{count}} ficheiros).",
    regenerateFailed: "Falha na regeneração de feeds.",
  },
  footerLabels: {
    site: "RSS",
    category: "RSS — {{name}}",
  },
  baseUrlMissing:
    "Define o URL público do site em Definições → Geral antes de regenerar feeds.",
};

export const ko: typeof en = {
  title: "RSS 피드",
  description:
    "/rss.xml에 RSS 2.0 피드와 선택적 카테고리별 피드를 생성합니다. 각 피드는 사이트 푸터에 추가할 수 있습니다.",
  regenerationTarget: {
    label: "RSS 피드",
    description: "사이트 피드 + 카테고리별 피드 + XSL 스타일시트 + 푸터 메뉴 새로고침",
  },
  sections: {
    site: "사이트 피드",
    categoryFeeds: "카테고리 피드",
    actions: "작업",
  },
  site: {
    enabled: "/rss.xml 생성",
    enabledHelp:
      "활성화하면 사이트 루트에 가장 최근의 온라인 게시물을 나열하는 RSS 파일이 게시됩니다.",
    itemCount: "피드 항목 수",
    itemCountHelp: "포함할 최신 게시물 수 (1–100).",
    excluded: "제외할 카테고리",
    excludedHelp:
      "체크된 카테고리의 게시물은 사이트 피드에서 제외됩니다. 모두 포함하려면 비워 두세요.",
    addToFooter: "푸터에 표시",
  },
  category: {
    addLabel: "카테고리 피드 추가",
    placeholder: "카테고리 검색…",
    add: "추가",
    itemCount: "항목 수",
    addToFooter: "푸터에 표시",
    remove: "제거",
    pathHint: "/{{path}}에 게시됨",
    none: "아직 카테고리 피드가 없습니다.",
  },
  actions: {
    save: "설정 저장",
    saving: "저장 중…",
    saved: "설정이 저장되었습니다.",
    uploadXsl: "스타일시트 업로드",
    uploadingXsl: "업로드 중…",
    xslUploaded: "스타일시트가 업로드되었습니다.",
    xslFailed: "스타일시트 업로드에 실패했습니다.",
    forceRegenerate: "모든 피드 강제 재생성",
    forceRegenerating: "재생성 중…",
    regenerated: "피드가 재생성되었습니다 ({{count}}개 파일).",
    regenerateFailed: "피드 재생성에 실패했습니다.",
  },
  footerLabels: {
    site: "RSS",
    category: "RSS — {{name}}",
  },
  baseUrlMissing:
    "피드를 재생성하기 전에 설정 → 일반에서 공개 사이트 URL을 설정하세요.",
};
