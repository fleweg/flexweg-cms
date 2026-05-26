import { useCallback, useEffect, useMemo, useState } from "react";

// Maintains a Map<id, T> of locally-inserted entities that haven't shown
// up in the canonical (server-backed) list yet. The hook merges them
// into the resolved list so consumers see the new row immediately —
// closing the latency gap between a mutation and the next subscription
// emission.
//
// Why: in SQLite mode, the polling tick is ~4 s. Without optimistic
// inserts, the flow
//
//   1. await createPost(...)  →  returns id
//   2. navigate(`/posts/${id}`)
//   3. PostEditPage reads from CmsDataContext  →  no entry yet
//   4. "Post not found" flash until the next poll catches up
//
// gives a brief 404 for every new post. Even Firebase mode (push via
// onSnapshot) has a short window where the freshly-created row is in
// Firestore but not yet in the local subscription state.
//
// Entries are dropped automatically once the canonical snapshot
// contains the same id (the server caught up). Callers don't have to
// remember to clear them.

export interface OptimisticEntitiesApi<T extends { id: string }> {
  // Canonical list with optimistic inserts/updates merged in. Drop-in
  // replacement for the raw `entities` array.
  resolved: T[];
  // Synchronously inject (or replace) an entity in the local list. Use
  // it right after `create…` returns, before navigating to the new
  // entity's detail page.
  addOptimistic: (entity: T) => void;
  // Optional rollback path — e.g. when the user navigates away before
  // the canonical refresh arrives and we want to free the temporary
  // entry.
  removeOptimistic: (id: string) => void;
}

export function useOptimisticEntities<T extends { id: string }>(
  canonical: T[],
): OptimisticEntitiesApi<T> {
  const [optimistic, setOptimistic] = useState<Map<string, T>>(() => new Map());

  // Auto-cleanup: whenever the canonical list updates, drop optimistic
  // entries whose id now exists in the snapshot. Keeps the merged list
  // free of stale duplicates without requiring the caller to clean up.
  useEffect(() => {
    if (optimistic.size === 0) return;
    const canonicalIds = new Set(canonical.map((e) => e.id));
    let changed = false;
    const next = new Map(optimistic);
    for (const id of optimistic.keys()) {
      if (canonicalIds.has(id)) {
        next.delete(id);
        changed = true;
      }
    }
    if (changed) setOptimistic(next);
  }, [canonical, optimistic]);

  const addOptimistic = useCallback((entity: T) => {
    setOptimistic((curr) => {
      const next = new Map(curr);
      next.set(entity.id, entity);
      return next;
    });
  }, []);

  const removeOptimistic = useCallback((id: string) => {
    setOptimistic((curr) => {
      if (!curr.has(id)) return curr;
      const next = new Map(curr);
      next.delete(id);
      return next;
    });
  }, []);

  const resolved = useMemo(() => {
    if (optimistic.size === 0) return canonical;
    // Avoid duplicates if a race left both versions in flight — prefer
    // the canonical row, drop the optimistic one.
    const canonicalIds = new Set(canonical.map((e) => e.id));
    const extras: T[] = [];
    for (const e of optimistic.values()) {
      if (!canonicalIds.has(e.id)) extras.push(e);
    }
    if (extras.length === 0) return canonical;
    return [...canonical, ...extras];
  }, [canonical, optimistic]);

  return { resolved, addOptimistic, removeOptimistic };
}
