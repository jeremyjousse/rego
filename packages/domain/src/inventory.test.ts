import { describe, expect, it } from "vitest";
import {
  calculateProgress,
  decrementPartFound,
  incrementPartFound,
  loadPartsFoundFromStorage,
  savePartsFoundToStorage,
} from "./inventory.js";

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

describe("inventory domain logic", () => {
  it("increments quantity found without exceeding maximum", () => {
    expect(incrementPartFound(0, 5)).toBe(1);
    expect(incrementPartFound(4, 5)).toBe(5);
    expect(incrementPartFound(5, 5)).toBe(5);
  });

  it("decrements quantity found without going below zero", () => {
    expect(decrementPartFound(5)).toBe(4);
    expect(decrementPartFound(1)).toBe(0);
    expect(decrementPartFound(0)).toBe(0);
  });

  it("calculates progress accurately", () => {
    const parts = [
      { id: "p1", quantity: 4 },
      { id: "p2", quantity: 6 },
    ];
    const foundMap = { p1: 4, p2: 1 };
    const progress = calculateProgress(parts, foundMap);

    expect(progress.totalRequired).toBe(10);
    expect(progress.totalFound).toBe(5);
    expect(progress.percent).toBe(50);
    expect(progress.completedPartsCount).toBe(1);
    expect(progress.totalPartsCount).toBe(2);
    expect(progress.isComplete).toBe(false);
  });

  it("detects completion when all parts are found", () => {
    const parts = [
      { id: "p1", quantity: 2 },
      { id: "p2", quantity: 3 },
    ];
    const foundMap = { p1: 2, p2: 3 };
    const progress = calculateProgress(parts, foundMap);

    expect(progress.percent).toBe(100);
    expect(progress.isComplete).toBe(true);
    expect(progress.completedPartsCount).toBe(2);
  });

  it("saves and loads parts map from storage", () => {
    const storage = new MemoryStorage();
    const map = { "3001-1": 3, "3002-2": 1 };

    savePartsFoundToStorage(storage, "75192-1", map);
    const loaded = loadPartsFoundFromStorage(storage, "75192-1");
    expect(loaded).toEqual(map);
  });
});
