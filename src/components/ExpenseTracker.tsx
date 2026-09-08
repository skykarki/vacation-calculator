"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Expense = {
  id: string;
  category: string;
  amount: number;
  currency: string;
  note: string | null;
};

export function ExpenseTracker({
  tripId,
  expenses,
  total,
  byCategory,
}: {
  tripId: string;
  expenses: Expense[];
  total: number;
  byCategory: Record<string, number>;
}) {
  const router = useRouter();
  const [category, setCategory] = useState("food");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const summary = Object.entries(byCategory)
    .map(([name, value]) => `${name}: $${value.toFixed(0)}`)
    .join(" · ");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");

    const payload = {
      category,
      amount: Number(amount),
      currency: "USD",
      note: note || null,
    };

    const res = await fetch(
      editingId
        ? `/api/trips/${tripId}/expenses/${editingId}`
        : `/api/trips/${tripId}/expenses`,
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    setPending(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Could not save expense");
      return;
    }

    setAmount("");
    setNote("");
    setEditingId(null);
    router.refresh();
  }

  async function remove(expenseId: string) {
    setPending(true);
    const res = await fetch(`/api/trips/${tripId}/expenses/${expenseId}`, {
      method: "DELETE",
    });
    setPending(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Could not delete expense");
      return;
    }
    router.refresh();
  }

  function startEdit(expense: Expense) {
    setEditingId(expense.id);
    setCategory(expense.category);
    setAmount(String(expense.amount));
    setNote(expense.note ?? "");
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Expenses</h2>
      <p className="text-sm text-gray-600 dark:text-zinc-400">
        {summary || "No expenses yet."}
        {expenses.length > 0 ? ` — Total: $${total.toFixed(0)}.` : ""}
      </p>
      <ul className="space-y-2 text-sm">
        {expenses.map((expense) => (
          <li key={expense.id} className="flex items-center justify-between gap-3">
            <span>
              {expense.category}: ${expense.amount.toFixed(0)}
              {expense.note ? ` — ${expense.note}` : ""}
            </span>
            <span className="flex gap-2">
              <button type="button" className="underline" onClick={() => startEdit(expense)}>
                Edit
              </button>
              <button
                type="button"
                className="underline text-red-700"
                onClick={() => remove(expense.id)}
              >
                Delete
              </button>
            </span>
          </li>
        ))}
      </ul>
      <form onSubmit={onSubmit} className="grid gap-3 rounded-lg border p-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
        >
          <option value="flight">Flight</option>
          <option value="hotel">Hotel</option>
          <option value="food">Food</option>
          <option value="activity">Activity</option>
          <option value="other">Other</option>
        </select>
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
          className="rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
        />
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note (optional)"
          className="rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-60"
          >
            {pending ? "Saving..." : editingId ? "Update expense" : "Add expense"}
          </button>
          {editingId ? (
            <button
              type="button"
              className="rounded border px-4 py-2"
              onClick={() => {
                setEditingId(null);
                setAmount("");
                setNote("");
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
