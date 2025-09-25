import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!(session && session.user && session.user.isAdmin)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Group applications by job and join job meta
  const grouped = await prisma.application.groupBy({
    by: ["jobId"],
    _count: { id: true },
  });

  const jobIds = grouped.map((g) => g.jobId);
  const jobs = await prisma.job.findMany({
    where: { id: { in: jobIds } },
    select: { id: true, title: true, type: true, slug: true },
  });

  const jobMap = new Map(jobs.map((j) => [j.id, j]));

  const payload = grouped
    .map((g) => ({
      jobId: g.jobId,
      count: g._count.id,
      job: jobMap.get(g.jobId) || null,
    }))
    // ensure stable order by job title
    .sort((a, b) => (a.job?.title || "").localeCompare(b.job?.title || ""));

  return NextResponse.json(payload);
}
