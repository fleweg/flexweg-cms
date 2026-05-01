import i18n from "../i18n";
import { toast } from "../lib/toast";
import { getFlexwegConfig, type FlexwegConfig } from "./flexwegConfig";

// Thin client over the Flexweg Files API. Every call resolves the config
// lazily so callers don't have to thread it through. Methods that mutate
// the site (upload/delete/rename/folders) all hit `/api/v1/files/*` and
// require an X-API-Key header.
//
// Error UX: every failure (HTTP non-2xx OR network/CORS) is surfaced via
// the global toast system in addition to throwing — so calling code can
// still react locally (inline error states, retry buttons) while the user
// gets an immediate visible alert.

export class FlexwegApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: string,
  ) {
    super(message);
    this.name = "FlexwegApiError";
  }
}

// Translatable label key suffix for each Flexweg action. Used to render
// "Uploading file: …" / "Suppression du fichier : …" in toasts.
type FlexwegAction =
  | "upload"
  | "delete"
  | "rename"
  | "get"
  | "list"
  | "createFolder"
  | "renameFolder"
  | "deleteFolder";

function actionLabel(action: FlexwegAction): string {
  return i18n.t(`flexweg.actions.${action}`);
}

async function requireConfig(): Promise<FlexwegConfig> {
  const config = await getFlexwegConfig();
  if (!config) {
    const message = i18n.t("flexweg.errors.configMissing");
    toast.error(message);
    throw new Error(message);
  }
  return config;
}

function authHeaders(config: FlexwegConfig): HeadersInit {
  return {
    "X-API-Key": config.apiKey,
    "Content-Type": "application/json",
  };
}

// Tries to extract a human-readable message from a Flexweg error body
// (some endpoints return JSON `{ "error": "..." }`, others plain text).
// Truncates so a giant HTML 500 page doesn't blow up the toast.
function extractDetail(body: string | undefined): string {
  if (!body) return "";
  let text = body.trim();
  try {
    const parsed = JSON.parse(text) as { error?: string; message?: string };
    text = parsed.error ?? parsed.message ?? text;
  } catch {
    // Not JSON — keep the raw body.
  }
  if (text.length > 240) text = text.slice(0, 240) + "…";
  return text;
}

// Maps an HTTP failure to the most descriptive translated message we can
// produce. Used both for the toast UX and as the FlexwegApiError message.
function buildErrorMessage(
  action: FlexwegAction,
  status: number,
  body: string | undefined,
): string {
  const label = actionLabel(action);
  const detail = extractDetail(body);
  switch (status) {
    case 401:
    case 403:
      return i18n.t("flexweg.errors.auth", { action: label });
    case 404:
      return i18n.t("flexweg.errors.notFound", { action: label });
    case 413:
      return i18n.t("flexweg.errors.tooLarge", { action: label });
    case 429:
      return i18n.t("flexweg.errors.rateLimited", { action: label });
    case 500:
    case 502:
    case 503:
    case 504:
      return i18n.t("flexweg.errors.serverError", { action: label, status });
    default:
      return i18n.t("flexweg.errors.generic", {
        action: label,
        status,
        detail: detail ? `: ${detail}` : "",
      });
  }
}

// Wraps a fetch call so that:
//   - HTTP non-2xx → toast + FlexwegApiError thrown.
//   - Thrown fetch (network down, CORS, abort) → toast + rethrow as-is so
//     callers can still detect AbortError specifically.
// Returns the raw Response on success.
async function performRequest(
  action: FlexwegAction,
  fetcher: () => Promise<Response>,
): Promise<Response> {
  let res: Response;
  try {
    res = await fetcher();
  } catch (err) {
    // AbortError is an explicit user-initiated cancel — never toast it.
    if ((err as { name?: string })?.name === "AbortError") throw err;
    toast.error(i18n.t("flexweg.errors.network", { action: actionLabel(action) }));
    throw err;
  }
  if (res.ok) return res;
  const body = await res.text().catch(() => "");
  // 404 on delete is a "desired state already met" sentinel — callers
  // suppress it. Skip the toast there.
  const isSilenced = (action === "delete" || action === "deleteFolder") && res.status === 404;
  const message = buildErrorMessage(action, res.status, body);
  if (!isSilenced) toast.error(message);
  throw new FlexwegApiError(message, res.status, body);
}

