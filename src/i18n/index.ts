import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import fr from "./fr.json";
import de from "./de.json";
import es from "./es.json";
import nl from "./nl.json";
import pt from "./pt.json";
import ko from "./ko.json";
import type { AdminLocale } from "../core/types";

export const SUPPORTED_LOCALES: AdminLocale[] = ["en", "fr", "de", "es", "nl", "pt", "ko"];
export const DEFAULT_LOCALE: AdminLocale = "en";
const STORAGE_KEY = "adminLocale";

// Native-name labels (with country flag emoji) shown wherever the admin
// renders a locale picker — Topbar's LocaleSwitcher and Settings →
// Profile. Kept here so both consumers stay in lockstep.
export const LOCALE_LABELS: Record<AdminLocale, string> = {
  fr: "🇫🇷 Français",
  en: "🇬🇧 English",
  de: "🇩🇪 Deutsch",
  es: "🇪🇸 Español",
  nl: "🇳🇱 Nederlands",
  pt: "🇵🇹 Português",
  ko: "🇰🇷 한국어",
};

// Flag-only variant used by the Topbar's collapsed locale switcher —
// keeps the header compact while the full label still renders inside
// the dropdown options.
export const LOCALE_FLAGS: Record<AdminLocale, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
  de: "🇩🇪",
  es: "🇪🇸",
  nl: "🇳🇱",
  pt: "🇵🇹",
  ko: "🇰🇷",
};

export function isSupportedLocale(value: unknown): value is AdminLocale {
  return typeof value === "string" && (SUPPORTED_LOCALES as string[]).includes(value);
}

// Maps a BCP-47 tag from `settings.language` (e.g. "fr", "fr-CA",
// "pt-BR") onto one of the locales we ship translations for. The
// public site's HTML lang attribute keeps the original tag (so screen
// readers and Intl.* APIs see "fr-CA" intact); this helper is for
// consumers picking strings out of a translation bundle, which need
// the base language only.
//
// Resolution: lower-case the prefix (text before the first `-`); if it
// matches a supported locale, return it; otherwise return `fallback`
// (defaults to `en`). Reused by every public-site renderer / generator
// that needs to localise its labels — sitemap XSL, RSS XSL, theme
// templates baking strings into the HTML, etc.
export function pickPublicLocale(
  bcp47: string | undefined | null,
  fallback: AdminLocale = DEFAULT_LOCALE,
): AdminLocale {
  const prefix = (bcp47 ?? "").split("-")[0]?.toLowerCase();
  if (prefix && (SUPPORTED_LOCALES as string[]).includes(prefix)) {
    return prefix as AdminLocale;
  }
  return fallback;
}

// Resolves the locale to use at boot time. Order:
//   1. Explicit value from the user's Firestore profile (passed in by the
//      AuthProvider once it has the record).
//   2. localStorage — survives reloads even before auth resolves.
//   3. navigator.language two-letter prefix, if supported.
//   4. DEFAULT_LOCALE (English).
// Used both at module load (browser bootstrap) and after login.
export function resolveInitialLocale(profileLocale?: string | null): AdminLocale {
  if (isSupportedLocale(profileLocale)) return profileLocale;

  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isSupportedLocale(stored)) return stored;
  }

  if (typeof navigator !== "undefined" && typeof navigator.language === "string") {
    const prefix = navigator.language.split("-")[0]?.toLowerCase();
    if (isSupportedLocale(prefix)) return prefix;
  }

  return DEFAULT_LOCALE;
}

export function persistLocale(locale: AdminLocale): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Private mode etc. — failing here is fine, the value just won't survive a reload.
  }
}

void i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      de: { translation: de },
      es: { translation: es },
      nl: { translation: nl },
      pt: { translation: pt },
      ko: { translation: ko },
    },
    lng: resolveInitialLocale(),
    fallbackLng: DEFAULT_LOCALE,
    interpolation: { escapeValue: false },
    returnNull: false,
    // Disable Suspense — resources are loaded synchronously from static
    // imports, so suspending makes no sense and can race with React's
    // reconciler if a parent boundary catches the thrown promise.
    react: { useSuspense: false },
  });

export async function setActiveLocale(locale: AdminLocale): Promise<void> {
  if (!isSupportedLocale(locale)) return;
  persistLocale(locale);
  await i18n.changeLanguage(locale);
}

export default i18n;
