// Runtime configuration resolver. Picks Firebase + admin email values
// from one of two sources, in order:
//
//   1. window.__FLEXWEG_CONFIG__ — set synchronously by /admin/config.js
//      before the bundle loads. This is how a "drop dist/ on Flexweg and
//      configure via the in-admin form" deployment works: the SetupForm
//      writes a populated config.js to /admin/config.js on Flexweg, and
//      the next reload reads it from the global.
//
//   2. import.meta.env.VITE_FIREBASE_* — populated by Vite at build time
//      from the developer's local .env, OR served by Vite during `npm run
//      dev`. This covers the legacy / dev path where the developer
//      already has credentials in .env and never sees the SetupForm.
//
// Both code paths converge on the same FlexwegRuntimeConfig shape; the
// rest of the codebase only ever reads through `getRuntimeConfig()` and
// stays oblivious to which source provided the values.

import type { FirebaseOptions } from "firebase/app";

declare global {
  interface Window {
    // Set by /admin/config.js before the main bundle loads. May be null
    // when the admin is freshly deployed without baked-in env values.
    __FLEXWEG_CONFIG__?: FlexwegRuntimeConfig | null;
  }
}

export interface FlexwegRuntimeConfig {
  firebase: FirebaseOptions;
  // Optional. Legacy field — modern admin builds detect the bootstrap
  // admin via a Firestore probe (`config/admin` rule) instead of
  // exposing the email publicly. Kept as an opt-in fallback so older
  // deployments that still have an `adminEmail` baked into config.js
  // keep working until they migrate the Firestore rules + redeploy.
  adminEmail?: string;
}

const FIREBASE_FIELDS = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
] as const;

type FirebaseField = (typeof FIREBASE_FIELDS)[number];

// Maps a Firebase config field name to the env var that supplies it.
// Used both for build-time resolution and for the SetupForm's "missing
// fields" diagnostic.
export const ENV_KEY_BY_FIELD: Record<FirebaseField, string> = {
  apiKey: "VITE_FIREBASE_API_KEY",
  authDomain: "VITE_FIREBASE_AUTH_DOMAIN",
  projectId: "VITE_FIREBASE_PROJECT_ID",
  storageBucket: "VITE_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "VITE_FIREBASE_MESSAGING_SENDER_ID",
  appId: "VITE_FIREBASE_APP_ID",
};

function nonEmpty(s: unknown): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

function readFromGlobal(): FlexwegRuntimeConfig | null {
  if (typeof window === "undefined") return null;
  const raw = window.__FLEXWEG_CONFIG__;
  if (!raw || typeof raw !== "object") return null;
  const fb = (raw as FlexwegRuntimeConfig).firebase;
  if (!fb) return null;
  // Require the minimum set of Firebase fields. Storage bucket and
  // messaging sender id are technically optional for Auth + Firestore but
  // we keep them in the contract because every Firebase web setup ships
  // them today and including them keeps parity with the .env path.
  for (const field of FIREBASE_FIELDS) {
    if (!nonEmpty((fb as Record<string, unknown>)[field])) return null;
  }
  // adminEmail is optional — modern setups omit it to keep the email
  // out of /admin/config.js; legacy setups keep it for backward
  // compatibility. Either shape passes here.
  return raw as FlexwegRuntimeConfig;
}

function readFromImportMetaEnv(): FlexwegRuntimeConfig | null {
  const env = import.meta.env;
  const firebase: Partial<FirebaseOptions> = {};
  for (const field of FIREBASE_FIELDS) {
    const v = env[ENV_KEY_BY_FIELD[field]];
    if (!nonEmpty(v)) return null;
    (firebase as Record<string, string>)[field] = v;
  }
  // adminEmail is optional — VITE_ADMIN_EMAIL is the legacy fallback
  // used by the email-comparison bootstrap detection. Modern setups
  // can leave it unset; the rules-based probe takes over.
  const adminEmail = env.VITE_ADMIN_EMAIL;
  return {
    firebase: firebase as FirebaseOptions,
    ...(nonEmpty(adminEmail) ? { adminEmail } : {}),
  };
}

let cached: FlexwegRuntimeConfig | null | undefined;

export function getRuntimeConfig(): FlexwegRuntimeConfig | null {
  if (cached !== undefined) return cached;
  cached = readFromGlobal() ?? readFromImportMetaEnv();
  return cached;
}

// Test / setup-flow helper: drops the cache so the next call re-evaluates
// the resolver. Used by the SetupForm's "Save & reload" path to verify
// the just-uploaded config.js without a full page reload (when feasible).
export function resetRuntimeConfigCache(): void {
  cached = undefined;
}

// Returns the env var names that would need to be set if we were going
// the .env route. Useful for the "missing fields" diagnostic on the
// pre-setup error screen and in the SetupForm.
export function getMissingFirebaseFields(): string[] {
  const fb = readFromGlobal()?.firebase ?? null;
  if (fb) return [];
  const env = import.meta.env;
  return FIREBASE_FIELDS.filter((f) => !nonEmpty(env[ENV_KEY_BY_FIELD[f]])).map(
    (f) => ENV_KEY_BY_FIELD[f],
  );
}

// Serialises a runtime config back into the JS source code for
// /admin/config.js. The SetupForm uploads this string to Flexweg; on the
// next reload it executes synchronously before the bundle and the
// resolver picks the values up via readFromGlobal().
//
// adminEmail is intentionally stripped from the serialised output even
// when present in the input. The modern bootstrap-admin flow uses a
// Firestore probe (`config/admin` rule) and pinned email in the rules,
// so writing the admin email into the public /admin/config.js would
// re-introduce the privacy issue we just solved.
export function buildConfigJsSource(config: FlexwegRuntimeConfig): string {
  const banner =
    "// Generated by Flexweg CMS first-run setup. Do not edit by hand —\n" +
    "// re-run the admin setup form to update.\n";
  const serialisable = { firebase: config.firebase };
  return `${banner}window.__FLEXWEG_CONFIG__ = ${JSON.stringify(serialisable, null, 2)};\n`;
}
