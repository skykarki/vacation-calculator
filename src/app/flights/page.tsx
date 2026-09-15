import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { FlightSearch } from "@/components/FlightSearch";
import { toIsoDate } from "@/lib/date-utils";

export default async function FlightsPage({
  searchParams,
}: {
  searchParams: Promise<{ tripId?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { tripId } = await searchParams;
  const trips = await prisma.trip.findMany({
    where: { userId: session.user.id },
    orderBy: { startDate: "asc" },
    select: {
      id: true,
      title: true,
      destination: true,
      startDate: true,
    },
  });

  const selectedTrip = trips.find((trip) => trip.id === tripId) ?? trips[0];

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-8">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-muted">Air tickets</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Book a flight</h1>
        <p className="mt-2 text-muted">
          Search any city or airport name, then book on Google Flights, Skyscanner, Kayak, or official airline sites.
        </p>
      </div>
      <FlightSearch
        trips={trips.map((trip) => ({
          id: trip.id,
          title: trip.title,
          destination: trip.destination,
          startDate: trip.startDate.toISOString(),
        }))}
        defaultTripId={selectedTrip?.id}
        defaultDate={selectedTrip ? toIsoDate(selectedTrip.startDate) : ""}
      />
    </main>
  );
}
