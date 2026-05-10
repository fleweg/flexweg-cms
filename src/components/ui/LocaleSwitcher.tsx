import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useOptionalAuth } from "../../context/AuthContext";
import {
  setActiveLocale,
  SUPPORTED_LOCALES,
  LOCALE_LABELS,
  LOCALE_FLAGS,
} from "../../i18n";
import { setUserPreferences } from "../../services/users";
import type { AdminLocale } from "../../core/types";

export function LocaleSwitcher() {
  const { t, i18n } = useTranslation();
  // Optional: SetupForm renders this component before AuthProvider is
  // mounted (Firebase isn't configured yet). In that mode `auth` is null
  // and we skip the Firestore persistence step — only localStorage is
  // updated, which is fine because the user record doesn't exist yet.
  const auth = useOptionalAuth();
  const current = (i18n.resolvedLanguage ?? i18n.language) as AdminLocale;

  async function handleChange(next: AdminLocale) {
    await setActiveLocale(next);
    // Persist to Firestore so the choice follows the user across devices.
    // localStorage is updated synchronously inside setActiveLocale for snappy
    // reloads on the same device.
    if (auth?.user && auth.record) {
      await setUserPreferences(auth.user.uid, { adminLocale: next }).catch(() => {
        // Non-fatal: localStorage already applied, the network failure will
        // resync next time the user changes language.
      });
    }
  }

  // Compact pattern: the visible chip shows only the flag of the active
  // locale; an invisible <select> overlays it so clicking opens the
  // native dropdown — which renders the full labels (flag + native
  // name) by virtue of <option> textContent. Best of both worlds:
  // tight header footprint, full readability when picking.
  return (
    <div className="relative inline-flex items-center gap-1 px-1.5 py-1 rounded-md hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
      <span className="text-base leading-none select-none" aria-hidden>
        {LOCALE_FLAGS[current]}
      </span>
      <ChevronDown className="h-3.5 w-3.5 text-surface-500 dark:text-surface-400" aria-hidden />
      <select
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label={t("common.language")}
        value={current}
        onChange={(e) => handleChange(e.target.value as AdminLocale)}
      >
        {SUPPORTED_LOCALES.map((locale) => (
          <option key={locale} value={locale}>
            {LOCALE_LABELS[locale]}
          </option>
        ))}
      </select>
    </div>
  );
}
