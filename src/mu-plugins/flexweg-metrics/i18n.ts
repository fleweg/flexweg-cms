// Bundled translations for the flexweg-metrics MU plugin. Loaded into a
// dedicated i18next namespace named "flexweg-metrics" by the plugin
// loader, so each card calls useTranslation("flexweg-metrics").

export const en = {
  common: {
    refresh: "Refresh",
    loading: "Loading…",
  },
  storage: {
    title: "Flexweg storage",
    plan: "Plan: {{name}}",
    storageLabel: "Storage",
    filesLabel: "Files",
    usageLine: "{{current}} of {{limit}}",
    filesLine: "{{current}} of {{limit}} files",
    upgrade: "Upgrade",
    upgradeHint: "You're approaching your plan limit.",
    notConfigured: "Configure your Flexweg account to monitor storage usage.",
    notConfiguredCta: "Open settings",
    error: "Couldn't fetch storage usage.",
  },
  firestore: {
    title: "Firestore",
    description: "Document counts across the admin's Firestore collections.",
    posts: "Posts",
    pages: "Pages",
    terms: "Categories & tags",
    media: "Media",
    users: "Users",
    total: "Total documents",
    freeTierNote: "Free tier: 50 K reads / 20 K writes per day, 1 GiB storage.",
    error: "Couldn't fetch Firestore counts.",
  },
};

export const fr: typeof en = {
  common: {
    refresh: "Actualiser",
    loading: "Chargement…",
  },
  storage: {
    title: "Stockage Flexweg",
    plan: "Plan : {{name}}",
    storageLabel: "Stockage",
    filesLabel: "Fichiers",
    usageLine: "{{current}} sur {{limit}}",
    filesLine: "{{current}} sur {{limit}} fichiers",
    upgrade: "Passer au supérieur",
    upgradeHint: "Vous approchez de la limite de votre plan.",
    notConfigured: "Configurez votre compte Flexweg pour suivre l'utilisation.",
    notConfiguredCta: "Ouvrir les réglages",
    error: "Impossible de récupérer l'utilisation du stockage.",
  },
  firestore: {
    title: "Firestore",
    description: "Nombre de documents par collection Firestore de l'admin.",
    posts: "Articles",
    pages: "Pages",
    terms: "Catégories & tags",
    media: "Médias",
    users: "Utilisateurs",
    total: "Total des documents",
    freeTierNote: "Plan gratuit : 50 K lectures / 20 K écritures par jour, 1 Gio de stockage.",
    error: "Impossible de récupérer les compteurs Firestore.",
  },
};

export const de: typeof en = {
  common: {
    refresh: "Aktualisieren",
    loading: "Wird geladen…",
  },
  storage: {
    title: "Flexweg-Speicher",
    plan: "Plan: {{name}}",
    storageLabel: "Speicher",
    filesLabel: "Dateien",
    usageLine: "{{current}} von {{limit}}",
    filesLine: "{{current}} von {{limit}} Dateien",
    upgrade: "Upgrade",
    upgradeHint: "Sie nähern sich dem Limit Ihres Plans.",
    notConfigured: "Konfigurieren Sie Ihr Flexweg-Konto, um die Speichernutzung anzuzeigen.",
    notConfiguredCta: "Einstellungen öffnen",
    error: "Speichernutzung konnte nicht abgerufen werden.",
  },
  firestore: {
    title: "Firestore",
    description: "Dokumentanzahl pro Firestore-Sammlung des Admins.",
    posts: "Beiträge",
    pages: "Seiten",
    terms: "Kategorien & Schlagwörter",
    media: "Medien",
    users: "Benutzer",
    total: "Dokumente insgesamt",
    freeTierNote: "Kostenlos: 50 K Lesezugriffe / 20 K Schreibzugriffe pro Tag, 1 GiB Speicher.",
    error: "Firestore-Zähler konnten nicht abgerufen werden.",
  },
};

