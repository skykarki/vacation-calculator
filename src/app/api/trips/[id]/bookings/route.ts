import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getOwnedTrip } from "@/lib/trip-access";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const trip = await getOwnedTrip(id, session.user.id);
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const bookings = await prisma.booking.findMany({
    where: { tripId: id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(bookings);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const trip = await getOwnedTrip(id, session.user.id);
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { type, provider, confirmation, startDate, endDate, notes } = await req.json();
  if (!type || !provider) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const booking = await prisma.booking.create({
    data: {
      tripId: id,
      type,
      provider,
      confirmation,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      notes,
    },
  });

  return NextResponse.json(booking, { status: 201 });
}
