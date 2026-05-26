// Backend dispatcher for the posts service.
//
// Picks the implementation based on the active runtime backend at
// module-load time. The choice is fixed for the lifetime of the page —
// switching backend requires a reload (the Settings page handles that).
//
// Type re-exports stay direct (not aliased via const) because TypeScript
// types don't exist at runtime — they'd be stripped by an assignment.
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
import * as firebase from "./firebase/posts";
import * as sqlite from "./flexweg-sqlite/posts";

let _impl: typeof firebase | typeof sqlite | null = null;
function impl(): typeof firebase {
  if (!_impl) _impl = getBackendKind() === "flexweg-sqlite" ? sqlite : firebase;
  return _impl as typeof firebase;
}

export function subscribeToPosts(
  ...args: Parameters<typeof firebase.subscribeToPosts>
): ReturnType<typeof firebase.subscribeToPosts> {
  return impl().subscribeToPosts(...args);
}
export function createPost(
  ...args: Parameters<typeof firebase.createPost>
): ReturnType<typeof firebase.createPost> {
  return impl().createPost(...args);
}
export function updatePost(
  ...args: Parameters<typeof firebase.updatePost>
): ReturnType<typeof firebase.updatePost> {
  return impl().updatePost(...args);
}
export function markPostOnline(
  ...args: Parameters<typeof firebase.markPostOnline>
): ReturnType<typeof firebase.markPostOnline> {
  return impl().markPostOnline(...args);
}
export function markPostDraft(
  ...args: Parameters<typeof firebase.markPostDraft>
): ReturnType<typeof firebase.markPostDraft> {
  return impl().markPostDraft(...args);
}
export function deletePost(
  ...args: Parameters<typeof firebase.deletePost>
): ReturnType<typeof firebase.deletePost> {
  return impl().deletePost(...args);
}
export function subscribeToPostsPaginated(
  ...args: Parameters<typeof firebase.subscribeToPostsPaginated>
): ReturnType<typeof firebase.subscribeToPostsPaginated> {
  return impl().subscribeToPostsPaginated(...args);
}
export function fetchAllPosts(
  ...args: Parameters<typeof firebase.fetchAllPosts>
): ReturnType<typeof firebase.fetchAllPosts> {
  return impl().fetchAllPosts(...args);
}
export function primeAllPostsCache(
  ...args: Parameters<typeof firebase.primeAllPostsCache>
): ReturnType<typeof firebase.primeAllPostsCache> {
  return impl().primeAllPostsCache(...args);
}
export function invalidateAllPostsCache(
  ...args: Parameters<typeof firebase.invalidateAllPostsCache>
): ReturnType<typeof firebase.invalidateAllPostsCache> {
  return impl().invalidateAllPostsCache(...args);
}
export function countPosts(
  ...args: Parameters<typeof firebase.countPosts>
): ReturnType<typeof firebase.countPosts> {
  return impl().countPosts(...args);
}

export type {
  CreatePostInput,
  UpdatePostInput,
  PaginatedQueryOpts,
  PaginatedQueryResult,
} from "./firebase/posts";
