import { describe, it, expect, beforeEach } from "vitest";
import { storage } from "../storage.js";
import { mockLocalStorage } from "../../test-utils/setup.js";

describe("storage utils", () => {
  beforeEach(() => {
    global.localStorage = mockLocalStorage();
  });

  it("sets and gets string value", () => {
    storage.set("key", "value");
    expect(storage.get("key")).toBe("value");
  });

  it("sets and gets object value", () => {
    const obj = { name: "test", count: 42 };
    storage.set("obj", obj);
    expect(storage.get("obj")).toEqual(obj);
  });

  it("returns null for non-existent key", () => {
    expect(storage.get("nonexistent")).toBeNull();
  });

  it("removes item", () => {
    storage.set("key", "value");
    storage.remove("key");
    expect(storage.get("key")).toBeNull();
  });

  it("clears all items", () => {
    storage.set("key1", "value1");
    storage.set("key2", "value2");
    storage.clear();
    expect(storage.get("key1")).toBeNull();
    expect(storage.get("key2")).toBeNull();
  });
});
