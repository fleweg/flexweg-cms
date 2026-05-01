import type { Media } from "./types";
import type { MediaView } from "../themes/types";

// Picks the URL of a named format from a MediaView, falling back through a
// chain of strategies so theme code stays robust when:
//   - the requested format wasn't generated for this asset (old upload, or
//     theme switched after upload),
//   - the asset was uploaded with the legacy single-URL shape,
//   - some variants failed to upload during the multi-variant pipeline.
//
// Order:
//   1. exact match for the requested name,
//   2. the view's `default` format,
//   3. the largest available format by area,
//   4. empty string (caller should treat as "no image").
export function pickFormat(view: MediaView | undefined, name?: string): string {
  if (!view) return "";
  const formats = view.formats;
  if (name && formats[name]) return formats[name].url;
  if (view.default && formats[view.default]) return formats[view.default].url;
  const largest = Object.values(formats).reduce<{ url: string; area: number } | null>(
    (acc, f) => {
      const area = (f.width || 0) * (f.height || 0);
      if (!acc || area > acc.area) return { url: f.url, area };
      return acc;
    },
    null,
  );
  return largest?.url ?? "";
}

// Adapts a raw Media doc (which may be either the new multi-variant shape
// or the legacy `{ url, storagePath }` shape) into the resolved MediaView
// passed to theme components. Legacy media gets a single synthesized
// "legacy" format keyed in `formats` so downstream code sees a uniform
// interface.
export function mediaToView(media: Media | undefined | null): MediaView | undefined {
  if (!media) return undefined;
  if (media.formats && Object.keys(media.formats).length > 0) {
    return {
      alt: media.alt,
      caption: media.caption,
      default: media.defaultFormat ?? Object.keys(media.formats)[0],
      formats: Object.fromEntries(
        Object.entries(media.formats).map(([k, v]) => [
          k,
          { url: v.url, width: v.width, height: v.height },
        ]),
      ),
    };
  }
  // Legacy fallback: pre-multi-variant doc with a single URL.
  if (media.url) {
    return {
      alt: media.alt,
      caption: media.caption,
      default: "legacy",
      formats: { legacy: { url: media.url, width: 0, height: 0 } },
    };
  }
  return undefined;
}

// Same as mediaToView but for direct access from admin UI code, which
// doesn't always have a MediaView in hand. Returns the URL of the named
// format or the best fallback. Tolerates legacy media seamlessly.
export function pickMediaUrl(media: Media | undefined | null, name?: string): string {
  return pickFormat(mediaToView(media), name);
}
