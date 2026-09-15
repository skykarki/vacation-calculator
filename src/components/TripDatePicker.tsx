"use client";

import { useMemo, useState } from "react";
import { DateInput } from "@/components/DateInput";
import { calculateTripDuration } from "@/lib/date-utils";

export default function TripDatePicker() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const duration = useMemo(() => {
    if (!startDate || !endDate) return null;
    try {
      return calculateTripDuration(new Date(startDate), new Date(endDate));
    } catch {
      return null;
    }
  }, [startDate, endDate]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium" htmlFor="trip-start-date">
          Start date
        </label>
        <DateInput
          id="trip-start-date"
          value={startDate}
          onChange={setStartDate}
          className="mt-1 w-full rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
        />
      </div>
      <div>
        <label className="block text-sm font-medium" htmlFor="trip-end-date">
          End date
        </label>
        <DateInput
          id="trip-end-date"
          value={endDate}
          min={startDate || undefined}
          onChange={setEndDate}
          className="mt-1 w-full rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
        />
      </div>

      {duration && (
        <p className="text-sm text-gray-600 dark:text-zinc-400">
          {duration.totalDays} days · {duration.months} month
          {duration.months !== 1 ? "s" : ""} {duration.extraDays} day
          {duration.extraDays !== 1 ? "s" : ""} · ~{duration.totalWeeks} weeks
        </p>
      )}
    </div>
  );
}
