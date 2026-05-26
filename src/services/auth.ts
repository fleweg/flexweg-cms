// Backend dispatcher for the auth service.
//
// Picks the implementation based on the active runtime backend at
// module-load time. The choice is fixed for the lifetime of the page —
// switching backend requires a reload (the Settings page handles that).
//
// In flexweg-sqlite mode, `sendResetEmail` throws (no email-based reset
// in that backend — admin uses adminResetPassword from the Users page).
// `probeBootstrapAdmin` returns false (admin role flows from the user
// record's `role` field, populated server-side for the first user).
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
import * as firebase from "./firebase/auth";
import * as sqlite from "./flexweg-sqlite/auth";

let _impl: typeof firebase | typeof sqlite | null = null;
function impl(): typeof firebase {
  if (!_impl) _impl = getBackendKind() === "flexweg-sqlite" ? sqlite : firebase;
  return _impl as typeof firebase;
}

export function subscribeToAuth(
  ...args: Parameters<typeof firebase.subscribeToAuth>
): ReturnType<typeof firebase.subscribeToAuth> {
  return impl().subscribeToAuth(...args);
}
export function signIn(
  ...args: Parameters<typeof firebase.signIn>
): ReturnType<typeof firebase.signIn> {
  return impl().signIn(...args);
}
export function signOut(
  ...args: Parameters<typeof firebase.signOut>
): ReturnType<typeof firebase.signOut> {
  return impl().signOut(...args);
}
export function sendResetEmail(
  ...args: Parameters<typeof firebase.sendResetEmail>
): ReturnType<typeof firebase.sendResetEmail> {
  return impl().sendResetEmail(...args);
}
export function probeBootstrapAdmin(
  ...args: Parameters<typeof firebase.probeBootstrapAdmin>
): ReturnType<typeof firebase.probeBootstrapAdmin> {
  return impl().probeBootstrapAdmin(...args);
}
export function authErrorKey(
  ...args: Parameters<typeof firebase.authErrorKey>
): ReturnType<typeof firebase.authErrorKey> {
  return impl().authErrorKey(...args);
}
