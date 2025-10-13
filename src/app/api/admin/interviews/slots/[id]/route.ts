import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!(session && session.user && session.user.isAdmin)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = await request.json();
  const startsAtStr = String(body.startsAt ?? "");
  const endsAtStr = String(body.endsAt ?? "");
  const startsAt = new Date(startsAtStr);
  const endsAt = new Date(endsAtStr);
  if (
    isNaN(startsAt.getTime()) ||
    isNaN(endsAt.getTime()) ||
    endsAt <= startsAt
  ) {
    return NextResponse.json({ error: "Invalid time range" }, { status: 400 });
  }

  const slot = await prisma.interviewSlot.findUnique({ where: { id } });
  if (!slot) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (slot.bookedByEmail) {
    return NextResponse.json(
      { error: "Cannot edit a booked slot" },
      { status: 409 }
    );
  }

  const updated = await prisma.interviewSlot.update({
    where: { id },
    data: { startsAt, endsAt, updatedAt: new Date() },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!(session && session.user && session.user.isAdmin)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const slot = await prisma.interviewSlot.findUnique({ where: { id } });
  if (!slot) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (slot.bookedByEmail) {
    return NextResponse.json(
      { error: "Cannot delete a booked slot" },
      { status: 409 }
    );
  }

  await prisma.interviewSlot.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
