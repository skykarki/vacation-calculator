import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getOwnedTrip } from "@/lib/trip-access";
import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; fileName: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, fileName } = await params;
  if (fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const trip = await getOwnedTrip(id, session.user.id);
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const document = await prisma.document.findFirst({
    where: {
      tripId: id,
      filePath: `/api/trips/${id}/documents/file/${fileName}`,
    },
  });
  if (!document) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const filePath = path.join(process.cwd(), "uploads", "trips", id, fileName);
  try {
    const data = await readFile(filePath);
    return new NextResponse(data, {
      headers: {
        "Content-Type": document.mimeType,
        "Content-Disposition": `inline; filename="${document.fileName}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
