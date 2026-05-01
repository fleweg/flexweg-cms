import { afterEach, describe, expect, it, vi } from "vitest";
import {
  addAction,
  addFilter,
  applyFilters,
  applyFiltersSync,
  doAction,
  listHooks,
  removeFilter,
  resetRegistry,
} from "./pluginRegistry";

afterEach(() => {
  resetRegistry();
});

describe("filters", () => {
  it("composes filters in priority order, then registration order", async () => {
    addFilter<string>("greet", (s) => `${s}!`, 10);
    addFilter<string>("greet", (s) => s.toUpperCase(), 5);
    addFilter<string>("greet", (s) => `(${s})`, 10);
    expect(await applyFilters("greet", "hi")).toBe("(HI!)");
  });

  it("returns the input when no filter is registered", async () => {
    expect(await applyFilters("noop", "x")).toBe("x");
  });

  it("supports removing a filter", async () => {
    const fn = (s: string) => `${s}!`;
    addFilter<string>("greet", fn);
    expect(await applyFilters("greet", "hi")).toBe("hi!");
    removeFilter("greet", fn);
    expect(await applyFilters("greet", "hi")).toBe("hi");
  });

  it("applyFiltersSync throws on async filters", () => {
    addFilter<string>("greet", async (s) => `${s}!`);
    expect(() => applyFiltersSync("greet", "hi")).toThrow();
  });
});

describe("actions", () => {
  it("runs all actions in order", async () => {
    const log: string[] = [];
    addAction(
      "publish.complete",
      () => {
        log.push("a");
      },
      10,
    );
    addAction(
      "publish.complete",
      () => {
        log.push("b");
      },
      5,
    );
    await doAction("publish.complete");
    expect(log).toEqual(["b", "a"]);
  });

  it("awaits async actions sequentially", async () => {
    const log: string[] = [];
    addAction("publish.complete", async () => {
      await Promise.resolve();
      log.push("first");
    });
    addAction("publish.complete", () => {
      log.push("second");
    });
    await doAction("publish.complete");
    expect(log).toEqual(["first", "second"]);
  });
});

describe("listHooks", () => {
  it("returns registered hook names", () => {
    addFilter("a", (v) => v);
    addAction("b", () => {});
    expect(listHooks()).toEqual({ filters: ["a"], actions: ["b"] });
  });
});

describe("resetRegistry", () => {
  it("clears all hooks", async () => {
    addFilter<string>("greet", (s) => `${s}!`);
    resetRegistry();
    expect(await applyFilters("greet", "hi")).toBe("hi");
    expect(listHooks()).toEqual({ filters: [], actions: [] });
  });
});

describe("error reporting", () => {
  it("propagates errors thrown by filters", async () => {
    addFilter("boom", () => {
      throw new Error("nope");
    });
    await expect(applyFilters("boom", "x")).rejects.toThrow("nope");
  });

  it("does not swallow errors in actions", async () => {
    const handler = vi.fn(() => {
      throw new Error("oops");
    });
    addAction("crash", handler);
    await expect(doAction("crash")).rejects.toThrow("oops");
    expect(handler).toHaveBeenCalled();
  });
});
