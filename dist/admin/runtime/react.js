// Runtime stub for "react". Loaded via the import-map in /admin/index.html
// when an external plugin or theme bundle does `import React from "react"`.
// Re-exports the live React module hosted by the admin so there is only
// ever ONE React instance in the page (React's hook integrity requires it).
//
// This file is intentionally written as plain ESM with no transpilation —
// it's served as-is from /admin/runtime/react.js without going through
// Vite's bundle pipeline.

const R = (typeof window !== "undefined" && window.__FLEXWEG_RUNTIME__)
  ? window.__FLEXWEG_RUNTIME__.react
  : null;

if (!R) {
  throw new Error(
    "[flexweg] window.__FLEXWEG_RUNTIME__ is not initialised. " +
      "An external bundle imported react before the admin booted. " +
      "Make sure flexwegRuntime is side-effect imported in main.tsx and " +
      "the import-map in index.html resolves react to ./runtime/react.js.",
  );
}

export default R;
export const Children = R.Children;
export const Component = R.Component;
export const Fragment = R.Fragment;
export const Profiler = R.Profiler;
export const PureComponent = R.PureComponent;
export const StrictMode = R.StrictMode;
export const Suspense = R.Suspense;
export const cloneElement = R.cloneElement;
export const createContext = R.createContext;
export const createElement = R.createElement;
export const createRef = R.createRef;
export const forwardRef = R.forwardRef;
export const isValidElement = R.isValidElement;
export const lazy = R.lazy;
export const memo = R.memo;
export const startTransition = R.startTransition;
export const useCallback = R.useCallback;
export const useContext = R.useContext;
export const useDebugValue = R.useDebugValue;
export const useDeferredValue = R.useDeferredValue;
export const useEffect = R.useEffect;
export const useId = R.useId;
export const useImperativeHandle = R.useImperativeHandle;
export const useInsertionEffect = R.useInsertionEffect;
export const useLayoutEffect = R.useLayoutEffect;
export const useMemo = R.useMemo;
export const useReducer = R.useReducer;
export const useRef = R.useRef;
export const useState = R.useState;
export const useSyncExternalStore = R.useSyncExternalStore;
export const useTransition = R.useTransition;
export const version = R.version;
