import { getFlexwegConfig, type FlexwegConfig } from "./flexwegConfig";

// Thin client over the Flexweg Files API. Every call resolves the config
// lazily so callers don't have to thread it through. Methods that mutate the
// site (upload/delete/rename/folders) all hit `/api/v1/files/*` and require
// an X-API-Key header.

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

async function requireConfig(): Promise<FlexwegConfig> {
  const config = await getFlexwegConfig();
  if (!config) {
    throw new Error(
      "Flexweg API key is not configured. Set it in admin Settings before publishing.",
    );
  }
  return config;
}

function authHeaders(config: FlexwegConfig): HeadersInit {
  return {
    "X-API-Key": config.apiKey,
    "Content-Type": "application/json",
  };
}

async function ensureOk(res: Response, action: string): Promise<void> {
  if (res.ok) return;
  const detail = await res.text().catch(() => "");
  throw new FlexwegApiError(
    `Flexweg ${action} failed (${res.status}): ${detail || res.statusText}`,
    res.status,
    detail,
  );
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

  const res = await fetch(`${config.apiBaseUrl}/files/upload`, {
    method: "POST",
    headers: authHeaders(config),
    body: JSON.stringify(body),
    signal: opts.signal,
  });
  await ensureOk(res, "upload");
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
  const res = await fetch(url, {
    method: "DELETE",
    headers: { "X-API-Key": config.apiKey },
    signal,
  });
  // Treat 404 as success: the file was already gone, the desired state is reached.
  if (res.status === 404) return;
  await ensureOk(res, "delete");
}

export async function renameFile(oldPath: string, newPath: string): Promise<void> {
  const config = await requireConfig();
  const res = await fetch(`${config.apiBaseUrl}/files/rename`, {
    method: "POST",
    headers: authHeaders(config),
    body: JSON.stringify({ old_path: oldPath, new_path: newPath }),
  });
  await ensureOk(res, "rename");
}

export async function getFile(path: string): Promise<string> {
  const config = await requireConfig();
  const url = `${config.apiBaseUrl}/files/get?${new URLSearchParams({ path })}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { "X-API-Key": config.apiKey },
  });
  await ensureOk(res, "get");
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
  const res = await fetch(url, {
    method: "GET",
    headers: { "X-API-Key": config.apiKey },
  });
  await ensureOk(res, "list");
  return (await res.json()) as ListResponse;
}

export async function createFolder(path: string): Promise<void> {
  const config = await requireConfig();
  const res = await fetch(`${config.apiBaseUrl}/files/create-folder`, {
    method: "POST",
    headers: authHeaders(config),
    body: JSON.stringify({ path }),
  });
  await ensureOk(res, "create-folder");
}

export async function renameFolder(oldPath: string, newPath: string): Promise<void> {
  const config = await requireConfig();
  const res = await fetch(`${config.apiBaseUrl}/files/rename-folder`, {
    method: "POST",
    headers: authHeaders(config),
    body: JSON.stringify({ old_path: oldPath, new_path: newPath }),
  });
  await ensureOk(res, "rename-folder");
}

export async function deleteFolder(path: string): Promise<void> {
  const config = await requireConfig();
  const url = `${config.apiBaseUrl}/files/delete-folder?${new URLSearchParams({ path })}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { "X-API-Key": config.apiKey },
  });
  if (res.status === 404) return;
  await ensureOk(res, "delete-folder");
}

// Convenience: build the public URL for a path stored on Flexweg.
export async function publicUrlFor(path: string): Promise<string> {
  const config = await requireConfig();
  return `${config.siteUrl}/${path.replace(/^\/+/, "")}`;
}