export const es: typeof en = {
  common: {
    refresh: "Actualizar",
    loading: "Cargando…",
  },
  storage: {
    title: "Almacenamiento Flexweg",
    plan: "Plan: {{name}}",
    storageLabel: "Almacenamiento",
    filesLabel: "Archivos",
    usageLine: "{{current}} de {{limit}}",
    filesLine: "{{current}} de {{limit}} archivos",
    upgrade: "Mejorar plan",
    upgradeHint: "Te estás acercando al límite de tu plan.",
    notConfigured: "Configura tu cuenta de Flexweg para supervisar el uso.",
    notConfiguredCta: "Abrir ajustes",
    error: "No se pudo obtener el uso de almacenamiento.",
  },
  firestore: {
    title: "Firestore",
    description: "Conteo de documentos por colección Firestore del admin.",
    posts: "Entradas",
    pages: "Páginas",
    terms: "Categorías y etiquetas",
    media: "Medios",
    users: "Usuarios",
    total: "Total de documentos",
    freeTierNote: "Plan gratuito: 50 K lecturas / 20 K escrituras al día, 1 GiB de almacenamiento.",
    error: "No se pudieron obtener los contadores de Firestore.",
  },
};

export const nl: typeof en = {
  common: {
    refresh: "Vernieuwen",
    loading: "Laden…",
  },
  storage: {
    title: "Flexweg-opslag",
    plan: "Plan: {{name}}",
    storageLabel: "Opslag",
    filesLabel: "Bestanden",
    usageLine: "{{current}} van {{limit}}",
    filesLine: "{{current}} van {{limit}} bestanden",
    upgrade: "Upgraden",
    upgradeHint: "Je nadert de limiet van je plan.",
    notConfigured: "Configureer je Flexweg-account om opslaggebruik te volgen.",
    notConfiguredCta: "Instellingen openen",
    error: "Opslaggebruik kon niet worden opgehaald.",
  },
  firestore: {
    title: "Firestore",
    description: "Aantal documenten per Firestore-collectie van de admin.",
    posts: "Berichten",
    pages: "Pagina's",
    terms: "Categorieën & tags",
    media: "Media",
    users: "Gebruikers",
    total: "Totaal aantal documenten",
    freeTierNote: "Gratis tier: 50 K leesbewerkingen / 20 K schrijfbewerkingen per dag, 1 GiB opslag.",
    error: "Firestore-tellers konden niet worden opgehaald.",
  },
};

export const pt: typeof en = {
  common: {
    refresh: "Atualizar",
    loading: "A carregar…",
  },
  storage: {
    title: "Armazenamento Flexweg",
    plan: "Plano: {{name}}",
    storageLabel: "Armazenamento",
    filesLabel: "Ficheiros",
    usageLine: "{{current}} de {{limit}}",
    filesLine: "{{current}} de {{limit}} ficheiros",
    upgrade: "Atualizar plano",
    upgradeHint: "Estás a aproximar-te do limite do plano.",
    notConfigured: "Configura a tua conta Flexweg para monitorizar o uso.",
    notConfiguredCta: "Abrir definições",
    error: "Não foi possível obter o uso do armazenamento.",
  },
  firestore: {
    title: "Firestore",
    description: "Contagem de documentos por coleção Firestore do admin.",
    posts: "Artigos",
    pages: "Páginas",
    terms: "Categorias e etiquetas",
    media: "Multimédia",
    users: "Utilizadores",
    total: "Total de documentos",
    freeTierNote: "Plano gratuito: 50 K leituras / 20 K escritas por dia, 1 GiB de armazenamento.",
    error: "Não foi possível obter os contadores do Firestore.",
  },
};

export const ko: typeof en = {
  common: {
    refresh: "새로 고침",
    loading: "불러오는 중…",
  },
  storage: {
    title: "Flexweg 저장소",
    plan: "요금제: {{name}}",
    storageLabel: "저장 용량",
    filesLabel: "파일",
    usageLine: "{{limit}} 중 {{current}}",
    filesLine: "{{limit}} 중 {{current}}개 파일",
    upgrade: "업그레이드",
    upgradeHint: "요금제 한도에 근접하고 있습니다.",
    notConfigured: "사용량을 모니터링하려면 Flexweg 계정을 구성하세요.",
    notConfiguredCta: "설정 열기",
    error: "저장 용량 정보를 가져올 수 없습니다.",
  },
  firestore: {
    title: "Firestore",
    description: "관리자의 Firestore 컬렉션별 문서 개수입니다.",
    posts: "게시물",
    pages: "페이지",
    terms: "카테고리 및 태그",
    media: "미디어",
    users: "사용자",
    total: "전체 문서",
    freeTierNote: "무료 등급: 일일 읽기 50K / 쓰기 20K, 저장 용량 1 GiB.",
    error: "Firestore 카운트를 가져올 수 없습니다.",
  },
};
