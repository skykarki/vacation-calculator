"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AccountSettings } from "@/components/AccountSettings";
import { BookingManager } from "@/components/BookingManager";
import { DocumentVault } from "@/components/DocumentVault";
import { ExpenseTracker } from "@/components/ExpenseTracker";
import { ItineraryBuilder } from "@/components/ItineraryBuilder";
import { LocaleDate } from "@/components/LocaleDate";
import { PackingList } from "@/components/PackingList";
import { TripForm } from "@/components/TripForm";
import { PackingItem } from "@/lib/packing";
import { tripStatus } from "@/lib/trip-style";

type ControlTrip = {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  notes: string;
  packingList: PackingItem[];
  itinerary: {
    id: string;
    day: number;
    title: string;
    time: string | null;
    notes: string | null;
  }[];
  expenses: {
    id: string;
    category: string;
    amount: number;
    currency: string;
    note: string | null;
  }[];
  bookings: {
    id: string;
    type: string;
    provider: string;
    confirmation: string | null;
    startDate: string | null;
    endDate: string | null;
    notes: string | null;
  }[];
  documents: {
    id: string;
    title: string;
    category: string;
    fileName: string;
    filePath: string;
  }[];
  expenseTotal: number;
  expenseByCategory: Record<string, number>;
};

type Tab = "overview" | "account" | "trips";
type TripTab = "details" | "itinerary" | "packing" | "expenses" | "bookings" | "documents";

