import { describe, expect, it } from "vitest";
import {
  calculateProgress,
  decrementPartFound,
  filterLegoParts,
  filterLegoSets,
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

  describe("filtering", () => {
    const parts = [
      {
        id: "1",
        name: "Brick 2x4",
        color: "Bright Blue",
        imgUrl: "",
        quantity: 4,
        category: "Brick",
      },
      {
        id: "2",
        name: "Brick 1x1",
        color: "Red",
        imgUrl: "",
        quantity: 2,
        category: "Brick",
      },
      {
        id: "3",
        name: "Plate 1x2",
        color: "Bright Blue",
        imgUrl: "",
        quantity: 6,
        category: "Plate",
      },
      {
        id: "4",
        name: "Tile 2x2",
        color: "Black",
        imgUrl: "",
        quantity: 1,
        category: "Tile",
      },
    ];

    it("filters parts by color, category, and completion status", () => {
      const partsFound = { "1": 4, "2": 1, "3": 2, "4": 1 };

      // Hide completed
      const remainingOnly = filterLegoParts(parts, partsFound, { hideCompleted: true });
      expect(remainingOnly.map((p) => p.id)).toEqual(["2", "3"]);

      // By color
      const blueParts = filterLegoParts(parts, partsFound, { color: "Bright Blue" });
      expect(blueParts.map((p) => p.id)).toEqual(["1", "3"]);

      // By category
      const brickParts = filterLegoParts(parts, partsFound, { category: "Brick" });
      expect(brickParts.map((p) => p.id)).toEqual(["1", "2"]);

      // Combined color and remaining
      const blueRemaining = filterLegoParts(parts, partsFound, {
        hideCompleted: true,
        color: "Bright Blue",
      });
      expect(blueRemaining.map((p) => p.id)).toEqual(["3"]);

      // Combined category and color
      const redBricks = filterLegoParts(parts, partsFound, {
        color: "Red",
        category: "Brick",
      });
      expect(redBricks.map((p) => p.id)).toEqual(["2"]);
    });

    it("filters sets by name or set number query", () => {
      const sets = [
        { num: "10497-1", name: "Galaxy Explorer", imgUrl: "" },
        { num: "75192-1", name: "Millennium Falcon", imgUrl: "" },
        { num: "42115-1", name: "Lamborghini Sián FKP 37", imgUrl: "" },
      ];

      expect(filterLegoSets(sets, "").length).toBe(3);
      expect(filterLegoSets(sets, "falcon")).toEqual([sets[1]]);
      expect(filterLegoSets(sets, "10497")).toEqual([sets[0]]);
      expect(filterLegoSets(sets, "non-existent")).toEqual([]);
    });
  });
});
