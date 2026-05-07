// Upload + uninstall handlers for external plugins/themes.
//
// "Install" expects a ZIP whose root contains a manifest.json + bundle.js.
// We extract client-side via JSZip, validate, upload every file to
// /admin/<type>/<id>/* via flexwegApi, and update /admin/external.json
// to reference the new entry. A subsequent reload picks the new entry
// up via externalLoader.
//
// "Uninstall" deletes the folder on Flexweg, removes the entry from
// external.json, and unregisters from the in-memory list. The user can
// re-install with a fresh ZIP without restarting the admin.
//
// All Flexweg API calls go through services/flexwegApi.ts so errors are
// funneled through the standard toast UX.

import JSZip from "jszip";
import {
  deleteFolder,
  getFile,
  uploadFile,
} from "./flexwegApi";
import {
  EXTERNAL_MANIFEST_PATH,
} from "./externalLoader";
import {
  EMPTY_EXTERNAL_MANIFEST,
  unregisterExternalPlugin,
  unregisterExternalTheme,
  type ExternalEntry,
  type ExternalManifest,
} from "./externalRegistry";
import {
  FLEXWEG_API_MIN_VERSION,
  FLEXWEG_API_VERSION,
} from "../core/flexwegRuntime";

export type ExternalKind = "plugins" | "themes";

// Shape of the manifest.json file shipped inside an external bundle's
// ZIP. Mirrors ExternalEntry but adds `name` (display name) which is
// surfaced in the upload UI before the bundle is even imported.
export interface BundledManifest {
  id: string;
  // Display name shown in the install confirmation. Free-form.
  name: string;
  // Bundle's own version, for display.
  version: string;
  // Runtime API version this bundle targets — checked before install.
  apiVersion: string;
  // Optional override; defaults to "bundle.js".
  entry?: string;
}

export interface UploadResult {
  manifest: BundledManifest;
  filesUploaded: number;
}

export class ExternalUploadError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "no-manifest"
      | "invalid-manifest"
      | "incompatible-api"
      | "duplicate-id"
      | "no-bundle"
      | "fetch-manifest"
      | "upload-failed",
  ) {
    super(message);
    this.name = "ExternalUploadError";
  }
}

function compareVersions(a: string, b: string): number {
  const parse = (s: string) =>
    s
      .split(".")
      .slice(0, 3)
      .map((p) => Number.parseInt(p, 10) || 0);
  const av = parse(a);
  const bv = parse(b);
  for (let i = 0; i < 3; i++) {
    const x = av[i] ?? 0;
    const y = bv[i] ?? 0;
    if (x !== y) return x < y ? -1 : 1;
  }
  return 0;
}

function isCompatibleApi(version: string): boolean {
  return (
    compareVersions(version, FLEXWEG_API_MIN_VERSION) >= 0 &&
    compareVersions(version, FLEXWEG_API_VERSION) <= 0
  );
}

// Slugifies the bundle id so a malicious or typo'd manifest can't
// escape into other Flexweg paths via "../" tricks.
function safeId(id: string): string {
  return id.replace(/[^a-z0-9-]/gi, "").toLowerCase();
}

// Flexweg API paths are absolute from the site root, but the admin SPA
// lives under /admin/ — every plugin/theme file and the external.json
// manifest must therefore be uploaded to `admin/<rest-of-path>`. The
// browser-side loader fetches them via relative URLs (`./external.json`,
// `./plugins/<id>/bundle.js`) which resolve against /admin/index.html
// to the same locations, but only AFTER we've prefixed the API path
// with "admin/". Without this prefix, files end up at the public site
// root (e.g. /plugins/<id>/bundle.js) where the admin doesn't look.
const ADMIN_PREFIX = "admin/";

function adminPath(relative: string): string {
  return ADMIN_PREFIX + relative.replace(/^\/+/, "");
}

