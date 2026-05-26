// Backend dispatcher for the site settings service.
//
// DEFAULT_SITE_SETTINGS is the same constant in both backends (the
// SQLite impl re-exports the Firebase definition to keep one source of
// truth). Re-exporting from the dispatcher is purely cosmetic — both
// impls converge on the same value.
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
import * as firebase from "./firebase/settings";
import * as sqlite from "./flexweg-sqlite/settings";

let _impl: typeof firebase | typeof sqlite | null = null;
function impl(): typeof firebase {
  if (!_impl) _impl = getBackendKind() === "flexweg-sqlite" ? sqlite : firebase;
  return _impl as typeof firebase;
}

// Constants: re-export directly from firebase (identical value in
// SQLite impl). Direct re-export is a live binding too, but the value
// is hoisted at module-record creation, so no TDZ.
export { DEFAULT_SITE_SETTINGS } from "./firebase/settings";

export function subscribeToSettings(
  ...args: Parameters<typeof firebase.subscribeToSettings>
): ReturnType<typeof firebase.subscribeToSettings> {
  return impl().subscribeToSettings(...args);
}
export function getSettings(
  ...args: Parameters<typeof firebase.getSettings>
): ReturnType<typeof firebase.getSettings> {
  return impl().getSettings(...args);
}
export function updateSettings(
  ...args: Parameters<typeof firebase.updateSettings>
): ReturnType<typeof firebase.updateSettings> {
  return impl().updateSettings(...args);
}
// Generic wrappers — written explicitly so `<T>` survives (the
// rest-spread + Parameters pattern erases generics).
export function updatePluginConfig<T>(pluginId: string, config: T): Promise<void> {
  return impl().updatePluginConfig(pluginId, config);
}
export function updateThemeConfig<T>(themeId: string, config: T): Promise<void> {
  return impl().updateThemeConfig(themeId, config);
}
