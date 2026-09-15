"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LocaleDate } from "@/components/LocaleDate";
import { DateRangeFields } from "@/components/DateRangeFields";
import Link from "next/link";
import { TicketRouteFields } from "@/components/TicketRouteFields";

type Booking = {
  id: string;
  type: string;
  provider: string;
  confirmation: string | null;
  origin?: string | null;
  destination?: string | null;
  flightNumber?: string | null;
  cabin?: string | null;
  price?: number | null;
  currency?: string | null;
  passengerName?: string | null;
  passengers?: number | null;
  startDate: string | Date | null;
  endDate: string | Date | null;
  notes: string | null;
};

const TICKET_TYPES = new Set(["flight", "train", "bus"]);

export function BookingManager({
  tripId,
  bookings,
}: {
  tripId: string;
  bookings: Booking[];
}) {
  const router = useRouter();
  const [type, setType] = useState("flight");
  const [provider, setProvider] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const isTicket = TICKET_TYPES.has(type);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const res = await fetch(`/api/trips/${tripId}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        provider,
        confirmation: confirmation || null,
        origin: isTicket ? origin || null : null,
        destination: isTicket ? destination || null : null,
        startDate: startDate || null,
        endDate: endDate || null,
        notes: notes || null,
      }),
    });
    setPending(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Could not add booking");
      return;
    }
    setProvider("");
    setConfirmation("");
    setOrigin("");
    setDestination("");
    setStartDate("");
    setEndDate("");
    setNotes("");
    router.refresh();
  }

  async function remove(bookingId: string) {
    setPending(true);
    const res = await fetch(`/api/trips/${tripId}/bookings/${bookingId}`, {
      method: "DELETE",
    });
    setPending(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Could not delete booking");
      return;
    }
    router.refresh();
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Bookings</h2>
        <Link
          href={`/flights?tripId=${tripId}`}
          className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-white"
        >
          Book air ticket
        </Link>
      </div>
      <ul className="space-y-2 text-sm">
        {bookings.length === 0 ? (
          <li className="text-gray-500">No bookings yet.</li>
        ) : (
          bookings.map((booking) => (
            <li
              key={booking.id}
              className="flex items-start justify-between gap-3 rounded border p-3"
            >
              <div>
                <p className="font-medium">
                  {booking.type} · {booking.provider}
                </p>
                {booking.origin || booking.destination ? (
                  <p>
                    {booking.origin || "From"}
                    {" → "}
                    {booking.destination || "To"}
                  </p>
                ) : null}
                {booking.flightNumber ? (
                  <p>
                    {booking.flightNumber}
                    {booking.cabin ? ` · ${booking.cabin}` : ""}
                    {booking.passengers ? ` · ${booking.passengers} passenger${booking.passengers === 1 ? "" : "s"}` : ""}
                  </p>
                ) : null}
                {booking.passengerName ? <p>Passenger: {booking.passengerName}</p> : null}
                {booking.confirmation ? (
                  <p>
                    {booking.notes?.includes("http") ? "Site: " : "Ticket: "}
                    {booking.confirmation}
                  </p>
                ) : null}
                {booking.price != null ? (
                  <p>
                    {booking.currency || "USD"} {booking.price}
                  </p>
                ) : null}
                {booking.startDate ? (
                  <p>
                    <LocaleDate value={booking.startDate} />
                    {booking.endDate ? (
                      <>
                        {" – "}
                        <LocaleDate value={booking.endDate} />
                      </>
                    ) : null}
                  </p>
                ) : null}
                {booking.notes ? <BookingNote notes={booking.notes} /> : null}
              </div>
              <button
                type="button"
                className="underline text-red-700"
                onClick={() => remove(booking.id)}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
      <form onSubmit={onSubmit} className="grid gap-3 rounded-lg border p-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
        >
          <option value="flight">Flight ticket</option>
          <option value="train">Train ticket</option>
          <option value="bus">Bus ticket</option>
          <option value="hotel">Hotel</option>
          <option value="car">Car</option>
          <option value="other">Other</option>
        </select>
        {isTicket ? (
          <TicketRouteFields
            originId="ticket-from"
            destinationId="ticket-to"
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
        ) : null}
        <input
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          placeholder={isTicket ? "Airline or operator" : "Provider"}
          required
          className="rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
        />
        <input
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          placeholder="Confirmation / ticket number"
          className="rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
        />
        <DateRangeFields
          startId="booking-start"
          endId="booking-end"
          startValue={startDate}
          endValue={endDate}
          onStartChange={setStartDate}
          onEndChange={setEndDate}
          onSwap={() => {
            setStartDate(endDate);
            setEndDate(startDate);
          }}
        />
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes"
          className="rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {pending ? "Saving..." : isTicket ? "Add ticket" : "Add booking"}
        </button>
      </form>
    </section>
  );
}

function BookingNote({ notes }: { notes: string }) {
  const match = notes.match(/https?:\/\/\S+/);
  if (!match) return <p>{notes}</p>;
  const url = match[0];
  return (
    <p>
      <a href={url} target="_blank" rel="noreferrer" className="underline">
        Open booking site
      </a>
    </p>
  );
}
