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

interface RebrickableApiPartItem {
  id: number | string;
  quantity: number;
  color?: {
    name?: string;
  };
  part?: {
    name?: string;
    part_img_url?: string | null;
  };
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

    const parts: LegoPart[] = data.results.map((item) => ({
      id: String(item.id),
      color: item.color?.name ?? "Unknown",
      name: item.part?.name ?? "Unknown Part",
      imgUrl: item.part?.part_img_url ?? "",
      quantity: item.quantity,
    }));

    return Right.create(parts);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Network error while fetching set parts";
    return Left.create(message);
  }
}
