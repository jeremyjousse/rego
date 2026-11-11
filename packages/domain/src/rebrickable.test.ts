import { describe, expect, it } from "vitest";
import { extractPartCategory, getSet, getSetParts, getUserSets } from "./rebrickable.js";

describe("rebrickable client", () => {
  it("extracts part category from name properly", () => {
    expect(extractPartCategory("Brick 2 x 4")).toBe("Brick");
    expect(extractPartCategory("Plate, Modified 1 x 2")).toBe("Plate");
    expect(extractPartCategory("tile 1 x 1")).toBe("Tile");
    expect(extractPartCategory("")).toBe("Other");
  });

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

  it("fetches and maps set parts successfully with category mapping", async () => {
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
                part_cat: { name: "Bricks" },
              },
            },
            {
              id: 101,
              quantity: 2,
              color: { name: "Black" },
              part: {
                name: "Plate 1 x 2",
                part_img_url: null,
              },
            },
          ],
        }),
      } as Response;
    };

    const result = await getSetParts("dummy-key", "10497-1", mockFetch);
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value).toHaveLength(2);
      expect(result.value[0].id).toBe("100");
      expect(result.value[0].name).toBe("Brick 2 x 4");
      expect(result.value[0].color).toBe("Bright Blue");
      expect(result.value[0].quantity).toBe(4);
      expect(result.value[0].category).toBe("Bricks");

      expect(result.value[1].id).toBe("101");
      expect(result.value[1].category).toBe("Plate");
    }
  });

  it("fetches a single set successfully", async () => {
    const mockFetch: typeof fetch = async () => {
      return {
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => ({
          set_num: "10497-1",
          name: "Galaxy Explorer",
          set_img_url: "https://cdn.rebrickable.com/media/sets/10497-1.jpg",
        }),
      } as Response;
    };

    const result = await getSet("dummy-key", "10497-1", mockFetch);
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.num).toBe("10497-1");
      expect(result.value.name).toBe("Galaxy Explorer");
      expect(result.value.imgUrl).toBe(
        "https://cdn.rebrickable.com/media/sets/10497-1.jpg"
      );
    }
  });

  it("handles error when fetching a single set", async () => {
    const mockFetch: typeof fetch = async () => {
      return {
        ok: false,
        status: 404,
        statusText: "Not Found",
      } as Response;
    };

    const result = await getSet("dummy-key", "99999-1", mockFetch);
    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.error).toContain("404");
    }
  });
});
