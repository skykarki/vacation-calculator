import { describe, expect, it } from "vitest";
import { buildMonthGrid } from "./calendar";

describe("buildMonthGrid", () => {
  it("fills a 7-column grid including leading and trailing days", () => {
    const cells = buildMonthGrid(2026, 9, []);
    expect(cells.length % 7).toBe(0);
    expect(cells.some((cell) => !cell.inMonth)).toBe(true);
    expect(cells.filter((cell) => cell.inMonth)).toHaveLength(31);
  });

  it("places inclusive trip days on the calendar", () => {
    const cells = buildMonthGrid(2026, 9, [
      {
        id: "kyoto",
        title: "Kyoto",
        destination: "Japan",
        startDate: "2026-10-10T00:00:00.000Z",
        endDate: "2026-10-20T00:00:00.000Z",
      },
    ]);
    const occupied = cells.filter((cell) => cell.trips.some((trip) => trip.id === "kyoto"));
    expect(occupied).toHaveLength(11);
    expect(occupied[0].iso).toBe("2026-10-10");
    expect(occupied[occupied.length - 1].iso).toBe("2026-10-20");
  });
});
