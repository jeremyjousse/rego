import { Left, Right, type Either } from "./Either.js";
import type { LegoPart } from "./LegoPart.js";
import type { LegoSet } from "./LegoSet.js";

export type RebrickableError = string;

interface RebrickableApiUserSetItem {
  set: {
    name: string;
    set_img_url: string | null;
    set_num: string;
  };
}

interface RebrickableApiUserSetsResponse {
  results?: RebrickableApiUserSetItem[];
  detail?: string;
}

interface RebrickableApiSetItem {
  set_num: string;
  name: string;
  set_img_url: string | null;
  detail?: string;
}

interface RebrickableApiPartItem {
  id: number | string;
  quantity: number;
  color?: {
    name?: string;
  };
  part?: {
    name?: string;
    part_img_url?: string | null;
    part_cat_id?: number;
    part_cat?: {
      name?: string;
    };
    category?:
      | {
          name?: string;
        }
      | string;
  };
}

export function extractPartCategory(partName?: string): string {
  if (!partName || !partName.trim()) return "Other";
  const clean = partName.trim();
  const firstWord = clean.split(/[\s,]+/)[0];
  if (!firstWord) return "Other";
  return firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
}

interface RebrickableApiPartsResponse {
  results?: RebrickableApiPartItem[];
  detail?: string;
}

export async function getUserSets(
  apiKey: string,
  userToken: string,
  fetchFn: typeof fetch = fetch
): Promise<Either<RebrickableError, LegoSet[]>> {
  try {
    const response = await fetchFn(
      `https://rebrickable.com/api/v3/users/${encodeURIComponent(userToken)}/sets/`,
      {
        method: "GET",
        headers: {
          Authorization: `key ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      return Left.create(
        `Rebrickable API error (${response.status}): ${response.statusText}`
      );
    }

    const data = (await response.json()) as RebrickableApiUserSetsResponse;
    if (!data.results || !Array.isArray(data.results)) {
      return Left.create(data.detail ?? "Invalid response received from Rebrickable");
    }

    const sets: LegoSet[] = data.results.map((item) => ({
      name: item.set.name,
      imgUrl: item.set.set_img_url ?? "",
      num: item.set.set_num,
    }));

    return Right.create(sets);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Network error while fetching sets";
    return Left.create(message);
  }
}

export async function getSetParts(
  apiKey: string,
  setNum: string,
  fetchFn: typeof fetch = fetch
): Promise<Either<RebrickableError, LegoPart[]>> {
  try {
    const response = await fetchFn(
      `https://rebrickable.com/api/v3/lego/sets/${encodeURIComponent(setNum)}/parts/?inc_minifig_parts=1&page_size=1000`,
      {
        method: "GET",
        headers: {
          Authorization: `key ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      return Left.create(
        `Rebrickable API error (${response.status}): ${response.statusText}`
      );
    }

    const data = (await response.json()) as RebrickableApiPartsResponse;
    if (!data.results || !Array.isArray(data.results)) {
      return Left.create(data.detail ?? "Invalid response received from Rebrickable");
    }

    const parts: LegoPart[] = data.results.map((item) => {
      const category =
        (typeof item.part?.category === "string"
          ? item.part.category
          : item.part?.category?.name) ??
        item.part?.part_cat?.name ??
        extractPartCategory(item.part?.name);

      return {
        id: String(item.id),
        color: item.color?.name ?? "Unknown",
        name: item.part?.name ?? "Unknown Part",
        imgUrl: item.part?.part_img_url ?? "",
        quantity: item.quantity,
        category,
      };
    });

    return Right.create(parts);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Network error while fetching set parts";
    return Left.create(message);
  }
}

export async function getSet(
  apiKey: string,
  setNum: string,
  fetchFn: typeof fetch = fetch
): Promise<Either<RebrickableError, LegoSet>> {
  try {
    const response = await fetchFn(
      `https://rebrickable.com/api/v3/lego/sets/${encodeURIComponent(setNum)}/`,
      {
        method: "GET",
        headers: {
          Authorization: `key ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      return Left.create(
        `Rebrickable API error (${response.status}): ${response.statusText}`
      );
    }

    const data = (await response.json()) as RebrickableApiSetItem;
    if (!data.set_num || !data.name) {
      return Left.create(data.detail ?? "Invalid set response received from Rebrickable");
    }

    const set: LegoSet = {
      name: data.name,
      imgUrl: data.set_img_url ?? "",
      num: data.set_num,
    };

    return Right.create(set);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Network error while fetching set details";
    return Left.create(message);
  }
}
