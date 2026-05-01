import { describe, expect, it } from "vitest";
import { mergeFormats, planFit, validateInputExtension } from "./imageProcessing";
import { ADMIN_FORMATS } from "./imageFormats";
import type { ImageFormatConfig } from "../core/types";

describe("planFit cover", () => {
  it("crops a wide source to match a square target", () => {
    const plan = planFit(2000, 1000, { width: 500, height: 500, fit: "cover" });
    expect(plan.canvasWidth).toBe(500);
    expect(plan.canvasHeight).toBe(500);
    expect(plan.srcX).toBeCloseTo(500); // crop 500px on each side
    expect(plan.srcWidth).toBeCloseTo(1000);
    expect(plan.srcHeight).toBeCloseTo(1000);
  });
  it("crops a tall source to match a wide target", () => {
    const plan = planFit(800, 1600, { width: 800, height: 400, fit: "cover" });
    expect(plan.srcY).toBeCloseTo(600);
    expect(plan.srcHeight).toBeCloseTo(400);
  });
});

describe("planFit contain", () => {
  it("scales down without upscaling", () => {
    const plan = planFit(2000, 1000, { width: 1000, height: 1000, fit: "contain" });
    // Source is 2:1, target is 1:1 → fit by width (limit factor 1000/2000=0.5).
    expect(plan.canvasWidth).toBe(1000);
    expect(plan.canvasHeight).toBe(500);
  });
  it("does not upscale a small source", () => {
    const plan = planFit(100, 100, { width: 1000, height: 1000, fit: "contain" });
    expect(plan.canvasWidth).toBe(100);
    expect(plan.canvasHeight).toBe(100);
  });
});

describe("validateInputExtension", () => {
  it("accepts known extensions", () => {
    expect(validateInputExtension("photo.jpg", [".jpg", ".png"])).toBeNull();
    expect(validateInputExtension("PHOTO.PNG", [".jpg", ".png"])).toBeNull();
  });
  it("normalizes user-facing dotless lists", () => {
    expect(validateInputExtension("photo.jpg", ["jpg", "png"])).toBeNull();
  });
  it("rejects unknown extensions", () => {
    expect(validateInputExtension("a.zip", [".jpg"])).toMatch(/unsupported/i);
  });
});

describe("mergeFormats", () => {
  it("unions admin and theme formats with theme winning on conflict", () => {
    const themeConfig: ImageFormatConfig = {
      inputFormats: [".jpg"],
      outputFormat: "webp",
      quality: 75,
      formats: {
        "admin-thumb": { width: 100, height: 100 }, // overrides admin
        large: { width: 1000, height: 500, fit: "cover" },
      },
      defaultFormat: "large",
    };
    const merged = mergeFormats(ADMIN_FORMATS, themeConfig);
    expect(merged.formats["admin-thumb"].width).toBe(100); // from theme
    expect(merged.formats.large.width).toBe(1000);
    expect(merged.formats["admin-preview"]).toBeDefined(); // still from admin
    expect(merged.outputMime).toBe("image/webp");
    expect(merged.quality).toBe(75);
    expect(merged.defaultFormat).toBe("large");
  });
  it("falls back when no theme config is supplied", () => {
    const merged = mergeFormats(ADMIN_FORMATS, undefined);
    expect(Object.keys(merged.formats)).toEqual(["admin-thumb", "admin-preview"]);
    expect(merged.outputMime).toBe("image/webp");
    expect(merged.defaultFormat).toBe("admin-preview");
  });
});
