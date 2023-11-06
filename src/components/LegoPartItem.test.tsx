import "@testing-library/jest-dom";

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import LegoPartItem from "./LegoPartItem";

describe("LegoPartItem", () => {
  it("displays the quantity of parts and number found", () => {
    const dispatchFound = () => {};
    render(
      <LegoPartItem
        color="red"
        hideFound={false}
        id="12343-5"
        imgUrl="http://test.com/img.jpg"
        name="my brick"
        quantity={2}
        quantityFound={1}
        dispatchFound={dispatchFound}
      />
    );
    expect(screen.getByText("1/2")).toBeInTheDocument();
  });
});
