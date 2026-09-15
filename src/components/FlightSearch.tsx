"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { DateInput } from "@/components/DateInput";
import { TicketRouteFields } from "@/components/TicketRouteFields";
import { BookingSite, CabinClass, FlightSearchResult } from "@/lib/flights";

type TripOption = {
  id: string;
  title: string;
  destination: string;
  startDate: string;
};

const KIND_COPY: Record<BookingSite["kind"], string> = {
  cheap: "Cheap tickets",
  best: "Best flights",
  airline: "Official airlines",
};

export function FlightSearch({
  trips,
  defaultTripId,
  defaultOrigin = "Doha (DOH) · Hamad International",
  defaultDestination = "Mogadishu (MGQ) · Aden Adde International",
  defaultDate = "",
}: {
  trips: TripOption[];
  defaultTripId?: string;
  defaultOrigin?: string;
  defaultDestination?: string;
  defaultDate?: string;
}) {
  const router = useRouter();
  const [origin, setOrigin] = useState(defaultOrigin);
  const [destination, setDestination] = useState(defaultDestination);
  const [date, setDate] = useState(defaultDate);
  const [returnDate, setReturnDate] = useState("");
  const [cabin, setCabin] = useState<CabinClass>("economy");
  const [passengers, setPassengers] = useState(1);
  const [tripId, setTripId] = useState(defaultTripId || trips[0]?.id || "");
  const [passengerName, setPassengerName] = useState("");
  const [result, setResult] = useState<FlightSearchResult | null>(null);
  const [pending, setPending] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function onSearch(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    setSavedId(null);
    const params = new URLSearchParams({
      origin,
      destination,
      date,
      cabin,
      passengers: String(passengers),
    });
    if (returnDate) params.set("returnDate", returnDate);
    const res = await fetch(`/api/flights?${params.toString()}`);
    const data = await res.json();
    setPending(false);
    setSearched(true);
    if (!res.ok) {
      setResult(null);
      setError(data.error || "Could not search flights");
      return;
    }
    setResult(data);
  }

  async function saveAndOpen(site: BookingSite) {
    window.open(site.url, "_blank", "noopener,noreferrer");
    if (!tripId) return;
    setPending(true);
    setError("");
    const res = await fetch("/api/flights/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tripId,
        siteId: site.id,
        origin,
        destination,
        date,
        returnDate,
        cabin,
        passengers,
        passengerName,
      }),
    });
    const data = await res.json();
    setPending(false);
    if (!res.ok) {
      setError(data.error || "Could not save this booking to the trip");
      return;
    }
    setSavedId(site.id);
    router.refresh();
  }

  const cheap = result?.sites.filter((site) => site.kind === "cheap") ?? [];
  const best = result?.sites.filter((site) => site.kind === "best") ?? [];
  const airlines = result?.sites.filter((site) => site.kind === "airline") ?? [];

  return (
    <div className="space-y-6">
      <form onSubmit={onSearch} className="space-y-4 rounded-3xl border border-line bg-surface p-5">
        <TicketRouteFields
          originId="air-from"
          destinationId="air-to"
          origin={origin}
          destination={destination}
          required
          onOriginChange={setOrigin}
          onDestinationChange={setDestination}
          onSwap={() => {
            setOrigin(destination);
            setDestination(origin);
          }}
        />
        <div className="grid gap-3 sm:grid-cols-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-xs text-muted">Depart</span>
            <DateInput
              required
              value={date}
              className="rounded-md border border-line bg-surface px-3 py-2"
              onChange={setDate}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-xs text-muted">Return</span>
            <DateInput
              min={date || undefined}
              value={returnDate}
              className="rounded-md border border-line bg-surface px-3 py-2"
              onChange={setReturnDate}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-xs text-muted">Cabin</span>
            <select
              value={cabin}
              onChange={(event) => setCabin(event.target.value as CabinClass)}
              className="rounded-md border border-line bg-surface px-3 py-2"
            >
              <option value="economy">Economy</option>
              <option value="premium">Premium</option>
              <option value="business">Business</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-xs text-muted">Passengers</span>
            <input
              type="number"
              min={1}
              max={9}
              value={passengers}
              onChange={(event) => setPassengers(Number(event.target.value))}
              className="rounded-md border border-line bg-surface px-3 py-2"
            />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-xs text-muted">Save to trip</span>
            <select
              value={tripId}
              onChange={(event) => setTripId(event.target.value)}
              className="rounded-md border border-line bg-surface px-3 py-2"
            >
              {trips.length === 0 ? <option value="">No trips yet</option> : null}
              {trips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.title}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-xs text-muted">Passenger name</span>
            <input
              value={passengerName}
              onChange={(event) => setPassengerName(event.target.value)}
              placeholder="Passenger name"
              className="rounded-md border border-line bg-surface px-3 py-2"
            />
          </label>
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {pending ? "Searching..." : "Find cheap and best tickets"}
        </button>
      </form>

      {searched && !result && !error ? (
        <p className="text-sm text-muted">No booking sites found for that route.</p>
      ) : null}

      {result ? (
        <div className="space-y-6">
          <p className="text-sm text-muted">
            {result.origin.city} ({result.origin.code}) {result.origin.name} to {result.destination.city} ({result.destination.code}) {result.destination.name}
          </p>
          <SiteGroup title={KIND_COPY.cheap} sites={cheap} savedId={savedId} pending={pending} onOpen={saveAndOpen} />
          <SiteGroup title={KIND_COPY.best} sites={best} savedId={savedId} pending={pending} onOpen={saveAndOpen} />
          <SiteGroup title={KIND_COPY.airline} sites={airlines} savedId={savedId} pending={pending} onOpen={saveAndOpen} />
        </div>
      ) : null}
    </div>
  );
}

function SiteGroup({
  title,
  sites,
  savedId,
  pending,
  onOpen,
}: {
  title: string;
  sites: BookingSite[];
  savedId: string | null;
  pending: boolean;
  onOpen: (site: BookingSite) => void;
}) {
  if (sites.length === 0) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="space-y-3">
        {sites.map((site) => (
          <li
            key={site.id}
            className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm font-medium">{site.name}</p>
              <p className="text-sm text-muted">
                {site.label} · {site.website}
              </p>
            </div>
            <button
              type="button"
              disabled={pending}
              onClick={() => onOpen(site)}
              className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {savedId === site.id ? "Opened and saved" : "Open site"}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
