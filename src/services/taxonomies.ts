import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { collections, getDb } from "./firebase";
import type { Term, TermType } from "../core/types";

const termsCollection = () => collection(getDb(), collections.terms);
const termDoc = (id: string) => doc(getDb(), collections.terms, id);

function newId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function subscribeToTerms(
  onChange: (terms: Term[]) => void,
  onError?: (err: Error) => void,
): () => void {
  const q = query(termsCollection(), orderBy("name", "asc"));
  return onSnapshot(
    q,
    (snap) => onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Term)),
    onError,
  );
}

export interface CreateTermInput {
  type: TermType;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
}

export async function createTerm(input: CreateTermInput): Promise<string> {
  const id = newId();
  const data: Record<string, unknown> = {
    type: input.type,
    name: input.name,
    slug: input.slug,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (input.description) data.description = input.description;
  if (input.parentId) data.parentId = input.parentId;
  await setDoc(termDoc(id), data);
  return id;
}

export async function updateTerm(
  id: string,
  patch: Partial<Pick<Term, "name" | "slug" | "description" | "parentId">>,
): Promise<void> {
  const update: Record<string, unknown> = { updatedAt: serverTimestamp() };
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) continue;
    update[key] = value;
  }
  await updateDoc(termDoc(id), update);
}

export async function deleteTerm(id: string): Promise<void> {
  await deleteDoc(termDoc(id));
}
