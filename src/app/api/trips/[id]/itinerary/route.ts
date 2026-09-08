import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

async function verifyOwnership(tripId: string, userId: string) {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  return trip && trip.userId === userId;
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
  const owns = await verifyOwnership(id, session.user.id);
  if (!owns) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { day, title, time, notes } = await req.json();
  if (!day || !title) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const item = await prisma.itineraryItem.create({
    data: { tripId: id, day, title, time, notes },
  });

  return NextResponse.json(item, { status: 201 });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const owns = await verifyOwnership(id, session.user.id);
  if (!owns) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const items = await prisma.itineraryItem.findMany({
    where: { tripId: id },
    orderBy: [{ day: "asc" }, { time: "asc" }],
  });

  return NextResponse.json(items);
}
