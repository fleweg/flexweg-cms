// Bundled translations for the flexweg-sitemaps plugin. Loaded into a
// dedicated i18next namespace named "flexweg-sitemaps" by the plugin
// loader, so the settings page can call useTranslation("flexweg-sitemaps")
// and use these short keys.

export const en = {
  title: "Sitemaps",
  description:
    "Generates sitemaps/sitemap-<year>.xml files, a sitemaps/sitemap-index.xml referencing them, an optional sitemaps/sitemap-news.xml, and a customizable robots.txt at the site root.",
  regenerationTarget: {
    label: "Sitemaps",
    description: "Yearly + index sitemaps under /sitemaps/, robots.txt, XSL stylesheets",
  },
  sections: {
    general: "General",
    robots: "robots.txt",
    actions: "Regeneration",
  },
  xsl: {
    help:
      "XSL stylesheets style the sitemaps when opened in a browser. Re-upload after changing the public site language.",
    upload: "Upload stylesheets",
    uploading: "Uploading…",
    uploaded: "Uploaded {{count}} stylesheet(s).",
    failed: "Stylesheet upload failed.",
  },
  contentTypes: {
    label: "Content types in sitemaps",
    posts: "Posts only",
    postsPages: "Posts and pages",
  },
  news: {
    enabled: "Generate sitemap-news.xml",
    enabledHelp: "Enable to publish a Google News sitemap alongside the index.",
    windowDays: "News window (days)",
    windowDaysHelp:
      "Articles modified within this many days appear in sitemap-news.xml. Google recommends 2.",
  },
  robots: {
    label: "robots.txt content",
    help:
      "Leave empty to use a generated default that points to your sitemaps/sitemap-index.xml (and sitemaps/sitemap-news.xml when News is enabled).",
    resetDefault: "Insert default",
    saveAndRegenerate: "Save & regenerate robots.txt",
    saving: "Saving…",
    saved: "robots.txt saved and regenerated.",
  },
  saveSettings: "Save settings",
  saved: "Settings saved.",
  forceRegenerate: "Force regenerate sitemaps",
  forceRegenerating: "Regenerating…",
  regenerated: "Sitemaps regenerated.",
  regenerateFailed: "Sitemap regeneration failed.",
  baseUrlMissing:
    "Set the public site URL in Settings → General before regenerating sitemaps.",
  uploaded: "Uploaded {{count}} files.",
};

export const fr: typeof en = {
  title: "Sitemaps",
  description:
    "Génère les fichiers sitemaps/sitemap-<année>.xml, un sitemaps/sitemap-index.xml qui les référence, un sitemaps/sitemap-news.xml optionnel, et un robots.txt personnalisable à la racine du site.",
  regenerationTarget: {
    label: "Sitemaps",
    description: "Sitemaps annuels + index sous /sitemaps/, robots.txt, feuilles XSL",
  },
  sections: {
    general: "Général",
    robots: "robots.txt",
    actions: "Régénération",
  },
  xsl: {
    help:
      "Les feuilles de style XSL habillent les sitemaps quand on les ouvre dans un navigateur. À ré-envoyer après un changement de langue du site public.",
    upload: "Envoyer les feuilles de style",
    uploading: "Envoi…",
    uploaded: "{{count}} feuille(s) de style envoyée(s).",
    failed: "Échec de l'envoi des feuilles de style.",
  },
  contentTypes: {
    label: "Types de contenu dans les sitemaps",
    posts: "Articles uniquement",
    postsPages: "Articles et pages",
  },
  news: {
    enabled: "Générer sitemap-news.xml",
    enabledHelp:
      "Activez pour publier un sitemap Google News à côté de l'index.",
    windowDays: "Fenêtre News (jours)",
    windowDaysHelp:
      "Les articles modifiés dans cet intervalle apparaissent dans sitemap-news.xml. Google recommande 2.",
  },
  robots: {
    label: "Contenu de robots.txt",
    help:
      "Laissez vide pour utiliser un robots.txt par défaut généré, qui pointe vers votre sitemaps/sitemap-index.xml (et sitemaps/sitemap-news.xml si News est activé).",
    resetDefault: "Insérer le défaut",
    saveAndRegenerate: "Enregistrer & régénérer robots.txt",
    saving: "Enregistrement…",
    saved: "robots.txt enregistré et régénéré.",
  },
  saveSettings: "Enregistrer les réglages",
  saved: "Réglages enregistrés.",
  forceRegenerate: "Forcer la régénération",
  forceRegenerating: "Régénération…",
  regenerated: "Sitemaps régénérés.",
  regenerateFailed: "Échec de la régénération des sitemaps.",
  baseUrlMissing:
    "Définissez l'URL publique du site dans Réglages → Général avant de régénérer les sitemaps.",
  uploaded: "{{count}} fichiers envoyés.",
};

