// Translation bundles for flexweg-search. Two consumers:
//
//   1. The admin UI (settings page) — looks up keys from this namespace
//      via `useTranslation("flexweg-search")`.
//
//   2. The published `/search-index.json` — the generator picks the
//      `runtime.*` strings for the public-site locale (resolved through
//      `pickPublicLocale(settings.language)`) and bakes them into the
//      JSON's `meta` block, so the runtime JS displays user-language
//      strings without needing an i18n library on the public side.

export const en = {
  title: "Search",
  description:
    "Builds a public search-index.json over your posts (and optionally pages) and ships a runtime that opens a search modal anywhere a [data-cms-search] trigger appears in your theme.",
  tabs: {
    index: "Index",
    behavior: "Behavior",
  },
  index: {
    title: "What to index",
    indexExcerpt: "Excerpts",
    indexExcerptHelp:
      "When the post has no excerpt, we fall back to the first 200 characters of the body.",
    indexCategory: "Category names",
    indexTags: "Tag names",
    includePages: "Include static pages",
    excludedTerms: "Excluded categories",
    excludedTermsHelp:
      "Posts whose primary category is selected here are skipped at indexing time.",
    none: "None",
  },
  behavior: {
    title: "Runtime behavior",
    minQueryLength: "Minimum query length",
    minQueryLengthHelp: "Below this number of characters, the modal shows nothing.",
    maxResults: "Maximum results",
    maxResultsHelp: "Hard cap on the number of results displayed at once.",
  },
  status: {
    notIndexed: "Not indexed yet",
    lastIndexed: "Last indexed: {{date}}",
    items: "{{count}} item",
    items_plural: "{{count}} items",
  },
  actions: {
    save: "Save",
    saving: "Saving…",
    saved: "Saved.",
    forceRegenerate: "Force regenerate",
    regenerating: "Regenerating…",
    regenerated: "Search index regenerated.",
    failed: "Save failed.",
  },
  baseUrlMissing:
    "Site URL is empty in Settings → General. Search files cannot be uploaded until that's set.",
  // Strings baked into search-index.json's `meta` block. The runtime JS
  // reads them verbatim — no i18n library on the public side.
  runtime: {
    placeholder: "Search…",
    close: "Close",
    noResults: "No results",
    dialogLabel: "Search",
  },
};

export const fr: typeof en = {
  title: "Recherche",
  description:
    "Génère un fichier search-index.json public à partir de vos articles (et optionnellement pages) et installe un runtime qui ouvre une modale de recherche partout où un déclencheur [data-cms-search] est présent dans votre thème.",
  tabs: {
    index: "Index",
    behavior: "Comportement",
  },
  index: {
    title: "Ce qui est indexé",
    indexExcerpt: "Extraits",
    indexExcerptHelp:
      "Si l'article n'a pas d'extrait, on retombe sur les 200 premiers caractères du corps.",
    indexCategory: "Noms des catégories",
    indexTags: "Noms des tags",
    includePages: "Inclure les pages statiques",
    excludedTerms: "Catégories exclues",
    excludedTermsHelp:
      "Les articles dont la catégorie principale est cochée ici sont ignorés à l'indexation.",
    none: "Aucune",
  },
  behavior: {
    title: "Comportement runtime",
    minQueryLength: "Longueur minimale de requête",
    minQueryLengthHelp: "En dessous de ce nombre de caractères, la modale n'affiche rien.",
    maxResults: "Nombre maximum de résultats",
    maxResultsHelp: "Plafond du nombre de résultats affichés simultanément.",
  },
  status: {
    notIndexed: "Pas encore indexé",
    lastIndexed: "Dernière indexation : {{date}}",
    items: "{{count}} élément",
    items_plural: "{{count}} éléments",
  },
  actions: {
    save: "Enregistrer",
    saving: "Enregistrement…",
    saved: "Enregistré.",
    forceRegenerate: "Régénérer manuellement",
    regenerating: "Régénération…",
    regenerated: "Index de recherche régénéré.",
    failed: "Échec de l'enregistrement.",
  },
  baseUrlMissing:
    "L'URL du site est vide dans Réglages → Général. Les fichiers de recherche ne peuvent pas être uploadés tant qu'elle n'est pas renseignée.",
  runtime: {
    placeholder: "Rechercher…",
    close: "Fermer",
    noResults: "Aucun résultat",
    dialogLabel: "Recherche",
  },
};

