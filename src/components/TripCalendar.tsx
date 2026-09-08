"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { buildMonthGrid, CalendarTrip } from "@/lib/calendar";
import { tripPalette } from "@/lib/trip-style";
import { toIsoDate } from "@/lib/date-utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function TripCalendar({ trips }: { trips: CalendarTrip[] }) {
  const now = new Date();
  const todayIso = toIsoDate(now);
  const [cursor, setCursor] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
  });

  const cells = useMemo(
    () => buildMonthGrid(cursor.year, cursor.month, trips),
    [cursor.month, cursor.year, trips],
  );

  const label = new Date(Date.UTC(cursor.year, cursor.month, 1)).toLocaleDateString(
    undefined,
    { month: "long", year: "numeric", timeZone: "UTC" },
  );

  function shift(delta: number) {
    setCursor((current) => {
      const month = current.month + delta;
      if (month < 0) return { year: current.year - 1, month: 11 };
      if (month > 11) return { year: current.year + 1, month: 0 };
      return { year: current.year, month };
    });
  }

  return (
    <section className="rounded-3xl border border-line bg-surface p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Calendar</p>
          <h2 className="text-xl font-semibold">{label}</h2>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button
            type="button"
            className="rounded-full border border-line px-3 py-1 hover:bg-accent-soft"
            onClick={() => shift(-1)}
          >
            Prev
          </button>
          <button
            type="button"
            className="rounded-full border border-line px-3 py-1 hover:bg-accent-soft"
            onClick={() =>
              setCursor({ year: now.getFullYear(), month: now.getMonth() })
            }
          >
            Today
          </button>
          <button
            type="button"
            className="rounded-full border border-line px-3 py-1 hover:bg-accent-soft"
            onClick={() => shift(1)}
          >
            Next
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium uppercase tracking-wide text-muted">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell) => {
          const isToday = cell.iso === todayIso;
          return (
            <div
              key={cell.iso}
              className={`min-h-[88px] rounded-xl p-1.5 text-left text-xs ${
                cell.inMonth ? "bg-background/70" : "bg-line/30 text-muted"
              } ${isToday ? "ring-2 ring-accent" : ""}`}
            >
              <p className={`mb-1 ${isToday ? "font-semibold text-accent" : ""}`}>
                {cell.date.getUTCDate()}
              </p>
              {cell.trips.map((trip) => {
                const [from] = tripPalette(`${trip.title}-${trip.destination}`);
                return (
                  <Link
                    key={trip.id}
                    href={`/trips/${trip.id}`}
                    className="mt-1 block truncate rounded-md px-1 py-0.5 text-white"
                    style={{ background: from }}
                  >
                    {trip.title}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
}
