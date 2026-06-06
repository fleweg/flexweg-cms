// Runtime stub for "react-i18next". External plugin / theme settings
// pages call useTranslation('<plugin-id>') here, getting the same
// i18next instance as the admin so addResourceBundle calls land on the
// shared store.
const R = (typeof window !== "undefined" && window.__FLEXWEG_RUNTIME__)
  ? window.__FLEXWEG_RUNTIME__.reactI18next
  : null;

if (!R) {
  throw new Error(
    "[flexweg] window.__FLEXWEG_RUNTIME__ is not initialised when react-i18next was imported.",
  );
}

export default R;
export const useTranslation = R.useTranslation;
export const Trans = R.Trans;
export const withTranslation = R.withTranslation;
export const I18nextProvider = R.I18nextProvider;
export const initReactI18next = R.initReactI18next;
export const useSSR = R.useSSR;
