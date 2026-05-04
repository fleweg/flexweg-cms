// Translations for the flexweg-import plugin. Loaded into the
// "flexweg-import" namespace at module import (see
// src/plugins/index.ts → loadPluginTranslations).
//
// All strings here drive the admin UI; the plugin doesn't bake any
// public-facing text into the published site.

export const en = {
  title: "Import",
  description:
    "Imports posts and pages from markdown files (with YAML frontmatter) or WordPress XML exports. Auto-creates missing categories and tags, uploads referenced images, and rewrites image URLs in the body so the imported content works on its new home.",

  source: {
    label: "Source",
    folder: "Flexweg folder",
    folderHelp: "Files dropped into _cms-import/ on your Flexweg site.",
    drop: "Drag and drop",
    dropHelp: "Drop files directly here — nothing is uploaded until you confirm.",
  },

  folder: {
    notInitialized: "Import folder not initialised yet.",
    initialize: "Initialize import folder",
    initializing: "Initialising…",
    initialized: "Folder created at _cms-import/ — drop your files there.",
    initFailed: "Folder initialisation failed.",
    refresh: "Refresh listing",
    countLine: "{{md}} markdown, {{xml}} WordPress XML, {{img}} images",
    empty: "No files in _cms-import/ yet.",
  },

  drop: {
    title: "Drop .md, .xml, or images here",
    help: "Or click to pick files. Folders are walked recursively when supported.",
    countLine: "{{md}} markdown, {{xml}} WordPress XML, {{img}} images, {{ignored}} ignored",
    clear: "Clear",
  },

  scan: {
    button: "Scan",
    scanning: "Scanning…",
    failed: "Scan failed: {{error}}",
    noSources: "Drop or upload at least one .md or .xml file before scanning.",
  },

  summary: {
    title: "Dry-run summary",
    posts: "{{count}} posts to create",
    pages: "{{count}} pages to create",
    categoriesNew: "{{count}} new categories",
    categoriesHierarchy: "({{count}} with parents)",
    tagsNew: "{{count}} new tags",
    imagesLocal: "{{count}} local images to upload",
    imagesRemote: "{{count}} remote images to fetch + upload",
    warnings: "{{count}} warnings",
    errors: "{{count}} errors (will block import)",
    noEntries: "Nothing to import.",
    showDetails: "Show details",
    hideDetails: "Hide details",
    entryRow: "{{type}}: {{title}} → /{{slug}}",
    cycleWarning: "Hierarchy cycle resolved by flattening",
  },

  defaults: {
    title: "Defaults",
    statusMode: "Status mode",
    statusDraft: "Always import as draft",
    statusDraftHelp: "Safer — review imported posts in the admin before publishing.",
    statusFromSource: "Honor source status",
    statusFromSourceHelp:
      "Markdown frontmatter status: / WordPress <wp:status> publish → online, anything else → draft.",
    statusOnline: "Always publish",
    statusOnlineHelp:
      "Force every imported post online. Heavy — runs the full publish pipeline per item.",
    defaultCategory: "Default category",
    defaultCategoryHelp:
      "Used when an entry doesn't specify a category. Leave empty to import without category.",
    defaultCategoryNone: "(none)",
    moveProcessed: "Move processed files to processed-<timestamp>/ (folder mode only)",
    imageConcurrency: "Remote image fetch concurrency",
    imageConcurrencyHelp:
      "Max parallel fetches against the source WordPress site. Lower if the source is slow / rate-limited.",
    save: "Save defaults",
    saved: "Defaults saved.",
  },

  confirm: {
    button: "Confirm import",
    running: "Importing…",
    blockedByErrors: "Fix errors before importing.",
    success: "Imported {{posts}} posts, {{pages}} pages, {{terms}} terms, {{media}} media.",
    failed: "Import finished with errors. Check the log below.",
    summary: "Created posts: {{posts}} · Pages: {{pages}} · Terms: {{terms}} · Media: {{media}} · Published: {{published}}",
  },

  log: {
    title: "Activity",
    copy: "Copy log",
    copied: "Log copied to clipboard.",
    empty: "No activity yet.",
  },
};

