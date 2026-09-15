"use client";

import { useMemo, useRef, useState } from "react";
import { Airport, airportLabel, findAirport, searchAirports } from "@/lib/airports";

export function AirportPicker({
  id,
  label,
  value,
  required,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  required?: boolean;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const blurTimer = useRef<number | null>(null);
  const selected = findAirport(value);
  const suggestions = useMemo(() => searchAirports(value, 8), [value]);

  function pick(airport: Airport) {
    onChange(airportLabel(airport));
    setOpen(false);
  }

  return (
    <label htmlFor={id} className="relative z-10 flex min-w-0 flex-1 flex-col gap-1 px-3 py-2">
      <span className="text-xs text-muted">{label}</span>
      <input
        id={id}
        value={value}
        required={required}
        autoComplete="off"
        placeholder="Type a city or airport"
        onFocus={(event) => {
          event.currentTarget.select();
          setOpen(true);
        }}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
        }}
        onBlur={() => {
          blurTimer.current = window.setTimeout(() => setOpen(false), 120);
        }}
        className="w-full bg-transparent text-sm outline-none"
      />
      {selected?.name ? (
        <span className="truncate text-[11px] text-muted">
          {selected.name}
          {selected.country ? `, ${selected.country}` : ""}
        </span>
      ) : null}
      {open ? (
        <ul className="absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-auto rounded-xl border border-line bg-surface shadow-lg">
          {suggestions.length === 0 ? (
            <li className="px-3 py-2 text-xs text-muted">Keep typing a city or airport name</li>
          ) : (
            suggestions.map((airport) => (
              <li key={`${id}-${airport.code}-${airport.city}`}>
                <button
                  type="button"
                  className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left hover:bg-accent-soft"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    if (blurTimer.current) window.clearTimeout(blurTimer.current);
                    pick(airport);
                  }}
                >
                  <span className="text-sm font-medium">
                    {airport.city} ({airport.code})
                  </span>
                  <span className="text-xs text-muted">
                    {airport.name}
                    {airport.country ? `, ${airport.country}` : ""}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </label>
  );
}
