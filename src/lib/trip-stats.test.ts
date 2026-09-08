import { describe, expect, it } from "vitest";
import {
  getNextUpcomingTripFromTrips,
  getYearlyTravelStatsFromTrips,
  summarizeExpenses,
} from "./trip-stats";

describe("getYearlyTravelStatsFromTrips", () => {
  it("counts only trips that start in the requested year", () => {
    const stats = getYearlyTravelStatsFromTrips(
      [
        { destination: "Lisbon", startDate: new Date("2026-04-10"), totalDays: 5 },
        { destination: "Kyoto", startDate: new Date("2026-10-10"), totalDays: 11 },
        { destination: "Paris", startDate: new Date("2025-12-20"), totalDays: 4 },
      ],
      2026,
    );

    expect(stats.totalTrips).toBe(2);
    expect(stats.totalDays).toBe(16);
    expect(stats.uniqueDestinations).toBe(2);
  });
});

describe("getNextUpcomingTripFromTrips", () => {
  it("returns the soonest trip that has not started", () => {
    const next = getNextUpcomingTripFromTrips(
      [
        { title: "Past", startDate: new Date("2026-01-01") },
        { title: "Soon", startDate: new Date("2026-10-10") },
        { title: "Later", startDate: new Date("2026-12-01") },
      ],
      new Date("2026-09-08"),
    );

    expect(next?.title).toBe("Soon");
  });
});

describe("summarizeExpenses", () => {
  it("totals expenses by category", () => {
    expect(
      summarizeExpenses([
        { category: "food", amount: 30 },
        { category: "food", amount: 20 },
        { category: "hotel", amount: 100 },
      ]),
    ).toEqual({
      total: 150,
      byCategory: { food: 50, hotel: 100 },
    });
  });
});
