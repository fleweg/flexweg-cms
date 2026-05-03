// WordPress-style filter/action registry. Plugins register their callbacks
// at boot time (see plugins/index.ts); core code calls applyFilters /
// doAction at well-known extension points to delegate to them.
//
// Filters: synchronous mutators. They take a value and return a (possibly)
// modified value. Multiple filters compose by feeding each output to the
// next. Use these to alter a piece of data the core is about to return or
// emit (HTML, props, frontmatter, ...).
//
// Actions: side effects. Multiple actions all run; their return values are
// ignored. Use these for plugin-driven side effects (regenerate sitemap,
// notify a service, log something).
//
// Both flavors support priorities so plugins can order themselves around
// each other when needed. Lower priority runs first, ties broken by
// registration order.

type FilterFn<T = unknown> = (value: T, ...args: unknown[]) => T | Promise<T>;
type ActionFn = (...args: unknown[]) => void | Promise<void>;

interface FilterEntry {
  fn: FilterFn;
  priority: number;
  order: number;
}
interface ActionEntry {
  fn: ActionFn;
  priority: number;
  order: number;
}

const filters = new Map<string, FilterEntry[]>();
const actions = new Map<string, ActionEntry[]>();
let registrationCounter = 0;

function sortByPriority<T extends { priority: number; order: number }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => a.priority - b.priority || a.order - b.order);
}

export function addFilter<T = unknown>(hook: string, fn: FilterFn<T>, priority = 10): void {
  const list = filters.get(hook) ?? [];
  list.push({ fn: fn as FilterFn, priority, order: registrationCounter++ });
  filters.set(hook, list);
}

export function removeFilter<T = unknown>(hook: string, fn: FilterFn<T>): void {
  const list = filters.get(hook);
  if (!list) return;
  filters.set(
    hook,
    list.filter((entry) => entry.fn !== (fn as FilterFn)),
  );
}

export async function applyFilters<T>(hook: string, value: T, ...args: unknown[]): Promise<T> {
  const list = filters.get(hook);
  if (!list || list.length === 0) return value;
  let current = value;
  for (const entry of sortByPriority(list)) {
    current = (await entry.fn(current, ...args)) as T;
  }
  return current;
}

// Synchronous variant for hot paths that can't await (e.g. inside a render
// pass). Plugins must register sync functions for these hooks; async ones
// will throw.
export function applyFiltersSync<T>(hook: string, value: T, ...args: unknown[]): T {
  const list = filters.get(hook);
  if (!list || list.length === 0) return value;
  let current = value;
  for (const entry of sortByPriority(list)) {
    const next = entry.fn(current, ...args);
    if (next instanceof Promise) {
      throw new Error(`Filter "${hook}" must be synchronous; got a Promise.`);
    }
    current = next as T;
  }
  return current;
}

export function addAction(hook: string, fn: ActionFn, priority = 10): void {
  const list = actions.get(hook) ?? [];
  list.push({ fn, priority, order: registrationCounter++ });
  actions.set(hook, list);
}

export function removeAction(hook: string, fn: ActionFn): void {
  const list = actions.get(hook);
  if (!list) return;
  actions.set(
    hook,
    list.filter((entry) => entry.fn !== fn),
  );
}

export async function doAction(hook: string, ...args: unknown[]): Promise<void> {
  const list = actions.get(hook);
  if (!list || list.length === 0) return;
  for (const entry of sortByPriority(list)) {
    await entry.fn(...args);
  }
}

// Wipes every registration. Used by the plugin loader when the user toggles
// a plugin on/off so the registry is rebuilt from scratch from the current
// enabled set.
export function resetRegistry(): void {
  filters.clear();
  actions.clear();
  registrationCounter = 0;
}

// Inspection helper for tests / plugin debugging UI.
export function listHooks(): { filters: string[]; actions: string[] } {
  return {
    filters: [...filters.keys()],
    actions: [...actions.keys()],
  };
}

// Public API surface passed to each plugin's `register(api)` function. We
// give each plugin a stable, narrow interface rather than letting it import
// the registry module directly so we can evolve internals freely.
//
// `registerBlock` lets plugins contribute editor blocks (paragraph-style
// rich-content nodes) that show up in the post editor's inserter and the
// inspector's Block tab. See core/blockRegistry.ts for the manifest shape.
import { registerBlock as registerBlockImpl } from "./blockRegistry";

export interface PluginApi {
  addFilter: typeof addFilter;
  addAction: typeof addAction;
  registerBlock: typeof registerBlockImpl;
}

export const pluginApi: PluginApi = {
  addFilter,
  addAction,
  registerBlock: registerBlockImpl,
};
