import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { summarizeExpenses } from "@/lib/trip-stats";
import { parsePackingList } from "@/lib/packing";
import { ItineraryBuilder } from "@/components/ItineraryBuilder";
import { PackingList } from "@/components/PackingList";
import { ExpenseTracker } from "@/components/ExpenseTracker";
import { BookingManager } from "@/components/BookingManager";
import { DocumentVault } from "@/components/DocumentVault";
import { LocaleDate } from "@/components/LocaleDate";

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      itinerary: { orderBy: [{ day: "asc" }, { time: "asc" }] },
      expenses: true,
      bookings: { orderBy: { createdAt: "asc" } },
      documents: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!trip || trip.userId !== session.user.id) {
    notFound();
  }

  const packingList = parsePackingList(trip.packingList);
  const budget = summarizeExpenses(trip.expenses);

  return (
    <main className="mx-auto max-w-3xl space-y-8 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{trip.title}</h1>
          <p className="text-zinc-600 dark:text-zinc-400">{trip.destination}</p>
        </div>
        <Link
          href={`/trips/${trip.id}/edit`}
          className="rounded bg-black px-4 py-2 text-sm text-white"
        >
          Edit
        </Link>
      </div>
      <div className="rounded-lg border p-4 text-sm">
        <p>
          <LocaleDate value={trip.startDate.toISOString()} /> –{" "}
          <LocaleDate value={trip.endDate.toISOString()} />
        </p>
        <p>{trip.totalDays} days</p>
        {trip.notes ? <p className="mt-2 text-zinc-600">{trip.notes}</p> : null}
      </div>
      <ItineraryBuilder
        tripId={trip.id}
        totalDays={trip.totalDays}
        items={trip.itinerary}
      />
      <PackingList tripId={trip.id} items={packingList} />
      <ExpenseTracker
        tripId={trip.id}
        expenses={trip.expenses}
        total={budget.total}
        byCategory={budget.byCategory}
      />
      <BookingManager
        tripId={trip.id}
        bookings={trip.bookings.map((booking) => ({
          ...booking,
          startDate: booking.startDate?.toISOString() ?? null,
          endDate: booking.endDate?.toISOString() ?? null,
        }))}
      />
      <DocumentVault tripId={trip.id} documents={trip.documents} />
    </main>
  );
}
