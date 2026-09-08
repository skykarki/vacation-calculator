import { describe, expect, it } from "vitest";
import {
  calculateTripDuration,
  endDateFromStartAndDays,
  parseTotalDays,
  resolveTripDates,
} from "./date-utils";

describe("calculateTripDuration", () => {
  it("counts a same-day trip as 1 day", () => {
    const result = calculateTripDuration(
      new Date("2026-05-01"),
      new Date("2026-05-01"),
    );
    expect(result.totalDays).toBe(1);
    expect(result.totalWeeks).toBe(0);
  });

  it("includes both start and end dates", () => {
    const result = calculateTripDuration(
      new Date("2026-05-01"),
      new Date("2026-05-05"),
    );
    expect(result.totalDays).toBe(5);
  });

  it("handles leap years", () => {
    const leap = calculateTripDuration(
      new Date("2024-02-28"),
      new Date("2024-03-01"),
    );
    const nonLeap = calculateTripDuration(
      new Date("2025-02-28"),
      new Date("2025-03-01"),
    );
    expect(leap.totalDays).toBe(3);
    expect(nonLeap.totalDays).toBe(2);
  });

  it("parses date-only strings as UTC midnight", () => {
    const result = calculateTripDuration(
      new Date("2026-06-01"),
      new Date("2026-06-08"),
    );
    expect(result.totalDays).toBe(8);
    expect(result.totalWeeks).toBe(1);
  });

  it("throws when end date is before start date", () => {
    expect(() =>
      calculateTripDuration(new Date("2026-05-05"), new Date("2026-05-01")),
    ).toThrow("End date cannot be before start date");
  });

  it("counts a 7-day span as one week", () => {
    const result = calculateTripDuration(
      new Date("2026-01-01"),
      new Date("2026-01-07"),
    );
    expect(result.totalDays).toBe(7);
    expect(result.totalWeeks).toBe(1);
  });
});

describe("endDateFromStartAndDays", () => {
  it("keeps a 1-day trip on the start date", () => {
    expect(toIso(endDateFromStartAndDays(new Date("2026-05-01"), 1))).toBe(
      "2026-05-01",
    );
  });

  it("sets the inclusive end date from the day count", () => {
    expect(toIso(endDateFromStartAndDays(new Date("2026-05-01"), 5))).toBe(
      "2026-05-05",
    );
  });

  it("crosses months and leap days", () => {
    expect(toIso(endDateFromStartAndDays(new Date("2024-02-28"), 3))).toBe(
      "2024-03-01",
    );
  });
});

describe("parseTotalDays", () => {
  it("rejects values below 1", () => {
    expect(() => parseTotalDays(0)).toThrow("Days must be a whole number of at least 1");
    expect(() => parseTotalDays(1.5)).toThrow("Days must be a whole number of at least 1");
  });
});

describe("resolveTripDates", () => {
  it("uses start and end dates to compute days", () => {
    const result = resolveTripDates({
      startDate: "2026-05-01",
      endDate: "2026-05-05",
    });
    expect(toIso(result.end)).toBe("2026-05-05");
    expect(result.totalDays).toBe(5);
  });

  it("uses start date and days to compute the end date", () => {
    const result = resolveTripDates({
      startDate: "2026-05-01",
      totalDays: 5,
    });
    expect(toIso(result.end)).toBe("2026-05-05");
    expect(result.totalDays).toBe(5);
  });
});

function toIso(date: Date) {
  return date.toISOString().slice(0, 10);
}