export const fr: typeof en = {
  title: "Import",
  description:
    "Importe des articles et pages à partir de fichiers markdown (frontmatter YAML) ou d'exports WordPress XML. Crée les catégories et tags manquants, upload les images référencées, et réécrit les URLs d'images dans le contenu pour que tout fonctionne sur le nouveau site.",
  source: {
    label: "Source",
    folder: "Dossier Flexweg",
    folderHelp: "Fichiers déposés dans _cms-import/ sur votre site Flexweg.",
    drop: "Glisser-déposer",
    dropHelp: "Déposez des fichiers directement ici — rien n'est uploadé avant confirmation.",
  },
  folder: {
    notInitialized: "Dossier d'import non initialisé.",
    initialize: "Initialiser le dossier d'import",
    initializing: "Initialisation…",
    initialized: "Dossier créé à _cms-import/ — déposez-y vos fichiers.",
    initFailed: "Échec de l'initialisation du dossier.",
    refresh: "Rafraîchir la liste",
    countLine: "{{md}} markdown, {{xml}} WordPress XML, {{img}} images",
    empty: "Aucun fichier dans _cms-import/ pour l'instant.",
  },
  drop: {
    title: "Déposez .md, .xml ou images ici",
    help: "Ou cliquez pour sélectionner. Les dossiers sont parcourus récursivement si supporté.",
    countLine: "{{md}} markdown, {{xml}} WordPress XML, {{img}} images, {{ignored}} ignorés",
    clear: "Vider",
  },
  scan: {
    button: "Scanner",
    scanning: "Analyse…",
    failed: "Échec de l'analyse : {{error}}",
    noSources: "Déposez ou uploadez au moins un fichier .md ou .xml avant de scanner.",
  },
  summary: {
    title: "Aperçu du dry-run",
    posts: "{{count}} articles à créer",
    pages: "{{count}} pages à créer",
    categoriesNew: "{{count}} nouvelles catégories",
    categoriesHierarchy: "({{count}} avec parents)",
    tagsNew: "{{count}} nouveaux tags",
    imagesLocal: "{{count}} images locales à uploader",
    imagesRemote: "{{count}} images distantes à récupérer + uploader",
    warnings: "{{count}} avertissements",
    errors: "{{count}} erreurs (bloque l'import)",
    noEntries: "Rien à importer.",
    showDetails: "Voir les détails",
    hideDetails: "Cacher les détails",
    entryRow: "{{type}} : {{title}} → /{{slug}}",
    cycleWarning: "Cycle de hiérarchie résolu par aplatissement",
  },
  defaults: {
    title: "Réglages par défaut",
    statusMode: "Mode de statut",
    statusDraft: "Toujours importer en brouillon",
    statusDraftHelp: "Plus sûr — revoir les articles importés dans l'admin avant publication.",
    statusFromSource: "Respecter le statut source",
    statusFromSourceHelp:
      "Markdown frontmatter status: / WordPress <wp:status> publish → en ligne, sinon → brouillon.",
    statusOnline: "Tout publier",
    statusOnlineHelp:
      "Force chaque article importé à être publié. Lourd — exécute le pipeline complet par item.",
    defaultCategory: "Catégorie par défaut",
    defaultCategoryHelp:
      "Utilisée quand l'article ne précise pas de catégorie. Vide pour importer sans catégorie.",
    defaultCategoryNone: "(aucune)",
    moveProcessed: "Déplacer les fichiers traités vers processed-<timestamp>/ (mode dossier uniquement)",
    imageConcurrency: "Téléchargements images parallèles",
    imageConcurrencyHelp:
      "Maximum de fetchs parallèles contre le site WordPress source. Baissez si la source est lente / rate-limitée.",
    save: "Enregistrer les défauts",
    saved: "Défauts enregistrés.",
  },
  confirm: {
    button: "Confirmer l'import",
    running: "Import en cours…",
    blockedByErrors: "Corrigez les erreurs avant d'importer.",
    success: "Importé {{posts}} articles, {{pages}} pages, {{terms}} termes, {{media}} médias.",
    failed: "Import terminé avec des erreurs. Voir le log ci-dessous.",
    summary: "Articles créés : {{posts}} · Pages : {{pages}} · Termes : {{terms}} · Médias : {{media}} · Publiés : {{published}}",
  },
  log: {
    title: "Activité",
    copy: "Copier le log",
    copied: "Log copié dans le presse-papier.",
    empty: "Aucune activité pour l'instant.",
  },
};

