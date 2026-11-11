import { describe, expect, it } from "vitest";
import { getSetParts, getUserSets } from "./rebrickable.js";

describe("rebrickable client", () => {
  it("fetches and maps user sets successfully", async () => {
    const mockFetch: typeof fetch = async () => {
      return {
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => ({
          results: [
            {
              set: {
                name: "Galaxy Explorer",
                set_num: "10497-1",
                set_img_url: "https://cdn.rebrickable.com/media/sets/10497-1.jpg",
              },
            },
          ],
        }),
      } as Response;
    };

    const result = await getUserSets("dummy-key", "dummy-token", mockFetch);
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value).toHaveLength(1);
      expect(result.value[0].name).toBe("Galaxy Explorer");
      expect(result.value[0].num).toBe("10497-1");
      expect(result.value[0].imgUrl).toBe(
        "https://cdn.rebrickable.com/media/sets/10497-1.jpg"
      );
    }
  });

  it("handles HTTP error response when fetching user sets", async () => {
    const mockFetch: typeof fetch = async () => {
      return {
        ok: false,
        status: 401,
        statusText: "Unauthorized",
      } as Response;
    };

    const result = await getUserSets("wrong-key", "token", mockFetch);
    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.error).toContain("401");
    }
  });

  it("fetches and maps set parts successfully", async () => {
    const mockFetch: typeof fetch = async () => {
      return {
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => ({
          results: [
            {
              id: 100,
              quantity: 4,
              color: { name: "Bright Blue" },
              part: {
                name: "Brick 2 x 4",
                part_img_url: "https://cdn.rebrickable.com/parts/3001.jpg",
              },
            },
          ],
        }),
      } as Response;
    };

    const result = await getSetParts("dummy-key", "10497-1", mockFetch);
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value).toHaveLength(1);
      expect(result.value[0].id).toBe("100");
      expect(result.value[0].name).toBe("Brick 2 x 4");
      expect(result.value[0].color).toBe("Bright Blue");
      expect(result.value[0].quantity).toBe(4);
    }
  });
});
