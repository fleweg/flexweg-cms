import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  toast,
  useCmsData,
  type PluginSettingsPageProps,
} from "@flexweg/cms-runtime";
import { DEFAULT_MULTILANG_CONFIG, type MultilangConfig } from "../types";

// The 7 admin locales the CMS ships with — same list the admin uses
// internally. Plugins can use any BCP-47 code, but offering these as
// presets keeps the common case one click away.
const SUPPORTED_LANGS = ["en", "fr", "de", "es", "nl", "pt", "ko"] as const;

export function SettingsPage({ config, save }: PluginSettingsPageProps<MultilangConfig>) {
  const { t } = useTranslation("flexweg-multilang");
  const { settings, pages } = useCmsData();
  const [draft, setDraft] = useState<MultilangConfig>({
    ...DEFAULT_MULTILANG_CONFIG,
    ...config,
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await save(draft);
      toast.success(t("settings.saved"));
    } catch (err) {
      toast.error((err as Error).message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function toggleLang(lang: string) {
    setDraft((d) => {
      const has = d.enabledLanguages.includes(lang);
      const next = has
        ? d.enabledLanguages.filter((l) => l !== lang)
        : [...d.enabledLanguages, lang];
      return { ...d, enabledLanguages: next };
    });
  }

  function setHomePage(lang: string, pageId: string) {
    setDraft((d) => ({
      ...d,
      homePages: { ...(d.homePages ?? {}), [lang]: pageId || "" },
    }));
  }

  const sitePrimary = (settings.language || "en").split("-")[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-lg">{t("settings.title")}</h2>
        <p className="text-sm text-surface-500 dark:text-surface-400">
          {t("settings.intro")}
        </p>
      </div>

      <section className="card p-4 space-y-3">
        <h3 className="font-medium">{t("settings.primaryLanguage.title")}</h3>
        <p className="text-xs text-surface-500 dark:text-surface-400">
          {t("settings.primaryLanguage.help")}
        </p>
        <div className="flex flex-wrap gap-2">
          <select
            className="input max-w-[200px]"
            value={draft.primaryLanguage}
            onChange={(e) => setDraft({ ...draft, primaryLanguage: e.target.value })}
          >
            {SUPPORTED_LANGS.map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>
          <span className="text-[11px] text-surface-500 self-center">
            {t("settings.primaryLanguage.siteHint", { lang: sitePrimary })}
          </span>
        </div>
      </section>

      <section className="card p-4 space-y-3">
        <h3 className="font-medium">{t("settings.enabledLanguages.title")}</h3>
        <p className="text-xs text-surface-500 dark:text-surface-400">
          {t("settings.enabledLanguages.help")}
        </p>
        <div className="flex flex-wrap gap-2">
          {SUPPORTED_LANGS.filter((l) => l !== draft.primaryLanguage).map((lang) => {
            const enabled = draft.enabledLanguages.includes(lang);
            return (
              <button
                key={lang}
                type="button"
                onClick={() => toggleLang(lang)}
                className={
                  "text-xs px-3 py-1.5 rounded uppercase font-medium " +
                  (enabled
                    ? "bg-surface-900 text-surface-50 dark:bg-surface-100 dark:text-surface-900"
                    : "bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300")
                }
              >
                {lang}
              </button>
            );
          })}
        </div>
      </section>

      {draft.enabledLanguages.length > 0 && (
        <section className="card p-4 space-y-3">
          <h3 className="font-medium">{t("settings.homePages.title")}</h3>
          <p className="text-xs text-surface-500 dark:text-surface-400">
            {t("settings.homePages.help")}
          </p>
          <div className="space-y-2">
            {draft.enabledLanguages.map((lang) => (
              <div key={lang} className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-semibold w-8">{lang}</span>
                <select
                  className="input flex-1"
                  value={draft.homePages?.[lang] ?? ""}
                  onChange={(e) => setHomePage(lang, e.target.value)}
                >
                  <option value="">{t("settings.homePages.none")}</option>
                  {pages
                    .filter((p) => p.status === "online")
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                </select>
              </div>
            ))}
          </div>
        </section>
      )}

      {draft.enabledLanguages.length > 0 && (
        <section className="card p-4 space-y-3">
          <h3 className="font-medium">{t("settings.switcher.title")}</h3>
          <p className="text-xs text-surface-500 dark:text-surface-400">
            {t("settings.switcher.help")}
          </p>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.showHeaderSwitcher ?? true}
              onChange={(e) =>
                setDraft({ ...draft, showHeaderSwitcher: e.target.checked })
              }
            />
            <span>{t("settings.switcher.header")}</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.showFooterSwitcher ?? false}
              onChange={(e) =>
                setDraft({ ...draft, showFooterSwitcher: e.target.checked })
              }
            />
            <span>{t("settings.switcher.footer")}</span>
          </label>
        </section>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          className="btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? t("settings.saving") : t("settings.save")}
        </button>
      </div>
    </div>
  );
}
