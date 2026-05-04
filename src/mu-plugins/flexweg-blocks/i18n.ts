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
      colsHelp:
        "2 to 4 columns. Reducing the count removes the trailing columns and their content. Custom widths are reset on every change.",
      customWidths: "Custom widths",
      widthsHelp:
        "Values are proportional, not absolute — 80/20 and 50/50 both work. Mobile stacking ignores these.",
      colN: "Col {{n}}",
      resetWidths: "Reset to equal",
    },
    html: {
      title: "Custom HTML",
      codeLabel: "HTML / JS / CSS",
      placeholder:
        "Write your HTML, CSS or JavaScript here. Anything you type runs verbatim on the published page.",
      editInSidebar: "Empty — open the right sidebar's Block tab to add code.",
      loadingEditor: "Loading code editor…",
      expand: "Expand",
      modalTitle: "Custom HTML",
      modalClose: "Close",
      lines: "{{n}} line",
      lines_other: "{{n}} lines",
      warning:
        "Code in this block runs as-is on the published page — including <script> tags. No sanitisation.",
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
        "2 à 4 colonnes. Réduire le nombre supprime les colonnes finales et leur contenu. Les largeurs custom sont réinitialisées à chaque changement.",
      customWidths: "Largeurs personnalisées",
      widthsHelp:
        "Les valeurs sont proportionnelles, pas absolues — 80/20 et 50/50 fonctionnent tous les deux. L'empilement mobile ignore ces réglages.",
      colN: "Col {{n}}",
      resetWidths: "Réinitialiser",
    },
    html: {
      title: "HTML libre",
      codeLabel: "HTML / JS / CSS",
      placeholder:
        "Écrivez votre HTML, CSS ou JavaScript ici. Tout ce que vous tapez s'exécute tel quel sur la page publiée.",
      editInSidebar:
        "Vide — ouvrez l'onglet Bloc dans la barre latérale droite pour saisir du code.",
      loadingEditor: "Chargement de l'éditeur…",
      expand: "Agrandir",
      modalTitle: "HTML libre",
      modalClose: "Fermer",
      lines: "{{n}} ligne",
      lines_other: "{{n}} lignes",
      warning:
        "Le code de ce bloc s'exécute tel quel sur la page publiée — y compris les <script>. Aucune sanitisation.",
    },
  },
};

export const de: typeof en = {
  blocks: {
    columns: {
      title: "Spalten",
      description: "Teilt in 2 bis 4 nebeneinander liegende Spalten. Wird auf Mobilgeräten gestapelt.",
      cols: "Anzahl der Spalten",
      colsHelp:
        "2 bis 4 Spalten. Beim Reduzieren werden die letzten Spalten und ihr Inhalt entfernt. Benutzerdefinierte Breiten werden bei jeder Änderung zurückgesetzt.",
      customWidths: "Benutzerdefinierte Breiten",
      widthsHelp:
        "Werte sind proportional, nicht absolut — 80/20 und 50/50 funktionieren beide. Mobile Stapelung ignoriert diese Werte.",
      colN: "Spalte {{n}}",
      resetWidths: "Auf gleich zurücksetzen",
    },
    html: {
      title: "Eigenes HTML",
      codeLabel: "HTML / JS / CSS",
      placeholder:
        "Schreiben Sie Ihr HTML, CSS oder JavaScript hier. Alles, was Sie eingeben, läuft unverändert auf der veröffentlichten Seite.",
      editInSidebar: "Leer — öffnen Sie den Block-Tab der rechten Seitenleiste, um Code hinzuzufügen.",
      loadingEditor: "Code-Editor wird geladen…",
      expand: "Vergrößern",
      modalTitle: "Eigenes HTML",
      modalClose: "Schließen",
      lines: "{{n}} Zeile",
      lines_other: "{{n}} Zeilen",
      warning:
        "Code in diesem Block läuft unverändert auf der veröffentlichten Seite — einschließlich <script>-Tags. Keine Bereinigung.",
    },
  },
};

export const es: typeof en = {
  blocks: {
    columns: {
      title: "Columnas",
      description: "Divide en 2 a 4 columnas lado a lado. Se apila en móvil.",
      cols: "Número de columnas",
      colsHelp:
        "De 2 a 4 columnas. Reducir el número elimina las columnas finales y su contenido. Las anchuras personalizadas se reinician en cada cambio.",
      customWidths: "Anchuras personalizadas",
      widthsHelp:
        "Los valores son proporcionales, no absolutos — 80/20 y 50/50 ambos funcionan. El apilado móvil ignora estos ajustes.",
      colN: "Col. {{n}}",
      resetWidths: "Restablecer iguales",
    },
    html: {
      title: "HTML personalizado",
      codeLabel: "HTML / JS / CSS",
      placeholder:
        "Escribe aquí tu HTML, CSS o JavaScript. Todo lo que escribas se ejecuta tal cual en la página publicada.",
      editInSidebar:
        "Vacío — abre la pestaña Bloque en la barra lateral derecha para añadir código.",
      loadingEditor: "Cargando editor de código…",
      expand: "Ampliar",
      modalTitle: "HTML personalizado",
      modalClose: "Cerrar",
      lines: "{{n}} línea",
      lines_other: "{{n}} líneas",
      warning:
        "El código de este bloque se ejecuta tal cual en la página publicada — incluidas las etiquetas <script>. Sin sanitización.",
    },
  },
};

