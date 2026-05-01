import type { ImageFormat } from "../core/types";

// Formats always generated regardless of the active theme. The media
// library grid and the in-editor media picker both rely on these — keeping
// them out of the theme config means uploading still works (and looks ok)
// even when no theme is active or when switching themes.
//
// Hard-coded on purpose: making them user-editable would let a misconfig
// (e.g. a 4000×4000 thumbnail) tank upload performance for everyone.
export const ADMIN_FORMATS: Record<string, ImageFormat> = {
  "admin-thumb": { width: 240, height: 240, fit: "cover" },
  "admin-preview": { width: 800, height: 800, fit: "contain" },
};

// The two reserved keys above are also the names callers pass to
// pickFormat() in admin UI code.
export const ADMIN_THUMB_KEY = "admin-thumb";
export const ADMIN_PREVIEW_KEY = "admin-preview";
