import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getOwnedTrip } from "@/lib/trip-access";
import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

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

  const documents = await prisma.document.findMany({
    where: { tripId: id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(documents);
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

  const form = await req.formData();
  const file = form.get("file");
  const title = String(form.get("title") ?? "");
  const category = String(form.get("category") ?? "other");

  if (!(file instanceof File) || !title) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storedName = `${Date.now()}-${safeName}`;
  const dir = path.join(process.cwd(), "uploads", "trips", id);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, storedName), bytes);

  const document = await prisma.document.create({
    data: {
      tripId: id,
      title,
      category,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      filePath: `/api/trips/${id}/documents/file/${storedName}`,
    },
  });

  return NextResponse.json(document, { status: 201 });
}
