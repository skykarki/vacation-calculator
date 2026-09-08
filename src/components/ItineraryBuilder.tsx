"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ItineraryItem = {
  id: string;
  day: number;
  title: string;
  time: string | null;
  notes: string | null;
};

export function ItineraryBuilder({
  tripId,
  totalDays,
  items,
}: {
  tripId: string;
  totalDays: number;
  items: ItineraryItem[];
}) {
  const router = useRouter();
  const [day, setDay] = useState(1);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const dayNumbers = useMemo(
    () => Array.from({ length: totalDays }, (_, i) => i + 1),
    [totalDays],
  );

  const itemsByDay = items.reduce(
    (acc, item) => {
      (acc[item.day] ??= []).push(item);
      return acc;
    },
    {} as Record<number, ItineraryItem[]>,
  );

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);

    const payload = {
      day,
      title,
      time: time || null,
      notes: notes || null,
    };

    const res = await fetch(
      editingId
        ? `/api/trips/${tripId}/itinerary/${editingId}`
        : `/api/trips/${tripId}/itinerary`,
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    setPending(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Could not save item");
      return;
    }

    setTitle("");
    setTime("");
    setNotes("");
    setEditingId(null);
    router.refresh();
  }

  async function remove(itemId: string) {
    setPending(true);
    const res = await fetch(`/api/trips/${tripId}/itinerary/${itemId}`, {
      method: "DELETE",
    });
    setPending(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Could not delete item");
      return;
    }
    if (editingId === itemId) {
      setEditingId(null);
      setTitle("");
      setTime("");
      setNotes("");
    }
    router.refresh();
  }

  function startEdit(item: ItineraryItem) {
    setEditingId(item.id);
    setDay(item.day);
    setTitle(item.title);
    setTime(item.time ?? "");
    setNotes(item.notes ?? "");
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Itinerary</h2>
      <div className="space-y-3">
        {dayNumbers.map((dayNumber) => (
          <div key={dayNumber} className="rounded-lg border p-4">
            <p className="font-medium">Day {dayNumber}</p>
            {(itemsByDay[dayNumber] ?? []).length === 0 ? (
              <p className="text-sm text-gray-500">nothing planned yet</p>
            ) : (
              <ul className="mt-2 space-y-2 text-sm">
                {(itemsByDay[dayNumber] ?? []).map((item) => (
                  <li key={item.id} className="flex items-start justify-between gap-3">
                    <span>
                      {item.time ? `${item.time} · ` : ""}
                      {item.title}
                      {item.notes ? ` — ${item.notes}` : ""}
                    </span>
                    <span className="flex gap-2">
                      <button type="button" className="underline" onClick={() => startEdit(item)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="underline text-red-700"
                        onClick={() => remove(item.id)}
                      >
                        Delete
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className="grid gap-3 rounded-lg border p-4">
        <select
          value={day}
          onChange={(e) => setDay(Number(e.target.value))}
          className="rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
        >
          {dayNumbers.map((dayNumber) => (
            <option key={dayNumber} value={dayNumber}>
              Day {dayNumber}
            </option>
          ))}
        </select>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Activity title"
          required
          className="rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
        />
        <input
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="Time (optional)"
          className="rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
        />
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          className="rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-60"
          >
            {pending ? "Saving..." : editingId ? "Update item" : "Add to itinerary"}
          </button>
          {editingId ? (
            <button
              type="button"
              className="rounded border px-4 py-2"
              onClick={() => {
                setEditingId(null);
                setTitle("");
                setTime("");
                setNotes("");
              }}
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
