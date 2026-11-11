import { describe, expect, it } from "vitest";
import { Left, Right, type Either } from "./Either.js";

describe("Either", () => {
  it("creates a Left instance with error", () => {
    const errorEither: Either<string, number> = Left.create("Not found");
    expect(errorEither.isLeft()).toBe(true);
    expect(errorEither.isRight()).toBe(false);
    if (errorEither.isLeft()) {
      expect(errorEither.error).toBe("Not found");
    }
  });

  it("creates a Right instance with value", () => {
    const successEither: Either<string, number> = Right.create(42);
    expect(successEither.isLeft()).toBe(false);
    expect(successEither.isRight()).toBe(true);
    if (successEither.isRight()) {
      expect(successEither.value).toBe(42);
    }
  });
});
