import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Calculate and update total score when all stages are complete
async function calculateAndUpdateTotalScore(applicationId: number) {
  const stages = ["hr", "technical", "manager", "team", "reference"];

  // Get all screening notes for this application
  const allNotes = await prisma.screeningNote.findMany({
    where: { applicationId },
  });

  // Group by stage and get the latest note for each stage
  const stageScores: Record<string, number> = {};
  stages.forEach((stage) => {
    const stageNotes = allNotes
      .filter((note) => note.stage === stage)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    if (stageNotes.length > 0 && stageNotes[0].score !== null) {
      stageScores[stage] = stageNotes[0].score!;
    }
  });

  // Check if all stages have scores
  const completedStages = Object.keys(stageScores);

  if (completedStages.length === stages.length) {
    // Calculate weighted average (all stages have equal weight)
    const totalScore = Math.round(
      Object.values(stageScores).reduce((sum, score) => sum + score, 0) /
        stages.length
    );

    // Update the application with total score
    await prisma.application.update({
      where: { id: applicationId },
      data: { totalScore },
    });
  }
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!(session && session.user && session.user.isAdmin)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  const appId = Number(id);
  if (Number.isNaN(appId)) {
    return NextResponse.json(
      { error: "Invalid application ID" },
      { status: 400 }
    );
  }
  const notes = await prisma.screeningNote.findMany({
    where: { applicationId: appId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(notes);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!(session && session.user && session.user.isAdmin)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  const appId = Number(id);
  if (Number.isNaN(appId)) {
    return NextResponse.json(
      { error: "Invalid application ID" },
      { status: 400 }
    );
  }
  const body = await request.json();
  const stage = String(body.stage || "hr");
  const verdict = body.verdict ? String(body.verdict) : null;
  const score = body.score != null ? Number(body.score) : null;
  const notes = body.notes ? String(body.notes) : null;
  const createdBy = session.user?.email || session.user?.name || "admin";

  // Only one evaluation per stage: update if exists, else create
  const existing = await prisma.screeningNote.findFirst({
    where: { applicationId: appId, stage },
    orderBy: { createdAt: "desc" },
  });

  let result;
  if (existing) {
    result = await prisma.screeningNote.update({
      where: { id: existing.id },
      data: { verdict, score, notes, createdBy },
    });
  } else {
    result = await prisma.screeningNote.create({
      data: { applicationId: appId, stage, verdict, score, notes, createdBy },
    });
  }

  // Calculate total score if all stages are complete
  await calculateAndUpdateTotalScore(appId);

  // Auto-progress interview process
  try {
    const allStages = ["hr", "technical", "manager", "team", "reference"]; // keep in sync
    const latestPerStage = await prisma.screeningNote.groupBy({
      by: ["stage"],
      where: { applicationId: appId },
      _max: { createdAt: true },
    });
    const completedCount = latestPerStage.filter((g) =>
      allStages.includes(g.stage)
    ).length;
    await prisma.application.update({
      where: { id: appId },
      data: {
        interviewProcess:
          completedCount >= allStages.length
            ? "completed"
            : completedCount > 0
            ? "in_progress"
            : "started",
      },
    });
  } catch (e) {
    // best effort; ignore
  }

  return NextResponse.json(result, { status: existing ? 200 : 201 });
}
