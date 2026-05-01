import { doc, getDoc, setDoc } from "firebase/firestore";
import { collections, configDocs, getDb } from "./firebase";

// Default Flexweg API base. Override via the Settings UI if your account
// uses a different host. The trailing slash is normalized away on read.
export const DEFAULT_FLEXWEG_API_BASE_URL = "https://www.flexweg.com/api/v1";

export interface FlexwegConfig {
  // Permanent API key generated in Flexweg account → API. Stored in Firestore
  // under config/flexweg, readable by any active admin/editor. Do not use
  // this pattern on a public-facing app — a team member can fish the key out
  // of devtools at runtime.
  apiKey: string;
  // Public base URL where uploaded files are served, e.g.
  // "https://your-site.flexweg.com" (no trailing slash).
  siteUrl: string;
  // API base URL, e.g. "https://www.flexweg.com/api/v1" (no trailing slash).
  apiBaseUrl: string;
}

const flexwegDocRef = () => doc(getDb(), collections.config, configDocs.flexweg);

function stripTrailingSlash(s: string): string {
  return s.replace(/\/+$/, "");
}

export async function getFlexwegConfig(): Promise<FlexwegConfig | null> {
  const snap = await getDoc(flexwegDocRef());
  if (!snap.exists()) return null;
  const data = snap.data() as Partial<FlexwegConfig> | undefined;
  if (!data?.apiKey || !data?.siteUrl) return null;
  return {
    apiKey: data.apiKey,
    siteUrl: stripTrailingSlash(data.siteUrl),
    apiBaseUrl: stripTrailingSlash(data.apiBaseUrl ?? DEFAULT_FLEXWEG_API_BASE_URL),
  };
}

export async function setFlexwegConfig(next: FlexwegConfig): Promise<void> {
  await setDoc(flexwegDocRef(), {
    apiKey: next.apiKey,
    siteUrl: stripTrailingSlash(next.siteUrl),
    apiBaseUrl: stripTrailingSlash(next.apiBaseUrl || DEFAULT_FLEXWEG_API_BASE_URL),
  });
}
