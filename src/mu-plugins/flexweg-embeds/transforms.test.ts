import { afterEach, describe, expect, it } from "vitest";
import { PROVIDERS } from "./providers";
import {
  _resetForTests,
  getDetectedBodyScripts,
  getDetectedHeadStyles,
  transformBodyHtml,
} from "./transforms";

afterEach(() => {
  _resetForTests();
});

describe("provider URL parsers", () => {
  it("YouTube — recognises watch, short, embed and shorts URLs", () => {
    const yt = PROVIDERS.youtube;
    expect(yt.parseUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(yt.parseUrl("https://youtu.be/dQw4w9WgXcQ?si=foo&t=42s")).toBe("dQw4w9WgXcQ");
    expect(yt.parseUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(yt.parseUrl("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("YouTube — rejects unrelated URLs", () => {
    expect(PROVIDERS.youtube.parseUrl("https://example.com/video/abc")).toBeNull();
    expect(PROVIDERS.youtube.parseUrl("not a url")).toBeNull();
  });

  it("Vimeo — accepts both /video/<id> and /<id> forms", () => {
    expect(PROVIDERS.vimeo.parseUrl("https://vimeo.com/12345")).toBe("12345");
    expect(PROVIDERS.vimeo.parseUrl("https://vimeo.com/video/67890")).toBe("67890");
    expect(PROVIDERS.vimeo.parseUrl("https://vimeo.com/channels/staffpicks")).toBeNull();
  });

  it("Twitter — extracts the numeric tweet id from twitter.com and x.com URLs", () => {
    const tw = PROVIDERS.twitter;
    expect(tw.parseUrl("https://twitter.com/jack/status/20")).toBe("20");
    expect(tw.parseUrl("https://x.com/elon/status/1234567890")).toBe("1234567890");
    expect(tw.parseUrl("https://x.com/officialjoel4_/status/2050718225923752234")).toBe(
      "2050718225923752234",
    );
    expect(tw.parseUrl("https://x.com/elon")).toBeNull();
  });

  it("Spotify — captures kind + id for tracks/albums/playlists", () => {
    expect(PROVIDERS.spotify.parseUrl("https://open.spotify.com/track/abc123XYZ")).toBe(
      "track/abc123XYZ",
    );
    expect(PROVIDERS.spotify.parseUrl("https://open.spotify.com/album/foo?si=bar")).toBe(
      "album/foo",
    );
    expect(PROVIDERS.spotify.parseUrl("https://open.spotify.com/user/me")).toBeNull();
  });
});

describe("transformBodyHtml", () => {
  it("replaces a YouTube marker with the iframe HTML", () => {
    const html =
      '<p>Watch:</p><div data-cms-embed="youtube" data-id="dQw4w9WgXcQ" data-url="https://youtu.be/dQw4w9WgXcQ"></div>';
    const out = transformBodyHtml(html);
    expect(out).toContain("youtube-nocookie.com/embed/dQw4w9WgXcQ");
    expect(out).not.toContain("data-cms-embed");
  });

  it("drops markers with unknown providers", () => {
    const html = '<div data-cms-embed="myspace" data-id="abc"></div>';
    expect(transformBodyHtml(html)).toBe("");
  });

  it("drops markers without a data-id", () => {
    const html = '<div data-cms-embed="youtube" data-id=""></div>';
    expect(transformBodyHtml(html)).toBe("");
  });

  it("handles attribute order independence", () => {
    const html =
      '<div data-id="dQw4w9WgXcQ" data-cms-embed="youtube" data-url="https://youtu.be/dQw4w9WgXcQ"></div>';
    expect(transformBodyHtml(html)).toContain("youtube-nocookie.com/embed/dQw4w9WgXcQ");
  });
});

describe("getDetectedBodyScripts", () => {
  // Every shipped provider currently uses a self-contained iframe
  // (no host-side runtime script). The dedup mechanism is still wired
  // up — covered by these tests — but the assertions reflect the
  // current "no scripts emitted" reality. Re-add provider-specific
  // assertions when a JS-needing provider (Instagram, TikTok) lands.

  it("returns an empty string for iframe-only embeds", () => {
    transformBodyHtml(
      [
        '<div data-cms-embed="youtube" data-id="dQw4w9WgXcQ"></div>',
        '<div data-cms-embed="vimeo" data-id="12345"></div>',
        '<div data-cms-embed="twitter" data-id="2050718225923752234"></div>',
        '<div data-cms-embed="spotify" data-id="track/abc"></div>',
      ].join("\n"),
    );
    expect(getDetectedBodyScripts()).toBe("");
  });

  it("resets state between successive transforms (no bleed across pages)", () => {
    transformBodyHtml('<div data-cms-embed="youtube" data-id="abc"></div>');
    expect(getDetectedBodyScripts()).toBe("");
    transformBodyHtml("<p>Plain text.</p>");
    expect(getDetectedBodyScripts()).toBe("");
  });
});

describe("getDetectedHeadStyles", () => {
  it("emits the baseline CSS only when at least one embed is detected", () => {
    transformBodyHtml('<div data-cms-embed="youtube" data-id="abc"></div>');
    expect(getDetectedHeadStyles()).toContain("data-cms-embed-styles");
    expect(getDetectedHeadStyles()).toContain(".cms-embed");
  });

  it("returns an empty string when no embed appears", () => {
    transformBodyHtml("<p>Just text.</p>");
    expect(getDetectedHeadStyles()).toBe("");
  });
});
