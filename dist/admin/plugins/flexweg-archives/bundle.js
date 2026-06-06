import { buildPostUrl as he, deleteFolder as ge, uploadFile as T, deleteFile as pe, buildSiteContext as me, i18n as Y, pickPublicLocale as J, getActiveTheme as fe, renderPageToHtml as ye, useCmsData as ve, toast as P, fetchAllPosts as $ } from "@flexweg/cms-runtime";
import { jsxs as h, jsx as o } from "react/jsx-runtime";
import { forwardRef as E, createElement as M, useState as C, useEffect as be } from "react";
import { useTranslation as ke } from "react-i18next";
const we = {
  title: "Archives",
  description: "Generates static archive pages grouped by year (and optionally by month or ISO week) and adds a 'See full archives' link to home and category listings — a static-friendly alternative to pagination.",
  regenerationTarget: {
    label: "Archives",
    description: "Wipe and rebuild every period page + the /archives/ index"
  },
  // ─── Admin / settings page ─────────────────────────────────────
  settings: {
    drillDown: "Drill-down",
    drillDownHelp: "Sub-grouping inside each year. Years are always the top level.",
    drillDownNone: "Year only",
    drillDownMonth: "Year → month",
    drillDownWeek: "Year → ISO week",
    includePages: "Include static pages alongside posts",
    includePagesHelp: "Off by default — pages are rarely chronological. Enable if you publish dated essays as pages instead of posts.",
    addArchivesLinkToHome: "Show 'See full archives' link on the home page",
    addArchivesLinkToCategory: "Show 'See full archives' link on category archives",
    showCounts: "Show post counts next to each period",
    save: "Save settings",
    saving: "Saving…",
    saved: "Settings saved.",
    forceRegenerate: "Force regenerate archives",
    forceRegenerating: "Regenerating…",
    regenerated: "Archives regenerated ({{count}} files).",
    regenerateFailed: "Archive regeneration failed.",
    forceRegenerateHelp: "Wipes every file under /archives/ and rebuilds from scratch using all currently-online posts. Use after toggling drill-down or after a bulk import."
  },
  // ─── Public-baked strings (rendered into archive HTML) ────────
  page: {
    indexTitle: "Archives",
    yearTitle: "Archives — {{year}}",
    monthTitle: "{{month}} {{year}}",
    weekTitle: "Week {{week}}, {{year}}",
    indexSubtitle_one: "{{count}} article published.",
    indexSubtitle_other: "{{count}} articles published.",
    yearSubtitle_one: "{{count}} article published in {{year}}.",
    yearSubtitle_other: "{{count}} articles published in {{year}}.",
    monthSubtitle_one: "{{count}} article published in {{month}} {{year}}.",
    monthSubtitle_other: "{{count}} articles published in {{month}} {{year}}.",
    weekSubtitle_one: "{{count}} article published during week {{week}} of {{year}}.",
    weekSubtitle_other: "{{count}} articles published during week {{week}} of {{year}}.",
    empty: "No posts published yet.",
    backToIndex: "← All archives",
    backToYear: "← {{year}}",
    seeFullArchives: "See full archives →",
    months: {
      1: "January",
      2: "February",
      3: "March",
      4: "April",
      5: "May",
      6: "June",
      7: "July",
      8: "August",
      9: "September",
      10: "October",
      11: "November",
      12: "December"
    },
    weekShort: "W{{n}}",
    countLabel_one: "{{count}} post",
    countLabel_other: "{{count}} posts"
  }
}, _e = {
  title: "Archives",
  description: "Génère des pages d'archives statiques groupées par année (et optionnellement par mois ou semaine ISO) et ajoute un lien « Voir toutes les archives » sur la home et les listings de catégorie — alternative compatible static à la pagination.",
  regenerationTarget: {
    label: "Archives",
    description: "Vide et reconstruit toutes les pages période + l'index /archives/"
  },
  settings: {
    drillDown: "Sous-groupement",
    drillDownHelp: "Sous-groupement à l'intérieur de chaque année. L'année est toujours le niveau racine.",
    drillDownNone: "Année seulement",
    drillDownMonth: "Année → mois",
    drillDownWeek: "Année → semaine ISO",
    includePages: "Inclure les pages statiques en plus des articles",
    includePagesHelp: "Désactivé par défaut — les pages sont rarement chronologiques. Activez si vous publiez des billets datés sous forme de pages.",
    addArchivesLinkToHome: "Afficher « Voir toutes les archives » sur la home",
    addArchivesLinkToCategory: "Afficher « Voir toutes les archives » sur les pages de catégorie",
    showCounts: "Afficher le nombre d'articles à côté de chaque période",
    save: "Enregistrer les réglages",
    saving: "Enregistrement…",
    saved: "Réglages enregistrés.",
    forceRegenerate: "Forcer la régénération",
    forceRegenerating: "Régénération…",
    regenerated: "Archives régénérées ({{count}} fichiers).",
    regenerateFailed: "Échec de la régénération.",
    forceRegenerateHelp: "Supprime tous les fichiers sous /archives/ et reconstruit de zéro à partir des articles actuellement en ligne. Utile après changement de sous-groupement ou import en masse."
  },
  page: {
    indexTitle: "Archives",
    yearTitle: "Archives — {{year}}",
    monthTitle: "{{month}} {{year}}",
    weekTitle: "Semaine {{week}}, {{year}}",
    indexSubtitle_one: "{{count}} article publié.",
    indexSubtitle_other: "{{count}} articles publiés.",
    yearSubtitle_one: "{{count}} article publié en {{year}}.",
    yearSubtitle_other: "{{count}} articles publiés en {{year}}.",
    monthSubtitle_one: "{{count}} article publié en {{month}} {{year}}.",
    monthSubtitle_other: "{{count}} articles publiés en {{month}} {{year}}.",
    weekSubtitle_one: "{{count}} article publié pendant la semaine {{week}} de {{year}}.",
    weekSubtitle_other: "{{count}} articles publiés pendant la semaine {{week}} de {{year}}.",
    empty: "Aucun article publié pour le moment.",
    backToIndex: "← Toutes les archives",
    backToYear: "← {{year}}",
    seeFullArchives: "Voir toutes les archives →",
    months: {
      1: "Janvier",
      2: "Février",
      3: "Mars",
      4: "Avril",
      5: "Mai",
      6: "Juin",
      7: "Juillet",
      8: "Août",
      9: "Septembre",
      10: "Octobre",
      11: "Novembre",
      12: "Décembre"
    },
    weekShort: "S{{n}}",
    countLabel_one: "{{count}} article",
    countLabel_other: "{{count}} articles"
  }
}, Se = {
  title: "Archive",
  description: 'Erzeugt statische Archivseiten gruppiert nach Jahr (und optional nach Monat oder ISO-Woche) und fügt einen Link „Alle Archive ansehen" auf der Startseite und in Kategorie-Listings hinzu — eine static-freundliche Alternative zur Paginierung.',
  regenerationTarget: {
    label: "Archive",
    description: "Löscht und erstellt jede Periodenseite + den /archives/-Index neu"
  },
  settings: {
    drillDown: "Untergliederung",
    drillDownHelp: "Untergruppierung innerhalb jedes Jahres. Jahre sind immer die oberste Ebene.",
    drillDownNone: "Nur Jahr",
    drillDownMonth: "Jahr → Monat",
    drillDownWeek: "Jahr → ISO-Woche",
    includePages: "Statische Seiten zusätzlich zu den Artikeln einbeziehen",
    includePagesHelp: "Standardmäßig aus — Seiten sind selten chronologisch. Aktivieren, wenn Sie datierte Beiträge als Seiten veröffentlichen.",
    addArchivesLinkToHome: 'Link „Alle Archive ansehen" auf der Startseite anzeigen',
    addArchivesLinkToCategory: 'Link „Alle Archive ansehen" auf Kategorie-Archiven anzeigen',
    showCounts: "Anzahl der Artikel neben jeder Periode anzeigen",
    save: "Einstellungen speichern",
    saving: "Speichert…",
    saved: "Einstellungen gespeichert.",
    forceRegenerate: "Archive zwangsweise neu erzeugen",
    forceRegenerating: "Neu erzeugen…",
    regenerated: "Archive neu erzeugt ({{count}} Dateien).",
    regenerateFailed: "Archiv-Neuerzeugung fehlgeschlagen.",
    forceRegenerateHelp: "Löscht alle Dateien unter /archives/ und baut sie von Grund auf neu mit allen aktuell online stehenden Artikeln. Nützlich nach Änderung der Untergliederung oder einem Massenimport."
  },
  page: {
    indexTitle: "Archive",
    yearTitle: "Archive — {{year}}",
    monthTitle: "{{month}} {{year}}",
    weekTitle: "Woche {{week}}, {{year}}",
    indexSubtitle_one: "{{count}} Artikel veröffentlicht.",
    indexSubtitle_other: "{{count}} Artikel veröffentlicht.",
    yearSubtitle_one: "{{count}} Artikel veröffentlicht in {{year}}.",
    yearSubtitle_other: "{{count}} Artikel veröffentlicht in {{year}}.",
    monthSubtitle_one: "{{count}} Artikel veröffentlicht im {{month}} {{year}}.",
    monthSubtitle_other: "{{count}} Artikel veröffentlicht im {{month}} {{year}}.",
    weekSubtitle_one: "{{count}} Artikel veröffentlicht in Woche {{week}} {{year}}.",
    weekSubtitle_other: "{{count}} Artikel veröffentlicht in Woche {{week}} {{year}}.",
    empty: "Noch keine Artikel veröffentlicht.",
    backToIndex: "← Alle Archive",
    backToYear: "← {{year}}",
    seeFullArchives: "Alle Archive ansehen →",
    months: {
      1: "Januar",
      2: "Februar",
      3: "März",
      4: "April",
      5: "Mai",
      6: "Juni",
      7: "Juli",
      8: "August",
      9: "September",
      10: "Oktober",
      11: "November",
      12: "Dezember"
    },
    weekShort: "KW{{n}}",
    countLabel_one: "{{count}} Artikel",
    countLabel_other: "{{count}} Artikel"
  }
}, Ae = {
  title: "Archivos",
  description: "Genera páginas de archivo estáticas agrupadas por año (y opcionalmente por mes o semana ISO) y añade un enlace «Ver archivo completo» en la home y en los listados de categoría — una alternativa compatible con hosting estático a la paginación.",
  regenerationTarget: {
    label: "Archivos",
    description: "Borra y reconstruye cada página de período + el índice /archives/"
  },
  settings: {
    drillDown: "Subagrupación",
    drillDownHelp: "Subagrupación dentro de cada año. El año es siempre el nivel superior.",
    drillDownNone: "Solo año",
    drillDownMonth: "Año → mes",
    drillDownWeek: "Año → semana ISO",
    includePages: "Incluir páginas estáticas además de las entradas",
    includePagesHelp: "Desactivado por defecto — las páginas raramente son cronológicas. Actívalo si publicas ensayos datados como páginas.",
    addArchivesLinkToHome: "Mostrar «Ver archivo completo» en la home",
    addArchivesLinkToCategory: "Mostrar «Ver archivo completo» en los archivos de categoría",
    showCounts: "Mostrar el número de entradas junto a cada periodo",
    save: "Guardar ajustes",
    saving: "Guardando…",
    saved: "Ajustes guardados.",
    forceRegenerate: "Forzar regeneración",
    forceRegenerating: "Regenerando…",
    regenerated: "Archivos regenerados ({{count}} ficheros).",
    regenerateFailed: "La regeneración falló.",
    forceRegenerateHelp: "Borra todos los ficheros bajo /archives/ y los reconstruye desde cero con las entradas en línea actuales. Útil tras cambiar la subagrupación o tras una importación masiva."
  },
  page: {
    indexTitle: "Archivos",
    yearTitle: "Archivos — {{year}}",
    monthTitle: "{{month}} {{year}}",
    weekTitle: "Semana {{week}}, {{year}}",
    indexSubtitle_one: "{{count}} entrada publicada.",
    indexSubtitle_other: "{{count}} entradas publicadas.",
    yearSubtitle_one: "{{count}} entrada publicada en {{year}}.",
    yearSubtitle_other: "{{count}} entradas publicadas en {{year}}.",
    monthSubtitle_one: "{{count}} entrada publicada en {{month}} {{year}}.",
    monthSubtitle_other: "{{count}} entradas publicadas en {{month}} {{year}}.",
    weekSubtitle_one: "{{count}} entrada publicada durante la semana {{week}} de {{year}}.",
    weekSubtitle_other: "{{count}} entradas publicadas durante la semana {{week}} de {{year}}.",
    empty: "Todavía no hay entradas publicadas.",
    backToIndex: "← Todos los archivos",
    backToYear: "← {{year}}",
    seeFullArchives: "Ver archivo completo →",
    months: {
      1: "Enero",
      2: "Febrero",
      3: "Marzo",
      4: "Abril",
      5: "Mayo",
      6: "Junio",
      7: "Julio",
      8: "Agosto",
      9: "Septiembre",
      10: "Octubre",
      11: "Noviembre",
      12: "Diciembre"
    },
    weekShort: "S{{n}}",
    countLabel_one: "{{count}} entrada",
    countLabel_other: "{{count}} entradas"
  }
}, Te = {
  title: "Archief",
  description: "Genereert statische archiefpagina's gegroepeerd per jaar (en optioneel per maand of ISO-week) en voegt een link 'Volledige archief bekijken' toe aan de homepagina en categorie-overzichten — een static-vriendelijk alternatief voor paginatie.",
  regenerationTarget: {
    label: "Archief",
    description: "Wist en bouwt elke periodepagina + de /archives/-index opnieuw"
  },
  settings: {
    drillDown: "Sub-groepering",
    drillDownHelp: "Subgroepering binnen elk jaar. Jaren zijn altijd het hoogste niveau.",
    drillDownNone: "Alleen jaar",
    drillDownMonth: "Jaar → maand",
    drillDownWeek: "Jaar → ISO-week",
    includePages: "Statische pagina's mee opnemen naast berichten",
    includePagesHelp: "Standaard uit — pagina's zijn zelden chronologisch. Schakel in als je gedateerde stukken als pagina's publiceert.",
    addArchivesLinkToHome: "Toon 'Volledige archief bekijken' op de homepagina",
    addArchivesLinkToCategory: "Toon 'Volledige archief bekijken' op categoriearchieven",
    showCounts: "Toon aantal berichten naast elke periode",
    save: "Instellingen opslaan",
    saving: "Opslaan…",
    saved: "Instellingen opgeslagen.",
    forceRegenerate: "Archief geforceerd regenereren",
    forceRegenerating: "Regenereren…",
    regenerated: "Archief geregenereerd ({{count}} bestanden).",
    regenerateFailed: "Archief-regeneratie mislukt.",
    forceRegenerateHelp: "Wist alle bestanden onder /archives/ en bouwt vanaf nul met de momenteel online berichten. Handig na het wijzigen van de subgroepering of na een bulkimport."
  },
  page: {
    indexTitle: "Archief",
    yearTitle: "Archief — {{year}}",
    monthTitle: "{{month}} {{year}}",
    weekTitle: "Week {{week}}, {{year}}",
    indexSubtitle_one: "{{count}} bericht gepubliceerd.",
    indexSubtitle_other: "{{count}} berichten gepubliceerd.",
    yearSubtitle_one: "{{count}} bericht gepubliceerd in {{year}}.",
    yearSubtitle_other: "{{count}} berichten gepubliceerd in {{year}}.",
    monthSubtitle_one: "{{count}} bericht gepubliceerd in {{month}} {{year}}.",
    monthSubtitle_other: "{{count}} berichten gepubliceerd in {{month}} {{year}}.",
    weekSubtitle_one: "{{count}} bericht gepubliceerd in week {{week}} van {{year}}.",
    weekSubtitle_other: "{{count}} berichten gepubliceerd in week {{week}} van {{year}}.",
    empty: "Nog geen berichten gepubliceerd.",
    backToIndex: "← Volledig archief",
    backToYear: "← {{year}}",
    seeFullArchives: "Volledige archief bekijken →",
    months: {
      1: "Januari",
      2: "Februari",
      3: "Maart",
      4: "April",
      5: "Mei",
      6: "Juni",
      7: "Juli",
      8: "Augustus",
      9: "September",
      10: "Oktober",
      11: "November",
      12: "December"
    },
    weekShort: "W{{n}}",
    countLabel_one: "{{count}} bericht",
    countLabel_other: "{{count}} berichten"
  }
}, xe = {
  title: "Arquivos",
  description: "Gera páginas de arquivo estáticas agrupadas por ano (e opcionalmente por mês ou semana ISO) e adiciona um link «Ver arquivo completo» na página inicial e nas listagens de categoria — uma alternativa compatível com alojamento estático à paginação.",
  regenerationTarget: {
    label: "Arquivos",
    description: "Limpa e reconstrói cada página de período + o índice /archives/"
  },
  settings: {
    drillDown: "Subagrupamento",
    drillDownHelp: "Subagrupamento dentro de cada ano. O ano é sempre o nível superior.",
    drillDownNone: "Apenas ano",
    drillDownMonth: "Ano → mês",
    drillDownWeek: "Ano → semana ISO",
    includePages: "Incluir páginas estáticas além dos artigos",
    includePagesHelp: "Desativado por defeito — as páginas raramente são cronológicas. Ativa se publicas ensaios datados como páginas.",
    addArchivesLinkToHome: "Mostrar «Ver arquivo completo» na página inicial",
    addArchivesLinkToCategory: "Mostrar «Ver arquivo completo» nos arquivos de categoria",
    showCounts: "Mostrar contagem de artigos junto a cada período",
    save: "Guardar definições",
    saving: "A guardar…",
    saved: "Definições guardadas.",
    forceRegenerate: "Forçar regeneração",
    forceRegenerating: "A regenerar…",
    regenerated: "Arquivos regenerados ({{count}} ficheiros).",
    regenerateFailed: "Falha na regeneração.",
    forceRegenerateHelp: "Apaga todos os ficheiros em /archives/ e reconstrói de raiz a partir dos artigos atualmente online. Útil após mudar o subagrupamento ou após uma importação em massa."
  },
  page: {
    indexTitle: "Arquivos",
    yearTitle: "Arquivos — {{year}}",
    monthTitle: "{{month}} {{year}}",
    weekTitle: "Semana {{week}}, {{year}}",
    indexSubtitle_one: "{{count}} artigo publicado.",
    indexSubtitle_other: "{{count}} artigos publicados.",
    yearSubtitle_one: "{{count}} artigo publicado em {{year}}.",
    yearSubtitle_other: "{{count}} artigos publicados em {{year}}.",
    monthSubtitle_one: "{{count}} artigo publicado em {{month}} {{year}}.",
    monthSubtitle_other: "{{count}} artigos publicados em {{month}} {{year}}.",
    weekSubtitle_one: "{{count}} artigo publicado durante a semana {{week}} de {{year}}.",
    weekSubtitle_other: "{{count}} artigos publicados durante a semana {{week}} de {{year}}.",
    empty: "Ainda sem artigos publicados.",
    backToIndex: "← Todos os arquivos",
    backToYear: "← {{year}}",
    seeFullArchives: "Ver arquivo completo →",
    months: {
      1: "Janeiro",
      2: "Fevereiro",
      3: "Março",
      4: "Abril",
      5: "Maio",
      6: "Junho",
      7: "Julho",
      8: "Agosto",
      9: "Setembro",
      10: "Outubro",
      11: "Novembro",
      12: "Dezembro"
    },
    weekShort: "S{{n}}",
    countLabel_one: "{{count}} artigo",
    countLabel_other: "{{count}} artigos"
  }
}, De = {
  title: "아카이브",
  description: "연도별로 그룹화된 정적 아카이브 페이지를 생성하며 (선택적으로 월 또는 ISO 주별로 세분화) 홈과 카테고리 목록에 '전체 아카이브 보기' 링크를 추가합니다 — 페이지네이션의 정적 호스팅 친화적 대안입니다.",
  regenerationTarget: {
    label: "아카이브",
    description: "모든 기간별 페이지 + /archives/ 인덱스를 지우고 다시 빌드"
  },
  settings: {
    drillDown: "세부 분류",
    drillDownHelp: "각 연도 내의 하위 그룹화. 연도는 항상 최상위 레벨입니다.",
    drillDownNone: "연도만",
    drillDownMonth: "연도 → 월",
    drillDownWeek: "연도 → ISO 주",
    includePages: "게시물 외에 정적 페이지도 포함",
    includePagesHelp: "기본적으로 비활성화 — 페이지는 시간순인 경우가 드뭅니다. 날짜가 있는 글을 페이지로 게시하는 경우 활성화하세요.",
    addArchivesLinkToHome: "홈 페이지에 '전체 아카이브 보기' 링크 표시",
    addArchivesLinkToCategory: "카테고리 아카이브에 '전체 아카이브 보기' 링크 표시",
    showCounts: "각 기간 옆에 게시물 수 표시",
    save: "설정 저장",
    saving: "저장 중…",
    saved: "설정이 저장되었습니다.",
    forceRegenerate: "아카이브 강제 재생성",
    forceRegenerating: "재생성 중…",
    regenerated: "아카이브가 재생성되었습니다 ({{count}}개 파일).",
    regenerateFailed: "아카이브 재생성에 실패했습니다.",
    forceRegenerateHelp: "/archives/ 아래의 모든 파일을 삭제하고 현재 온라인 상태인 모든 게시물로부터 처음부터 다시 빌드합니다. 세부 분류 변경 후 또는 대량 가져오기 후에 유용합니다."
  },
  page: {
    indexTitle: "아카이브",
    yearTitle: "아카이브 — {{year}}",
    monthTitle: "{{year}}년 {{month}}",
    weekTitle: "{{year}}년 {{week}}주",
    indexSubtitle_one: "{{count}}개의 게시물이 게시되었습니다.",
    indexSubtitle_other: "{{count}}개의 게시물이 게시되었습니다.",
    yearSubtitle_one: "{{year}}년에 {{count}}개의 게시물이 게시되었습니다.",
    yearSubtitle_other: "{{year}}년에 {{count}}개의 게시물이 게시되었습니다.",
    monthSubtitle_one: "{{year}}년 {{month}}에 {{count}}개의 게시물이 게시되었습니다.",
    monthSubtitle_other: "{{year}}년 {{month}}에 {{count}}개의 게시물이 게시되었습니다.",
    weekSubtitle_one: "{{year}}년 {{week}}주에 {{count}}개의 게시물이 게시되었습니다.",
    weekSubtitle_other: "{{year}}년 {{week}}주에 {{count}}개의 게시물이 게시되었습니다.",
    empty: "아직 게시된 게시물이 없습니다.",
    backToIndex: "← 전체 아카이브",
    backToYear: "← {{year}}",
    seeFullArchives: "전체 아카이브 보기 →",
    months: {
      1: "1월",
      2: "2월",
      3: "3월",
      4: "4월",
      5: "5월",
      6: "6월",
      7: "7월",
      8: "8월",
      9: "9월",
      10: "10월",
      11: "11월",
      12: "12월"
    },
    weekShort: "W{{n}}",
    countLabel_one: "{{count}}개의 게시물",
    countLabel_other: "{{count}}개의 게시물"
  }
};
function H(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (typeof t.toDate == "function")
    try {
      return t.toDate();
    } catch {
      return null;
    }
  return typeof t.toMillis == "function" ? new Date(t.toMillis()) : null;
}
function x(e) {
  return H(e.publishedAt) ?? H(e.updatedAt) ?? H(e.createdAt);
}
function Le(e) {
  const t = new Date(Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate())), n = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - n);
  const a = t.getUTCFullYear(), r = new Date(Date.UTC(a, 0, 1)), i = Math.ceil(((t.getTime() - r.getTime()) / 864e5 + 1) / 7);
  return { year: a, week: i };
}
function L(e, t) {
  const n = x(e);
  if (!n) return null;
  const a = { kind: "year", year: n.getUTCFullYear() };
  if (t === "month")
    return {
      year: a,
      drill: { kind: "month", year: a.year, month: n.getUTCMonth() + 1 }
    };
  if (t === "week") {
    const r = Le(n);
    return { year: a, drill: { kind: "week", year: r.year, week: r.week } };
  }
  return { year: a, drill: null };
}
const y = "archives", V = `${y}/index.html`;
function U(e, t = y) {
  return `${t}/${e.year}/index.html`;
}
function q(e, t = y) {
  const n = String(e.month).padStart(2, "0");
  return `${t}/${e.year}/${n}/index.html`;
}
function G(e, t = y) {
  const n = String(e.week).padStart(2, "0");
  return `${t}/${e.year}/W${n}/index.html`;
}
function Ne(e, t = y) {
  return e.kind === "year" ? U(e, t) : e.kind === "month" ? q(e, t) : G(e, t);
}
function D(e, t = y) {
  return `/${Ne(e, t).replace(/index\.html$/, "")}`;
}
const Pe = `/${y}/`;
function N(e, t) {
  return !e || e === t ? y : `${e}/${y}`;
}
function B(e, t) {
  return `${N(e, t)}/index.html`;
}
function K(e, t) {
  return `/${N(e, t)}/`;
}
function w(e) {
  return e.kind === "year" ? `Y${e.year}` : e.kind === "month" ? `M${e.year}-${String(e.month).padStart(2, "0")}` : `W${e.year}-${String(e.week).padStart(2, "0")}`;
}
function _(e, t) {
  return e.year !== t.year ? t.year - e.year : e.kind === "month" && t.kind === "month" ? t.month - e.month : e.kind === "week" && t.kind === "week" ? t.week - e.week : 0;
}
function F(e, t, n) {
  const a = /* @__PURE__ */ new Map();
  for (const r of e) {
    const i = L(r, t);
    if (!i) continue;
    const l = n === "year" ? i.year : i.drill ?? i.year, c = w(l);
    let s = a.get(c);
    s || (s = { period: l, posts: [] }, a.set(c, s)), s.posts.push(r);
  }
  return a;
}
function W(e) {
  return [...e].sort((t, n) => {
    var i, l;
    const a = ((i = x(t)) == null ? void 0 : i.getTime()) ?? 0, r = ((l = x(n)) == null ? void 0 : l.getTime()) ?? 0;
    return r !== a ? r - a : t.id < n.id ? 1 : -1;
  });
}
function Ce(e, t) {
  const n = e.primaryTermId ? t.find((a) => a.id === e.primaryTermId) : void 0;
  return `/${he({
    post: e,
    primaryTerm: n ? { ...n, type: "category" } : void 0
  })}`;
}
function j({ post: e, language: t, terms: n }) {
  const a = x(e), r = a ? new Intl.DateTimeFormat(t || "en", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(a) : "";
  return /* @__PURE__ */ h("li", { className: "archives__item", children: [
    /* @__PURE__ */ o("a", { className: "archives__item-link", href: Ce(e, n), children: e.title }),
    r && /* @__PURE__ */ o("time", { className: "archives__item-date", dateTime: a == null ? void 0 : a.toISOString(), children: r })
  ] });
}
function X(e, t) {
  return e.kind === "year" ? String(e.year) : e.kind === "month" ? `${t(`page.months.${e.month}`)} ${e.year}` : t("page.weekTitle", { week: e.week, year: e.year });
}
function He({
  posts: e,
  drillDown: t,
  showCounts: n,
  t: a,
  root: r
}) {
  const i = [...F(e, t, "year").values()].sort(
    (c, s) => _(c.period, s.period)
  ), l = e.length;
  return /* @__PURE__ */ h("main", { className: "archives archives--index", children: [
    /* @__PURE__ */ h("header", { className: "archives__header", children: [
      /* @__PURE__ */ o("h1", { className: "archives__title", children: a("page.indexTitle") }),
      l > 0 && /* @__PURE__ */ o("p", { className: "archives__subtitle", children: a("page.indexSubtitle", { count: l }) })
    ] }),
    l === 0 && /* @__PURE__ */ o("p", { className: "archives__empty", children: a("page.empty") }),
    i.length > 0 && /* @__PURE__ */ o("ul", { className: "archives__years", children: i.map(({ period: c, posts: s }) => {
      const d = c, g = t === "none" ? null : [
        ...F(s, t, "drill").values()
      ].sort((p, m) => _(p.period, m.period));
      return /* @__PURE__ */ h("li", { className: "archives__year", children: [
        /* @__PURE__ */ h("h2", { className: "archives__year-heading", children: [
          /* @__PURE__ */ o("a", { className: "archives__year-link", href: D(d, r), children: d.year }),
          n && /* @__PURE__ */ h("span", { className: "archives__count", children: [
            "(",
            s.length,
            ")"
          ] })
        ] }),
        g && g.length > 0 && /* @__PURE__ */ o("ul", { className: "archives__drilldown", children: g.map(({ period: p, posts: m }) => /* @__PURE__ */ h(
          "li",
          {
            className: "archives__drilldown-item",
            children: [
              /* @__PURE__ */ o(
                "a",
                {
                  className: "archives__drilldown-link",
                  href: D(p, r),
                  children: X(p, a)
                }
              ),
              n && /* @__PURE__ */ h("span", { className: "archives__count", children: [
                "(",
                m.length,
                ")"
              ] })
            ]
          },
          w(p)
        )) })
      ] }, d.year);
    }) })
  ] });
}
function Ie({
  period: e,
  posts: t,
  drillDown: n,
  showCounts: a,
  language: r,
  t: i,
  terms: l,
  root: c,
  indexHref: s
}) {
  const d = W(t);
  let g, p;
  if (e.kind === "year")
    g = i("page.yearTitle", { year: e.year }), p = i("page.yearSubtitle", { count: t.length, year: e.year });
  else if (e.kind === "month") {
    const f = i(`page.months.${e.month}`);
    g = i("page.monthTitle", { month: f, year: e.year }), p = i("page.monthSubtitle", {
      count: t.length,
      month: f,
      year: e.year
    });
  } else
    g = i("page.weekTitle", { week: e.week, year: e.year }), p = i("page.weekSubtitle", {
      count: t.length,
      week: e.week,
      year: e.year
    });
  const m = e.kind === "year" && n !== "none", b = m ? [...F(d, n, "drill").values()].sort(
    (f, k) => _(f.period, k.period)
  ) : null, u = e.kind === "year" ? s ?? Pe : D({ kind: "year", year: e.year }, c), v = e.kind === "year" ? i("page.backToIndex") : i("page.backToYear", { year: e.year });
  return /* @__PURE__ */ h("main", { className: "archives archives--period", children: [
    /* @__PURE__ */ h("header", { className: "archives__header", children: [
      /* @__PURE__ */ o("p", { className: "archives__back", children: /* @__PURE__ */ o("a", { href: u, children: v }) }),
      /* @__PURE__ */ o("h1", { className: "archives__title", children: g }),
      t.length > 0 && /* @__PURE__ */ o("p", { className: "archives__subtitle", children: p })
    ] }),
    t.length === 0 && /* @__PURE__ */ o("p", { className: "archives__empty", children: i("page.empty") }),
    !m && t.length > 0 && /* @__PURE__ */ o("ul", { className: "archives__list", children: d.map((f) => /* @__PURE__ */ o(
      j,
      {
        post: f,
        language: r,
        terms: l
      },
      f.id
    )) }),
    m && b && /* @__PURE__ */ o("div", { className: "archives__groups", children: b.map(({ period: f, posts: k }) => /* @__PURE__ */ h("section", { className: "archives__group", children: [
      /* @__PURE__ */ h("h2", { className: "archives__group-heading", children: [
        /* @__PURE__ */ o(
          "a",
          {
            className: "archives__group-link",
            href: D(f, c),
            children: X(f, i)
          }
        ),
        a && /* @__PURE__ */ h("span", { className: "archives__count", children: [
          "(",
          k.length,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ o("ul", { className: "archives__list", children: W(k).map((A) => /* @__PURE__ */ o(
        j,
        {
          post: A,
          language: r,
          terms: l
        },
        A.id
      )) })
    ] }, w(f))) })
  ] });
}
function Z(e, t, n) {
  if (e === "index")
    return {
      pageTitle: n("page.indexTitle"),
      pageDescription: n("page.indexSubtitle", { count: t })
    };
  if (e.kind === "year")
    return {
      pageTitle: n("page.yearTitle", { year: e.year }),
      pageDescription: n("page.yearSubtitle", { count: t, year: e.year })
    };
  if (e.kind === "month") {
    const r = n(`page.months.${e.month}`);
    return {
      pageTitle: n("page.monthTitle", { month: r, year: e.year }),
      pageDescription: n("page.monthSubtitle", {
        count: t,
        month: r,
        year: e.year
      })
    };
  }
  const a = e;
  return a.kind === "week" ? {
    pageTitle: n("page.weekTitle", { week: a.week, year: a.year }),
    pageDescription: n("page.weekSubtitle", {
      count: t,
      week: a.week,
      year: a.year
    })
  } : { pageTitle: n("page.indexTitle"), pageDescription: "" };
}
const Q = {
  drillDown: "month",
  includePages: !1,
  addArchivesLinkToHome: !0,
  addArchivesLinkToCategory: !0,
  showCounts: !0
}, S = "flexweg-archives";
function ee(e) {
  var n;
  const t = (n = e.pluginConfigs) == null ? void 0 : n[S];
  return { ...Q, ...t ?? {} };
}
function te(e) {
  return {
    posts: e.posts,
    pages: e.pages,
    terms: e.terms,
    media: /* @__PURE__ */ new Map(),
    settings: e.settings,
    users: [],
    authorLookup: () => {
    }
  };
}
function ne(e, t) {
  const n = e.posts.filter((r) => r.status === "online");
  if (!t.includePages) return n;
  const a = e.pages.filter((r) => r.status === "online");
  return [...n, ...a];
}
function Me(e) {
  return e.terms.map((t) => ({ id: t.id, slug: t.slug }));
}
function ae(e) {
  const t = fe(e.data.settings.activeThemeId), n = {
    site: e.site,
    pageTitle: e.pageTitle,
    pageDescription: e.pageDescription,
    currentPath: e.currentPath,
    currentLocale: e.currentLocale
  };
  return ye({
    base: t.templates.base,
    baseProps: n,
    template: e.inner,
    templateProps: e.innerProps
  });
}
async function Fe(e) {
  const { post: t, ...n } = e, a = ee(n.settings), r = { uploaded: [], deleted: [] };
  for (const { language: i, isPrimary: l } of ie(n)) {
    const c = re(n, i, l);
    if (!c) continue;
    const s = N(i, l ? i : "__primary__"), d = B(i, l ? i : "__primary__"), g = K(i, l ? i : "__primary__"), p = await Ye({
      data: c,
      config: a,
      touchedPost: t,
      root: s,
      indexPath: d,
      indexHref: g,
      currentLocale: l ? void 0 : i
    });
    r.uploaded.push(...p.uploaded), r.deleted.push(...p.deleted);
  }
  return r;
}
function Re(e) {
  var r, i;
  if (((r = e.enabledPlugins) == null ? void 0 : r["flexweg-multilang"]) === !1) return null;
  const t = (i = e.pluginConfigs) == null ? void 0 : i["flexweg-multilang"];
  if (!t) return null;
  const n = t.primaryLanguage || (e.language || "en").split("-")[0], a = Array.isArray(t.enabledLanguages) ? t.enabledLanguages : [];
  return a.length === 0 ? null : { primaryLanguage: n, enabledLanguages: a };
}
function Oe(e, t) {
  const n = e.translations, a = n == null ? void 0 : n[t];
  return !a || !a.slug || !a.title ? null : a;
}
function $e(e, t) {
  const n = e.translations, a = n == null ? void 0 : n[t];
  return !a || !a.slug || !a.name ? null : a;
}
function re(e, t, n) {
  if (n)
    return { ...e, settings: { ...e.settings, language: t } };
  const a = `${t}/`, r = e.terms.map((s) => {
    if (s.type !== "category") return s;
    const d = $e(s, t);
    return d ? { ...s, name: d.name, slug: `${a}${d.slug}` } : s;
  }), i = (s) => {
    const d = Oe(s, t);
    if (!d) return null;
    const g = s.type !== "post" || !s.primaryTermId;
    return {
      ...s,
      title: d.title,
      slug: g ? `${a}${d.slug}` : d.slug
    };
  }, l = e.posts.map(i).filter((s) => s !== null), c = e.pages.map(i).filter((s) => s !== null);
  return l.length === 0 && c.length === 0 ? null : {
    posts: l,
    pages: c,
    terms: r,
    settings: { ...e.settings, language: t }
  };
}
function ie(e) {
  const t = Re(e.settings);
  if (!t) return [{ language: e.settings.language || "en", isPrimary: !0 }];
  const n = [
    { language: t.primaryLanguage, isPrimary: !0 }
  ];
  for (const a of t.enabledLanguages)
    a !== t.primaryLanguage && n.push({ language: a, isPrimary: !1 });
  return n;
}
async function oe(e) {
  const t = ee(e.settings), n = { uploaded: [], deleted: [] }, a = ie(e);
  for (const { language: r, isPrimary: i } of a) {
    const l = re(e, r, i);
    if (!l) continue;
    const c = N(r, i ? r : "__primary__"), s = B(r, i ? r : "__primary__"), d = K(r, i ? r : "__primary__");
    await ge(c), n.deleted.push(`${c}/`);
    const g = await We({
      data: l,
      config: t,
      root: c,
      indexPath: s,
      indexHref: d,
      currentLocale: i ? void 0 : r
    });
    n.uploaded.push(...g.uploaded), n.deleted.push(...g.deleted);
  }
  return n;
}
async function We(e) {
  const { data: t, config: n, root: a, indexPath: r, indexHref: i, currentLocale: l } = e, c = { uploaded: [], deleted: [] }, s = ne(t, n), d = te(t), g = se(d, l), p = ze(s, n.drillDown), m = [];
  for (const u of p.years) m.push(u);
  for (const u of p.drills) m.push(u);
  for (const u of m) {
    const v = R(u, a), f = ce({
      data: t,
      config: n,
      site: g,
      period: u,
      entities: s,
      root: a,
      indexHref: i,
      currentLocale: l
    });
    await T({ path: v, content: f }), c.uploaded.push(v), await je(75);
  }
  const b = de({
    data: t,
    config: n,
    site: g,
    entities: s,
    root: a,
    indexPath: r,
    currentLocale: l
  });
  return await T({ path: r, content: b }), c.uploaded.push(r), c;
}
function se(e, t) {
  const n = me(e);
  return t ? { ...n, homePath: `/${t}/index.html` } : n;
}
function R(e, t = y) {
  return e.kind === "year" ? U(e, t) : e.kind === "month" ? q(e, t) : G(e, t);
}
function je(e) {
  return new Promise((t) => setTimeout(t, e));
}
function ze(e, t) {
  const n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
  for (const l of e) {
    const c = L(l, t);
    c && (n.set(w(c.year), c.year), c.drill && a.set(w(c.drill), c.drill));
  }
  const r = [...n.values()].sort(_), i = [...a.values()].sort(_);
  return { years: r, drills: i };
}
function le(e, t, n) {
  return e.filter((a) => {
    var i, l;
    const r = L(a, n);
    return r ? t.kind === "year" ? r.year.year === t.year : t.kind === "month" ? ((i = r.drill) == null ? void 0 : i.kind) === "month" && r.drill.year === t.year && r.drill.month === t.month : ((l = r.drill) == null ? void 0 : l.kind) === "week" && r.drill.year === t.year && r.drill.week === t.week : !1;
  });
}
function ce(e) {
  const t = Y.getFixedT(
    J(e.data.settings.language),
    S
  ), n = le(e.entities, e.period, e.config.drillDown), a = Z(e.period, n.length, t), r = e.root ?? y;
  return ae({
    data: e.data,
    config: e.config,
    site: e.site,
    inner: Ie,
    innerProps: {
      period: e.period,
      posts: n,
      drillDown: e.config.drillDown,
      showCounts: e.config.showCounts,
      language: e.data.settings.language,
      t,
      terms: Me(e.data),
      root: r,
      indexHref: e.indexHref
    },
    pageTitle: a.pageTitle,
    pageDescription: a.pageDescription,
    currentPath: R(e.period, r),
    currentLocale: e.currentLocale
  });
}
function de(e) {
  const t = Y.getFixedT(
    J(e.data.settings.language),
    S
  ), n = Z("index", e.entities.length, t);
  return ae({
    data: e.data,
    config: e.config,
    site: e.site,
    inner: He,
    innerProps: {
      posts: e.entities,
      drillDown: e.config.drillDown,
      showCounts: e.config.showCounts,
      t,
      root: e.root ?? y
    },
    pageTitle: n.pageTitle,
    pageDescription: n.pageDescription,
    currentPath: e.indexPath ?? V,
    currentLocale: e.currentLocale
  });
}
async function Ye(e) {
  const { data: t, config: n, touchedPost: a, currentLocale: r } = e, i = e.root ?? y, l = e.indexPath ?? V, c = e.indexHref, s = { uploaded: [], deleted: [] }, d = ne(t, n), g = te(t), p = se(g, r), m = L(a, n.drillDown), b = [];
  m && (b.push(m.year), m.drill && b.push(m.drill));
  for (const v of b) {
    const f = le(d, v, n.drillDown), k = R(v, i);
    if (f.length === 0) {
      try {
        await pe(k), s.deleted.push(k);
      } catch {
      }
      continue;
    }
    const A = ce({
      data: t,
      config: n,
      site: p,
      period: v,
      entities: d,
      root: i,
      indexHref: c,
      currentLocale: r
    });
    await T({ path: k, content: A }), s.uploaded.push(k);
  }
  const u = de({
    data: t,
    config: n,
    site: p,
    entities: d,
    root: i,
    indexPath: l,
    currentLocale: r
  });
  return await T({ path: l, content: u }), s.uploaded.push(l), s;
}
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Je = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), ue = (...e) => e.filter((t, n, a) => !!t && t.trim() !== "" && a.indexOf(t) === n).join(" ").trim();
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Ee = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ve = E(
  ({
    color: e = "currentColor",
    size: t = 24,
    strokeWidth: n = 2,
    absoluteStrokeWidth: a,
    className: r = "",
    children: i,
    iconNode: l,
    ...c
  }, s) => M(
    "svg",
    {
      ref: s,
      ...Ee,
      width: t,
      height: t,
      stroke: e,
      strokeWidth: a ? Number(n) * 24 / Number(t) : n,
      className: ue("lucide", r),
      ...c
    },
    [
      ...l.map(([d, g]) => M(d, g)),
      ...Array.isArray(i) ? i : [i]
    ]
  )
);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const O = (e, t) => {
  const n = E(
    ({ className: a, ...r }, i) => M(Ve, {
      ref: i,
      iconNode: t,
      className: ue(`lucide-${Je(e)}`, a),
      ...r
    })
  );
  return n.displayName = `${e}`, n;
};
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const z = O("LoaderCircle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ue = O("RefreshCw", [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
]);
/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const qe = O("Save", [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
]);
function Ge({
  config: e,
  save: t
}) {
  const { t: n } = ke("flexweg-archives"), { terms: a, settings: r } = ve(), [i, l] = C(e);
  be(() => l(e), [e]);
  const [c, s] = C(!1), [d, g] = C(!1);
  function p(u) {
    l((v) => ({ ...v, ...u }));
  }
  async function m() {
    s(!0);
    try {
      await t(i), P.success(n("settings.saved"));
    } finally {
      s(!1);
    }
  }
  async function b() {
    g(!0);
    try {
      await t(i);
      const [u, v] = await Promise.all([
        $({ type: "post" }),
        $({ type: "page" })
      ]), f = await oe({ posts: u, pages: v, terms: a, settings: r });
      P.success(n("settings.regenerated", { count: f.uploaded.length }));
    } catch (u) {
      console.error("[flexweg-archives] regeneration failed:", u), P.error(n("settings.regenerateFailed"));
    } finally {
      g(!1);
    }
  }
  return /* @__PURE__ */ h("div", { className: "space-y-4", children: [
    /* @__PURE__ */ h("section", { className: "card p-4 space-y-4", children: [
      /* @__PURE__ */ h("header", { className: "space-y-1", children: [
        /* @__PURE__ */ o("h2", { className: "font-semibold", children: n("title") }),
        /* @__PURE__ */ o("p", { className: "text-sm text-surface-600 dark:text-surface-300", children: n("description") })
      ] }),
      /* @__PURE__ */ h("div", { className: "space-y-2", children: [
        /* @__PURE__ */ o("label", { className: "label", children: n("settings.drillDown") }),
        /* @__PURE__ */ o("div", { className: "flex flex-col gap-1", children: ["none", "month", "week"].map((u) => /* @__PURE__ */ h("label", { className: "inline-flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ o(
            "input",
            {
              type: "radio",
              name: "drillDown",
              value: u,
              checked: i.drillDown === u,
              onChange: () => p({ drillDown: u })
            }
          ),
          /* @__PURE__ */ o("span", { children: n(
            u === "none" ? "settings.drillDownNone" : u === "month" ? "settings.drillDownMonth" : "settings.drillDownWeek"
          ) })
        ] }, u)) }),
        /* @__PURE__ */ o("p", { className: "text-xs text-surface-500 dark:text-surface-400", children: n("settings.drillDownHelp") })
      ] }),
      /* @__PURE__ */ h("div", { children: [
        /* @__PURE__ */ h("label", { className: "inline-flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ o(
            "input",
            {
              type: "checkbox",
              checked: i.includePages,
              onChange: (u) => p({ includePages: u.target.checked })
            }
          ),
          /* @__PURE__ */ o("span", { children: n("settings.includePages") })
        ] }),
        /* @__PURE__ */ o("p", { className: "text-xs text-surface-500 mt-1 dark:text-surface-400", children: n("settings.includePagesHelp") })
      ] }),
      /* @__PURE__ */ o("div", { children: /* @__PURE__ */ h("label", { className: "inline-flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ o(
          "input",
          {
            type: "checkbox",
            checked: i.showCounts,
            onChange: (u) => p({ showCounts: u.target.checked })
          }
        ),
        /* @__PURE__ */ o("span", { children: n("settings.showCounts") })
      ] }) }),
      /* @__PURE__ */ o("div", { children: /* @__PURE__ */ h("label", { className: "inline-flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ o(
          "input",
          {
            type: "checkbox",
            checked: i.addArchivesLinkToHome,
            onChange: (u) => p({ addArchivesLinkToHome: u.target.checked })
          }
        ),
        /* @__PURE__ */ o("span", { children: n("settings.addArchivesLinkToHome") })
      ] }) }),
      /* @__PURE__ */ o("div", { children: /* @__PURE__ */ h("label", { className: "inline-flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ o(
          "input",
          {
            type: "checkbox",
            checked: i.addArchivesLinkToCategory,
            onChange: (u) => p({ addArchivesLinkToCategory: u.target.checked })
          }
        ),
        /* @__PURE__ */ o("span", { children: n("settings.addArchivesLinkToCategory") })
      ] }) }),
      /* @__PURE__ */ o("div", { className: "pt-2", children: /* @__PURE__ */ o(
        "button",
        {
          type: "button",
          className: "btn-primary",
          onClick: m,
          disabled: c,
          children: /* @__PURE__ */ h("span", { className: "inline-flex items-center justify-center gap-1.5", children: [
            /* @__PURE__ */ o(z, { className: "h-4 w-4 animate-spin " + (c ? "" : "hidden") }),
            /* @__PURE__ */ o(qe, { className: "h-4 w-4 " + (c ? "hidden" : "") }),
            /* @__PURE__ */ o("span", { children: n(c ? "settings.saving" : "settings.save") })
          ] })
        }
      ) })
    ] }),
    /* @__PURE__ */ h("section", { className: "card p-4 space-y-3", children: [
      /* @__PURE__ */ h("header", { children: [
        /* @__PURE__ */ o("h2", { className: "font-semibold", children: n("settings.forceRegenerate") }),
        /* @__PURE__ */ o("p", { className: "text-sm text-surface-600 dark:text-surface-300 mt-1", children: n("settings.forceRegenerateHelp") })
      ] }),
      /* @__PURE__ */ o("div", { children: /* @__PURE__ */ o(
        "button",
        {
          type: "button",
          className: "btn-secondary",
          onClick: b,
          disabled: d,
          children: /* @__PURE__ */ h("span", { className: "inline-flex items-center justify-center gap-1.5", children: [
            /* @__PURE__ */ o(z, { className: "h-4 w-4 animate-spin " + (d ? "" : "hidden") }),
            /* @__PURE__ */ o(Ue, { className: "h-4 w-4 " + (d ? "hidden" : "") }),
            /* @__PURE__ */ o("span", { children: n(d ? "settings.forceRegenerating" : "settings.forceRegenerate") })
          ] })
        }
      ) })
    ] })
  ] });
}
const Be = `# Flexweg Archives

Static archive pages — a search-engine-friendly, static-hosting-friendly alternative to pagination.

## What it does

When enabled, this plugin produces a tree of HTML pages under \`/archives/\` on your public site:

\`\`\`
/archives/                       → top-level table of contents
/archives/2026/                  → all posts published in 2026
/archives/2026/01/   (optional)  → posts of January 2026
/archives/2026/W23/  (optional)  → posts of ISO week 23, 2026
\`\`\`

Each page lists post titles + dates, all linking to the live post URL. The pages live in the active theme's \`BaseLayout\`, so header / footer / branding stay consistent with the rest of the site.

It also injects a **"See full archives →"** link below the home page and category archive listings (toggleable per destination), letting visitors browse older posts without paginating — the entire archive is one click away from any landing page.

## Why archives, not pagination

Static hosting (no server, no JS reads) makes pagination expensive: every paginated page must be pre-generated, every link must be a real file, and any post added forces every page after that to shift. Archives are O(1) per write — adding a post touches at most three files (the year page, the optional drill-down page, the index) regardless of how many posts exist on the site.

## Settings

Reachable from **Plugins → Configure** or directly at \`/admin/#/settings/plugin/flexweg-archives\`.

| Setting | Default | Effect |
|---|---|---|
| Drill-down | \`Year → month\` | Sub-grouping inside each year. Years are always the top level. Pick \`none\` for one big year-list page, \`month\` for \`/archives/2026/01/\` sub-pages, or \`week\` for \`/archives/2026/W23/\` sub-pages. |
| Include static pages | Off | When on, static pages (type \`page\`) appear in the archives alongside posts. Most sites keep this off — pages are rarely chronological. |
| Show counts | On | Whether to append \`(N)\` to each period entry in the index. |
| Show "See full archives" on home | On | Renders a footer link below the home page listing. Hidden when no posts exist yet. |
| Show "See full archives" on category | On | Same, on category archive pages. |

There's also a **Force regenerate** button that wipes \`/archives/\` on Flexweg and rebuilds every file from scratch using the currently-online post set. Use it after switching drill-down (so old \`/2025/01/\` pages stop existing if you switched to weekly) or after a bulk import.

## How regeneration works

The plugin subscribes to three lifecycle hooks: \`publish.complete\`, \`post.unpublished\`, \`post.deleted\`. On every event:

1. It computes the periods the touched post belongs to (year + drill-down).
2. For each, it re-renders the corresponding archive page if any post still belongs there, or **deletes** the file if the period just emptied out.
3. It always re-renders \`/archives/index.html\` to keep the counts and period list honest.

So changing a post's status or deleting it never leaves a dangling reference, and never regenerates files that didn't change.

## URL strategy

| Period | Path | Example |
|---|---|---|
| Index | \`/archives/\` | \`/archives/\` |
| Year | \`/archives/<YYYY>/\` | \`/archives/2026/\` |
| Month | \`/archives/<YYYY>/<MM>/\` | \`/archives/2026/01/\` |
| Week | \`/archives/<YYYY>/W<NN>/\` | \`/archives/2026/W23/\` |

ISO 8601 weeks are used for the week drill-down, so dates near year boundaries (e.g. Dec 31 2024 → ISO 2025-W01) land in the correct week. The year shown for a week page is the **ISO week-numbering year**, not the calendar year of the underlying date.

## Date used to bucket a post

\`publishedAt\` is the source of truth. When missing (rare — predates the field, or the post was online before \`publishedAt\` was tracked), the plugin falls back to \`updatedAt\`, then \`createdAt\`. The same chain RSS and sitemaps use, so a post lands in the same period across all three plugins.

## Customising the look

The plugin renders archive HTML wrapped in the active theme's \`BaseLayout\`, with the inner content using these BEM-style classes:

\`\`\`
.archives                 wrapper
.archives__header         page heading + subtitle
.archives__title
.archives__subtitle
.archives__back           "← All archives" / "← <year>" link
.archives__empty          empty-state message

.archives__years          <ul> of years on the index
.archives__year           one year on the index
.archives__year-heading
.archives__year-link
.archives__drilldown      <ul> of months/weeks under a year (drill-down on)
.archives__drilldown-item
.archives__drilldown-link
.archives__count          "(12)" after period names

.archives__list           <ul> of posts on a period page
.archives__item           single post entry
.archives__item-link
.archives__item-date

.archives__groups         year page split by month/week (drill-down on)
.archives__group
.archives__group-heading
.archives__group-link

.archives-link            the "See full archives →" link inserted on home/cat
\`\`\`

The default theme ships baseline styles in \`themes/default/theme.scss\` (under \`// Archives plugin styles\`). Custom themes override or replace as needed — the markup stays the same, only CSS changes.

## Translations

Bundled translations cover all seven admin locales (\`en\`, \`fr\`, \`de\`, \`es\`, \`nl\`, \`pt\`, \`ko\`). The settings page is rendered in the admin's locale (via \`useTranslation("flexweg-archives")\`); the public-facing strings (page titles, "See full archives →", month names) are baked into HTML at publish time, resolved against the **public site language** (\`settings.language\`) via prefix match — so a site with \`language: "fr-CA"\` gets French archives pages.

For a locale outside the supported set, the plugin falls back to English on the public side. The \`<html lang>\` attribute keeps the original BCP-47 tag intact.

## Overriding the markup

The current implementation does not expose the archive templates as a hook surface — if you want a fundamentally different layout (e.g. a calendar grid instead of a list), the practical path is to fork \`src/plugins/flexweg-archives/render.tsx\` in your project. The data shape (\`ArchivePeriod\`, \`Post[]\`, \`t\` function for translations) is stable enough to swap the inner JSX without touching the generator.

## Disabling the plugin

Toggling the plugin off in **Plugins** stops:

- The lifecycle hooks (existing archive files stay where they are — they just no longer auto-update).
- The \`addArchivesLinkToHome\` / \`addArchivesLinkToCategory\` link injection on the next home / category re-publish.

To clean up the stale archive files after disabling, click **Force regenerate** once **before** disabling (it'll wipe and rebuild — leaving an up-to-date snapshot), or manually delete the \`/archives/\` folder on Flexweg via the dashboard.
`;
async function I(e, t) {
  try {
    await Fe({
      post: e,
      posts: t.posts,
      pages: t.pages,
      terms: t.terms,
      settings: t.settings
    });
  } catch (n) {
    console.error("[flexweg-archives] regeneration failed:", n);
  }
}
const et = {
  id: S,
  name: "Flexweg Archives",
  version: "1.0.0",
  author: "Flexweg",
  description: "Generates static archive pages grouped by year (and optionally month or ISO week) and adds a 'See full archives' link to home / category listings — a static-friendly alternative to pagination.",
  readme: Be,
  i18n: { en: we, fr: _e, de: Se, es: Ae, nl: Te, pt: xe, ko: De },
  settings: {
    navLabelKey: "title",
    defaultConfig: Q,
    component: Ge
  },
  register(e) {
    e.addAction("publish.complete", async (t, n) => {
      await I(t, n);
    }), e.addAction("post.unpublished", async (t, n) => {
      await I(t, n);
    }), e.addAction("post.deleted", async (t, n) => {
      await I(t, n);
    }), e.registerRegenerationTarget({
      id: S,
      labelKey: "regenerationTarget.label",
      descriptionKey: "regenerationTarget.description",
      priority: 230,
      run: async (t, n) => {
        n({ level: "info", message: "Regenerating archive pages…" });
        const a = await oe({
          posts: t.posts,
          pages: t.pages,
          terms: t.terms,
          settings: t.settings
        });
        n({
          level: "success",
          message: `Archives: ${a.uploaded.length} uploaded, ${a.deleted.length} removed.`
        });
      }
    });
  }
};
export {
  et as manifest
};