export const de: typeof en = {
  title: "Import",
  description:
    "Importiert Artikel und Seiten aus Markdown-Dateien (mit YAML-Frontmatter) oder WordPress-XML-Exports. Erstellt fehlende Kategorien und Schlagwörter automatisch, lädt referenzierte Bilder hoch und schreibt Bild-URLs im Inhalt um, damit der importierte Inhalt am neuen Ort funktioniert.",
  source: {
    label: "Quelle",
    folder: "Flexweg-Ordner",
    folderHelp: "Dateien, die in _cms-import/ auf Ihrer Flexweg-Site abgelegt wurden.",
    drop: "Drag-and-Drop",
    dropHelp: "Dateien direkt hier ablegen — nichts wird vor der Bestätigung hochgeladen.",
  },
  folder: {
    notInitialized: "Import-Ordner noch nicht initialisiert.",
    initialize: "Import-Ordner initialisieren",
    initializing: "Wird initialisiert…",
    initialized: "Ordner unter _cms-import/ erstellt — legen Sie Ihre Dateien dort ab.",
    initFailed: "Initialisierung des Ordners fehlgeschlagen.",
    refresh: "Liste aktualisieren",
    countLine: "{{md}} Markdown, {{xml}} WordPress-XML, {{img}} Bilder",
    empty: "Noch keine Dateien in _cms-import/.",
  },
  drop: {
    title: ".md-, .xml- oder Bilddateien hier ablegen",
    help: "Oder klicken zum Auswählen. Ordner werden bei Unterstützung rekursiv durchsucht.",
    countLine: "{{md}} Markdown, {{xml}} WordPress-XML, {{img}} Bilder, {{ignored}} ignoriert",
    clear: "Leeren",
  },
  scan: {
    button: "Scannen",
    scanning: "Scannt…",
    failed: "Scan fehlgeschlagen: {{error}}",
    noSources: "Legen Sie mindestens eine .md- oder .xml-Datei ab, bevor Sie scannen.",
  },
  summary: {
    title: "Dry-Run-Übersicht",
    posts: "{{count}} Artikel zu erstellen",
    pages: "{{count}} Seiten zu erstellen",
    categoriesNew: "{{count}} neue Kategorien",
    categoriesHierarchy: "({{count}} mit Eltern)",
    tagsNew: "{{count}} neue Schlagwörter",
    imagesLocal: "{{count}} lokale Bilder hochzuladen",
    imagesRemote: "{{count}} entfernte Bilder zu holen + hochzuladen",
    warnings: "{{count}} Warnungen",
    errors: "{{count}} Fehler (blockiert Import)",
    noEntries: "Nichts zu importieren.",
    showDetails: "Details anzeigen",
    hideDetails: "Details ausblenden",
    entryRow: "{{type}}: {{title}} → /{{slug}}",
    cycleWarning: "Hierarchie-Zyklus durch Glätten aufgelöst",
  },
  defaults: {
    title: "Standardeinstellungen",
    statusMode: "Status-Modus",
    statusDraft: "Immer als Entwurf importieren",
    statusDraftHelp: "Sicherer — importierte Artikel im Admin prüfen, bevor sie veröffentlicht werden.",
    statusFromSource: "Quell-Status respektieren",
    statusFromSourceHelp:
      "Markdown-Frontmatter status: / WordPress <wp:status> publish → online, sonst → Entwurf.",
    statusOnline: "Alles veröffentlichen",
    statusOnlineHelp:
      "Erzwingt die Veröffentlichung jedes importierten Artikels. Aufwendig — führt die vollständige Veröffentlichungspipeline pro Element aus.",
    defaultCategory: "Standardkategorie",
    defaultCategoryHelp:
      "Wird verwendet, wenn ein Eintrag keine Kategorie angibt. Leer lassen, um ohne Kategorie zu importieren.",
    defaultCategoryNone: "(keine)",
    moveProcessed: "Verarbeitete Dateien nach processed-<timestamp>/ verschieben (nur Ordner-Modus)",
    imageConcurrency: "Parallele Bild-Downloads",
    imageConcurrencyHelp:
      "Maximale parallele Fetches gegen die Quell-WordPress-Site. Senken, wenn die Quelle langsam / rate-limited ist.",
    save: "Standards speichern",
    saved: "Standards gespeichert.",
  },
  confirm: {
    button: "Import bestätigen",
    running: "Import läuft…",
    blockedByErrors: "Beheben Sie Fehler vor dem Import.",
    success: "Importiert: {{posts}} Artikel, {{pages}} Seiten, {{terms}} Begriffe, {{media}} Medien.",
    failed: "Import mit Fehlern beendet. Siehe Log unten.",
    summary: "Erstellte Artikel: {{posts}} · Seiten: {{pages}} · Begriffe: {{terms}} · Medien: {{media}} · Veröffentlicht: {{published}}",
  },
  log: {
    title: "Aktivität",
    copy: "Log kopieren",
    copied: "Log in die Zwischenablage kopiert.",
    empty: "Noch keine Aktivität.",
  },
};

