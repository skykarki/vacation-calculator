import { describe, expect, it } from "vitest";
import { isTripOwner } from "./trip-access";

describe("isTripOwner", () => {
  it("returns true only for the matching user", () => {
    expect(isTripOwner({ userId: "user-a" }, "user-a")).toBe(true);
    expect(isTripOwner({ userId: "user-a" }, "user-b")).toBe(false);
    expect(isTripOwner(null, "user-a")).toBe(false);
  });
});
