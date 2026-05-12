import { useEffect, useMemo, useRef, useState } from "react";

// Curated set of Material Symbols Outlined names that fit a
// marketplace / SaaS context (themes, plugins, apps). Free typing is
// still allowed for anything outside this list — the field accepts
// any valid symbol name, the grid is just a faster path for the 90%
// of cases. Names match the canonical Material Symbols identifiers.
const CURATED_ICONS = [
  "dashboard", "analytics", "monitoring", "trending_up", "insights",
  "bolt", "rocket_launch", "auto_awesome", "star", "favorite",
  "shopping_bag", "shopping_cart", "credit_card", "payments", "sell",
  "lock", "security", "shield", "verified_user", "key",
  "settings", "tune", "build", "construction", "extension",
  "palette", "brush", "format_paint", "color_lens", "design_services",
  "code", "terminal", "data_object", "developer_mode", "integration_instructions",
  "cloud", "cloud_upload", "cloud_download", "storage", "database",
  "search", "filter_alt", "sort", "view_module", "view_list",
  "mail", "send", "chat", "forum", "notifications",
  "person", "group", "groups", "manage_accounts", "support_agent",
  "download", "upload", "file_download", "file_upload", "save",
  "language", "translate", "public", "globe", "travel_explore",
  "speed", "memory", "bar_chart", "pie_chart", "show_chart",
  "shopping_basket", "store", "inventory", "package_2", "local_shipping",
  "smartphone", "devices", "tablet_mac", "laptop_mac", "tv",
  "schedule", "today", "event", "calendar_month", "timer",
  "help", "info", "question_mark", "lightbulb", "tips_and_updates",
  "check_circle", "task_alt", "verified", "done", "thumb_up",
  "warning", "error", "block", "report", "priority_high",
];

const FONT_LINK_ID = "mp-icon-picker-font";
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0,0";

function ensureFontLoaded() {
  if (typeof document === "undefined") return;
  if (document.getElementById(FONT_LINK_ID)) return;
  const link = document.createElement("link");
  link.id = FONT_LINK_ID;
  link.rel = "stylesheet";
  link.href = FONT_HREF;
  document.head.appendChild(link);
}

const ICON_STYLE: React.CSSProperties = {
  fontFamily: '"Material Symbols Outlined"',
  fontWeight: "normal",
  fontStyle: "normal",
  fontSize: 24,
  lineHeight: 1,
  letterSpacing: "normal",
  textTransform: "none",
  display: "inline-block",
  whiteSpace: "nowrap",
  wordWrap: "normal",
  direction: "ltr",
  WebkitFontSmoothing: "antialiased",
  fontVariationSettings: '"FILL" 0',
};

export function IconPicker({
  value,
  onChange,
  placeholder = "e.g. dashboard, security, bolt",
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ensureFontLoaded();
  }, []);

  // Close the grid when the user clicks outside.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CURATED_ICONS;
    return CURATED_ICONS.filter((name) => name.includes(q));
  }, [query]);

  return (
    <div ref={rootRef} className="relative">
      <div className="flex items-stretch gap-2">
        <input
          className="input text-xs flex-1"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setOpen(true)}
        />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-center w-10 rounded border border-surface-200 bg-surface-50 dark:border-surface-700 dark:bg-surface-800 shrink-0"
          aria-label="Pick icon"
          title={value || "No icon selected"}
        >
          <span style={ICON_STYLE}>{value || "image"}</span>
        </button>
      </div>
      {open && (
        <div className="absolute z-20 mt-1 w-full rounded border border-surface-200 bg-white shadow-lg dark:border-surface-700 dark:bg-surface-900">
          <div className="border-b border-surface-100 p-2 dark:border-surface-800">
            <input
              className="input text-xs w-full"
              placeholder="Search icons…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <p className="text-center text-xs text-surface-500 py-4">
                No match — keep typing in the field above to use it anyway.
              </p>
            ) : (
              <div className="grid grid-cols-6 gap-1">
                {filtered.map((name) => {
                  const active = name === value;
                  return (
                    <button
                      key={name}
                      type="button"
                      title={name}
                      onClick={() => {
                        onChange(name);
                        setOpen(false);
                        setQuery("");
                      }}
                      className={
                        "flex flex-col items-center justify-center gap-1 rounded p-2 text-[10px] " +
                        (active
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                          : "hover:bg-surface-100 text-surface-700 dark:hover:bg-surface-800 dark:text-surface-300")
                      }
                    >
                      <span style={ICON_STYLE}>{name}</span>
                      <span className="truncate w-full text-center">{name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
