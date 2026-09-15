import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getOwnedTrip } from "@/lib/trip-access";
import { CabinClass, formatAirport, getBookingSite, searchFlightDeals } from "@/lib/flights";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const tripId = typeof body.tripId === "string" ? body.tripId : "";
  const siteId = typeof body.siteId === "string" ? body.siteId : "";
  const origin = typeof body.origin === "string" ? body.origin : "";
  const destination = typeof body.destination === "string" ? body.destination : "";
  const date = typeof body.date === "string" ? body.date : "";
  const returnDate = typeof body.returnDate === "string" ? body.returnDate : "";
  const cabin = (body.cabin || "economy") as CabinClass;
  const passengers = Number(body.passengers || 1);
  const passengerName =
    typeof body.passengerName === "string" && body.passengerName.trim()
      ? body.passengerName.trim()
      : session.user.name || session.user.email || "Traveler";

  if (!tripId || !siteId || !origin || !destination || !date) {
    return NextResponse.json(
      { error: "Trip, route, and booking site are required" },
      { status: 400 },
    );
  }

  const trip = await getOwnedTrip(tripId, session.user.id);
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let deals;
  try {
    deals = searchFlightDeals({
      origin,
      destination,
      date,
      returnDate,
      cabin,
      passengers,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid flight search" },
      { status: 400 },
    );
  }

  const site = getBookingSite(siteId, {
    origin,
    destination,
    date,
    returnDate,
    cabin,
    passengers,
  });
  if (!site) {
    return NextResponse.json({ error: "Booking site not found" }, { status: 404 });
  }

  const booking = await prisma.booking.create({
    data: {
      tripId,
      type: "flight",
      provider: site.name,
      confirmation: site.website,
      origin: formatAirport(deals.origin),
      destination: formatAirport(deals.destination),
      flightNumber: site.label,
      cabin,
      passengers,
      passengerName,
      startDate: new Date(`${date}T00:00:00.000Z`),
      endDate: returnDate
        ? new Date(`${returnDate}T00:00:00.000Z`)
        : new Date(`${date}T00:00:00.000Z`),
      notes: `Book on ${site.website}: ${site.url}`,
    },
  });

  return NextResponse.json({ booking, url: site.url }, { status: 201 });
}
