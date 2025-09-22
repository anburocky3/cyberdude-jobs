import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { jobId } = await request.json();
  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
  }

  // Here you can persist application to a DB or send an email/Slack message
  console.log("Application received", { jobId, applicant: session.user });

  return NextResponse.json({ ok: true });
}