export const de: typeof en = {
  title: "Sitemaps",
  description:
    "Erzeugt sitemaps/sitemap-<Jahr>.xml-Dateien, eine sitemaps/sitemap-index.xml, die darauf verweist, eine optionale sitemaps/sitemap-news.xml und eine anpassbare robots.txt im Site-Root.",
  regenerationTarget: {
    label: "Sitemaps",
    description: "Jährliche + Index-Sitemaps unter /sitemaps/, robots.txt, XSL-Stylesheets",
  },
  sections: {
    general: "Allgemein",
    robots: "robots.txt",
    actions: "Neuerzeugung",
  },
  xsl: {
    help:
      "XSL-Stylesheets stylen die Sitemaps, wenn sie im Browser geöffnet werden. Nach Änderung der öffentlichen Website-Sprache erneut hochladen.",
    upload: "Stylesheets hochladen",
    uploading: "Lädt hoch…",
    uploaded: "{{count}} Stylesheet(s) hochgeladen.",
    failed: "Stylesheet-Upload fehlgeschlagen.",
  },
  contentTypes: {
    label: "Inhaltstypen in Sitemaps",
    posts: "Nur Artikel",
    postsPages: "Artikel und Seiten",
  },
  news: {
    enabled: "sitemap-news.xml erzeugen",
    enabledHelp: "Aktivieren, um eine Google-News-Sitemap neben dem Index zu veröffentlichen.",
    windowDays: "News-Fenster (Tage)",
    windowDaysHelp:
      "Artikel, die innerhalb dieser Anzahl von Tagen geändert wurden, erscheinen in sitemap-news.xml. Google empfiehlt 2.",
  },
  robots: {
    label: "Inhalt der robots.txt",
    help:
      "Leer lassen, um eine erzeugte Standard-Datei zu verwenden, die auf Ihre sitemaps/sitemap-index.xml (und sitemaps/sitemap-news.xml bei aktivierter News-Sitemap) verweist.",
    resetDefault: "Standard einfügen",
    saveAndRegenerate: "Speichern & robots.txt neu erzeugen",
    saving: "Speichert…",
    saved: "robots.txt gespeichert und neu erzeugt.",
  },
  saveSettings: "Einstellungen speichern",
  saved: "Einstellungen gespeichert.",
  forceRegenerate: "Sitemaps zwangsweise neu erzeugen",
  forceRegenerating: "Neu erzeugen…",
  regenerated: "Sitemaps neu erzeugt.",
  regenerateFailed: "Sitemap-Neuerzeugung fehlgeschlagen.",
  baseUrlMissing:
    "Legen Sie die öffentliche Website-URL unter Einstellungen → Allgemein fest, bevor Sie Sitemaps neu erzeugen.",
  uploaded: "{{count}} Dateien hochgeladen.",
};