export const nl: typeof en = {
  blocks: {
    columns: {
      title: "Kolommen",
      description: "Splits in 2 tot 4 naast elkaar staande kolommen. Stapelt op mobiel.",
      cols: "Aantal kolommen",
      colsHelp:
        "2 tot 4 kolommen. Bij verlaging worden de laatste kolommen en hun inhoud verwijderd. Aangepaste breedtes worden bij elke wijziging gereset.",
      customWidths: "Aangepaste breedtes",
      widthsHelp:
        "Waarden zijn proportioneel, niet absoluut — 80/20 en 50/50 werken beide. Mobiel stapelen negeert deze.",
      colN: "Kol {{n}}",
      resetWidths: "Naar gelijk herstellen",
    },
    html: {
      title: "Eigen HTML",
      codeLabel: "HTML / JS / CSS",
      placeholder:
        "Schrijf hier je HTML, CSS of JavaScript. Alles wat je typt, draait letterlijk op de gepubliceerde pagina.",
      editInSidebar:
        "Leeg — open het tabblad Blok in de rechter zijbalk om code toe te voegen.",
      loadingEditor: "Code-editor laden…",
      expand: "Vergroten",
      modalTitle: "Eigen HTML",
      modalClose: "Sluiten",
      lines: "{{n}} regel",
      lines_other: "{{n}} regels",
      warning:
        "Code in dit blok draait ongewijzigd op de gepubliceerde pagina — inclusief <script>-tags. Geen sanering.",
    },
  },
};

export const pt: typeof en = {
  blocks: {
    columns: {
      title: "Colunas",
      description: "Divide em 2 a 4 colunas lado a lado. Empilha no mobile.",
      cols: "Número de colunas",
      colsHelp:
        "De 2 a 4 colunas. Reduzir o número remove as colunas finais e o seu conteúdo. As larguras personalizadas são reiniciadas em cada alteração.",
      customWidths: "Larguras personalizadas",
      widthsHelp:
        "Os valores são proporcionais, não absolutos — 80/20 e 50/50 ambos funcionam. O empilhamento móvel ignora estas definições.",
      colN: "Col. {{n}}",
      resetWidths: "Repor iguais",
    },
    html: {
      title: "HTML personalizado",
      codeLabel: "HTML / JS / CSS",
      placeholder:
        "Escreve aqui o teu HTML, CSS ou JavaScript. Tudo o que escreveres corre tal qual na página publicada.",
      editInSidebar:
        "Vazio — abre o separador Bloco na barra lateral direita para adicionar código.",
      loadingEditor: "A carregar editor de código…",
      expand: "Ampliar",
      modalTitle: "HTML personalizado",
      modalClose: "Fechar",
      lines: "{{n}} linha",
      lines_other: "{{n}} linhas",
      warning:
        "O código deste bloco corre tal qual na página publicada — incluindo as tags <script>. Sem sanitização.",
    },
  },
};

export const ko: typeof en = {
  blocks: {
    columns: {
      title: "열",
      description: "2~4개의 나란한 열로 분할합니다. 모바일에서는 세로로 쌓입니다.",
      cols: "열 개수",
      colsHelp:
        "2~4개의 열. 개수를 줄이면 마지막 열과 그 내용이 제거됩니다. 사용자 정의 너비는 변경할 때마다 초기화됩니다.",
      customWidths: "사용자 정의 너비",
      widthsHelp:
        "값은 절대값이 아닌 비율입니다 — 80/20과 50/50 모두 동작합니다. 모바일 스택은 이 설정을 무시합니다.",
      colN: "열 {{n}}",
      resetWidths: "균등하게 재설정",
    },
    html: {
      title: "사용자 정의 HTML",
      codeLabel: "HTML / JS / CSS",
      placeholder:
        "여기에 HTML, CSS 또는 JavaScript를 작성하세요. 입력한 내용은 게시된 페이지에서 그대로 실행됩니다.",
      editInSidebar:
        "비어 있음 — 코드를 추가하려면 오른쪽 사이드바의 블록 탭을 여세요.",
      loadingEditor: "코드 편집기 로딩 중…",
      expand: "확장",
      modalTitle: "사용자 정의 HTML",
      modalClose: "닫기",
      lines: "{{n}} 줄",
      lines_other: "{{n}} 줄",
      warning:
        "이 블록의 코드는 <script> 태그를 포함해 게시된 페이지에서 그대로 실행됩니다. 정제 처리는 없습니다.",
    },
  },
};
