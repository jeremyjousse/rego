import { describe, expect, it, beforeEach } from "vitest";
import {
  clearAuthFromStorage,
  loadAuthFromStorage,
  saveAuthToStorage,
  REBRICKABLE_AUTH_STORAGE_KEY,
} from "./auth.js";

class MemoryStorage implements Storage {
  private data: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.data).length;
  }

  clear(): void {
    this.data = {};
  }

  getItem(key: string): string | null {
    return this.data[key] ?? null;
  }

  key(index: number): string | null {
    return Object.keys(this.data)[index] ?? null;
  }

  removeItem(key: string): void {
    delete this.data[key];
  }

  setItem(key: string, value: string): void {
    this.data[key] = value;
  }
}

describe("auth storage", () => {
  let storage: Storage;

  beforeEach(() => {
    storage = new MemoryStorage();
  });

  it("returns null when storage is empty", () => {
    expect(loadAuthFromStorage(storage)).toBeNull();
  });

  it("saves and loads valid credentials", () => {
    const auth = { apiKey: "my-api-key", userToken: "my-user-token" };
    saveAuthToStorage(storage, auth);
    const loaded = loadAuthFromStorage(storage);
    expect(loaded).toEqual(auth);
  });

  it("returns null when JSON is invalid", () => {
    storage.setItem(REBRICKABLE_AUTH_STORAGE_KEY, "invalid-json{");
    expect(loadAuthFromStorage(storage)).toBeNull();
  });

  it("returns null when credentials are empty strings", () => {
    storage.setItem(
      REBRICKABLE_AUTH_STORAGE_KEY,
      JSON.stringify({ apiKey: "  ", userToken: "" })
    );
    expect(loadAuthFromStorage(storage)).toBeNull();
  });

  it("clears credentials", () => {
    saveAuthToStorage(storage, { apiKey: "key", userToken: "token" });
    clearAuthFromStorage(storage);
    expect(loadAuthFromStorage(storage)).toBeNull();
  });
});
