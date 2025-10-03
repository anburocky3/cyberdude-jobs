import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = session.user.email;

  const apps = await prisma.application.findMany({
    where: { userEmail: email },
    orderBy: { createdAt: "desc" },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          type: true,
          slug: true,
          company: true,
        },
      },
      ScreeningNote: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          stage: true,
          verdict: true,
          score: true,
          notes: true,
          createdAt: true,
          createdBy: true,
        },
      },
    },
  });

  return NextResponse.json(
    apps.map((a) => ({
      id: a.id,
      createdAt: a.createdAt.toISOString(),
      job: a.job,
      currentStatus: a.currentStatus,
      interviewProcess: (a as unknown as { interviewProcess?: string })
        .interviewProcess,
      result: (a as unknown as { result?: string }).result,
      notes: a.ScreeningNote.map((n) => ({
        id: n.id,
        stage: n.stage,
        verdict: n.verdict,
        notes: n.notes,
        createdAt: n.createdAt.toISOString(),
      })),
    }))
  );
}
