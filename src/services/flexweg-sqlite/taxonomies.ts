// SQLite implementation of the terms (categories + tags) service.
// Mirrors the function signatures of services/firebase/taxonomies.ts
// so the top-level dispatcher can swap impls based on backend.

import { Timestamp } from "firebase/firestore";
import { sqlExec, sqlQuery } from "./client";
import { notifyPotentialChange, subscribeWithPolling } from "./subscriptions";
import type { Term, TermType } from "../../core/types";

interface TermRow {
  id: string;
  type: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  created_at: number;
  updated_at: number;
  last_published_path: string | null;
}

function rowToTerm(r: TermRow): Term {
  const term: Term = {
    id: r.id,
    type: r.type as TermType,
    name: r.name,
    slug: r.slug,
    createdAt: Timestamp.fromMillis(r.created_at),
    updatedAt: Timestamp.fromMillis(r.updated_at),
  };
  if (r.description) term.description = r.description;
  if (r.parent_id) term.parentId = r.parent_id;
  if (r.last_published_path) term.lastPublishedPath = r.last_published_path;
  return term;
}

function genId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function subscribeToTerms(
  onChange: (terms: Term[]) => void,
  onError?: (err: Error) => void,
): () => void {
  return subscribeWithPolling(
    async () => {
      const { rows } = await sqlQuery<TermRow>(
        "SELECT * FROM terms ORDER BY name ASC",
        [],
      );
      return rows.map(rowToTerm);
    },
    onChange,
    onError,
  );
}

export async function fetchAllTerms(): Promise<Term[]> {
  const { rows } = await sqlQuery<TermRow>(
    "SELECT * FROM terms ORDER BY name ASC",
    [],
  );
  return rows.map(rowToTerm);
}

export interface CreateTermInput {
  type: TermType;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
}

export async function createTerm(input: CreateTermInput): Promise<string> {
  const id = genId();
  const now = Date.now();
  await sqlExec(
    `INSERT INTO terms (
      id, type, name, slug, description, parent_id,
      created_at, updated_at, last_published_path
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      input.type,
      input.name,
      input.slug,
      input.description ?? null,
      input.parentId ?? null,
      now,
      now,
      null,
    ],
  );
  notifyPotentialChange();
  return id;
}

export async function updateTerm(
  id: string,
  patch: Partial<Pick<Term, "name" | "slug" | "description" | "parentId">>,
): Promise<void> {
  const sets: string[] = [];
  const params: unknown[] = [];
  if (patch.name !== undefined) {
    sets.push("name = ?");
    params.push(patch.name);
  }
  if (patch.slug !== undefined) {
    sets.push("slug = ?");
    params.push(patch.slug);
  }
  if (patch.description !== undefined) {
    sets.push("description = ?");
    params.push(patch.description ?? null);
  }
  if (patch.parentId !== undefined) {
    sets.push("parent_id = ?");
    params.push(patch.parentId ?? null);
  }
  sets.push("updated_at = ?");
  params.push(Date.now());
  params.push(id);
  if (sets.length === 1) {
    // No-op patch (only updated_at) — still bump it.
  }
  await sqlExec(`UPDATE terms SET ${sets.join(", ")} WHERE id = ?`, params);
  notifyPotentialChange();
}

export async function deleteTerm(id: string): Promise<void> {
  await sqlExec("DELETE FROM terms WHERE id = ?", [id]);
  notifyPotentialChange();
}
