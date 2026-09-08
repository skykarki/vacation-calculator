import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
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
  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip || trip.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const expenses = await prisma.expense.findMany({
    where: { tripId: id },
    orderBy: { id: "asc" },
  });

  return NextResponse.json(expenses);
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
  const trip = await prisma.trip.findUnique({ where: { id } });
  if (!trip || trip.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { category, amount, currency, note } = await req.json();
  if (!category || typeof amount !== "number") {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const expense = await prisma.expense.create({
    data: {
      tripId: id,
      category,
      amount,
      currency: currency || "USD",
      note,
    },
  });

  return NextResponse.json(expense, { status: 201 });
}
