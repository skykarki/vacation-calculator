"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  calculateTripDuration,
  endDateFromStartAndDays,
  toIsoDate,
} from "@/lib/date-utils";
import { DateRangeFields } from "@/components/DateRangeFields";

type TripFormValues = {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalDays: number | "";
  notes: string;
};

export function TripForm({
  tripId,
  initialValues,
  redirectTo = "/dashboard",
}: {
  tripId?: string;
  initialValues?: TripFormValues;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<TripFormValues>(
    initialValues ?? {
      title: "",
      destination: "",
      startDate: "",
      endDate: "",
      totalDays: "",
      notes: "",
    },
  );
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const duration =
    form.startDate && form.endDate
      ? (() => {
          try {
            return calculateTripDuration(
              new Date(form.startDate),
              new Date(form.endDate),
            );
          } catch {
            return null;
          }
        })()
      : null;

  function applyStartDate(startDate: string) {
    setForm((current) => {
      if (startDate && current.endDate && current.endDate >= startDate) {
        try {
          const totalDays = calculateTripDuration(
            new Date(startDate),
            new Date(current.endDate),
          ).totalDays;
          return { ...current, startDate, totalDays };
        } catch {
          return { ...current, startDate };
        }
      }

      if (startDate && typeof current.totalDays === "number" && current.totalDays >= 1) {
        try {
          const endDate = toIsoDate(
            endDateFromStartAndDays(new Date(startDate), current.totalDays),
          );
          return { ...current, startDate, endDate };
        } catch {
          return { ...current, startDate };
        }
      }

      return { ...current, startDate };
    });
  }

  function applyEndDate(endDate: string) {
    setForm((current) => {
      if (current.startDate && endDate && endDate >= current.startDate) {
        try {
          const totalDays = calculateTripDuration(
            new Date(current.startDate),
            new Date(endDate),
          ).totalDays;
          return { ...current, endDate, totalDays };
        } catch {
          return { ...current, endDate };
        }
      }
      return { ...current, endDate };
    });
  }

  function swapDates() {
    if (!form.startDate && !form.endDate) return;
    const nextStart = form.endDate;
    const nextEnd = form.startDate;
    setForm((current) => {
      if (nextStart && nextEnd && nextEnd >= nextStart) {
        try {
          const totalDays = calculateTripDuration(
            new Date(nextStart),
            new Date(nextEnd),
          ).totalDays;
          return { ...current, startDate: nextStart, endDate: nextEnd, totalDays };
        } catch {
          return { ...current, startDate: nextStart, endDate: nextEnd };
        }
      }
      return { ...current, startDate: nextStart, endDate: nextEnd };
    });
  }

  function applyTotalDays(value: string) {
    if (value === "") {
      setForm((current) => ({ ...current, totalDays: "" }));
      return;
    }

    const totalDays = Number(value);
    setForm((current) => {
      if (
        current.startDate &&
        Number.isInteger(totalDays) &&
        totalDays >= 1
      ) {
        try {
          const endDate = toIsoDate(
            endDateFromStartAndDays(new Date(current.startDate), totalDays),
          );
          return { ...current, totalDays, endDate };
        } catch {
          return { ...current, totalDays };
        }
      }
      return { ...current, totalDays: Number.isNaN(totalDays) ? "" : totalDays };
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);

    const res = await fetch(tripId ? `/api/trips/${tripId}` : "/api/trips", {
      method: tripId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        destination: form.destination,
        startDate: form.startDate,
        endDate: form.endDate || undefined,
        totalDays: form.totalDays === "" ? undefined : form.totalDays,
        notes: form.notes,
      }),
    });

    setPending(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  async function handleDelete() {
    if (!tripId) return;
    setPending(true);
    const res = await fetch(`/api/trips/${tripId}`, { method: "DELETE" });
    setPending(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Could not delete trip");
      return;
    }
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4 p-6">
      {redirectTo === "/control" ? null : (
        <h1 className="text-3xl font-semibold tracking-tight">
          {tripId ? "Edit trip" : "New trip"}
        </h1>
      )}
      <input
        placeholder="Trip title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="w-full rounded border border-line bg-surface px-3 py-2"
        required
      />
      <input
        placeholder="Destination"
        value={form.destination}
        onChange={(e) => setForm({ ...form, destination: e.target.value })}
        className="w-full rounded border border-line bg-surface px-3 py-2"
        required
      />
      <DateRangeFields
        startId="startDate"
        endId="endDate"
        startValue={form.startDate}
        endValue={form.endDate}
        startRequired
        onStartChange={applyStartDate}
        onEndChange={applyEndDate}
        onSwap={swapDates}
      />
      <label htmlFor="totalDays" className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Days</span>
        <input
          id="totalDays"
          type="number"
          min={1}
          step={1}
          value={form.totalDays}
          onChange={(e) => applyTotalDays(e.target.value)}
          className="rounded-md border border-line bg-surface px-3 py-2"
        />
      </label>
      <p className="text-sm text-muted">
        Pick start and end dates to fill days, or enter days to fill the end date.
        {duration
          ? ` ${duration.totalDays} days · ${duration.months} months ${duration.extraDays} days.`
          : ""}
      </p>
      <textarea
        placeholder="Notes"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
        className="w-full rounded border border-line bg-surface px-3 py-2"
        rows={3}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-accent px-4 py-2 text-white disabled:opacity-60"
      >
        {pending ? "Saving..." : tripId ? "Update trip" : "Save Trip"}
      </button>
      {tripId ? (
        <button
          type="button"
          disabled={pending}
          onClick={handleDelete}
          className="w-full rounded-full border border-red-200 px-4 py-2 text-red-700 disabled:opacity-60"
        >
          Cancel trip
        </button>
      ) : null}
    </form>
  );
}
