import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useCmsData } from "../context/CmsDataContext";
import { setActiveLocale, SUPPORTED_LOCALES } from "../i18n";
import {
  DEFAULT_FLEXWEG_API_BASE_URL,
  getFlexwegConfig,
  setFlexwegConfig,
  type FlexwegConfig,
} from "../services/flexwegConfig";
import { updateSettings } from "../services/settings";
import { setUserPreferences } from "../services/users";
import type { AdminLocale } from "../core/types";

// Renders the "General" tab inside <SettingsLayout />. Outer page chrome
// (title + tab strip) lives in the layout, so this component is just the
// content sections.
export function SettingsPage() {
  const { t } = useTranslation();
  const { user, record } = useAuth();
  const { settings, pages } = useCmsData();

  // Site
  const [title, setTitle] = useState(settings.title);
  const [description, setDescription] = useState(settings.description);
  const [language, setLanguage] = useState(settings.language);
  const [baseUrl, setBaseUrl] = useState(settings.baseUrl);
  const [postsPerPage, setPostsPerPage] = useState(settings.postsPerPage);
  const [homeMode, setHomeMode] = useState(settings.homeMode);
  const [homePageId, setHomePageId] = useState(settings.homePageId ?? "");
  const [savingSite, setSavingSite] = useState(false);

  // Sync local edits when the underlying doc changes (other admins editing,
  // first load, etc.).
  useEffect(() => {
    setTitle(settings.title);
    setDescription(settings.description);
    setLanguage(settings.language);
    setBaseUrl(settings.baseUrl);
    setPostsPerPage(settings.postsPerPage);
    setHomeMode(settings.homeMode);
    setHomePageId(settings.homePageId ?? "");
  }, [settings]);

  async function saveSite() {
    setSavingSite(true);
    try {
      await updateSettings({
        title,
        description,
        language,
        baseUrl,
        postsPerPage,
        homeMode,
        homePageId: homeMode === "static-page" ? homePageId || undefined : undefined,
      });
    } finally {
      setSavingSite(false);
    }
  }

  // Flexweg API config — loaded separately from the settings doc.
  const [apiKey, setApiKey] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [apiBaseUrl, setApiBaseUrl] = useState(DEFAULT_FLEXWEG_API_BASE_URL);
  const [savingFw, setSavingFw] = useState(false);

  useEffect(() => {
    void getFlexwegConfig().then((c) => {
      if (!c) return;
      setApiKey(c.apiKey);
      setSiteUrl(c.siteUrl);
      setApiBaseUrl(c.apiBaseUrl);
    });
  }, []);

  async function saveFlexweg() {
    setSavingFw(true);
    try {
      const next: FlexwegConfig = { apiKey, siteUrl, apiBaseUrl };
      await setFlexwegConfig(next);
    } finally {
      setSavingFw(false);
    }
  }

  // Profile (admin language for *this* user)
  async function changeAdminLocale(locale: AdminLocale) {
    await setActiveLocale(locale);
    if (user && record) await setUserPreferences(user.uid, { adminLocale: locale });
  }

  return (
    <div className="space-y-6">
      <section className="card p-4 space-y-3">
        <h2 className="font-semibold">{t("settings.profile.title")}</h2>
        <div>
          <label className="label">{t("settings.profile.adminLocale")}</label>
          <select
            className="input max-w-xs"
            value={record?.preferences?.adminLocale ?? "en"}
            onChange={(e) => changeAdminLocale(e.target.value as AdminLocale)}
          >
            {SUPPORTED_LOCALES.map((locale) => (
              <option key={locale} value={locale}>
                {locale === "en" ? "English" : "Français"}
              </option>
            ))}
          </select>
          <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
            {t("settings.profile.adminLocaleHelp")}
          </p>
        </div>
      </section>

      <section className="card p-4 space-y-3">
        <h2 className="font-semibold">{t("settings.site.title")}</h2>
        <div>
          <label className="label">{t("settings.site.siteTitle")}</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="label">{t("settings.site.siteDescription")}</label>
          <textarea
            className="input min-h-[60px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="label">{t("settings.site.siteLanguage")}</label>
          <input
            className="input max-w-xs"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="en, fr, fr-FR…"
          />
          <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
            {t("settings.site.siteLanguageHelp")}
          </p>
        </div>
        <div>
          <label className="label">{t("settings.site.baseUrl")}</label>
          <input
            className="input"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://your-site.flexweg.com"
          />
        </div>
        <div>
          <label className="label">{t("settings.site.postsPerPage")}</label>
          <input
            className="input max-w-xs"
            type="number"
            min={1}
            value={postsPerPage}
            onChange={(e) => setPostsPerPage(Number.parseInt(e.target.value, 10) || 1)}
          />
        </div>
        <div>
          <label className="label">{t("settings.site.homeMode")}</label>
          <select className="input max-w-xs" value={homeMode} onChange={(e) => setHomeMode(e.target.value as typeof homeMode)}>
            <option value="latest-posts">{t("settings.site.homeLatest")}</option>
            <option value="static-page">{t("settings.site.homeStatic")}</option>
          </select>
        </div>
        {homeMode === "static-page" && (
          <div>
            <label className="label">{t("settings.site.homePage")}</label>
            <select
              className="input max-w-xs"
              value={homePageId}
              onChange={(e) => setHomePageId(e.target.value)}
            >
              <option value="">—</option>
              {pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        )}
        <button type="button" className="btn-primary" onClick={saveSite} disabled={savingSite}>
          {savingSite && <Loader2 className="h-4 w-4 animate-spin" />}
          {savingSite ? t("common.saving") : t("common.save")}
        </button>
      </section>

      <section className="card p-4 space-y-3">
        <h2 className="font-semibold">{t("settings.flexweg.title")}</h2>
        <div>
          <label className="label">{t("settings.flexweg.apiKey")}</label>
          <input
            className="input font-mono"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
            {t("settings.flexweg.apiKeyHelp")}
          </p>
        </div>
        <div>
          <label className="label">{t("settings.flexweg.siteUrl")}</label>
          <input
            className="input"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            placeholder="https://your-site.flexweg.com"
          />
          <p className="text-xs text-surface-500 mt-1 dark:text-surface-400">
            {t("settings.flexweg.siteUrlHelp")}
          </p>
        </div>
        <div>
          <label className="label">{t("settings.flexweg.apiBaseUrl")}</label>
          <input
            className="input"
            value={apiBaseUrl}
            onChange={(e) => setApiBaseUrl(e.target.value)}
          />
        </div>
        <button type="button" className="btn-primary" onClick={saveFlexweg} disabled={savingFw}>
          {savingFw && <Loader2 className="h-4 w-4 animate-spin" />}
          {savingFw ? t("common.saving") : t("common.save")}
        </button>
      </section>
    </div>
  );
}
