import { jsxs as l, jsx as n } from "react/jsx-runtime";
import { useState as i, useEffect as o } from "react";
function s() {
  const [e, t] = i(0);
  return o(() => {
    const a = window.setInterval(() => t((r) => r + 1), 1e3);
    return () => window.clearInterval(a);
  }, []), /* @__PURE__ */ l("div", { className: "card p-4", children: [
    /* @__PURE__ */ n("p", { className: "text-sm font-semibold", children: "Hello from external plugin" }),
    /* @__PURE__ */ l("p", { className: "text-xs text-surface-500 mt-1 dark:text-surface-400", children: [
      "This card is contributed by an externally-loaded plugin. Tick:",
      " ",
      e
    ] })
  ] });
}
const u = {
  id: "hello-plugin",
  name: "Hello Plugin",
  version: "1.0.0",
  description: "Sample external plugin — injects a meta tag on every published page and shows a dashboard card.",
  author: "Flexweg",
  register(e) {
    e.addFilter("page.head.extra", (t) => t + `<meta name="x-hello-plugin" content="external" />
`), e.addAction("publish.complete", (t) => {
      console.log("[hello-plugin] published:", t.id);
    }), e.registerDashboardCard({
      id: "hello-plugin/card",
      priority: 50,
      component: s
    });
  }
};
export {
  u as default
};
