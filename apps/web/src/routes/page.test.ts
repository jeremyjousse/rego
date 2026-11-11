import { cleanup, fireEvent, render, screen } from "@testing-library/svelte";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LegoPartCard, PartFilterControls } from "@rego/ui";

describe("Web & UI Component integration", () => {
  afterEach(() => {
    cleanup();
  });
  it("renders LegoPartCard with quantities, title, and category badge", () => {
    const part = {
      id: "part-123",
      name: "Brick 2x4",
      color: "Bright Blue",
      imgUrl: "https://test.com/brick.jpg",
      quantity: 5,
      category: "Brick",
    };

    render(LegoPartCard, {
      part,
      quantityFound: 2,
    });

    expect(screen.getByText("Brick 2x4")).toBeDefined();
    expect(screen.getByText("Bright Blue")).toBeDefined();
    expect(screen.getByText("Brick")).toBeDefined();
    expect(screen.getByText("2")).toBeDefined();
  });

  it("handles increment and decrement callbacks", async () => {
    const part = {
      id: "part-456",
      name: "Plate 1x1",
      color: "Red",
      imgUrl: "",
      quantity: 3,
      category: "Plate",
    };

    const onincrement = vi.fn();
    const ondecrement = vi.fn();

    render(LegoPartCard, {
      part,
      quantityFound: 1,
      onincrement,
      ondecrement,
    });

    const decreaseBtn = screen.getByLabelText("Decrease Plate 1x1");
    const increaseBtn = screen.getByLabelText("Increase Plate 1x1");

    await fireEvent.click(increaseBtn);
    expect(onincrement).toHaveBeenCalledTimes(1);

    await fireEvent.click(decreaseBtn);
    expect(ondecrement).toHaveBeenCalledTimes(1);
  });

  describe("PartFilterControls", () => {
    it("renders available colors and categories in filter dropdowns", () => {
      render(PartFilterControls, {
        hideCompleted: false,
        completedCount: 3,
        color: "",
        colors: ["Bright Blue", "Red"],
        category: "",
        categories: ["Brick", "Plate"],
        totalPartsCount: 10,
        visiblePartsCount: 8,
      });

      expect(screen.getByText(/Showing/)).toBeDefined();
      expect(screen.getByText("8")).toBeDefined();
      expect(screen.getByText("10")).toBeDefined();
      expect(screen.getByText("All Colors (2)")).toBeDefined();
      expect(screen.getByText("All Categories (2)")).toBeDefined();
      expect(screen.getByText("Bright Blue")).toBeDefined();
      expect(screen.getByText("Brick")).toBeDefined();
    });

    it("triggers callbacks when toggling filters or changing dropdowns", async () => {
      const ontogglehide = vi.fn();
      const oncolorchange = vi.fn();
      const oncategorychange = vi.fn();
      const onreset = vi.fn();

      render(PartFilterControls, {
        hideCompleted: true,
        completedCount: 2,
        color: "Red",
        colors: ["Bright Blue", "Red"],
        category: "Plate",
        categories: ["Brick", "Plate"],
        totalPartsCount: 5,
        visiblePartsCount: 1,
        ontogglehide,
        oncolorchange,
        oncategorychange,
        onreset,
      });

      // Toggle hide completed
      const hideBtn = screen.getByRole("button", { name: /Showing Remaining Only/i });
      await fireEvent.click(hideBtn);
      expect(ontogglehide).toHaveBeenCalledTimes(1);

      // Select color
      const colorSelect = screen.getByLabelText("Filter parts by color");
      await fireEvent.change(colorSelect, { target: { value: "Bright Blue" } });
      expect(oncolorchange).toHaveBeenCalledWith("Bright Blue");

      // Select category
      const categorySelect = screen.getByLabelText("Filter parts by category or shape");
      await fireEvent.change(categorySelect, { target: { value: "Brick" } });
      expect(oncategorychange).toHaveBeenCalledWith("Brick");

      // Reset filters button is visible when filters are active
      const resetBtn = screen.getByRole("button", { name: "Reset all filters" });
      await fireEvent.click(resetBtn);
      expect(onreset).toHaveBeenCalledTimes(1);
    });

    it("does not render reset button when no filters are active", () => {
      render(PartFilterControls, {
        hideCompleted: false,
        color: "",
        category: "",
        colors: ["Red"],
        categories: ["Brick"],
      });

      expect(screen.queryByRole("button", { name: "Reset all filters" })).toBeNull();
    });
  });
});
