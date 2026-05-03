// Tiny helper that loads a remote `<script>` once per page-life and
// returns a Promise that resolves the moment the script finishes
// running. Multiple callers waiting on the same URL share the same
// pending promise — no duplicate network requests, no duplicate
// global side effects (which would clobber widgets.js' window.twttr
// for example).
//
// Used by the embeds NodeView so the in-editor preview can call the
// provider's runtime API (twttr.widgets.load, instgrm.Embeds.process,
// …) the same way the published page would.

const pending = new Map<string, Promise<void>>();

export function loadScriptOnce(url: string): Promise<void> {
  const cached = pending.get(url);
  if (cached) return cached;

  // If the script tag is already in the document (e.g. injected by
  // the published-page bundle that the admin happens to import in a
  // weird scenario), assume it's loaded and resolve immediately.
  if (typeof document !== "undefined") {
    const existing = document.querySelector(`script[src="${url}"]`);
    if (existing) {
      const resolved = Promise.resolve();
      pending.set(url, resolved);
      return resolved;
    }
  }

  const promise = new Promise<void>((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("loadScriptOnce called in non-browser environment"));
      return;
    }
    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    // Twitter's widgets.js requires a charset attribute or it 404s
    // on some CDNs. Setting it unconditionally is harmless for other
    // providers.
    script.setAttribute("charset", "utf-8");
    script.onload = () => resolve();
    script.onerror = () => {
      pending.delete(url);
      reject(new Error(`Failed to load script: ${url}`));
    };
    document.head.appendChild(script);
  });

  pending.set(url, promise);
  return promise;
}
