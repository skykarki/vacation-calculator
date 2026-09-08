import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getOwnedTrip } from "@/lib/trip-access";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; bookingId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, bookingId } = await params;
  const trip = await getOwnedTrip(id, session.user.id);
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking || booking.tripId !== id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      type: body.type ?? booking.type,
      provider: body.provider ?? booking.provider,
      confirmation:
        body.confirmation === undefined ? booking.confirmation : body.confirmation,
      startDate:
        body.startDate === undefined
          ? booking.startDate
          : body.startDate
            ? new Date(body.startDate)
            : null,
      endDate:
        body.endDate === undefined
          ? booking.endDate
          : body.endDate
            ? new Date(body.endDate)
            : null,
      notes: body.notes === undefined ? booking.notes : body.notes,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; bookingId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, bookingId } = await params;
  const trip = await getOwnedTrip(id, session.user.id);
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking || booking.tripId !== id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.booking.delete({ where: { id: bookingId } });
  return NextResponse.json({ success: true });
}
