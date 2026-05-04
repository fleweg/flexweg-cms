// Bundled translations for the flexweg-custom-code plugin. Loaded
// into a dedicated i18next namespace named "flexweg-custom-code"
// at module import time (see src/plugins/index.ts). Plugin UI calls
// useTranslation("flexweg-custom-code") to scope its keys.

export const en = {
  title: "Custom code",
  description:
    "Inject site-wide HTML / CSS / JS into the <head> or before the </body> of every published page.",
  warning:
    "Code is injected as-is on every page. No sanitisation — a broken <script> can take down the whole site until you fix it.",
  loadingEditor: "Loading code editor…",
  expand: "Expand",
  modalClose: "Close",
  head: {
    title: "Head",
    help:
      "Appended at the bottom of every page's <head>. Best for analytics, fonts, custom <style> overrides.",
    placeholder:
      "<!-- e.g. <script>...</script> for Google Analytics, <style>body{...}</style> for overrides -->",
  },
  body: {
    title: "Body end",
    help:
      "Appended just before </body>. Best for deferred scripts (chat widgets, late analytics) that need the DOM parsed.",
    placeholder:
      "<!-- e.g. <script>...</script> for a chat widget that needs the DOM ready -->",
  },
  save: "Save",
  saving: "Saving…",
  saved: "Custom code saved.",
  saveFailed: "Save failed.",
  republishHint:
    "Republish your posts and pages (Themes → Regenerate site) to push the new code to all already-online files.",
};

export const fr: typeof en = {
  title: "Code personnalisé",
  description:
    "Injectez du HTML / CSS / JS site-wide dans le <head> ou avant la fin du <body> de chaque page publiée.",
  warning:
    "Le code est injecté tel quel sur toutes les pages. Aucune sanitisation — un <script> cassé peut faire tomber tout le site jusqu'à correction.",
  loadingEditor: "Chargement de l'éditeur…",
  expand: "Agrandir",
  modalClose: "Fermer",
  head: {
    title: "Head",
    help:
      "Ajouté en bas du <head> de chaque page. Idéal pour les analytics, les fonts, les surcharges <style>.",
    placeholder:
      "<!-- ex. <script>...</script> pour Google Analytics, <style>body{...}</style> pour des surcharges -->",
  },
  body: {
    title: "Fin du body",
    help:
      "Ajouté juste avant </body>. Idéal pour les scripts différés (widgets chat, analytics tardifs) qui ont besoin du DOM parsé.",
    placeholder:
      "<!-- ex. <script>...</script> pour un widget chat qui a besoin du DOM prêt -->",
  },
  save: "Enregistrer",
  saving: "Enregistrement…",
  saved: "Code personnalisé enregistré.",
  saveFailed: "Échec de l'enregistrement.",
  republishHint:
    "Republiez vos articles et pages (Thèmes → Régénérer le site) pour pousser le nouveau code dans tous les fichiers déjà en ligne.",
};

export const de: typeof en = {
  title: "Eigener Code",
  description:
    "Fügen Sie site-weites HTML / CSS / JS in den <head> oder vor das </body> jeder veröffentlichten Seite ein.",
  warning:
    "Code wird unverändert auf jeder Seite eingefügt. Keine Bereinigung — ein fehlerhaftes <script> kann die gesamte Website bis zur Korrektur lahmlegen.",
  loadingEditor: "Code-Editor wird geladen…",
  expand: "Vergrößern",
  modalClose: "Schließen",
  head: {
    title: "Head",
    help:
      "Wird unten im <head> jeder Seite eingefügt. Ideal für Analytics, Fonts, eigene <style>-Überschreibungen.",
    placeholder:
      "<!-- z. B. <script>...</script> für Google Analytics, <style>body{...}</style> für Überschreibungen -->",
  },
  body: {
    title: "Body-Ende",
    help:
      "Wird direkt vor </body> eingefügt. Ideal für verzögerte Skripte (Chat-Widgets, späte Analytics), die ein geparstes DOM benötigen.",
    placeholder:
      "<!-- z. B. <script>...</script> für ein Chat-Widget, das ein bereites DOM benötigt -->",
  },
  save: "Speichern",
  saving: "Speichert…",
  saved: "Eigener Code gespeichert.",
  saveFailed: "Speichern fehlgeschlagen.",
  republishHint:
    "Veröffentlichen Sie Ihre Artikel und Seiten erneut (Themes → Website neu generieren), um den neuen Code in alle bereits online stehenden Dateien zu übertragen.",
};

