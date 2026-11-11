import type { LegoPart } from "./LegoPart.js";
import type { LegoSet } from "./LegoSet.js";

export type PartsFoundMap = Record<string, number>;

export function getSetStorageKey(setNum: string): string {
  return `rebrickableSet-${setNum}`;
}

export function loadPartsFoundFromStorage(
  storage: Storage,
  setNum: string
): PartsFoundMap {
  try {
    const raw = storage.getItem(getSetStorageKey(setNum));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return {};
    }
    const validated: PartsFoundMap = {};
    for (const [key, val] of Object.entries(parsed)) {
      if (typeof val === "number" && !Number.isNaN(val) && val >= 0) {
        validated[key] = val;
      }
    }
    return validated;
  } catch {
    return {};
  }
}

export function savePartsFoundToStorage(
  storage: Storage,
  setNum: string,
  state: PartsFoundMap
): void {
  storage.setItem(getSetStorageKey(setNum), JSON.stringify(state));
}

export function incrementPartFound(currentFound: number, maxQuantity: number): number {
  if (currentFound >= maxQuantity) return maxQuantity;
  return currentFound + 1;
}

export function decrementPartFound(currentFound: number): number {
  if (currentFound <= 0) return 0;
  return currentFound - 1;
}

export interface InventoryProgress {
  readonly totalRequired: number;
  readonly totalFound: number;
  readonly percent: number;
  readonly completedPartsCount: number;
  readonly totalPartsCount: number;
  readonly isComplete: boolean;
}

export function calculateProgress(
  parts: readonly { id: string; quantity: number }[],
  foundMap: PartsFoundMap
): InventoryProgress {
  let totalRequired = 0;
  let totalFound = 0;
  let completedPartsCount = 0;

  for (const part of parts) {
    totalRequired += part.quantity;
    const found = Math.min(foundMap[part.id] ?? 0, part.quantity);
    totalFound += found;
    if (found >= part.quantity && part.quantity > 0) {
      completedPartsCount += 1;
    }
  }

  const percent = totalRequired > 0 ? Math.round((totalFound / totalRequired) * 100) : 0;
  return {
    totalRequired,
    totalFound,
    percent,
    completedPartsCount,
    totalPartsCount: parts.length,
    isComplete: totalRequired > 0 && totalFound >= totalRequired,
  };
}

export interface PartFilterOptions {
  hideCompleted?: boolean;
  color?: string;
  category?: string;
}

export function filterLegoParts(
  parts: readonly LegoPart[],
  partsFound: PartsFoundMap,
  options: PartFilterOptions
): LegoPart[] {
  const cleanColor = options.color?.trim() ?? "";
  const cleanCategory = options.category?.trim() ?? "";

  return parts.filter((part) => {
    if (options.hideCompleted && (partsFound[part.id] ?? 0) >= part.quantity) {
      return false;
    }
    if (cleanColor && part.color !== cleanColor) {
      return false;
    }
    if (cleanCategory && part.category !== cleanCategory) {
      return false;
    }
    return true;
  });
}

export function filterLegoSets(sets: readonly LegoSet[], query: string): LegoSet[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...sets];
  return sets.filter(
    (s) => s.name.toLowerCase().includes(q) || s.num.toLowerCase().includes(q)
  );
}
