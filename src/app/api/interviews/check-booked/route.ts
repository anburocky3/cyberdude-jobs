import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const applicationId = Number(searchParams.get("applicationId"));
  if (!applicationId)
    return NextResponse.json(
      { error: "applicationId required" },
      { status: 400 }
    );

  const existing = await prisma.interviewSlot.findFirst({
    where: { applicationId },
    select: { id: true, startsAt: true, endsAt: true },
  });
  return NextResponse.json({ booked: !!existing, slot: existing ?? null });
}
