import { describe, expect, it } from "vitest";
import { mediaToView, pickFormat, pickMediaUrl } from "./media";
import type { Media } from "./types";

const newShape: Media = {
  id: "1",
  name: "photo.jpg",
  contentType: "image/webp",
  size: 1234,
  storageBase: "media/2026/05/photo-abc",
  defaultFormat: "medium",
  formats: {
    "admin-thumb": { url: "https://x/admin-thumb.webp", width: 240, height: 240, bytes: 100 },
    medium: { url: "https://x/medium.webp", width: 600, height: 600, bytes: 500 },
    large: { url: "https://x/large.webp", width: 1600, height: 900, bytes: 1500 },
  },
  uploadedAt: 0,
  uploadedBy: "u",
};

const legacyShape: Media = {
  id: "2",
  name: "old.jpg",
  contentType: "image/jpeg",
  size: 500,
  storagePath: "attachments/old.jpg",
  url: "https://x/old.jpg",
  uploadedAt: 0,
  uploadedBy: "u",
};

describe("pickFormat", () => {
  it("returns the requested format when present", () => {
    const view = mediaToView(newShape)!;
    expect(pickFormat(view, "large")).toBe("https://x/large.webp");
  });
  it("falls back to default when the requested format is missing", () => {
    const view = mediaToView(newShape)!;
    expect(pickFormat(view, "hero")).toBe("https://x/medium.webp");
  });
  it("falls back to the largest available when default is also missing", () => {
    const view = mediaToView({
      ...newShape,
      defaultFormat: "ghost",
    })!;
    // largest by area is "large" (1600*900=1_440_000)
    expect(pickFormat(view, "ghost")).toBe("https://x/large.webp");
  });
  it("returns empty string for undefined view", () => {
    expect(pickFormat(undefined)).toBe("");
  });
});

describe("mediaToView", () => {
  it("maps the new shape directly", () => {
    const view = mediaToView(newShape)!;
    expect(view.default).toBe("medium");
    expect(Object.keys(view.formats)).toContain("large");
  });
  it("synthesizes a legacy format from old-shape media", () => {
    const view = mediaToView(legacyShape)!;
    expect(view.default).toBe("legacy");
    expect(view.formats.legacy.url).toBe("https://x/old.jpg");
  });
  it("returns undefined for null/undefined input", () => {
    expect(mediaToView(null)).toBeUndefined();
    expect(mediaToView(undefined)).toBeUndefined();
  });
  it("returns undefined when both `formats` and legacy `url` are missing", () => {
    expect(mediaToView({ ...legacyShape, url: undefined })).toBeUndefined();
  });
});

describe("pickMediaUrl", () => {
  it("works against legacy media", () => {
    expect(pickMediaUrl(legacyShape, "large")).toBe("https://x/old.jpg");
  });
  it("works against new media", () => {
    expect(pickMediaUrl(newShape, "admin-thumb")).toBe("https://x/admin-thumb.webp");
  });
});
