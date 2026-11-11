import { describe, expect, it } from "vitest";
import {
  filterLegoParts,
  filterLegoSets,
  type LegoPart,
  type LegoSet,
  type PartsFoundMap,
} from "@rego/domain";

describe("URL persistence and filter restoration", () => {
  describe("Set listing query persistence (?q=...)", () => {
    const mockSets: LegoSet[] = [
      { num: "10497-1", name: "Galaxy Explorer", imgUrl: "" },
      { num: "75192-1", name: "Millennium Falcon", imgUrl: "" },
      { num: "10300-1", name: "Back to the Future Time Machine", imgUrl: "" },
    ];

    it("restores search filter from deep link URL query parameter", () => {
      const url = new URL("https://rego.app/?q=galaxy");
      const queryParam = url.searchParams.get("q") ?? "";

      expect(queryParam).toBe("galaxy");
      const matched = filterLegoSets(mockSets, queryParam);
      expect(matched).toHaveLength(1);
      expect(matched[0].num).toBe("10497-1");
    });

    it("serializes search query into URL search parameters cleanly", () => {
      const url = new URL("https://rego.app/");

      // Set query
      url.searchParams.set("q", "Falcon");
      expect(url.search).toBe("?q=Falcon");

      // Empty query removes parameter
      url.searchParams.delete("q");
      expect(url.search).toBe("");
    });
  });

  describe("Set inspection filters persistence (?hideCompleted=...&color=...&category=...)", () => {
    const mockParts: LegoPart[] = [
      {
        id: "p1",
        name: "Brick 2 x 4",
        color: "Bright Blue",
        imgUrl: "",
        quantity: 4,
        category: "Brick",
      },
      {
        id: "p2",
        name: "Brick 1 x 2",
        color: "Bright Blue",
        imgUrl: "",
        quantity: 2,
        category: "Brick",
      },
      {
        id: "p3",
        name: "Plate 1 x 2",
        color: "Bright Blue",
        imgUrl: "",
        quantity: 5,
        category: "Plate",
      },
      {
        id: "p4",
        name: "Brick 2 x 2",
        color: "Red",
        imgUrl: "",
        quantity: 2,
        category: "Brick",
      },
    ];

    const mockPartsFound: PartsFoundMap = {
      p1: 4, // completed
      p2: 1, // in progress
      p3: 0, // not found
      p4: 2, // completed
    };

    it("restores filter parameters from deep link URL and filters parts accurately", () => {
      const deepLink = new URL(
        "https://rego.app/sets/10497-1?hideCompleted=true&color=Bright%20Blue&category=Brick"
      );

      const hideCompleted = deepLink.searchParams.get("hideCompleted") === "true";
      const color = deepLink.searchParams.get("color") ?? "";
      const category = deepLink.searchParams.get("category") ?? "";

      expect(hideCompleted).toBe(true);
      expect(color).toBe("Bright Blue");
      expect(category).toBe("Brick");

      const visibleParts = filterLegoParts(mockParts, mockPartsFound, {
        hideCompleted,
        color,
        category,
      });

      // p1 is completed (hidden)
      // p2 is Bright Blue Brick and incomplete (visible)
      // p3 is Plate (not Brick)
      // p4 is Red (not Bright Blue)
      expect(visibleParts).toHaveLength(1);
      expect(visibleParts[0].id).toBe("p2");
    });

    it("updates and cleans URL parameters when filters are modified or reset", () => {
      const url = new URL("https://rego.app/sets/10497-1");

      // Apply filters
      url.searchParams.set("hideCompleted", "true");
      url.searchParams.set("color", "Bright Blue");
      url.searchParams.set("category", "Brick");

      expect(url.searchParams.get("hideCompleted")).toBe("true");
      expect(url.searchParams.get("color")).toBe("Bright Blue");
      expect(url.searchParams.get("category")).toBe("Brick");

      // Reset filters removes parameters
      url.searchParams.delete("hideCompleted");
      url.searchParams.delete("color");
      url.searchParams.delete("category");

      expect(url.search).toBe("");
    });
  });
});
