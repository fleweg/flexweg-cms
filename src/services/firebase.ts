import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import {
  getMissingFirebaseFields,
  getRuntimeConfig,
  resetRuntimeConfigCache,
  type FlexwegRuntimeConfig,
} from "../lib/runtimeConfig";

export function getAdminEmail(): string {
  const v = getRuntimeConfig()?.adminEmail;
  return typeof v === "string" ? v.trim().toLowerCase() : "";
}

// Returns the env var names that would need to be filled in .env to boot
// the admin without going through the in-app SetupForm. Returns [] when
// the runtime config is already resolved (either from window.__FLEXWEG_CONFIG__
// or from baked-in import.meta.env values).
export function getMissingFirebaseEnvVars(): string[] {
  return getMissingFirebaseFields();
}

let cachedDb: Firestore | null = null;
let cachedAuth: Auth | null = null;
let cachedApp: FirebaseApp | null = null;

function getApp(): FirebaseApp {
  if (cachedApp) return cachedApp;
  const config = getRuntimeConfig();
  if (!config) {
    throw new Error(
      "Firebase config not available. The runtime resolver returned null — either fill .env or complete the in-admin setup form.",
    );
  }
  cachedApp = getApps()[0] ?? initializeApp(config.firebase);
  return cachedApp;
}

export function getDb(): Firestore {
  if (cachedDb) return cachedDb;
  cachedDb = getFirestore(getApp());
  return cachedDb;
}

export function getAuthClient(): Auth {
  if (cachedAuth) return cachedAuth;
  cachedAuth = getAuth(getApp());
  return cachedAuth;
}

// Initialises Firebase from a SetupForm payload before the runtime
// config has been persisted. Used during first-run setup so we can
// authenticate the admin and write config/flexweg to Firestore *before*
// uploading the populated config.js to Flexweg.
//
// After this returns, getDb() / getAuthClient() will reuse the same app
// instance, and getRuntimeConfig() will resolve from window.__FLEXWEG_CONFIG__
// (which we set here as a side effect so the rest of the codebase stays
// in sync without a reload).
export function initFirebaseFromSetup(config: FlexwegRuntimeConfig): void {
  if (cachedApp) {
    throw new Error("Firebase is already initialised — cannot re-init from setup.");
  }
  if (typeof window !== "undefined") {
    window.__FLEXWEG_CONFIG__ = config;
  }
  resetRuntimeConfigCache();
  cachedApp = initializeApp(config.firebase);
}

export const collections = {
  posts: "posts",
  terms: "terms",
  media: "media",
  config: "config",
  users: "users",
  settings: "settings",
} as const;

export const configDocs = {
  flexweg: "flexweg",
} as const;

export const settingsDocs = {
  site: "site",
} as const;