export function ControlPanel({
  account,
  trips,
  stats,
}: {
  account: { name: string; email: string; hasPassword: boolean };
  trips: ControlTrip[];
  stats: {
    totalTrips: number;
    totalDays: number;
    destinations: number;
    expenses: number;
    bookings: number;
    documents: number;
  };
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(trips[0]?.id ?? "");
  const [tripTab, setTripTab] = useState<TripTab>("details");
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return trips;
    return trips.filter(
      (trip) =>
        trip.title.toLowerCase().includes(q) ||
        trip.destination.toLowerCase().includes(q),
    );
  }, [query, trips]);

  const selected = trips.find((trip) => trip.id === selectedId) ?? filtered[0] ?? null;

  async function deleteTrip(tripId: string) {
    setDeleting(true);
    const res = await fetch(`/api/trips/${tripId}`, { method: "DELETE" });
    setDeleting(false);
    if (!res.ok) return;
    if (selectedId === tripId) setSelectedId("");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["overview", "Overview"],
            ["trips", "Manage trips"],
            ["account", "Account"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              tab === id ? "bg-accent text-white" : "border border-line bg-surface hover:bg-accent-soft"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Trips" value={stats.totalTrips} />
            <Stat label="Travel days" value={stats.totalDays} />
            <Stat label="Destinations" value={stats.destinations} />
            <Stat label="Expenses" value={`$${stats.expenses.toFixed(0)}`} />
            <Stat label="Bookings" value={stats.bookings} />
            <Stat label="Documents" value={stats.documents} />
          </div>
          <div className="rounded-3xl border border-line bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Quick actions</h2>
              <Link href="/trips/new" className="text-sm text-accent underline">
                New trip
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {trips.slice(0, 6).map((trip) => (
                <button
                  key={trip.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(trip.id);
                    setTab("trips");
                  }}
                  className="rounded-2xl border border-line p-4 text-left hover:bg-accent-soft"
                >
                  <p className="font-medium">{trip.title}</p>
                  <p className="text-sm text-muted">{trip.destination}</p>
                </button>
              ))}
              {trips.length === 0 ? (
                <p className="text-sm text-muted">No trips yet. Create one to manage it here.</p>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {tab === "account" ? (
        <section className="rounded-3xl border border-line bg-surface p-6">
          <h2 className="mb-4 text-lg font-semibold">Account</h2>
          <AccountSettings
            name={account.name}
            email={account.email}
            hasPassword={account.hasPassword}
          />
        </section>
      ) : null}

      {tab === "trips" ? (
        <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="space-y-3 rounded-3xl border border-line bg-surface p-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search trips"
              className="w-full rounded-md border border-line px-3 py-2 text-sm"
            />
            <div className="max-h-[70vh] space-y-2 overflow-auto">
              {filtered.map((trip) => (
                <button
                  key={trip.id}
                  type="button"
                  onClick={() => setSelectedId(trip.id)}
                  className={`w-full rounded-2xl border px-3 py-3 text-left ${
                    selected?.id === trip.id
                      ? "border-accent bg-accent-soft"
                      : "border-line hover:bg-background"
                  }`}
                >
                  <p className="font-medium">{trip.title}</p>
                  <p className="text-xs text-muted">
                    {trip.destination} · {tripStatus(trip.startDate, trip.endDate)}
                  </p>
                </button>
              ))}
              {filtered.length === 0 ? (
                <p className="p-3 text-sm text-muted">No matching trips.</p>
              ) : null}
            </div>
            <Link
              href="/trips/new"
              className="block rounded-full bg-accent px-4 py-2 text-center text-sm font-medium text-white"
            >
              New trip
            </Link>
          </div>

          {selected ? (
            <div className="space-y-4 rounded-3xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">
                    {tripStatus(selected.startDate, selected.endDate)}
                  </p>
                  <h2 className="text-2xl font-semibold">{selected.title}</h2>
                  <p className="text-muted">
                    {selected.destination} · <LocaleDate value={selected.startDate} /> –{" "}
                    <LocaleDate value={selected.endDate} /> · {selected.totalDays} days
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/trips/${selected.id}`}
                    className="rounded-full border border-line px-4 py-2 text-sm"
                  >
                    Open page
                  </Link>
                  <button
                    type="button"
                    disabled={deleting}
                    onClick={() => deleteTrip(selected.id)}
                    className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-700"
                  >
                    {deleting ? "Deleting..." : "Delete trip"}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["details", "Details"],
                    ["itinerary", "Itinerary"],
                    ["packing", "Packing"],
                    ["expenses", "Expenses"],
                    ["bookings", "Bookings"],
                    ["documents", "Documents"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTripTab(id)}
                    className={`rounded-full px-3 py-1.5 text-sm ${
                      tripTab === id ? "bg-accent text-white" : "border border-line hover:bg-accent-soft"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {tripTab === "details" ? (
                <TripForm
                  key={`details-${selected.id}`}
                  tripId={selected.id}
                  redirectTo="/control"
                  initialValues={{
                    title: selected.title,
                    destination: selected.destination,
                    startDate: selected.startDate.slice(0, 10),
                    endDate: selected.endDate.slice(0, 10),
                    totalDays: selected.totalDays,
                    notes: selected.notes,
                  }}
                />
              ) : null}
              {tripTab === "itinerary" ? (
                <ItineraryBuilder
                  key={`itinerary-${selected.id}`}
                  tripId={selected.id}
                  totalDays={selected.totalDays}
                  items={selected.itinerary}
                />
              ) : null}
              {tripTab === "packing" ? (
                <PackingList
                  key={`packing-${selected.id}`}
                  tripId={selected.id}
                  items={selected.packingList}
                />
              ) : null}
              {tripTab === "expenses" ? (
                <ExpenseTracker
                  key={`expenses-${selected.id}`}
                  tripId={selected.id}
                  expenses={selected.expenses}
                  total={selected.expenseTotal}
                  byCategory={selected.expenseByCategory}
                />
              ) : null}
              {tripTab === "bookings" ? (
                <BookingManager
                  key={`bookings-${selected.id}`}
                  tripId={selected.id}
                  bookings={selected.bookings}
                />
              ) : null}
              {tripTab === "documents" ? (
                <DocumentVault
                  key={`documents-${selected.id}`}
                  tripId={selected.id}
                  documents={selected.documents}
                />
              ) : null}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-line p-8 text-center text-muted">
              Select a trip or create one to manage itinerary, packing, expenses, bookings, and documents.
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-3xl border border-line bg-surface p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
