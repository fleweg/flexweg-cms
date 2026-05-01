import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import fr from "./fr.json";
import type { AdminLocale } from "../core/types";

export const SUPPORTED_LOCALES: AdminLocale[] = ["en", "fr"];
export const DEFAULT_LOCALE: AdminLocale = "en";
const STORAGE_KEY = "adminLocale";

export function isSupportedLocale(value: unknown): value is AdminLocale {
  return typeof value === "string" && (SUPPORTED_LOCALES as string[]).includes(value);
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