// Reads the current external.json from Flexweg. Returns the empty
// manifest when the file doesn't yet exist (first install). 404 is
// silently mapped to empty by getFile's underlying performRequest.
async function readManifest(): Promise<ExternalManifest> {
  try {
    const text = await getFile(adminPath(EXTERNAL_MANIFEST_PATH));
    const parsed = JSON.parse(text) as Partial<ExternalManifest>;
    return {
      plugins: Array.isArray(parsed?.plugins) ? parsed.plugins : [],
      themes: Array.isArray(parsed?.themes) ? parsed.themes : [],
    };
  } catch (err) {
    // 404 → file doesn't exist yet → start from an empty manifest.
    // Any other error means we genuinely couldn't read the file; fail
    // hard so we don't accidentally overwrite a healthy manifest with
    // an empty one.
    if ((err as { status?: number })?.status === 404) {
      return { ...EMPTY_EXTERNAL_MANIFEST };
    }
    throw new ExternalUploadError(
      `Could not read ${EXTERNAL_MANIFEST_PATH}`,
      "fetch-manifest",
    );
  }
}

async function writeManifest(manifest: ExternalManifest): Promise<void> {
  await uploadFile({
    path: adminPath(EXTERNAL_MANIFEST_PATH),
    content: JSON.stringify(manifest, null, 2),
  });
}

