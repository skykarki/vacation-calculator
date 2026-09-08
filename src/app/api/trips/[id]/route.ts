import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { resolveTripDates, toIsoDate } from "@/lib/date-utils";
import { NextResponse } from "next/server";
import { getOwnedTrip } from "@/lib/trip-access";

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

  return NextResponse.json(trip);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getOwnedTrip(id, session.user.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  let start = existing.startDate;
  let end = existing.endDate;
  let totalDays = existing.totalDays;

  if (body.startDate || body.endDate || body.totalDays != null) {
    try {
      const resolved = resolveTripDates({
        startDate: body.startDate ?? toIsoDate(existing.startDate),
        endDate: body.endDate,
        totalDays: body.totalDays ?? existing.totalDays,
      });
      start = resolved.start;
      end = resolved.end;
      totalDays = resolved.totalDays;
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Invalid dates" },
        { status: 400 },
      );
    }
  }

  const trip = await prisma.trip.update({
    where: { id },
    data: {
      title: body.title ?? existing.title,
      destination: body.destination ?? existing.destination,
      startDate: start,
      endDate: end,
      totalDays,
      notes: body.notes ?? existing.notes,
      packingList: body.packingList ?? existing.packingList,
    },
  });

  return NextResponse.json(trip);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getOwnedTrip(id, session.user.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.trip.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
