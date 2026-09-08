"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LocaleDate } from "@/components/LocaleDate";

type Booking = {
  id: string;
  type: string;
  provider: string;
  confirmation: string | null;
  startDate: string | Date | null;
  endDate: string | Date | null;
  notes: string | null;
};

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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

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
      <h2 className="text-xl font-semibold">Bookings</h2>
      <ul className="space-y-2 text-sm">
        {bookings.length === 0 ? (
          <li className="text-gray-500">No bookings yet.</li>
        ) : (
          bookings.map((booking) => (
            <li key={booking.id} className="flex items-start justify-between gap-3 rounded border p-3">
              <div>
                <p className="font-medium">
                  {booking.type} · {booking.provider}
                </p>
                {booking.confirmation ? <p>Confirmation: {booking.confirmation}</p> : null}
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
                {booking.notes ? <p>{booking.notes}</p> : null}
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
          <option value="flight">Flight</option>
          <option value="hotel">Hotel</option>
          <option value="car">Car</option>
          <option value="train">Train</option>
          <option value="other">Other</option>
        </select>
        <input
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          placeholder="Provider"
          required
          className="rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
        />
        <input
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          placeholder="Confirmation number"
          className="rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
        />
        <div className="flex gap-3">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
          />
          <input
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
          />
        </div>
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
          {pending ? "Saving..." : "Add booking"}
        </button>
      </form>
    </section>
  );
}
