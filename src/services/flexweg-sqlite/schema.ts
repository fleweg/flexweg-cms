// SQLite schema for the CMS. Run once during install via
// `sqlBatch(SCHEMA_STATEMENTS)`. All statements are idempotent
// (`CREATE TABLE IF NOT EXISTS`), so re-running them on an existing
// DB is safe and used by the "ensure schema" check on every boot.
//
// Mirrors the Firestore document shapes but flattens to relational
// tables. JSON columns (term_ids, formats, seo, socials, preferences,
// previous_published_paths) get JSON.stringify/JSON.parse wrappers in
// each service file's rowToX/xToRow helpers.
//
// Columns use snake_case in SQL to match SQLite convention; the
// rowToX helpers in each service file translate to the camelCase
// TypeScript domain types.

import { sqlBatch, sqlExec, sqlQuery } from "./client";
import { DEFAULT_SITE_SETTINGS } from "../firebase/settings";

export const SCHEMA_STATEMENTS: Array<{ sql: string; params?: unknown[] }> = [
  // -- users (cache; auth API is source of truth) ----------------------
  {
    sql: `CREATE TABLE IF NOT EXISTS users (
      uid TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      display_name TEXT,
      first_name TEXT,
      last_name TEXT,
      title TEXT,
      bio TEXT,
      avatar_media_id TEXT,
      socials TEXT,
      role TEXT NOT NULL DEFAULT 'editor',
      disabled INTEGER NOT NULL DEFAULT 0,
      preferences TEXT,
      created_at INTEGER NOT NULL,
      created_by TEXT
    )`,
  },

  // -- posts (posts + pages, discriminated by `type` column) -----------
  {
    sql: `CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      content_markdown TEXT NOT NULL DEFAULT '',
      excerpt TEXT,
      hero_media_id TEXT,
      author_id TEXT,
      term_ids TEXT,
      primary_term_id TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      seo TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      published_at INTEGER,
      last_published_path TEXT,
      previous_published_paths TEXT,
      last_published_hash TEXT,
      legacy_url TEXT
    )`,
  },
  { sql: `CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type)` },
  { sql: `CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug)` },
  { sql: `CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status)` },
  { sql: `CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC)` },
  { sql: `CREATE INDEX IF NOT EXISTS idx_posts_updated_at ON posts(updated_at DESC)` },

  // -- terms (categories + tags) ---------------------------------------
  {
    sql: `CREATE TABLE IF NOT EXISTS terms (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      description TEXT,
      parent_id TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      last_published_path TEXT
    )`,
  },
  { sql: `CREATE INDEX IF NOT EXISTS idx_terms_type ON terms(type)` },
  { sql: `CREATE INDEX IF NOT EXISTS idx_terms_slug ON terms(slug)` },

  // -- media (multi-variant image metadata) ----------------------------
  {
    sql: `CREATE TABLE IF NOT EXISTS media (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      content_type TEXT NOT NULL,
      size INTEGER NOT NULL,
      storage_base TEXT,
      formats TEXT,
      default_format TEXT,
      alt TEXT,
      caption TEXT,
      uploaded_at INTEGER NOT NULL,
      uploaded_by TEXT,
      storage_path TEXT,
      url TEXT
    )`,
  },
  { sql: `CREATE INDEX IF NOT EXISTS idx_media_uploaded_at ON media(uploaded_at DESC)` },

  // -- settings (single row, key="site") -------------------------------
  {
    sql: `CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )`,
  },

  // -- generic config (flexweg API key, etc.) --------------------------
  {
    sql: `CREATE TABLE IF NOT EXISTS config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )`,
  },
];

// Initialises a fresh SQLite: creates all tables + indexes + seeds the
// default site settings if not present. Idempotent — safe to call on
// every boot to handle schema additions.
export async function ensureSchema(): Promise<void> {
  await sqlBatch(SCHEMA_STATEMENTS);
  await seedDefaultSettingsIfMissing();
}

async function seedDefaultSettingsIfMissing(): Promise<void> {
  const existing = await sqlQuery<{ value: string }>(
    "SELECT value FROM settings WHERE key = ?",
    ["site"],
  );
  if (existing.rows.length > 0) return;
  await sqlExec("INSERT INTO settings (key, value) VALUES (?, ?)", [
    "site",
    JSON.stringify(DEFAULT_SITE_SETTINGS),
  ]);
}
