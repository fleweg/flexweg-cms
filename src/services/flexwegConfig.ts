// Backend dispatcher for the Flexweg attachments-config service.
//
// Both backends store the master Flexweg API key in their own data
// layer (Firestore `config/flexweg` vs SQLite `config` table key
// "flexweg"). The shape returned by `getFlexwegConfig()` is identical —
// the dispatcher hands it to services/flexwegApi.ts which is itself
// backend-agnostic.
//
// `FlexwegConfig` is defined in the firebase impl and the SQLite impl
// imports it via `import type { FlexwegConfig } from "../flexwegConfig"`
// (this file) — type-only, so the runtime import graph stays acyclic.
//
// IMPORTANT: dispatched function exports are HOISTED FUNCTION
// declarations (not `const x = impl.x`), and `impl()` is resolved
// lazily on first call. Reason: `core/flexwegRuntime.ts` reads several
// dispatcher exports at module-init inside an object literal, and a
// circular import path through `themes/index.ts` means this module's
// body hasn't necessarily run when flexwegRuntime's body does. Using
// hoisted function bindings + lazy impl resolution avoids the TDZ
// ("can't access lexical declaration X before initialization") crash.

import { getBackendKind } from "../lib/runtimeConfig";
import * as firebase from "./firebase/flexwegConfig";
import * as sqlite from "./flexweg-sqlite/flexwegConfig";

let _impl: typeof firebase | typeof sqlite | null = null;
function impl(): typeof firebase {
  if (!_impl) _impl = getBackendKind() === "flexweg-sqlite" ? sqlite : firebase;
  return _impl as typeof firebase;
}

// The DEFAULT_FLEXWEG_API_BASE_URL value is identical in both backends —
// re-exporting from firebase is fine and avoids a needless indirection.
export { DEFAULT_FLEXWEG_API_BASE_URL } from "./firebase/flexwegConfig";

export function getFlexwegConfig(
  ...args: Parameters<typeof firebase.getFlexwegConfig>
): ReturnType<typeof firebase.getFlexwegConfig> {
  return impl().getFlexwegConfig(...args);
}
export function setFlexwegConfig(
  ...args: Parameters<typeof firebase.setFlexwegConfig>
): ReturnType<typeof firebase.setFlexwegConfig> {
  return impl().setFlexwegConfig(...args);
}

export type { FlexwegConfig } from "./firebase/flexwegConfig";