export interface UploadFileOptions {
  path: string;
  // Either a UTF-8 string (for HTML/CSS/JS/text/JSON/...) or pre-encoded base64.
  content: string;
  encoding?: "utf-8" | "base64";
  signal?: AbortSignal;
}

export async function uploadFile(opts: UploadFileOptions): Promise<void> {
  const config = await requireConfig();
  const body: Record<string, unknown> = {
    path: opts.path,
    content: opts.content,
  };
  // The API only requires `encoding` when sending base64. Sending `utf-8`
  // explicitly is harmless and clarifies intent.
  if (opts.encoding) body.encoding = opts.encoding;

  await performRequest("upload", () =>
    fetch(`${config.apiBaseUrl}/files/upload`, {
      method: "POST",
      headers: authHeaders(config),
      body: JSON.stringify(body),
      signal: opts.signal,
    }),
  );
}

// Reads bytes from a File and returns a base64 string (without the data: prefix).
// Used for binary uploads (images, PDFs, fonts).
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Unexpected FileReader result type"));
        return;
      }
      const idx = result.indexOf(",");
      resolve(idx >= 0 ? result.slice(idx + 1) : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export async function deleteFile(path: string, signal?: AbortSignal): Promise<void> {
  const config = await requireConfig();
  const url = `${config.apiBaseUrl}/files/delete?${new URLSearchParams({ path })}`;
  try {
    await performRequest("delete", () =>
      fetch(url, {
        method: "DELETE",
        headers: { "X-API-Key": config.apiKey },
        signal,
      }),
    );
  } catch (err) {
    // Treat 404 as success: the file was already gone, the desired state is reached.
    if (err instanceof FlexwegApiError && err.status === 404) return;
    throw err;
  }
}

export async function renameFile(oldPath: string, newPath: string): Promise<void> {
  const config = await requireConfig();
  await performRequest("rename", () =>
    fetch(`${config.apiBaseUrl}/files/rename`, {
      method: "POST",
      headers: authHeaders(config),
      body: JSON.stringify({ old_path: oldPath, new_path: newPath }),
    }),
  );
}

export async function getFile(path: string): Promise<string> {
  const config = await requireConfig();
  const url = `${config.apiBaseUrl}/files/get?${new URLSearchParams({ path })}`;
  const res = await performRequest("get", () =>
    fetch(url, {
      method: "GET",
      headers: { "X-API-Key": config.apiKey },
    }),
  );
  return res.text();
}

export interface ListItem {
  path: string;
  type: "file" | "folder";
  size?: number;
  url?: string;
  depth?: number;
}

export interface ListResponse {
  items: ListItem[];
  page: number;
  per_page: number;
  total?: number;
}

export async function listFiles(page = 1, perPage = 100): Promise<ListResponse> {
  const config = await requireConfig();
  const url = `${config.apiBaseUrl}/files/list?${new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  })}`;
  const res = await performRequest("list", () =>
    fetch(url, {
      method: "GET",
      headers: { "X-API-Key": config.apiKey },
    }),
  );
  return (await res.json()) as ListResponse;
}

export async function createFolder(path: string): Promise<void> {
  const config = await requireConfig();
  await performRequest("createFolder", () =>
    fetch(`${config.apiBaseUrl}/files/create-folder`, {
      method: "POST",
      headers: authHeaders(config),
      body: JSON.stringify({ path }),
    }),
  );
}

export async function renameFolder(oldPath: string, newPath: string): Promise<void> {
  const config = await requireConfig();
  await performRequest("renameFolder", () =>
    fetch(`${config.apiBaseUrl}/files/rename-folder`, {
      method: "POST",
      headers: authHeaders(config),
      body: JSON.stringify({ old_path: oldPath, new_path: newPath }),
    }),
  );
}

export async function deleteFolder(path: string): Promise<void> {
  const config = await requireConfig();
  const url = `${config.apiBaseUrl}/files/delete-folder?${new URLSearchParams({ path })}`;
  try {
    await performRequest("deleteFolder", () =>
      fetch(url, {
        method: "DELETE",
        headers: { "X-API-Key": config.apiKey },
      }),
    );
  } catch (err) {
    if (err instanceof FlexwegApiError && err.status === 404) return;
    throw err;
  }
}

// Convenience: build the public URL for a path stored on Flexweg.
export async function publicUrlFor(path: string): Promise<string> {
  const config = await requireConfig();
  return `${config.siteUrl}/${path.replace(/^\/+/, "")}`;
}