export const es: typeof en = {
  title: "Sitemaps",
  description:
    "Genera archivos sitemaps/sitemap-<año>.xml, un sitemaps/sitemap-index.xml que los referencia, un sitemaps/sitemap-news.xml opcional y un robots.txt personalizable en la raíz del sitio.",
  regenerationTarget: {
    label: "Sitemaps",
    description: "Sitemaps anuales + índice bajo /sitemaps/, robots.txt, hojas XSL",
  },
  sections: {
    general: "General",
    robots: "robots.txt",
    actions: "Regeneración",
  },
  xsl: {
    help:
      "Las hojas de estilo XSL dan formato a los sitemaps cuando se abren en un navegador. Vuelve a subirlas tras cambiar el idioma del sitio público.",
    upload: "Subir hojas de estilo",
    uploading: "Subiendo…",
    uploaded: "Subidas {{count}} hoja(s) de estilo.",
    failed: "Error al subir las hojas de estilo.",
  },
  contentTypes: {
    label: "Tipos de contenido en sitemaps",
    posts: "Solo entradas",
    postsPages: "Entradas y páginas",
  },
  news: {
    enabled: "Generar sitemap-news.xml",
    enabledHelp: "Actívalo para publicar un sitemap de Google News junto al índice.",
    windowDays: "Ventana News (días)",
    windowDaysHelp:
      "Los artículos modificados en este número de días aparecen en sitemap-news.xml. Google recomienda 2.",
  },
  robots: {
    label: "Contenido de robots.txt",
    help:
      "Déjalo vacío para usar un valor por defecto generado que apunta a tu sitemaps/sitemap-index.xml (y a sitemaps/sitemap-news.xml si News está activado).",
    resetDefault: "Insertar por defecto",
    saveAndRegenerate: "Guardar y regenerar robots.txt",
    saving: "Guardando…",
    saved: "robots.txt guardado y regenerado.",
  },
  saveSettings: "Guardar ajustes",
  saved: "Ajustes guardados.",
  forceRegenerate: "Forzar regeneración",
  forceRegenerating: "Regenerando…",
  regenerated: "Sitemaps regenerados.",
  regenerateFailed: "La regeneración de sitemaps falló.",
  baseUrlMissing:
    "Define la URL pública del sitio en Ajustes → General antes de regenerar los sitemaps.",
  uploaded: "{{count}} archivos subidos.",
};

export const nl: typeof en = {
  title: "Sitemaps",
  description:
    "Genereert sitemaps/sitemap-<jaar>.xml-bestanden, een sitemaps/sitemap-index.xml die ernaar verwijst, een optionele sitemaps/sitemap-news.xml en een aanpasbare robots.txt in de site-root.",
  regenerationTarget: {
    label: "Sitemaps",
    description: "Jaarlijkse + index-sitemaps onder /sitemaps/, robots.txt, XSL-stylesheets",
  },
  sections: {
    general: "Algemeen",
    robots: "robots.txt",
    actions: "Regeneratie",
  },
  xsl: {
    help:
      "XSL-stylesheets geven sitemaps stijl wanneer ze in een browser worden geopend. Upload opnieuw na het wijzigen van de publieke sitetaal.",
    upload: "Stylesheets uploaden",
    uploading: "Uploaden…",
    uploaded: "{{count}} stylesheet(s) geüpload.",
    failed: "Stylesheet-upload mislukt.",
  },
  contentTypes: {
    label: "Inhoudstypes in sitemaps",
    posts: "Alleen berichten",
    postsPages: "Berichten en pagina's",
  },
  news: {
    enabled: "sitemap-news.xml genereren",
    enabledHelp: "Inschakelen om een Google News-sitemap naast de index te publiceren.",
    windowDays: "News-venster (dagen)",
    windowDaysHelp:
      "Artikelen die binnen dit aantal dagen zijn gewijzigd verschijnen in sitemap-news.xml. Google adviseert 2.",
  },
  robots: {
    label: "Inhoud van robots.txt",
    help:
      "Laat leeg om een gegenereerde standaard te gebruiken die wijst naar je sitemaps/sitemap-index.xml (en sitemaps/sitemap-news.xml wanneer News is ingeschakeld).",
    resetDefault: "Standaard invoegen",
    saveAndRegenerate: "Opslaan & robots.txt opnieuw genereren",
    saving: "Opslaan…",
    saved: "robots.txt opgeslagen en opnieuw gegenereerd.",
  },
  saveSettings: "Instellingen opslaan",
  saved: "Instellingen opgeslagen.",
  forceRegenerate: "Sitemaps forceren te regenereren",
  forceRegenerating: "Regenereren…",
  regenerated: "Sitemaps geregenereerd.",
  regenerateFailed: "Sitemap-regeneratie mislukt.",
  baseUrlMissing:
    "Stel de publieke site-URL in via Instellingen → Algemeen voordat je sitemaps regenereert.",
  uploaded: "{{count}} bestanden geüpload.",
};