export const de: typeof en = {
  title: "Suche",
  description:
    "Erstellt eine öffentliche search-index.json über Ihre Beiträge (und optional Seiten) und liefert eine Laufzeit, die ein Suchfenster überall dort öffnet, wo ein [data-cms-search]-Trigger im Theme vorhanden ist.",
  tabs: {
    index: "Index",
    behavior: "Verhalten",
  },
  index: {
    title: "Was indexiert wird",
    indexExcerpt: "Auszüge",
    indexExcerptHelp:
      "Wenn der Beitrag keinen Auszug hat, verwenden wir die ersten 200 Zeichen des Inhalts.",
    indexCategory: "Kategorienamen",
    indexTags: "Tag-Namen",
    includePages: "Statische Seiten einbeziehen",
    excludedTerms: "Ausgeschlossene Kategorien",
    excludedTermsHelp:
      "Beiträge, deren Hauptkategorie hier ausgewählt ist, werden bei der Indexierung übersprungen.",
    none: "Keine",
  },
  behavior: {
    title: "Laufzeitverhalten",
    minQueryLength: "Mindestlänge der Anfrage",
    minQueryLengthHelp:
      "Unterhalb dieser Zeichenanzahl zeigt das Suchfenster nichts an.",
    maxResults: "Maximale Ergebnisse",
    maxResultsHelp: "Hartes Limit für die Anzahl der gleichzeitig angezeigten Ergebnisse.",
  },
  status: {
    notIndexed: "Noch nicht indexiert",
    lastIndexed: "Zuletzt indexiert: {{date}}",
    items: "{{count}} Element",
    items_plural: "{{count}} Elemente",
  },
  actions: {
    save: "Speichern",
    saving: "Speichern…",
    saved: "Gespeichert.",
    forceRegenerate: "Manuell neu generieren",
    regenerating: "Neu generieren…",
    regenerated: "Suchindex neu generiert.",
    failed: "Speichern fehlgeschlagen.",
  },
  baseUrlMissing:
    "Die Website-URL ist in Einstellungen → Allgemein leer. Die Suchdateien können nicht hochgeladen werden, bis das eingetragen ist.",
  runtime: {
    placeholder: "Suchen…",
    close: "Schließen",
    noResults: "Keine Ergebnisse",
    dialogLabel: "Suche",
  },
};

export const es: typeof en = {
  title: "Búsqueda",
  description:
    "Genera un archivo público search-index.json sobre tus artículos (y opcionalmente páginas) y entrega un runtime que abre una modal de búsqueda en cualquier disparador [data-cms-search] presente en tu tema.",
  tabs: {
    index: "Índice",
    behavior: "Comportamiento",
  },
  index: {
    title: "Qué se indexa",
    indexExcerpt: "Extractos",
    indexExcerptHelp:
      "Si el artículo no tiene extracto, usamos los primeros 200 caracteres del cuerpo.",
    indexCategory: "Nombres de categorías",
    indexTags: "Nombres de etiquetas",
    includePages: "Incluir páginas estáticas",
    excludedTerms: "Categorías excluidas",
    excludedTermsHelp:
      "Los artículos cuya categoría principal esté seleccionada aquí se omiten en la indexación.",
    none: "Ninguna",
  },
  behavior: {
    title: "Comportamiento del runtime",
    minQueryLength: "Longitud mínima de consulta",
    minQueryLengthHelp:
      "Por debajo de esta cantidad de caracteres, la modal no muestra nada.",
    maxResults: "Resultados máximos",
    maxResultsHelp: "Límite estricto del número de resultados mostrados a la vez.",
  },
  status: {
    notIndexed: "Aún no indexado",
    lastIndexed: "Última indexación: {{date}}",
    items: "{{count}} elemento",
    items_plural: "{{count}} elementos",
  },
  actions: {
    save: "Guardar",
    saving: "Guardando…",
    saved: "Guardado.",
    forceRegenerate: "Regenerar manualmente",
    regenerating: "Regenerando…",
    regenerated: "Índice de búsqueda regenerado.",
    failed: "Error al guardar.",
  },
  baseUrlMissing:
    "La URL del sitio está vacía en Ajustes → General. Los archivos de búsqueda no se pueden subir hasta que se rellene.",
  runtime: {
    placeholder: "Buscar…",
    close: "Cerrar",
    noResults: "Sin resultados",
    dialogLabel: "Búsqueda",
  },
};

export const nl: typeof en = {
  title: "Zoeken",
  description:
    "Bouwt een openbare search-index.json over je berichten (en optioneel pagina's) en levert een runtime die een zoekvenster opent overal waar een [data-cms-search]-trigger in je thema staat.",
  tabs: {
    index: "Index",
    behavior: "Gedrag",
  },
  index: {
    title: "Wat geïndexeerd wordt",
    indexExcerpt: "Samenvattingen",
    indexExcerptHelp:
      "Als het bericht geen samenvatting heeft, vallen we terug op de eerste 200 tekens van de tekst.",
    indexCategory: "Categorienamen",
    indexTags: "Tag-namen",
    includePages: "Statische pagina's meenemen",
    excludedTerms: "Uitgesloten categorieën",
    excludedTermsHelp:
      "Berichten waarvan de hoofdcategorie hier is geselecteerd, worden overgeslagen bij het indexeren.",
    none: "Geen",
  },
  behavior: {
    title: "Runtime-gedrag",
    minQueryLength: "Minimale lengte zoekterm",
    minQueryLengthHelp:
      "Onder dit aantal tekens toont het zoekvenster niets.",
    maxResults: "Maximaal aantal resultaten",
    maxResultsHelp: "Harde limiet op het aantal gelijktijdig getoonde resultaten.",
  },
  status: {
    notIndexed: "Nog niet geïndexeerd",
    lastIndexed: "Laatst geïndexeerd: {{date}}",
    items: "{{count}} item",
    items_plural: "{{count}} items",
  },
  actions: {
    save: "Opslaan",
    saving: "Opslaan…",
    saved: "Opgeslagen.",
    forceRegenerate: "Handmatig regenereren",
    regenerating: "Regenereren…",
    regenerated: "Zoekindex geregenereerd.",
    failed: "Opslaan mislukt.",
  },
  baseUrlMissing:
    "De site-URL is leeg in Instellingen → Algemeen. Zoekbestanden kunnen pas worden geüpload als die ingevuld is.",
  runtime: {
    placeholder: "Zoeken…",
    close: "Sluiten",
    noResults: "Geen resultaten",
    dialogLabel: "Zoeken",
  },
};

