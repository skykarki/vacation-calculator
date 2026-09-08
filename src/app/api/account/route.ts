import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, createdAt: true, password: true },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    hasPassword: Boolean(user.password),
  });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const name = typeof body.name === "string" ? body.name.trim() : user.name;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : user.email;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  if (email !== user.email) {
    const taken = await prisma.user.findUnique({ where: { email } });
    if (taken) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
  }

  let password = user.password;
  if (body.newPassword) {
    if (typeof body.newPassword !== "string" || body.newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 },
      );
    }
    if (user.password) {
      if (!body.currentPassword) {
        return NextResponse.json({ error: "Current password is required" }, { status: 400 });
      }
      const valid = await bcrypt.compare(body.currentPassword, user.password);
      if (!valid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }
    }
    password = await bcrypt.hash(body.newPassword, 10);
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { name, email, password },
    select: { id: true, name: true, email: true },
  });

  return NextResponse.json(updated);
}
