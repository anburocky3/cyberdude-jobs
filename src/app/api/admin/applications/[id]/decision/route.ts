import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
  const application = await prisma.application.findUnique({
    where: { id: appId },
    select: { id: true, interviewProcess: true, result: true },
  });
  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(application);
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
  const interviewProcess = body.interviewProcess as
    | "started"
    | "in_progress"
    | "completed"
    | undefined;
  const result = body.result as
    | "pending"
    | "hired"
    | "hold"
    | "reject"
    | undefined;

  const updated = await prisma.application.update({
    where: { id: appId },
    data: {
      ...(interviewProcess ? { interviewProcess } : {}),
      ...(result ? { result } : {}),
      // If making a final decision, ensure interview process is completed
      ...(result && result !== "hold"
        ? { interviewProcess: "completed" as const }
        : {}),
    },
    select: { id: true, interviewProcess: true, result: true },
  });

  // Optional webhook notification
  if (result) {
    const webhook = process.env.DECISION_WEBHOOK_URL;
    if (webhook) {
      try {
        await fetch(webhook, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            applicationId: appId,
            result,
            interviewProcess: updated.interviewProcess,
            at: new Date().toISOString(),
          }),
        });
      } catch {}
    }
  }

  return NextResponse.json(updated);
}
