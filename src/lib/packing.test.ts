import { describe, expect, it } from "vitest";
import { parsePackingList } from "./packing";

describe("parsePackingList", () => {
  it("returns an empty list for non-arrays", () => {
    expect(parsePackingList(null)).toEqual([]);
    expect(parsePackingList({})).toEqual([]);
  });

  it("keeps valid packing items", () => {
    const items = parsePackingList([
      { id: "p1", text: "Passport", checked: true },
      { id: 2, text: "bad" },
      { id: "p2", text: "Charger", checked: false },
    ]);
    expect(items).toEqual([
      { id: "p1", text: "Passport", checked: true },
      { id: "p2", text: "Charger", checked: false },
    ]);
  });
});
