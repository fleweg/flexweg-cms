import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { setActiveLocale, SUPPORTED_LOCALES, LOCALE_LABELS } from "../../i18n";
import { setUserPreferences } from "../../services/users";
import type { AdminLocale } from "../../core/types";

export function LocaleSwitcher() {
  const { i18n } = useTranslation();
  const { user, record } = useAuth();
  const current = (i18n.resolvedLanguage ?? i18n.language) as AdminLocale;

  async function handleChange(next: AdminLocale) {
    await setActiveLocale(next);
    // Persist to Firestore so the choice follows the user across devices.
    // localStorage is updated synchronously inside setActiveLocale for snappy
    // reloads on the same device.
    if (user && record) {
      await setUserPreferences(user.uid, { adminLocale: next }).catch(() => {
        // Non-fatal: localStorage already applied, the network failure will
        // resync next time the user changes language.
      });
    }
  }

  return (
    <div className="inline-flex items-center gap-2">
      <Globe className="h-4 w-4 text-surface-400" aria-hidden />
      <select
        className="bg-transparent text-sm font-medium text-surface-700 dark:text-surface-200 outline-none"
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