export const pt: typeof en = {
  title: "Sitemaps",
  description:
    "Gera ficheiros sitemaps/sitemap-<ano>.xml, um sitemaps/sitemap-index.xml que os referencia, um sitemaps/sitemap-news.xml opcional e um robots.txt personalizável na raiz do site.",
  regenerationTarget: {
    label: "Sitemaps",
    description: "Sitemaps anuais + índice em /sitemaps/, robots.txt, folhas XSL",
  },
  sections: {
    general: "Geral",
    robots: "robots.txt",
    actions: "Regeneração",
  },
  xsl: {
    help:
      "As folhas de estilo XSL formatam os sitemaps quando abertos num browser. Reenviar após alterar o idioma do site público.",
    upload: "Enviar folhas de estilo",
    uploading: "A enviar…",
    uploaded: "Enviadas {{count}} folha(s) de estilo.",
    failed: "Falha ao enviar folhas de estilo.",
  },
  contentTypes: {
    label: "Tipos de conteúdo nos sitemaps",
    posts: "Apenas artigos",
    postsPages: "Artigos e páginas",
  },
  news: {
    enabled: "Gerar sitemap-news.xml",
    enabledHelp: "Ativa para publicar um sitemap Google News ao lado do índice.",
    windowDays: "Janela News (dias)",
    windowDaysHelp:
      "Os artigos modificados neste número de dias aparecem em sitemap-news.xml. O Google recomenda 2.",
  },
  robots: {
    label: "Conteúdo do robots.txt",
    help:
      "Deixa vazio para usar um valor predefinido gerado que aponta para o teu sitemaps/sitemap-index.xml (e sitemaps/sitemap-news.xml quando o News está ativo).",
    resetDefault: "Inserir predefinido",
    saveAndRegenerate: "Guardar e regenerar robots.txt",
    saving: "A guardar…",
    saved: "robots.txt guardado e regenerado.",
  },
  saveSettings: "Guardar definições",
  saved: "Definições guardadas.",
  forceRegenerate: "Forçar regeneração",
  forceRegenerating: "A regenerar…",
  regenerated: "Sitemaps regenerados.",
  regenerateFailed: "Falha na regeneração de sitemaps.",
  baseUrlMissing:
    "Define o URL público do site em Definições → Geral antes de regenerar sitemaps.",
  uploaded: "{{count}} ficheiros enviados.",
};

export const ko: typeof en = {
  title: "사이트맵",
  description:
    "sitemaps/sitemap-<연도>.xml 파일, 이를 참조하는 sitemaps/sitemap-index.xml, 선택적 sitemaps/sitemap-news.xml 및 사이트 루트의 사용자 정의 가능한 robots.txt를 생성합니다.",
  regenerationTarget: {
    label: "사이트맵",
    description: "/sitemaps/ 아래의 연도별 + 인덱스 사이트맵, robots.txt, XSL 스타일시트",
  },
  sections: {
    general: "일반",
    robots: "robots.txt",
    actions: "재생성",
  },
  xsl: {
    help:
      "XSL 스타일시트는 브라우저에서 사이트맵을 열 때 스타일을 적용합니다. 공개 사이트 언어를 변경한 후 다시 업로드하세요.",
    upload: "스타일시트 업로드",
    uploading: "업로드 중…",
    uploaded: "{{count}}개의 스타일시트를 업로드했습니다.",
    failed: "스타일시트 업로드에 실패했습니다.",
  },
  contentTypes: {
    label: "사이트맵에 포함할 콘텐츠 유형",
    posts: "게시물만",
    postsPages: "게시물 및 페이지",
  },
  news: {
    enabled: "sitemap-news.xml 생성",
    enabledHelp: "활성화하면 인덱스 옆에 Google News 사이트맵을 게시합니다.",
    windowDays: "News 기간 (일)",
    windowDaysHelp:
      "지정한 일수 내에 수정된 기사는 sitemap-news.xml에 포함됩니다. Google은 2일을 권장합니다.",
  },
  robots: {
    label: "robots.txt 내용",
    help:
      "비워 두면 sitemaps/sitemap-index.xml(및 News가 활성화된 경우 sitemaps/sitemap-news.xml)을 가리키는 기본값이 사용됩니다.",
    resetDefault: "기본값 삽입",
    saveAndRegenerate: "저장 및 robots.txt 재생성",
    saving: "저장 중…",
    saved: "robots.txt가 저장되고 재생성되었습니다.",
  },
  saveSettings: "설정 저장",
  saved: "설정이 저장되었습니다.",
  forceRegenerate: "사이트맵 강제 재생성",
  forceRegenerating: "재생성 중…",
  regenerated: "사이트맵이 재생성되었습니다.",
  regenerateFailed: "사이트맵 재생성에 실패했습니다.",
  baseUrlMissing:
    "사이트맵을 재생성하기 전에 설정 → 일반에서 공개 사이트 URL을 설정하세요.",
  uploaded: "{{count}}개의 파일을 업로드했습니다.",
};
