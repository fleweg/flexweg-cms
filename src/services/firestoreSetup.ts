// First-run helper: detects whether the composite indexes the
// paginated post / page list pages need are deployed, and if not,
// extracts the auto-suggest "create this index" URL Firestore
// embeds inside `failed-precondition` errors so the user can click
// once to fix it.
//
// Why this exists: composite-index creation is an admin-only
// operation that the client SDK can't perform — Google reserves it
// for the Firebase Console / CLI / gcloud / Admin SDK. The closest
// the browser can get to "auto-create" is to detect missing indexes
// and surface the one-click create link from the Firebase Console.
// That's what `pingPaginatedQueries` does.
//
// Result is cached in localStorage so the ping doesn't re-run on
// every reload. Once the indexes are confirmed ready, we never
// re-check (a created index never disappears unless an admin
// explicitly deletes it).

import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  type FirestoreError,
} from "firebase/firestore";
import { collections, getDb } from "./firebase";

export interface MissingIndex {
  // Human-readable label shown to the user. Bound to the query
  // shape so the user can match it back to the workflow that needs it.
  label: string;
  // The index this query needs (printable form for the modal).
  fields: string;
  // The auto-suggest URL Firestore returns in the `failed-precondition`
  // error message. Empty string when extraction failed (rare —
  // would indicate Firestore changed its error format).
  createUrl: string;
}

export interface FirestoreSetupResult {
  ready: boolean;
  missingIndexes: MissingIndex[];
  // True if at least one ping query failed for a reason other than
  // missing index (network, permissions). The setup gate shows
  // these as a generic error rather than the index-creation flow.
  unexpectedError?: { code: string; message: string };
}

const CACHE_KEY = "flexweg.firestoreIndexesReady";
const FAILED_PRECONDITION = "failed-precondition";

// Pulls the auto-suggest URL out of Firestore's error message.
// Format: "The query requires an index. You can create it here: https://…"
function extractSuggestUrl(message: string): string {
  const m = message.match(/https:\/\/console\.firebase\.google\.com\/[^\s)]+/);
  return m ? m[0] : "";
}

interface PingDescriptor {
  label: string;
  fields: string;
  run: () => Promise<unknown>;
}

// The exact queries the list pages run, executed with limit(1) so
// the cost is one document max per query (well within free-tier
// quotas — 4 reads total when both indexes already exist).
function buildPingQueries(): PingDescriptor[] {
  const postsCollection = collection(getDb(), collections.posts);
  return [
    {
      label: "Posts list — all",
      fields: "type ASC, createdAt DESC",
      run: () =>
        getDocs(
          query(
            postsCollection,
            where("type", "==", "post"),
            orderBy("createdAt", "desc"),
            limit(1),
          ),
        ),
    },
    {
      label: "Posts list — by status",
      fields: "type ASC, status ASC, createdAt DESC",
      run: () =>
        getDocs(
          query(
            postsCollection,
            where("type", "==", "post"),
            where("status", "==", "online"),
            orderBy("createdAt", "desc"),
            limit(1),
          ),
        ),
    },
  ];
}

// Runs the two ping queries. For each:
//   • OK → index exists, nothing to do.
//   • failed-precondition → index missing, pull the create URL.
//   • Anything else → bubble up as `unexpectedError` (network down,
//     rules denying reads, etc.).
export async function pingPaginatedQueries(): Promise<FirestoreSetupResult> {
  const missingIndexes: MissingIndex[] = [];
  let unexpectedError: FirestoreSetupResult["unexpectedError"];

  for (const ping of buildPingQueries()) {
    try {
      await ping.run();
    } catch (err) {
      const fbErr = err as FirestoreError;
      if (fbErr.code === FAILED_PRECONDITION) {
        missingIndexes.push({
          label: ping.label,
          fields: ping.fields,
          createUrl: extractSuggestUrl(fbErr.message ?? ""),
        });
      } else {
        // First non-precondition error wins — there's no value in
        // running subsequent queries when the network or rules are
        // broken. The user will fix that first then retry.
        unexpectedError = unexpectedError ?? {
          code: fbErr.code ?? "unknown",
          message: fbErr.message ?? String(err),
        };
      }
    }
  }

  const ready = missingIndexes.length === 0 && !unexpectedError;
  if (ready) markIndexesReady();
  return { ready, missingIndexes, unexpectedError };
}

// Cache helpers — mark the indexes as ready in localStorage so a
// reload skips the ping (saves 2 reads on every admin boot for
// already-set-up sites).

export function getCachedReady(): boolean {
  try {
    return window.localStorage.getItem(CACHE_KEY) === "1";
  } catch {
    return false;
  }
}

function markIndexesReady(): void {
  try {
    window.localStorage.setItem(CACHE_KEY, "1");
  } catch {
    // Private mode etc. — failing to cache is fine, the ping just
    // re-runs next time. Don't surface to the user.
  }
}

// Exposed for the "Retry" button — drops the cache so the next
// pingPaginatedQueries() call hits Firestore again. Useful when
// the user has just clicked through Firebase Console to create the
// indexes and wants to verify.
export function invalidateCachedReady(): void {
  try {
    window.localStorage.removeItem(CACHE_KEY);
  } catch {
    // Same as above — not worth surfacing.
  }
}
