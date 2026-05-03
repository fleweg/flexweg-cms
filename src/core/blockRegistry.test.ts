import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Type } from "lucide-react";
import {
  findActiveBlock,
  getBlock,
  getRegistryVersion,
  listBlocks,
  registerBlock,
  registerCoreBlock,
  resetBlocks,
  type BlockManifest,
} from "./blockRegistry";

// The block registry is a module-level singleton; tests must wipe
// every entry (core + plugin) between runs to avoid cross-test
// pollution. resetBlocks() spares core blocks intentionally — we work
// around that by tracking what each test inserted and clearing the
// internal map by re-importing if needed. Simpler approach: register
// distinct ids per test, and use resetBlocks() to clear plugin blocks.

const baseManifest: Omit<BlockManifest, "id"> = {
  titleKey: "test.block",
  icon: Type,
  category: "text",
  insert: () => {},
};

beforeEach(() => {
  // Plugin blocks only — core blocks added in earlier tests survive,
  // but each test uses unique ids so no overlap.
  resetBlocks();
});

afterEach(() => {
  resetBlocks();
});

describe("registerBlock / listBlocks", () => {
  it("returns registered plugin blocks via listBlocks()", () => {
    registerBlock({ ...baseManifest, id: "test/alpha" });
    registerBlock({ ...baseManifest, id: "test/beta" });
    const ids = listBlocks().map((b) => b.id);
    expect(ids).toContain("test/alpha");
    expect(ids).toContain("test/beta");
  });

  it("getBlock returns a registered manifest by id", () => {
    registerBlock({ ...baseManifest, id: "test/lookup" });
    expect(getBlock("test/lookup")?.id).toBe("test/lookup");
    expect(getBlock("test/missing")).toBeUndefined();
  });

  it("resetBlocks clears plugin blocks", () => {
    registerBlock({ ...baseManifest, id: "test/temp" });
    expect(getBlock("test/temp")).toBeDefined();
    resetBlocks();
    expect(getBlock("test/temp")).toBeUndefined();
  });
});

describe("registerCoreBlock", () => {
  it("survives resetBlocks()", () => {
    registerCoreBlock({ ...baseManifest, id: "test/core-block" });
    expect(getBlock("test/core-block")).toBeDefined();
    resetBlocks();
    expect(getBlock("test/core-block")).toBeDefined();
  });

  it("a plugin block with the same id as a core block is rejected", () => {
    registerCoreBlock({ ...baseManifest, id: "test/conflict" });
    registerBlock({ ...baseManifest, id: "test/conflict", titleKey: "overridden" });
    expect(getBlock("test/conflict")?.titleKey).toBe("test.block");
  });
});

describe("getRegistryVersion", () => {
  it("increments on every mutation", () => {
    const before = getRegistryVersion();
    registerBlock({ ...baseManifest, id: "test/v1" });
    expect(getRegistryVersion()).toBeGreaterThan(before);
    const mid = getRegistryVersion();
    resetBlocks();
    expect(getRegistryVersion()).toBeGreaterThan(mid);
  });
});

describe("findActiveBlock", () => {
  it("returns the first manifest whose isActive predicate matches", () => {
    registerBlock({
      ...baseManifest,
      id: "test/a",
      isActive: () => false,
    });
    registerBlock({
      ...baseManifest,
      id: "test/b",
      isActive: () => true,
    });
    // Editor argument is ignored by the test predicates; cast to any.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(findActiveBlock({} as any)?.id).toBe("test/b");
  });

  it("returns undefined when no predicate matches", () => {
    registerBlock({ ...baseManifest, id: "test/none", isActive: () => false });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(findActiveBlock({} as any)).toBeUndefined();
  });
});
