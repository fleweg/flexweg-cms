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

  it("Twitter — accepts twitter.com and x.com status URLs", () => {
    const tw = PROVIDERS.twitter;
    expect(tw.parseUrl("https://twitter.com/jack/status/20")).toBe(
      "https://twitter.com/jack/status/20",
    );
    expect(tw.parseUrl("https://x.com/elon/status/1234567890")).toBe(
      "https://x.com/elon/status/1234567890",
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
  it("emits Twitter widgets.js exactly once when a tweet is embedded", () => {
    transformBodyHtml(
      '<div data-cms-embed="twitter" data-id="https://x.com/jack/status/20" data-url="https://x.com/jack/status/20"></div>',
    );
    const scripts = getDetectedBodyScripts();
    expect(scripts).toContain("platform.twitter.com/widgets.js");
    // Single occurrence — the script tag appears once in the output.
    expect(scripts.match(/platform\.twitter\.com\/widgets\.js/g)?.length).toBe(1);
  });

  it("dedupes when several tweets are embedded on the same page", () => {
    transformBodyHtml(
      [
        '<div data-cms-embed="twitter" data-id="https://x.com/jack/status/20" data-url="https://x.com/jack/status/20"></div>',
        '<div data-cms-embed="twitter" data-id="https://x.com/elon/status/100" data-url="https://x.com/elon/status/100"></div>',
        '<div data-cms-embed="twitter" data-id="https://x.com/foo/status/300" data-url="https://x.com/foo/status/300"></div>',
      ].join("\n"),
    );
    const scripts = getDetectedBodyScripts();
    expect(scripts.match(/platform\.twitter\.com\/widgets\.js/g)?.length).toBe(1);
  });

  it("returns an empty string when only iframe-only embeds are used", () => {
    transformBodyHtml(
      '<div data-cms-embed="youtube" data-id="dQw4w9WgXcQ"></div><div data-cms-embed="vimeo" data-id="12345"></div>',
    );
    expect(getDetectedBodyScripts()).toBe("");
  });

  it("resets state between successive transforms (no bleed across pages)", () => {
    transformBodyHtml(
      '<div data-cms-embed="twitter" data-id="https://x.com/jack/status/20"></div>',
    );
    expect(getDetectedBodyScripts()).toContain("widgets.js");
    transformBodyHtml('<div data-cms-embed="youtube" data-id="abc"></div>');
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
