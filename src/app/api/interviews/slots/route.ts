import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Get available slots for a date (query: date=YYYY-MM-DD)
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  if (date) {
    const day = new Date(date);
    if (isNaN(day.getTime()))
      return NextResponse.json({ error: "invalid date" }, { status: 400 });

    const items = await prisma.interviewSlot.findMany({
      where: {
        interviewavailability: {
          date: {
            gte: new Date(day.toDateString()),
            lt: new Date(
              new Date(day.toDateString()).getTime() + 24 * 60 * 60 * 1000
            ),
          },
        },
      },
      orderBy: { startsAt: "asc" },
    });
    return NextResponse.json(items);
  }

  // No date provided: return all upcoming slots with availability date for grouping
  const startOfToday = new Date(new Date().toDateString());
  const items = await prisma.interviewSlot.findMany({
    where: {
      interviewavailability: {
        date: { gte: startOfToday },
      },
    },
    include: { interviewavailability: { select: { date: true } } },
    orderBy: [{ interviewavailability: { date: "asc" } }, { startsAt: "asc" }],
  });
  return NextResponse.json(items);
}

// Book a slot
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const slotId = Number(body.slotId);
  const applicationId = body.applicationId ? Number(body.applicationId) : null;
  if (!slotId)
    return NextResponse.json({ error: "slotId required" }, { status: 400 });

  // Enforce: one scheduled slot per application
  if (applicationId) {
    const existing = await prisma.interviewSlot.findFirst({
      where: { applicationId },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json(
        { error: "This application already has a scheduled slot" },
        { status: 409 }
      );
    }
  }

  // Atomic booking
  const updated = await prisma.interviewSlot.updateMany({
    where: { id: slotId, bookedByEmail: null },
    data: {
      bookedByEmail: session.user.email,
      applicationId: applicationId ?? undefined,
    },
  });
  if (updated.count === 0) {
    return NextResponse.json({ error: "Slot already booked" }, { status: 409 });
  }
  const slot = await prisma.interviewSlot.findUnique({ where: { id: slotId } });
  return NextResponse.json(slot);
}