export const es: typeof en = {
  title: "Importar",
  description:
    "Importa entradas y páginas desde archivos markdown (con frontmatter YAML) o desde exports XML de WordPress. Crea automáticamente categorías y etiquetas que faltan, sube las imágenes referenciadas y reescribe las URLs de imágenes en el contenido para que el contenido importado funcione en su nuevo sitio.",
  source: {
    label: "Origen",
    folder: "Carpeta Flexweg",
    folderHelp: "Archivos depositados en _cms-import/ en tu sitio Flexweg.",
    drop: "Arrastrar y soltar",
    dropHelp: "Suelta archivos aquí — nada se sube antes de la confirmación.",
  },
  folder: {
    notInitialized: "Carpeta de importación no inicializada.",
    initialize: "Inicializar carpeta de importación",
    initializing: "Inicializando…",
    initialized: "Carpeta creada en _cms-import/ — deposita tus archivos allí.",
    initFailed: "Error al inicializar la carpeta.",
    refresh: "Refrescar listado",
    countLine: "{{md}} markdown, {{xml}} WordPress XML, {{img}} imágenes",
    empty: "Aún no hay archivos en _cms-import/.",
  },
  drop: {
    title: "Suelta .md, .xml o imágenes aquí",
    help: "O haz clic para elegir. Las carpetas se recorren recursivamente cuando es posible.",
    countLine: "{{md}} markdown, {{xml}} WordPress XML, {{img}} imágenes, {{ignored}} ignorados",
    clear: "Vaciar",
  },
  scan: {
    button: "Escanear",
    scanning: "Escaneando…",
    failed: "Error al escanear: {{error}}",
    noSources: "Deposita o sube al menos un archivo .md o .xml antes de escanear.",
  },
  summary: {
    title: "Resumen de simulación",
    posts: "{{count}} entradas a crear",
    pages: "{{count}} páginas a crear",
    categoriesNew: "{{count}} nuevas categorías",
    categoriesHierarchy: "({{count}} con padres)",
    tagsNew: "{{count}} nuevas etiquetas",
    imagesLocal: "{{count}} imágenes locales a subir",
    imagesRemote: "{{count}} imágenes remotas a buscar + subir",
    warnings: "{{count}} avisos",
    errors: "{{count}} errores (bloquea importación)",
    noEntries: "Nada que importar.",
    showDetails: "Ver detalles",
    hideDetails: "Ocultar detalles",
    entryRow: "{{type}}: {{title}} → /{{slug}}",
    cycleWarning: "Ciclo de jerarquía resuelto aplanando",
  },
  defaults: {
    title: "Predeterminados",
    statusMode: "Modo de estado",
    statusDraft: "Siempre importar como borrador",
    statusDraftHelp: "Más seguro — revisa las entradas en el admin antes de publicar.",
    statusFromSource: "Respetar estado del origen",
    statusFromSourceHelp:
      "Markdown frontmatter status: / WordPress <wp:status> publish → en línea, demás → borrador.",
    statusOnline: "Publicar todo",
    statusOnlineHelp:
      "Fuerza la publicación de cada entrada importada. Pesado — corre la pipeline de publicación completa por item.",
    defaultCategory: "Categoría por defecto",
    defaultCategoryHelp:
      "Se usa cuando una entrada no especifica categoría. Vacío para importar sin categoría.",
    defaultCategoryNone: "(ninguna)",
    moveProcessed: "Mover archivos procesados a processed-<timestamp>/ (solo modo carpeta)",
    imageConcurrency: "Concurrencia de descargas de imágenes",
    imageConcurrencyHelp:
      "Máximo de fetchs paralelos contra el sitio WordPress origen. Baja si la fuente es lenta / con límite de tasa.",
    save: "Guardar predeterminados",
    saved: "Predeterminados guardados.",
  },
  confirm: {
    button: "Confirmar importación",
    running: "Importando…",
    blockedByErrors: "Arregla los errores antes de importar.",
    success: "Importadas {{posts}} entradas, {{pages}} páginas, {{terms}} términos, {{media}} medios.",
    failed: "Importación terminada con errores. Ver el log abajo.",
    summary: "Entradas creadas: {{posts}} · Páginas: {{pages}} · Términos: {{terms}} · Medios: {{media}} · Publicadas: {{published}}",
  },
  log: {
    title: "Actividad",
    copy: "Copiar log",
    copied: "Log copiado al portapapeles.",
    empty: "Aún no hay actividad.",
  },
};

