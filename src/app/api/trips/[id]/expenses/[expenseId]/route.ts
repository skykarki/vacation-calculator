import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getOwnedTrip } from "@/lib/trip-access";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; expenseId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, expenseId } = await params;
  const trip = await getOwnedTrip(id, session.user.id);
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const expense = await prisma.expense.findUnique({ where: { id: expenseId } });
  if (!expense || expense.tripId !== id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const updated = await prisma.expense.update({
    where: { id: expenseId },
    data: {
      category: body.category ?? expense.category,
      amount: typeof body.amount === "number" ? body.amount : expense.amount,
      currency: body.currency ?? expense.currency,
      note: body.note === undefined ? expense.note : body.note,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; expenseId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, expenseId } = await params;
  const trip = await getOwnedTrip(id, session.user.id);
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const expense = await prisma.expense.findUnique({ where: { id: expenseId } });
  if (!expense || expense.tripId !== id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.expense.delete({ where: { id: expenseId } });
  return NextResponse.json({ success: true });
}
