import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  getNextUpcomingTripFromTrips,
  getYearlyTravelStatsFromTrips,
} from "@/lib/trip-stats";
import { TripCard } from "@/components/TripCard";
import { TripCalendar } from "@/components/TripCalendar";
import { LocaleDate } from "@/components/LocaleDate";
import { redirect } from "next/navigation";
import { differenceInCalendarDays } from "date-fns";
import { tripPalette } from "@/lib/trip-style";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const currentYear = new Date().getFullYear();
  const trips = await prisma.trip.findMany({
    where: { userId },
    orderBy: { startDate: "asc" },
    select: {
      id: true,
      title: true,
      destination: true,
      startDate: true,
      endDate: true,
      totalDays: true,
    },
  });

  const stats = getYearlyTravelStatsFromTrips(trips, currentYear);
  const nextTrip = getNextUpcomingTripFromTrips(trips);
  const daysUntilNext = nextTrip
    ? differenceInCalendarDays(nextTrip.startDate, new Date())
    : null;
  const nextPalette = nextTrip
    ? tripPalette(`${nextTrip.title}-${nextTrip.destination}`)
    : ["#0f766e", "#115e59"];

  const calendarTrips = trips.map((trip) => ({
    id: trip.id,
    title: trip.title,
    destination: trip.destination,
    startDate: trip.startDate.toISOString(),
    endDate: trip.endDate.toISOString(),
  }));

  const firstName = session.user.name?.split(" ")[0] || session.user.email?.split("@")[0];

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted">Travel desk</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
            Hello{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="mt-2 max-w-xl text-muted">
            Your trips, countdown, and calendar in one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/control"
            className="inline-flex w-fit rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium hover:bg-accent-soft"
          >
            Control panel
          </Link>
          <Link
            href="/trips/new"
            className="inline-flex w-fit rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-90"
          >
            Plan a trip
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label={`Days in ${currentYear}`}
          value={stats.totalDays}
          hint="Inclusive travel days"
        />
        <StatCard label="Trips this year" value={stats.totalTrips} hint="Counted by start date" />
        <StatCard
          label="Destinations"
          value={stats.uniqueDestinations}
          hint="Unique places visited"
        />
      </section>

      {nextTrip ? (
        <section
          className="overflow-hidden rounded-3xl p-6 text-white shadow-sm"
          style={{
            background: `linear-gradient(135deg, ${nextPalette[0]}, ${nextPalette[1]})`,
          }}
        >
          <p className="text-xs uppercase tracking-[0.22em] text-white/80">Next departure</p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{nextTrip.title}</h2>
              <p className="text-white/85">{nextTrip.destination}</p>
            </div>
            <div className="text-sm sm:text-right">
              <p className="text-3xl font-semibold">
                {daysUntilNext === 0 ? "Today" : `${daysUntilNext} days`}
              </p>
              <p className="text-white/80">
                {nextTrip.totalDays} day trip · <LocaleDate value={nextTrip.startDate.toISOString()} />
              </p>
            </div>
          </div>
          <Link
            href={`/trips/${nextTrip.id}`}
            className="mt-5 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-medium hover:bg-white/25"
          >
            Open itinerary
          </Link>
        </section>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <TripCalendar trips={calendarTrips} />
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">All trips</h2>
            <p className="text-sm text-muted">{trips.length} total</p>
          </div>
          {trips.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-line bg-surface p-8 text-center">
              <p className="font-medium">No trips yet</p>
              <p className="mt-1 text-sm text-muted">Start with a destination and a day count.</p>
              <Link
                href="/trips/new"
                className="mt-4 inline-flex rounded-full bg-accent px-4 py-2 text-sm font-medium text-white"
              >
                Create your first trip
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {trips.map((trip) => (
                <TripCard
                  key={trip.id}
                  id={trip.id}
                  title={trip.title}
                  destination={trip.destination}
                  startDate={trip.startDate.toISOString()}
                  endDate={trip.endDate.toISOString()}
                  totalDays={trip.totalDays}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div className="rounded-3xl border border-line bg-surface p-5 shadow-sm">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}
