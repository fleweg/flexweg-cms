import type { FontFallback, FontOption } from "../components/ui/FontSelect";

// Curated set of fonts exposed in admin Settings → Editor. Picked for
// visual diversity: a sans-serif modern grotesque, two old-style
// serifs (Garamond, Playfair Display), a Times-compatible serif, and
// a chunky slab — plus the OS-native stack as a zero-download
// default. The display name is also the storage value, so users see
// the same string in the Settings dropdown and in Firestore. New
// presets: append here, the rest of the editor pipeline picks them
// up automatically.

export interface EditorFontPreset {
  // Display name AND storage value — kept identical for simplicity.
  // Stored verbatim in `settings.editorStyle.fontFamily`.
  name: string;
  // CSS generic family used as a fallback while the Google Fonts
  // download is in flight. Matches FontSelect's contract.
  fallback: FontFallback;
  // Full font-family stack consumed by the editor's injected
  // <style>. Includes specific fallbacks (Garamond → "Times New
  // Roman" → serif) so OS-default font matching produces something
  // sensible even before the Google Fonts CSS loads.
  stack: string;
  // Google Fonts CSS URL with the weights the editor uses (regular +
  // bold for headings). Undefined for the system entry — no remote
  // download.
  googleHref?: string;
}

const SYSTEM_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export const SYSTEM_FONT_NAME = "System";

export const EDITOR_FONTS: EditorFontPreset[] = [
  {
    name: SYSTEM_FONT_NAME,
    fallback: "sans-serif",
    stack: SYSTEM_STACK,
  },
  {
    name: "Inter",
    fallback: "sans-serif",
    stack: `Inter, ${SYSTEM_STACK}`,
    googleHref:
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap",
  },
  {
    name: "EB Garamond",
    fallback: "serif",
    stack: `'EB Garamond', Garamond, 'Times New Roman', Times, serif`,
    googleHref:
      "https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;700&display=swap",
  },
  {
    name: "Tinos",
    fallback: "serif",
    stack: `Tinos, 'Times New Roman', Times, serif`,
    googleHref: "https://fonts.googleapis.com/css2?family=Tinos:wght@400;700&display=swap",
  },
  {
    name: "Merriweather",
    fallback: "serif",
    stack: "Merriweather, Georgia, 'Times New Roman', serif",
    googleHref:
      "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap",
  },
  {
    name: "Playfair Display",
    fallback: "serif",
    stack: "'Playfair Display', Georgia, 'Times New Roman', serif",
    googleHref:
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap",
  },
];

// Convenience adapter for the FontSelect component. Strips internal
// fields (stack, etc.) the picker doesn't need.
export const EDITOR_FONT_OPTIONS: FontOption[] = EDITOR_FONTS.map((f) => ({
  name: f.name,
  fallback: f.fallback,
  googleHref: f.googleHref,
}));

// Defaults applied when EditorStyle leaves a field empty. Aligned
// with the Tailwind utility values that previously hardcoded
// `.prose-editor` in src/index.css — switching the indirection keeps
// the visual experience identical for users who never touched the
// setting.
export const DEFAULT_EDITOR_SIZES = {
  body: "0.875rem",
  h1: "1.25rem",
  h2: "1.125rem",
  h3: "1rem",
} as const;

export function getEditorFont(name?: string): EditorFontPreset {
  if (!name) return EDITOR_FONTS[0];
  return EDITOR_FONTS.find((f) => f.name === name) ?? EDITOR_FONTS[0];
}
