import { differenceInCalendarDays, differenceInCalendarMonths } from "date-fns";

export interface TripDuration {
  totalDays: number;
  totalWeeks: number;
  months: number;
  extraDays: number;
}

export function calculateTripDuration(startDate: Date, endDate: Date): TripDuration {
  if (endDate < startDate) {
    throw new Error("End date cannot be before start date");
  }

  const totalDays = differenceInCalendarDays(endDate, startDate) + 1;

  const totalWeeks = Math.floor(totalDays / 7);
  const months = differenceInCalendarMonths(endDate, startDate);
  const extraDays = totalDays - months * 30;

  return { totalDays, totalWeeks, months, extraDays };
}

export function toIsoDate(date: Date | string) {
  return new Date(date).toISOString().slice(0, 10);
}

export function parseTotalDays(value: unknown) {
  const days = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(days) || days < 1) {
    throw new Error("Days must be a whole number of at least 1");
  }
  return days;
}

export function endDateFromStartAndDays(startDate: Date, totalDays: number) {
  const days = parseTotalDays(totalDays);
  const end = new Date(startDate);
  end.setUTCDate(end.getUTCDate() + days - 1);
  return end;
}

export function resolveTripDates(input: {
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  totalDays?: unknown;
}) {
  if (!input.startDate) {
    throw new Error("Start date is required");
  }

  const start = new Date(input.startDate);

  if (input.endDate) {
    const end = new Date(input.endDate);
    const duration = calculateTripDuration(start, end);
    return { start, end, totalDays: duration.totalDays, duration };
  }

  const days = parseTotalDays(input.totalDays);
  const end = endDateFromStartAndDays(start, days);
  return { start, end, totalDays: days, duration: calculateTripDuration(start, end) };
}
