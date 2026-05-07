// Runtime stub for "react/jsx-runtime". External bundles compile JSX
// down to jsx() / jsxs() calls; the import-map redirects these here so
// they hit the same React instance as the admin.
const R = (typeof window !== "undefined" && window.__FLEXWEG_RUNTIME__)
  ? window.__FLEXWEG_RUNTIME__.reactJsxRuntime
  : null;

if (!R) {
  throw new Error(
    "[flexweg] window.__FLEXWEG_RUNTIME__ is not initialised when react-jsx-runtime was imported.",
  );
}

export const jsx = R.jsx;
export const jsxs = R.jsxs;
export const jsxDEV = R.jsxDEV;
export const Fragment = R.Fragment;