export const nl: typeof en = {
  title: "Import",
  description:
    "Importeert berichten en pagina's vanuit markdown-bestanden (met YAML-frontmatter) of WordPress-XML-exports. Maakt ontbrekende categorieën en tags automatisch aan, uploadt verwezen afbeeldingen en herschrijft afbeeldings-URL's in de inhoud zodat de geïmporteerde inhoud op de nieuwe locatie werkt.",
  source: {
    label: "Bron",
    folder: "Flexweg-map",
    folderHelp: "Bestanden geplaatst in _cms-import/ op je Flexweg-site.",
    drop: "Drag-and-drop",
    dropHelp: "Plaats bestanden hier — er wordt niets geüpload vóór bevestiging.",
  },
  folder: {
    notInitialized: "Importmap nog niet geïnitialiseerd.",
    initialize: "Importmap initialiseren",
    initializing: "Initialiseren…",
    initialized: "Map aangemaakt in _cms-import/ — plaats je bestanden daar.",
    initFailed: "Map-initialisatie mislukt.",
    refresh: "Lijst verversen",
    countLine: "{{md}} markdown, {{xml}} WordPress XML, {{img}} afbeeldingen",
    empty: "Nog geen bestanden in _cms-import/.",
  },
  drop: {
    title: "Plaats hier .md, .xml of afbeeldingen",
    help: "Of klik om te kiezen. Mappen worden recursief doorlopen waar ondersteund.",
    countLine: "{{md}} markdown, {{xml}} WordPress XML, {{img}} afbeeldingen, {{ignored}} genegeerd",
    clear: "Leegmaken",
  },
  scan: {
    button: "Scannen",
    scanning: "Scannen…",
    failed: "Scannen mislukt: {{error}}",
    noSources: "Plaats of upload minstens één .md- of .xml-bestand voordat je scant.",
  },
  summary: {
    title: "Dry-run overzicht",
    posts: "{{count}} berichten aan te maken",
    pages: "{{count}} pagina's aan te maken",
    categoriesNew: "{{count}} nieuwe categorieën",
    categoriesHierarchy: "({{count}} met ouders)",
    tagsNew: "{{count}} nieuwe tags",
    imagesLocal: "{{count}} lokale afbeeldingen om te uploaden",
    imagesRemote: "{{count}} externe afbeeldingen om op te halen + te uploaden",
    warnings: "{{count}} waarschuwingen",
    errors: "{{count}} fouten (blokkeert import)",
    noEntries: "Niets te importeren.",
    showDetails: "Details tonen",
    hideDetails: "Details verbergen",
    entryRow: "{{type}}: {{title}} → /{{slug}}",
    cycleWarning: "Hiërarchiecyclus opgelost door af te platten",
  },
  defaults: {
    title: "Standaardinstellingen",
    statusMode: "Statusmodus",
    statusDraft: "Altijd als concept importeren",
    statusDraftHelp: "Veiliger — controleer geïmporteerde berichten in de admin voordat je publiceert.",
    statusFromSource: "Bronstatus respecteren",
    statusFromSourceHelp:
      "Markdown frontmatter status: / WordPress <wp:status> publish → online, anders → concept.",
    statusOnline: "Alles publiceren",
    statusOnlineHelp:
      "Forceert publicatie van elk geïmporteerd bericht. Zwaar — draait de volledige publicatiepijplijn per item.",
    defaultCategory: "Standaardcategorie",
    defaultCategoryHelp:
      "Wordt gebruikt wanneer een item geen categorie opgeeft. Leeg om zonder categorie te importeren.",
    defaultCategoryNone: "(geen)",
    moveProcessed: "Verwerkte bestanden naar processed-<timestamp>/ verplaatsen (alleen mapmodus)",
    imageConcurrency: "Parallelle afbeeldings-downloads",
    imageConcurrencyHelp:
      "Maximaal parallel fetches naar de bron-WordPress-site. Verlaag als de bron traag / rate-limited is.",
    save: "Standaarden opslaan",
    saved: "Standaarden opgeslagen.",
  },
  confirm: {
    button: "Import bevestigen",
    running: "Importeren…",
    blockedByErrors: "Los fouten op vóór het importeren.",
    success: "Geïmporteerd: {{posts}} berichten, {{pages}} pagina's, {{terms}} termen, {{media}} media.",
    failed: "Import met fouten voltooid. Zie het log hieronder.",
    summary: "Aangemaakte berichten: {{posts}} · Pagina's: {{pages}} · Termen: {{terms}} · Media: {{media}} · Gepubliceerd: {{published}}",
  },
  log: {
    title: "Activiteit",
    copy: "Log kopiëren",
    copied: "Log naar klembord gekopieerd.",
    empty: "Nog geen activiteit.",
  },
};

