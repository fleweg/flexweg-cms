import type { ImageFormat } from "../core/types";

// Formats always generated regardless of the active theme. The media
// library grid and the in-editor media picker both rely on these — keeping
// them out of the theme config means uploading still works (and looks ok)
// even when no theme is active or when switching themes.
//
// `admin-original` is intentionally a "contain" fit at 2000×2000 so the
// uploaded source is preserved at full ratio, never upscaled, never
// cropped. Its purpose isn't display — it's the high-fidelity source we
// keep around so a future re-crop pipeline can regenerate other variants
// (e.g. when a theme later adds a format larger than what was generated
// at upload time). Higher per-format `quality` to keep re-crop headroom.
//
// Hard-coded on purpose: making them user-editable would let a misconfig
// (e.g. a 4000×4000 thumbnail) tank upload performance for everyone.
export const ADMIN_FORMATS: Record<string, ImageFormat> = {
  "admin-thumb": { width: 240, height: 240, fit: "cover" },
  "admin-preview": { width: 800, height: 800, fit: "contain" },
  "admin-original": { width: 2000, height: 2000, fit: "contain", quality: 90 },
};

// The reserved keys above are also the names callers pass to
// pickFormat() in admin UI code.
export const ADMIN_THUMB_KEY = "admin-thumb";
export const ADMIN_PREVIEW_KEY = "admin-preview";
export const ADMIN_ORIGINAL_KEY = "admin-original";
