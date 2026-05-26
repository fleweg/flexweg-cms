// Backend dispatcher for the users service.
//
// IMPORTANT: dispatched function exports are HOISTED FUNCTION
// declarations (not `const x = impl.x`), and `impl()` is resolved
// lazily on first call. Reason: `core/flexwegRuntime.ts` reads several
// dispatcher exports at module-init inside an object literal, and a
// circular import path through `themes/index.ts` means this module's
// body hasn't necessarily run when flexwegRuntime's body does. Using
// hoisted function bindings + lazy impl resolution avoids the TDZ
// ("can't access lexical declaration X before initialization") crash.
//
// `syncUsersFromApi` is intentionally NOT re-exported here — it exists
// only on the SQLite backend (no Firebase counterpart). Callers that
// need it (e.g. AddUserModal in UsersPage) import directly from
// `services/flexweg-sqlite/users`. Keeping it off the dispatcher
// preserves backend symmetry and avoids a runtime-mode branch in every
// caller.

import { getBackendKind } from "../lib/runtimeConfig";
import * as firebase from "./firebase/users";
import * as sqlite from "./flexweg-sqlite/users";

let _impl: typeof firebase | typeof sqlite | null = null;
function impl(): typeof firebase {
  if (!_impl) _impl = getBackendKind() === "flexweg-sqlite" ? sqlite : firebase;
  return _impl as typeof firebase;
}

// Constants: re-export directly from firebase (identical value in
// SQLite impl). Direct re-export is a live binding too, but the value
// is hoisted at module-record creation, so no TDZ.
export { USER_ROLES } from "./firebase/users";

export function subscribeToUsers(
  ...args: Parameters<typeof firebase.subscribeToUsers>
): ReturnType<typeof firebase.subscribeToUsers> {
  return impl().subscribeToUsers(...args);
}
export function getUserRecord(
  ...args: Parameters<typeof firebase.getUserRecord>
): ReturnType<typeof firebase.getUserRecord> {
  return impl().getUserRecord(...args);
}
export function subscribeToUserRecord(
  ...args: Parameters<typeof firebase.subscribeToUserRecord>
): ReturnType<typeof firebase.subscribeToUserRecord> {
  return impl().subscribeToUserRecord(...args);
}
export function ensureSelfUserRecord(
  ...args: Parameters<typeof firebase.ensureSelfUserRecord>
): ReturnType<typeof firebase.ensureSelfUserRecord> {
  return impl().ensureSelfUserRecord(...args);
}
export function setUserRole(
  ...args: Parameters<typeof firebase.setUserRole>
): ReturnType<typeof firebase.setUserRole> {
  return impl().setUserRole(...args);
}
export function setUserDisabled(
  ...args: Parameters<typeof firebase.setUserDisabled>
): ReturnType<typeof firebase.setUserDisabled> {
  return impl().setUserDisabled(...args);
}
export function setUserPreferences(
  ...args: Parameters<typeof firebase.setUserPreferences>
): ReturnType<typeof firebase.setUserPreferences> {
  return impl().setUserPreferences(...args);
}
export function setUserProfile(
  ...args: Parameters<typeof firebase.setUserProfile>
): ReturnType<typeof firebase.setUserProfile> {
  return impl().setUserProfile(...args);
}
export function resolveDisplayName(
  ...args: Parameters<typeof firebase.resolveDisplayName>
): ReturnType<typeof firebase.resolveDisplayName> {
  return impl().resolveDisplayName(...args);
}
export function resolvePublicDisplayName(
  ...args: Parameters<typeof firebase.resolvePublicDisplayName>
): ReturnType<typeof firebase.resolvePublicDisplayName> {
  return impl().resolvePublicDisplayName(...args);
}
export function deleteUserRecord(
  ...args: Parameters<typeof firebase.deleteUserRecord>
): ReturnType<typeof firebase.deleteUserRecord> {
  return impl().deleteUserRecord(...args);
}
export function buildAuthorLookup(
  ...args: Parameters<typeof firebase.buildAuthorLookup>
): ReturnType<typeof firebase.buildAuthorLookup> {
  return impl().buildAuthorLookup(...args);
}

export type { UserProfilePatch } from "./firebase/users";