export const pt: typeof en = {
  title: "Importar",
  description:
    "Importa artigos e páginas a partir de ficheiros markdown (com frontmatter YAML) ou exports XML do WordPress. Cria automaticamente categorias e etiquetas em falta, envia as imagens referenciadas e reescreve URLs de imagens no conteúdo para que o conteúdo importado funcione no seu novo destino.",
  source: {
    label: "Origem",
    folder: "Pasta Flexweg",
    folderHelp: "Ficheiros colocados em _cms-import/ no teu site Flexweg.",
    drop: "Arrastar e largar",
    dropHelp: "Larga ficheiros aqui — nada é enviado antes da confirmação.",
  },
  folder: {
    notInitialized: "Pasta de importação ainda não inicializada.",
    initialize: "Inicializar pasta de importação",
    initializing: "A inicializar…",
    initialized: "Pasta criada em _cms-import/ — coloca aí os teus ficheiros.",
    initFailed: "Falha ao inicializar a pasta.",
    refresh: "Atualizar listagem",
    countLine: "{{md}} markdown, {{xml}} WordPress XML, {{img}} imagens",
    empty: "Ainda sem ficheiros em _cms-import/.",
  },
  drop: {
    title: "Larga .md, .xml ou imagens aqui",
    help: "Ou clica para escolher. Pastas são percorridas recursivamente quando suportado.",
    countLine: "{{md}} markdown, {{xml}} WordPress XML, {{img}} imagens, {{ignored}} ignorados",
    clear: "Limpar",
  },
  scan: {
    button: "Analisar",
    scanning: "A analisar…",
    failed: "Falha na análise: {{error}}",
    noSources: "Larga ou envia pelo menos um ficheiro .md ou .xml antes de analisar.",
  },
  summary: {
    title: "Resumo da simulação",
    posts: "{{count}} artigos a criar",
    pages: "{{count}} páginas a criar",
    categoriesNew: "{{count}} novas categorias",
    categoriesHierarchy: "({{count}} com pais)",
    tagsNew: "{{count}} novas etiquetas",
    imagesLocal: "{{count}} imagens locais a enviar",
    imagesRemote: "{{count}} imagens remotas a obter + enviar",
    warnings: "{{count}} avisos",
    errors: "{{count}} erros (bloqueia importação)",
    noEntries: "Nada a importar.",
    showDetails: "Mostrar detalhes",
    hideDetails: "Ocultar detalhes",
    entryRow: "{{type}}: {{title}} → /{{slug}}",
    cycleWarning: "Ciclo de hierarquia resolvido por achatamento",
  },
  defaults: {
    title: "Predefinições",
    statusMode: "Modo de estado",
    statusDraft: "Importar sempre como rascunho",
    statusDraftHelp: "Mais seguro — revê os artigos importados no admin antes de publicar.",
    statusFromSource: "Respeitar estado da origem",
    statusFromSourceHelp:
      "Markdown frontmatter status: / WordPress <wp:status> publish → online, restante → rascunho.",
    statusOnline: "Publicar tudo",
    statusOnlineHelp:
      "Força a publicação de cada artigo importado. Pesado — corre a pipeline completa de publicação por item.",
    defaultCategory: "Categoria por defeito",
    defaultCategoryHelp:
      "Usada quando uma entrada não especifica categoria. Vazio para importar sem categoria.",
    defaultCategoryNone: "(nenhuma)",
    moveProcessed: "Mover ficheiros processados para processed-<timestamp>/ (apenas modo pasta)",
    imageConcurrency: "Concorrência de downloads de imagens",
    imageConcurrencyHelp:
      "Máximo de fetches paralelos contra o site WordPress de origem. Reduz se a origem for lenta / rate-limited.",
    save: "Guardar predefinições",
    saved: "Predefinições guardadas.",
  },
  confirm: {
    button: "Confirmar importação",
    running: "A importar…",
    blockedByErrors: "Corrige os erros antes de importar.",
    success: "Importados: {{posts}} artigos, {{pages}} páginas, {{terms}} termos, {{media}} multimédia.",
    failed: "Importação concluída com erros. Vê o log abaixo.",
    summary: "Artigos criados: {{posts}} · Páginas: {{pages}} · Termos: {{terms}} · Multimédia: {{media}} · Publicados: {{published}}",
  },
  log: {
    title: "Atividade",
    copy: "Copiar log",
    copied: "Log copiado para a área de transferência.",
    empty: "Ainda sem atividade.",
  },
};

