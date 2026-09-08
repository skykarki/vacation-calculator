"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { PackingItem } from "@/lib/packing";

export function PackingList({
  tripId,
  items,
}: {
  tripId: string;
  items: PackingItem[];
}) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function save(next: PackingItem[]) {
    setPending(true);
    setError("");
    const res = await fetch(`/api/trips/${tripId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packingList: next }),
    });
    setPending(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Could not update packing list");
      return;
    }
    router.refresh();
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const nextItem: PackingItem = {
      id: crypto.randomUUID(),
      text,
      checked: false,
    };
    setText("");
    await save([...items, nextItem]);
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Packing list</h2>
      <ul className="space-y-2">
        {items.length === 0 ? (
          <li className="text-sm text-gray-500">No items yet.</li>
        ) : (
          items.map((item) => (
            <li key={item.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={item.checked}
                disabled={pending}
                onChange={() =>
                  save(
                    items.map((entry) =>
                      entry.id === item.id
                        ? { ...entry, checked: !entry.checked }
                        : entry,
                    ),
                  )
                }
              />
              <span className={item.checked ? "line-through text-gray-500" : ""}>
                {item.text}
              </span>
              <button
                type="button"
                className="ml-auto underline text-red-700"
                disabled={pending}
                onClick={() => save(items.filter((entry) => entry.id !== item.id))}
              >
                Remove
              </button>
            </li>
          ))
        )}
      </ul>
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add packing item"
          required
          className="flex-1 rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          Add
        </button>
      </form>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </section>
  );
}
