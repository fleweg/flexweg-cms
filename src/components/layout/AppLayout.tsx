import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppLayout() {
  // Mobile drawer open state. Lifted here because both the Topbar
  // (burger button) and the Sidebar (the drawer itself) need to read
  // / write it. Always false on desktop — the sidebar is always
  // visible there and the burger is hidden via Tailwind's md: prefix.
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  // Auto-close on every route change so tapping a nav link inside
  // the drawer dismisses it rather than leaving the user stuck on a
  // covered page. Driven by pathname only — re-render of the same
  // page (e.g. settings save) shouldn't toggle the drawer.
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-full bg-surface-50 dark:bg-surface-950">
      <Sidebar mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1 min-w-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
