import { fireEvent, render, screen } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import { LegoPartCard } from "@rego/ui";

describe("Web & UI Component integration", () => {
  it("renders LegoPartCard with quantities and title", () => {
    const part = {
      id: "part-123",
      name: "Brick 2x4",
      color: "Bright Blue",
      imgUrl: "https://test.com/brick.jpg",
      quantity: 5,
    };

    render(LegoPartCard, {
      part,
      quantityFound: 2,
    });

    expect(screen.getByText("Brick 2x4")).toBeDefined();
    expect(screen.getByText("Bright Blue")).toBeDefined();
    expect(screen.getByText("2")).toBeDefined();
  });

  it("handles increment and decrement callbacks", async () => {
    const part = {
      id: "part-456",
      name: "Plate 1x1",
      color: "Red",
      imgUrl: "",
      quantity: 3,
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
});