export const pt: typeof en = {
  title: "Pesquisa",
  description:
    "Gera um arquivo público search-index.json sobre seus posts (e opcionalmente páginas) e entrega um runtime que abre um modal de pesquisa em qualquer gatilho [data-cms-search] do seu tema.",
  tabs: {
    index: "Índice",
    behavior: "Comportamento",
  },
  index: {
    title: "O que é indexado",
    indexExcerpt: "Resumos",
    indexExcerptHelp:
      "Se o post não tem resumo, usamos os primeiros 200 caracteres do conteúdo.",
    indexCategory: "Nomes das categorias",
    indexTags: "Nomes das tags",
    includePages: "Incluir páginas estáticas",
    excludedTerms: "Categorias excluídas",
    excludedTermsHelp:
      "Posts cuja categoria principal esteja selecionada aqui são ignorados na indexação.",
    none: "Nenhuma",
  },
  behavior: {
    title: "Comportamento de runtime",
    minQueryLength: "Comprimento mínimo da consulta",
    minQueryLengthHelp:
      "Abaixo deste número de caracteres, o modal não mostra nada.",
    maxResults: "Resultados máximos",
    maxResultsHelp:
      "Limite rígido do número de resultados exibidos por vez.",
  },
  status: {
    notIndexed: "Ainda não indexado",
    lastIndexed: "Última indexação: {{date}}",
    items: "{{count}} item",
    items_plural: "{{count}} itens",
  },
  actions: {
    save: "Salvar",
    saving: "Salvando…",
    saved: "Salvo.",
    forceRegenerate: "Regenerar manualmente",
    regenerating: "Regenerando…",
    regenerated: "Índice de pesquisa regenerado.",
    failed: "Falha ao salvar.",
  },
  baseUrlMissing:
    "A URL do site está vazia em Configurações → Geral. Os arquivos de pesquisa não podem ser enviados até que ela esteja preenchida.",
  runtime: {
    placeholder: "Pesquisar…",
    close: "Fechar",
    noResults: "Sem resultados",
    dialogLabel: "Pesquisa",
  },
};

export const ko: typeof en = {
  title: "검색",
  description:
    "게시물(선택적으로 페이지 포함)에 대한 공개 search-index.json을 빌드하고 테마의 [data-cms-search] 트리거가 있는 곳에서 검색 모달을 여는 런타임을 제공합니다.",
  tabs: {
    index: "인덱스",
    behavior: "동작",
  },
  index: {
    title: "인덱싱 대상",
    indexExcerpt: "요약",
    indexExcerptHelp:
      "게시물에 요약이 없으면 본문의 첫 200자를 사용합니다.",
    indexCategory: "카테고리 이름",
    indexTags: "태그 이름",
    includePages: "정적 페이지 포함",
    excludedTerms: "제외할 카테고리",
    excludedTermsHelp:
      "기본 카테고리가 여기에서 선택된 게시물은 인덱싱 시 건너뜁니다.",
    none: "없음",
  },
  behavior: {
    title: "런타임 동작",
    minQueryLength: "최소 쿼리 길이",
    minQueryLengthHelp:
      "이 글자 수 미만이면 모달이 아무것도 표시하지 않습니다.",
    maxResults: "최대 결과 수",
    maxResultsHelp: "한 번에 표시되는 결과 수의 절대 상한.",
  },
  status: {
    notIndexed: "아직 인덱싱되지 않음",
    lastIndexed: "마지막 인덱싱: {{date}}",
    items: "{{count}}개 항목",
    items_plural: "{{count}}개 항목",
  },
  actions: {
    save: "저장",
    saving: "저장 중…",
    saved: "저장됨.",
    forceRegenerate: "수동으로 재생성",
    regenerating: "재생성 중…",
    regenerated: "검색 인덱스가 재생성되었습니다.",
    failed: "저장 실패.",
  },
  baseUrlMissing:
    "설정 → 일반에서 사이트 URL이 비어 있습니다. URL이 설정될 때까지 검색 파일을 업로드할 수 없습니다.",
  runtime: {
    placeholder: "검색…",
    close: "닫기",
    noResults: "결과 없음",
    dialogLabel: "검색",
  },
};
