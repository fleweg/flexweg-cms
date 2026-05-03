import { Music, Twitter, Video, Youtube } from "lucide-react";
import type { ComponentType } from "react";

// One descriptor per supported embed kind. The Tiptap node factory
// reads these to build a node per provider; the publish-time transform
// reads them to render iframes/blockquotes; the inspector reads them
// for help text and icons. Adding a new provider is exactly one entry
// in this map plus, optionally, an i18n key.
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
  // ID for YouTube/Vimeo, full URL for Twitter, "type/id" for
  // Spotify). Returns null when the URL doesn't match this provider —
  // the inspector uses that to surface an inline validation error.
  parseUrl(url: string): string | null;
  // Builds the published-page embed HTML. Receives the parsed id; the
  // result is injected verbatim into the post body during the
  // post.html.body filter.
  renderHtml(id: string): string;
  // Editor-side preview HTML rendered inside the NodeView. Often the
  // same iframe as renderHtml minus a few permission allowlist
  // entries, or a placeholder card when an iframe would be too noisy
  // (Twitter — widgets.js doesn't run inside the editor).
  renderEditorPreview(id: string): string;
  // Optional script tag emitted at body-end when at least one block
  // of this provider is present on the page. Empty for iframe-only
  // embeds (YouTube, Vimeo, Spotify); set for Twitter (widgets.js).
  bodyScript?: string;
}

// Escapes a string for safe inclusion as an HTML attribute value.
// Local helper because the providers and the publish-time transform
// both build raw HTML strings and we don't want to depend on the
// page renderer's React JSX escaping.
function escapeAttr(value: string): string {
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
  renderEditorPreview(id) {
    const safe = escapeAttr(id);
    return `<iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/${safe}" frameborder="0" allowfullscreen></iframe>`;
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
  renderEditorPreview(id) {
    const safe = escapeAttr(id);
    return `<iframe loading="lazy" src="https://player.vimeo.com/video/${safe}" frameborder="0" allowfullscreen></iframe>`;
  },
};

const twitter: EmbedProvider = {
  providerId: "twitter",
  titleKey: "twitter.title",
  hintKey: "twitter.hint",
  icon: Twitter,
  parseUrl(url) {
    // Twitter accepts twitter.com and x.com; the full URL is what
    // widgets.js uses to fetch the tweet, so we keep it intact rather
    // than splitting out the id. We only validate the shape.
    const match = url.match(
      /^https?:\/\/(?:twitter\.com|x\.com)\/[A-Za-z0-9_]+\/status\/\d+/,
    );
    return match ? match[0] : null;
  },
  renderHtml(tweetUrl) {
    const safe = escapeAttr(tweetUrl);
    return `<blockquote class="twitter-tweet" data-dnt="true"><a href="${safe}"></a></blockquote>`;
  },
  renderEditorPreview(tweetUrl) {
    const safe = escapeAttr(tweetUrl);
    return `<div class="cms-embed-placeholder"><strong>Tweet</strong><br/><a href="${safe}" target="_blank" rel="noreferrer">${safe}</a><br/><small>Preview loads on the published page.</small></div>`;
  },
  // widgets.js scans the DOM at load and rewrites every blockquote it
  // finds. async + defer so it never blocks first paint. Charset is
  // mandatory per Twitter's docs — they choke without it.
  bodyScript: `<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`,
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
  renderEditorPreview(idPath) {
    const safe = escapeAttr(idPath);
    return `<iframe loading="lazy" src="https://open.spotify.com/embed/${safe}" frameborder="0" allowfullscreen></iframe>`;
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
