import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!(session && session.user && session.user.isAdmin)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const items = await prisma.interviewAvailability.findMany({
    orderBy: { date: "asc" },
    include: {
      interviewslot: true,
    },
  });

  // Enrich slots with application + job metadata (no relation defined in schema)
  const appIds = Array.from(
    new Set(
      items
        .flatMap((it) => it.interviewslot)
        .map((s) => s.applicationId)
        .filter((v): v is number => typeof v === "number")
    )
  );
  let appsById: Record<
    number,
    { id: number; job: { id: number; slug: string; title: string } }
  > = {};
  if (appIds.length) {
    const apps = await prisma.application.findMany({
      where: { id: { in: appIds } },
      select: {
        id: true,
        job: { select: { id: true, slug: true, title: true } },
      },
    });
    appsById = Object.fromEntries(apps.map((a) => [a.id, a]));
  }

  const withRefs = items.map((it) => ({
    ...it,
    interviewslot: it.interviewslot.map((s) => ({
      ...s,
      application: s.applicationId ? appsById[s.applicationId] ?? null : null,
    })),
  }));

  return NextResponse.json(withRefs);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!(session && session.user && session.user.isAdmin)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const dateStr = String(body.date);
  const startStr = String(body.startTime);
  const endStr = String(body.endTime);
  const slotMinutes = Number(body.slotMinutes ?? 20);
  const date = new Date(dateStr);
  const startTime = new Date(startStr);
  const endTime = new Date(endStr);
  if (!(date instanceof Date) || isNaN(date.getTime()))
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  if (
    isNaN(startTime.getTime()) ||
    isNaN(endTime.getTime()) ||
    endTime <= startTime
  )
    return NextResponse.json({ error: "Invalid time window" }, { status: 400 });

  const created = await prisma.interviewAvailability.create({
    data: {
      date,
      startTime,
      endTime,
      slotMinutes,
      updatedAt: new Date(),
      createdAt: new Date(),
    },
  });
  // create slots
  const slots = [] as {
    availabilityId: number;
    startsAt: Date;
    endsAt: Date;
    updatedAt: Date;
    createdAt: Date;
  }[];
  let cursor = new Date(startTime);
  while (cursor < endTime) {
    const endsAt = new Date(cursor.getTime() + slotMinutes * 60 * 1000);
    if (endsAt > endTime) break;
    // Skip lunch window overlap (1:00 PM - 2:00 PM)
    const lunchStart = new Date(date);
    lunchStart.setHours(13, 0, 0, 0);
    const lunchEnd = new Date(date);
    lunchEnd.setHours(14, 0, 0, 0);
    const overlapsLunch = !(endsAt <= lunchStart || cursor >= lunchEnd);
    if (!overlapsLunch) {
      slots.push({
        availabilityId: created.id,
        startsAt: new Date(cursor),
        endsAt,
        updatedAt: new Date(),
        createdAt: new Date(),
      });
    }
    cursor = endsAt;
  }
  if (slots.length) {
    await prisma.interviewSlot.createMany({
      data: slots,
    });
  }
  const full = await prisma.interviewAvailability.findUnique({
    where: { id: created.id },
    include: { interviewslot: true },
  });
  return NextResponse.json(full, { status: 201 });
}