export const ko: typeof en = {
  title: "가져오기",
  description:
    "마크다운 파일(YAML 프론트매터 포함) 또는 WordPress XML 내보내기에서 게시물과 페이지를 가져옵니다. 누락된 카테고리와 태그를 자동으로 생성하고, 참조된 이미지를 업로드하며, 콘텐츠 내의 이미지 URL을 다시 작성하여 가져온 콘텐츠가 새 위치에서 작동하도록 합니다.",
  source: {
    label: "소스",
    folder: "Flexweg 폴더",
    folderHelp: "Flexweg 사이트의 _cms-import/에 놓인 파일.",
    drop: "끌어다 놓기",
    dropHelp: "여기에 파일을 직접 놓으세요 — 확인 전까지 아무것도 업로드되지 않습니다.",
  },
  folder: {
    notInitialized: "가져오기 폴더가 아직 초기화되지 않았습니다.",
    initialize: "가져오기 폴더 초기화",
    initializing: "초기화 중…",
    initialized: "_cms-import/에 폴더가 생성되었습니다 — 파일을 그곳에 놓으세요.",
    initFailed: "폴더 초기화에 실패했습니다.",
    refresh: "목록 새로고침",
    countLine: "{{md}}개 마크다운, {{xml}}개 WordPress XML, {{img}}개 이미지",
    empty: "_cms-import/에 아직 파일이 없습니다.",
  },
  drop: {
    title: "여기에 .md, .xml 또는 이미지를 놓으세요",
    help: "또는 클릭하여 선택하세요. 지원되는 경우 폴더는 재귀적으로 탐색됩니다.",
    countLine: "{{md}}개 마크다운, {{xml}}개 WordPress XML, {{img}}개 이미지, {{ignored}}개 무시됨",
    clear: "지우기",
  },
  scan: {
    button: "스캔",
    scanning: "스캔 중…",
    failed: "스캔 실패: {{error}}",
    noSources: "스캔하기 전에 최소 하나의 .md 또는 .xml 파일을 놓거나 업로드하세요.",
  },
  summary: {
    title: "드라이런 요약",
    posts: "생성할 게시물 {{count}}개",
    pages: "생성할 페이지 {{count}}개",
    categoriesNew: "새 카테고리 {{count}}개",
    categoriesHierarchy: "(부모 있는 {{count}}개)",
    tagsNew: "새 태그 {{count}}개",
    imagesLocal: "업로드할 로컬 이미지 {{count}}개",
    imagesRemote: "가져와서 업로드할 원격 이미지 {{count}}개",
    warnings: "경고 {{count}}개",
    errors: "오류 {{count}}개 (가져오기 차단)",
    noEntries: "가져올 항목이 없습니다.",
    showDetails: "세부정보 보기",
    hideDetails: "세부정보 숨기기",
    entryRow: "{{type}}: {{title}} → /{{slug}}",
    cycleWarning: "계층 구조 순환을 평탄화하여 해결",
  },
  defaults: {
    title: "기본값",
    statusMode: "상태 모드",
    statusDraft: "항상 초안으로 가져오기",
    statusDraftHelp: "더 안전 — 게시 전에 관리자에서 가져온 게시물을 검토하세요.",
    statusFromSource: "소스 상태 유지",
    statusFromSourceHelp:
      "마크다운 프론트매터 status: / WordPress <wp:status> publish → 온라인, 그 외 → 초안.",
    statusOnline: "모두 게시",
    statusOnlineHelp:
      "가져온 모든 게시물을 강제 게시합니다. 무거움 — 항목당 전체 게시 파이프라인을 실행합니다.",
    defaultCategory: "기본 카테고리",
    defaultCategoryHelp:
      "항목이 카테고리를 지정하지 않은 경우 사용됩니다. 카테고리 없이 가져오려면 비워 두세요.",
    defaultCategoryNone: "(없음)",
    moveProcessed: "처리된 파일을 processed-<timestamp>/로 이동 (폴더 모드 전용)",
    imageConcurrency: "원격 이미지 가져오기 동시성",
    imageConcurrencyHelp:
      "소스 WordPress 사이트에 대한 최대 병렬 가져오기 수. 소스가 느리거나 속도 제한이 있는 경우 낮추세요.",
    save: "기본값 저장",
    saved: "기본값이 저장되었습니다.",
  },
  confirm: {
    button: "가져오기 확인",
    running: "가져오는 중…",
    blockedByErrors: "가져오기 전에 오류를 수정하세요.",
    success: "{{posts}}개 게시물, {{pages}}개 페이지, {{terms}}개 용어, {{media}}개 미디어를 가져왔습니다.",
    failed: "가져오기가 오류와 함께 완료되었습니다. 아래 로그를 확인하세요.",
    summary: "생성된 게시물: {{posts}} · 페이지: {{pages}} · 용어: {{terms}} · 미디어: {{media}} · 게시됨: {{published}}",
  },
  log: {
    title: "활동",
    copy: "로그 복사",
    copied: "로그가 클립보드에 복사되었습니다.",
    empty: "아직 활동이 없습니다.",
  },
};