export const es: typeof en = {
  title: "Código personalizado",
  description:
    "Inyecta HTML / CSS / JS para todo el sitio en el <head> o antes de </body> de cada página publicada.",
  warning:
    "El código se inyecta tal cual en cada página. Sin sanitización — un <script> roto puede tirar todo el sitio hasta que lo corrijas.",
  loadingEditor: "Cargando editor de código…",
  expand: "Ampliar",
  modalClose: "Cerrar",
  head: {
    title: "Head",
    help:
      "Añadido al final del <head> de cada página. Ideal para analítica, fuentes, anulaciones <style>.",
    placeholder:
      "<!-- p. ej. <script>...</script> para Google Analytics, <style>body{...}</style> para anulaciones -->",
  },
  body: {
    title: "Fin del body",
    help:
      "Añadido justo antes de </body>. Ideal para scripts diferidos (widgets de chat, analítica tardía) que necesitan el DOM parseado.",
    placeholder:
      "<!-- p. ej. <script>...</script> para un widget de chat que necesita el DOM listo -->",
  },
  save: "Guardar",
  saving: "Guardando…",
  saved: "Código personalizado guardado.",
  saveFailed: "Error al guardar.",
  republishHint:
    "Republica tus entradas y páginas (Temas → Regenerar el sitio) para empujar el nuevo código a todos los archivos ya en línea.",
};

export const nl: typeof en = {
  title: "Eigen code",
  description:
    "Plaats site-brede HTML / CSS / JS in de <head> of vóór de </body> van elke gepubliceerde pagina.",
  warning:
    "Code wordt ongewijzigd op elke pagina ingevoegd. Geen sanering — een kapot <script> kan de hele site neerhalen tot je het herstelt.",
  loadingEditor: "Code-editor laden…",
  expand: "Vergroten",
  modalClose: "Sluiten",
  head: {
    title: "Head",
    help:
      "Toegevoegd aan het einde van de <head> van elke pagina. Ideaal voor analytics, lettertypen, aangepaste <style>-overrides.",
    placeholder:
      "<!-- bv. <script>...</script> voor Google Analytics, <style>body{...}</style> voor overrides -->",
  },
  body: {
    title: "Einde body",
    help:
      "Toegevoegd vlak vóór </body>. Ideaal voor uitgestelde scripts (chat-widgets, late analytics) die een geparste DOM nodig hebben.",
    placeholder:
      "<!-- bv. <script>...</script> voor een chat-widget dat een gereed DOM nodig heeft -->",
  },
  save: "Opslaan",
  saving: "Opslaan…",
  saved: "Eigen code opgeslagen.",
  saveFailed: "Opslaan mislukt.",
  republishHint:
    "Publiceer je berichten en pagina's opnieuw (Thema's → Site opnieuw genereren) om de nieuwe code naar alle reeds online bestanden te pushen.",
};

export const pt: typeof en = {
  title: "Código personalizado",
  description:
    "Injeta HTML / CSS / JS para todo o site no <head> ou antes de </body> de cada página publicada.",
  warning:
    "O código é injetado tal qual em cada página. Sem sanitização — um <script> avariado pode deitar abaixo o site inteiro até o corrigires.",
  loadingEditor: "A carregar editor de código…",
  expand: "Ampliar",
  modalClose: "Fechar",
  head: {
    title: "Head",
    help:
      "Adicionado no fim do <head> de cada página. Ideal para analítica, tipos de letra, sobreposições <style>.",
    placeholder:
      "<!-- p. ex. <script>...</script> para Google Analytics, <style>body{...}</style> para sobreposições -->",
  },
  body: {
    title: "Fim do body",
    help:
      "Adicionado mesmo antes de </body>. Ideal para scripts diferidos (widgets de chat, analítica tardia) que precisam do DOM analisado.",
    placeholder:
      "<!-- p. ex. <script>...</script> para um widget de chat que precisa do DOM pronto -->",
  },
  save: "Guardar",
  saving: "A guardar…",
  saved: "Código personalizado guardado.",
  saveFailed: "Falha ao guardar.",
  republishHint:
    "Republica os teus artigos e páginas (Temas → Regenerar o site) para empurrar o novo código para todos os ficheiros já online.",
};

export const ko: typeof en = {
  title: "사용자 정의 코드",
  description:
    "게시되는 모든 페이지의 <head> 또는 </body> 직전에 사이트 전체 HTML / CSS / JS를 삽입합니다.",
  warning:
    "코드는 모든 페이지에 그대로 삽입됩니다. 정제 처리는 없습니다 — 잘못된 <script>는 수정 전까지 사이트 전체를 다운시킬 수 있습니다.",
  loadingEditor: "코드 편집기 로딩 중…",
  expand: "확장",
  modalClose: "닫기",
  head: {
    title: "Head",
    help:
      "각 페이지의 <head> 하단에 추가됩니다. 분석 도구, 글꼴, 사용자 정의 <style> 재정의에 적합합니다.",
    placeholder:
      "<!-- 예: <script>...</script> Google Analytics, <style>body{...}</style> 재정의 -->",
  },
  body: {
    title: "Body 끝",
    help:
      "</body> 직전에 추가됩니다. DOM 파싱이 필요한 지연 스크립트(채팅 위젯, 후속 분석)에 적합합니다.",
    placeholder:
      "<!-- 예: <script>...</script> DOM이 준비된 후 실행되는 채팅 위젯 -->",
  },
  save: "저장",
  saving: "저장 중…",
  saved: "사용자 정의 코드가 저장되었습니다.",
  saveFailed: "저장에 실패했습니다.",
  republishHint:
    "이미 게시된 모든 파일에 새 코드를 적용하려면 게시물과 페이지를 재게시하세요 (테마 → 사이트 재생성).",
};
