import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getOwnedTrip } from "@/lib/trip-access";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, itemId } = await params;
  const trip = await getOwnedTrip(id, session.user.id);
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const item = await prisma.itineraryItem.findUnique({ where: { id: itemId } });
  if (!item || item.tripId !== id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const updated = await prisma.itineraryItem.update({
    where: { id: itemId },
    data: {
      day: body.day ?? item.day,
      title: body.title ?? item.title,
      time: body.time === undefined ? item.time : body.time,
      notes: body.notes === undefined ? item.notes : body.notes,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, itemId } = await params;
  const trip = await getOwnedTrip(id, session.user.id);
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const item = await prisma.itineraryItem.findUnique({ where: { id: itemId } });
  if (!item || item.tripId !== id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.itineraryItem.delete({ where: { id: itemId } });
  return NextResponse.json({ success: true });
}
