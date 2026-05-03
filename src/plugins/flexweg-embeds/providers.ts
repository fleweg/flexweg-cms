import { Music, Twitter, Video, Youtube } from "lucide-react";
import type { ComponentType } from "react";

// One descriptor per supported embed kind. The Tiptap node factory
// reads these to build a node per provider; the publish-time transform
// reads them to render iframes; the inspector reads them for help text
// and icons. Adding a new provider is exactly one entry in this map
// plus, optionally, an i18n key.
export interface EmbedProvider {
  // Stable id; appears in `data-cms-embed="<id>"` markers and the
  // matching Tiptap node name (camelCase prefix `embed`).
  providerId: string;
  // i18n key used for the inserter label and inspector heading.
  // Resolved against the plugin's own namespace ("flexweg-embeds").
  titleKey: string;
  // Lucide-style icon — same prop shape as block manifests.
  icon: ComponentType<{ className?: string }>;
  // i18n key for the URL input's help text. Same namespace as titleKey.
  hintKey: string;
  // Parses a public URL into the provider-specific identifier (video
  // ID, tweet ID, "<kind>/<id>" for Spotify). Returns null when the
  // URL doesn't match this provider.
  parseUrl(url: string): string | null;
  // Builds the embed HTML. Used both at publish time (post.html.body
  // filter replaces markers with this output) and inside the editor
  // (NodeView injects it via dangerouslySetInnerHTML). All current
  // providers use a self-contained iframe — same markup works in both
  // contexts. Providers that need a different in-editor representation
  // can override via `renderEditorPreview`.
  renderHtml(id: string): string;
  // Optional override for the in-editor preview. Defaults to renderHtml.
  // Useful if a provider's published-page embed depends on a runtime
  // script that the admin can't load (CSP, sandboxing, …) — in that
  // case the editor can fall back to a static placeholder.
  renderEditorPreview?(id: string): string;
  // Optional script tag emitted at body-end when at least one block
  // of this provider is present on the published page. Used by
  // providers whose embed needs a host-side runtime script
  // (Instagram embed.js, TikTok, …). Currently unused — every shipped
  // provider relies on a self-contained iframe.
  bodyScript?: string;
  // URL of a runtime script the in-editor NodeView needs to load to
  // render the preview properly. Same use-case as bodyScript but
  // scoped to the admin. Loaded lazily and only once per session via
  // scriptLoader.loadScriptOnce.
  editorScript?: string;
  // Callback invoked after the NodeView injected the preview HTML and
  // `editorScript` (if any) finished loading. Hook for the provider
  // to call its script's "process this subtree" API.
  attachEditor?(element: HTMLElement): void;
}

// Escapes a string for safe inclusion as an HTML attribute value.
// Local helper because the providers and the publish-time transform
// both build raw HTML strings and we don't want to depend on the
// page renderer's React JSX escaping.
//
// Coerces non-string inputs to "" rather than throwing — defensive
// against malformed node.attrs that could otherwise crash the editor
// when passed straight to renderHtml.
function escapeAttr(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const youtube: EmbedProvider = {
  providerId: "youtube",
  titleKey: "youtube.title",
  hintKey: "youtube.hint",
  icon: Youtube,
  parseUrl(url) {
    // Standard, short, embed and shorts URLs. The video id is always
    // 11 chars of [A-Za-z0-9_-]. We deliberately accept query strings
    // (`?si=...&t=42s` from the share button) by stopping at the first
    // separator.
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/))([\w-]{11})/,
    );
    return match ? match[1] : null;
  },
  renderHtml(id) {
    const safe = escapeAttr(id);
    return `<div class="cms-embed cms-embed-youtube"><iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/${safe}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
  },
};

const vimeo: EmbedProvider = {
  providerId: "vimeo",
  titleKey: "vimeo.title",
  hintKey: "vimeo.hint",
  icon: Video,
  parseUrl(url) {
    // Public Vimeo URLs end in /<numeric-id>; channel/album paths are
    // ignored — we only embed individual videos. The optional /video/
    // segment matches the embed-friendly URL the share dialog gives.
    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return match ? match[1] : null;
  },
  renderHtml(id) {
    const safe = escapeAttr(id);
    return `<div class="cms-embed cms-embed-vimeo"><iframe loading="lazy" src="https://player.vimeo.com/video/${safe}" title="Vimeo video" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
  },
};

const twitter: EmbedProvider = {
  providerId: "twitter",
  titleKey: "twitter.title",
  hintKey: "twitter.hint",
  icon: Twitter,
  parseUrl(url) {
    // Capture only the numeric tweet id — the embed iframe URL only
    // needs the id, no host-side script. Username is discarded.
    // Accepts both twitter.com and x.com.
    const match = url.match(
      /^https?:\/\/(?:twitter\.com|x\.com)\/[A-Za-z0-9_]+\/status\/(\d+)/,
    );
    return match ? match[1] : null;
  },
  renderHtml(tweetId) {
    // platform.twitter.com/embed/Tweet.html is Twitter's first-party
    // iframe URL. It loads the tweet card without any host-side JS,
    // sidesteps every widgets.js timing/CORS issue, and works
    // identically inside contentEditable editors and on static pages.
    // The only tradeoff is a fixed iframe height — set per-provider
    // CSS in styles.ts gives a reasonable default that fits most
    // tweets without scrollbars.
    const safe = escapeAttr(tweetId);
    return `<div class="cms-embed cms-embed-twitter"><iframe loading="lazy" src="https://platform.twitter.com/embed/Tweet.html?id=${safe}" title="Tweet" frameborder="0" scrolling="no" allowfullscreen></iframe></div>`;
  },
};

const spotify: EmbedProvider = {
  providerId: "spotify",
  titleKey: "spotify.title",
  hintKey: "spotify.hint",
  icon: Music,
  parseUrl(url) {
    // Spotify share URLs come in five flavors: track, album, playlist,
    // episode and show. We capture both the kind and the id so the
    // renderer can rebuild the right /embed/<kind>/<id> URL.
    const match = url.match(
      /open\.spotify\.com\/(track|album|playlist|episode|show)\/([A-Za-z0-9]+)/,
    );
    return match ? `${match[1]}/${match[2]}` : null;
  },
  renderHtml(idPath) {
    const safe = escapeAttr(idPath);
    return `<div class="cms-embed cms-embed-spotify"><iframe loading="lazy" src="https://open.spotify.com/embed/${safe}" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
  },
};

export const PROVIDERS: Record<string, EmbedProvider> = {
  youtube,
  vimeo,
  twitter,
  spotify,
};

// Stable iteration order for inserter and tests. Matches the order
// declared above; a `Object.values(PROVIDERS)` would also work but is
// not guaranteed by spec on older runtimes.
export const PROVIDER_LIST: EmbedProvider[] = [youtube, vimeo, twitter, spotify];
