import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getOwnedTrip } from "@/lib/trip-access";
import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; documentId: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, documentId } = await params;
  const trip = await getOwnedTrip(id, session.user.id);
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const document = await prisma.document.findUnique({ where: { id: documentId } });
  if (!document || document.tripId !== id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const storedName = document.filePath.split("/").pop();
  if (storedName) {
    const filePath = path.join(process.cwd(), "uploads", "trips", id, storedName);
    try {
      await unlink(filePath);
    } catch {
      // File may already be gone.
    }
  }

  await prisma.document.delete({ where: { id: documentId } });
  return NextResponse.json({ success: true });
}
