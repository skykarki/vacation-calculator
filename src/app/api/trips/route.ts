import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { resolveTripDates } from "@/lib/date-utils";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const trips = await prisma.trip.findMany({
    where: { userId: session.user.id },
    orderBy: { startDate: "asc" },
  });

  return NextResponse.json(trips);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, destination, startDate, endDate, totalDays, notes } = await req.json();

  if (!title || !destination || !startDate || (!endDate && totalDays == null)) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  let start: Date;
  let end: Date;
  let duration;
  try {
    const resolved = resolveTripDates({ startDate, endDate, totalDays });
    start = resolved.start;
    end = resolved.end;
    duration = resolved.duration;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid dates" },
      { status: 400 },
    );
  }

  const trip = await prisma.trip.create({
    data: {
      title,
      destination,
      startDate: start,
      endDate: end,
      totalDays: duration.totalDays,
      notes,
      userId: session.user.id,
    },
  });

  return NextResponse.json(trip, { status: 201 });
}
