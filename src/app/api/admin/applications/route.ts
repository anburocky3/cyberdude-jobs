import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma, JobType } from "@prisma/client";

export async function GET(request: Request) {
  const session = await auth();
  if (!(session && session.user && session.user.isAdmin)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").toLowerCase();
  const jobType = searchParams.get("jobType") || undefined; // fulltime | internship
  const jobIdParam = searchParams.get("jobId");
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;
  const evaluated = searchParams.get("evaluated") || undefined; // 'yes' | 'no'

  const where: Prisma.ApplicationWhereInput = {};
  if (jobType) where.job = { is: { type: jobType as JobType } };
  if (jobIdParam) {
    const jobIdNum = Number(jobIdParam);
    if (!Number.isNaN(jobIdNum)) where.jobId = jobIdNum;
  }
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to + "T23:59:59");
  }

  const results = await prisma.application.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      job: { select: { id: true, title: true, type: true, slug: true } },
    },
  });

  let filtered = q
    ? results.filter((a) => {
        const hay = [
          a.userEmail,
          a.userName || "",
          a.job.title,
          a.currentStatus,
          a.country,
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      })
    : results;

  // Filter by evaluated state using totalScore presence
  if (evaluated === "yes") {
    filtered = filtered.filter((a) => a.totalScore != null);
  } else if (evaluated === "no") {
    filtered = filtered.filter((a) => a.totalScore == null);
  }

  return NextResponse.json(
    filtered.map((a) => ({
      id: a.id,
      jobId: a.jobId,
      job: a.job,
      userEmail: a.userEmail,
      userName: a.userName,
      profileImage: a.profileImage,
      currentStatus: a.currentStatus,
      country: a.country,
      totalScore: a.totalScore,
      createdAt: a.createdAt.toISOString(),
      skills: Array.isArray(a.skills) ? (a.skills as string[]) : [],
    }))
  );
}