// base64-encodes an ArrayBuffer for use with flexwegApi's base64 upload.
// Used for binary files (images, fonts, etc.) shipped inside a bundle ZIP.
function arrayBufferToBase64(buf: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const TEXT_EXTENSIONS = new Set([
  "js",
  "json",
  "css",
  "html",
  "txt",
  "md",
  "svg",
  "xml",
]);

function isTextFile(path: string): boolean {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  return TEXT_EXTENSIONS.has(ext);
}

// Installs a bundle from a ZIP file. Steps:
//   1. Unzip in-memory
//   2. Read + validate manifest.json (presence, shape, apiVersion)
//   3. Upload every file under <kind>/<id>/ on Flexweg
//   4. Update external.json adding the new entry
//
// Returns the parsed manifest so callers can show a confirmation toast.
export async function installFromZip(
  kind: ExternalKind,
  zipFile: File,
): Promise<UploadResult> {
  const zip = await JSZip.loadAsync(zipFile);

  // The ZIP root may include a wrapping folder (the way macOS Archive
  // Utility creates ZIPs). Detect it: if there's a single top-level
  // directory and manifest.json sits inside, peel it off transparently.
  const topLevel = new Set<string>();
  zip.forEach((relativePath) => {
    const seg = relativePath.split("/")[0];
    if (seg) topLevel.add(seg);
  });
  let prefix = "";
  if (
    topLevel.size === 1 &&
    !zip.file("manifest.json")
  ) {
    const candidate = [...topLevel][0] + "/";
    if (zip.file(candidate + "manifest.json")) {
      prefix = candidate;
    }
  }

  const manifestEntry = zip.file(prefix + "manifest.json");
  if (!manifestEntry) {
    throw new ExternalUploadError(
      "manifest.json missing from ZIP root",
      "no-manifest",
    );
  }
  let manifest: BundledManifest;
  try {
    manifest = JSON.parse(await manifestEntry.async("string"));
  } catch {
    throw new ExternalUploadError(
      "manifest.json is not valid JSON",
      "invalid-manifest",
    );
  }

  // Required fields. We're lenient on optional metadata but strict on
  // anything that determines installability or routing.
  for (const field of ["id", "name", "version", "apiVersion"] as const) {
    if (typeof manifest[field] !== "string" || !manifest[field]) {
      throw new ExternalUploadError(
        `manifest.json missing required field: ${field}`,
        "invalid-manifest",
      );
    }
  }
  manifest.id = safeId(manifest.id);
  if (!manifest.id) {
    throw new ExternalUploadError(
      "manifest.id contains no allowed characters (a-z 0-9 -)",
      "invalid-manifest",
    );
  }

  if (!isCompatibleApi(manifest.apiVersion)) {
    throw new ExternalUploadError(
      `bundle apiVersion ${manifest.apiVersion} is incompatible — admin supports [${FLEXWEG_API_MIN_VERSION}, ${FLEXWEG_API_VERSION}]`,
      "incompatible-api",
    );
  }

  const entryName = manifest.entry ?? "bundle.js";
  if (!zip.file(prefix + entryName)) {
    throw new ExternalUploadError(
      `entry file "${entryName}" missing from ZIP`,
      "no-bundle",
    );
  }

  // Refuse to clobber an existing entry — the caller is expected to
  // explicitly uninstall first if they want to swap an entry.
  const current = await readManifest();
  const list = current[kind];
  if (list.some((e) => e.id === manifest.id)) {
    throw new ExternalUploadError(
      `${kind === "plugins" ? "plugin" : "theme"} "${manifest.id}" is already installed — uninstall it first`,
      "duplicate-id",
    );
  }

  // Upload every non-directory file in the (possibly prefixed) ZIP to
  // admin/<kind>/<id>/<relative-path>. The admin/ prefix is required —
  // the runtime loader fetches the bundle via a URL relative to
  // /admin/index.html, so the file MUST land under /admin/ on Flexweg.
  const baseRemote = adminPath(`${kind}/${manifest.id}/`);
  const fileEntries: Array<{ remotePath: string; entry: JSZip.JSZipObject }> = [];
  zip.forEach((relativePath, entry) => {
    if (entry.dir) return;
    if (prefix && !relativePath.startsWith(prefix)) return;
    const local = prefix ? relativePath.slice(prefix.length) : relativePath;
    if (!local) return;
    fileEntries.push({ remotePath: baseRemote + local, entry });
  });

  let filesUploaded = 0;
  for (const { remotePath, entry } of fileEntries) {
    try {
      if (isTextFile(remotePath)) {
        const content = await entry.async("string");
        await uploadFile({ path: remotePath, content });
      } else {
        const buf = await entry.async("arraybuffer");
        const content = arrayBufferToBase64(buf);
        await uploadFile({ path: remotePath, content, encoding: "base64" });
      }
      filesUploaded++;
    } catch (err) {
      // Bail out early — leaving a partial install is worse than
      // surfacing the failure. The user can retry; subsequent
      // installs will pass the duplicate check because external.json
      // hasn't been updated yet.
      throw new ExternalUploadError(
        `upload failed at ${remotePath}: ${(err as Error).message}`,
        "upload-failed",
      );
    }
  }

  // Append the new entry to external.json. Default entryPath when the
  // manifest didn't override.
  const newEntry: ExternalEntry = {
    id: manifest.id,
    version: manifest.version,
    apiVersion: manifest.apiVersion,
    entryPath: `${kind}/${manifest.id}/${entryName}`,
  };
  current[kind].push(newEntry);
  await writeManifest(current);

  return { manifest, filesUploaded };
}

// Uninstalls an external entry. Deletes the folder on Flexweg, drops
// the entry from external.json, and unregisters from the in-memory
// list. The admin keeps running with the residual filters/blocks/cards
// the bundle registered until the next reload — full cleanup requires
// reloading the page.
export async function uninstallExternal(
  kind: ExternalKind,
  id: string,
): Promise<void> {
  // Update the manifest first so a partial cleanup never leaves the
  // admin trying to load a folder that's already been deleted.
  const current = await readManifest();
  current[kind] = current[kind].filter((e) => e.id !== id);
  await writeManifest(current);

  // Then nuke the folder. 404 is treated as success by deleteFolder.
  try {
    await deleteFolder(adminPath(`${kind}/${id}`));
  } catch (err) {
    // Even if the folder delete fails, the manifest is already
    // updated so the next reload won't try to load it. Surface the
    // error to the caller so they can retry the cleanup later.
    throw new ExternalUploadError(
      `folder cleanup failed: ${(err as Error).message}`,
      "upload-failed",
    );
  }

  if (kind === "plugins") unregisterExternalPlugin(id);
  else unregisterExternalTheme(id);
}
