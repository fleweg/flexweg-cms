// Runtime stub for "react-dom/client".
const R = (typeof window !== "undefined" && window.__FLEXWEG_RUNTIME__)
  ? window.__FLEXWEG_RUNTIME__.reactDomClient
  : null;

if (!R) {
  throw new Error(
    "[flexweg] window.__FLEXWEG_RUNTIME__ is not initialised when react-dom/client was imported.",
  );
}

export const createRoot = R.createRoot;
export const hydrateRoot = R.hydrateRoot;
