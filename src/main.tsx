import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./i18n";
// Side-effect imports — order matters. flexwegRuntime must run BEFORE
// any external bundle could be evaluated, so that window.__FLEXWEG_RUNTIME__
// is populated when /admin/runtime/*.js stubs read from it. The other
// two register editor blocks; they're independent of each other but
// both must run before the editor mounts.
import "./core/flexwegRuntime";
import "./core/coreBlocks";
import "./index.css";

const container = document.getElementById("root");
if (!container) throw new Error("Root container #root is missing from index.html");

createRoot(container).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
