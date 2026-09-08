import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parsePackingList } from "@/lib/packing";
import { summarizeExpenses } from "@/lib/trip-stats";
import { ControlPanel } from "@/components/ControlPanel";

export default async function ControlPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const [user, trips] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, password: true },
    }),
    prisma.trip.findMany({
      where: { userId: session.user.id },
      orderBy: { startDate: "asc" },
      include: {
        itinerary: { orderBy: [{ day: "asc" }, { time: "asc" }] },
        expenses: true,
        bookings: { orderBy: { createdAt: "asc" } },
        documents: { orderBy: { createdAt: "desc" } },
      },
    }),
  ]);

  if (!user) redirect("/login");

  const serialized = trips.map((trip) => {
    const budget = summarizeExpenses(trip.expenses);
    return {
      id: trip.id,
      title: trip.title,
      destination: trip.destination,
      startDate: trip.startDate.toISOString(),
      endDate: trip.endDate.toISOString(),
      totalDays: trip.totalDays,
      notes: trip.notes ?? "",
      packingList: parsePackingList(trip.packingList),
      itinerary: trip.itinerary,
      expenses: trip.expenses,
      bookings: trip.bookings.map((booking) => ({
        ...booking,
        startDate: booking.startDate?.toISOString() ?? null,
        endDate: booking.endDate?.toISOString() ?? null,
      })),
      documents: trip.documents,
      expenseTotal: budget.total,
      expenseByCategory: budget.byCategory,
    };
  });

  const stats = {
    totalTrips: trips.length,
    totalDays: trips.reduce((sum, trip) => sum + trip.totalDays, 0),
    destinations: new Set(trips.map((trip) => trip.destination)).size,
    expenses: serialized.reduce((sum, trip) => sum + trip.expenseTotal, 0),
    bookings: trips.reduce((sum, trip) => sum + trip.bookings.length, 0),
    documents: trips.reduce((sum, trip) => sum + trip.documents.length, 0),
  };

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-muted">Control panel</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Full access</h1>
        <p className="mt-2 text-muted">
          Manage account, trips, itineraries, packing, expenses, bookings, and documents.
        </p>
      </div>
      <ControlPanel
        account={{
          name: user.name ?? "",
          email: user.email,
          hasPassword: Boolean(user.password),
        }}
        trips={serialized}
        stats={stats}
      />
    </main>
  );
}
