import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type {
  Prisma,
  JobType,
  ApplicationInterviewProcess,
  ApplicationResult,
} from "@prisma/client";

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
  const sort = searchParams.get("sort") || "created_desc"; // created_desc|created_asc|score_desc|score_asc|process|result|gender_asc|gender_desc
  const genderParam = (searchParams.get("gender") || "").toLowerCase(); // male|female|other
  const interiewProcessParam = (
    searchParams.get("interiewProcess") || ""
  ).toLowerCase(); // pending|started|in_progress|completed
  const resultParam = (searchParams.get("interviewResult") || "").toLowerCase(); // pending|hired|hold|reject
  const where: Prisma.ApplicationWhereInput = {};
  if (jobType) where.job = { is: { type: jobType as JobType } };
  if (jobIdParam) {
    const jobIdNum = Number(jobIdParam);
    if (!Number.isNaN(jobIdNum)) where.jobId = jobIdNum;
  }
  if (genderParam && ["male", "female", "other"].includes(genderParam)) {
    where.gender = genderParam;
  }
  if (
    interiewProcessParam &&
    ["pending", "started", "in_progress", "completed"].includes(
      interiewProcessParam
    )
  ) {
    where.interviewProcess =
      interiewProcessParam as ApplicationInterviewProcess;
  }
  if (
    resultParam &&
    ["pending", "hired", "hold", "reject"].includes(resultParam)
  ) {
    where.result = resultParam as ApplicationResult;
  }
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lte = new Date(to + "T23:59:59");
  }

  const orderBy = (() => {
    switch (sort) {
      case "created_asc":
        return { createdAt: "asc" as const };
      case "score_desc":
        return [
          { totalScore: "desc" as const },
          { createdAt: "desc" as const },
        ];
      case "score_asc":
        return [{ totalScore: "asc" as const }, { createdAt: "desc" as const }];
      case "process":
        return [
          { interviewProcess: "asc" as const },
          { createdAt: "desc" as const },
        ];
      case "result":
        return [{ result: "asc" as const }, { createdAt: "desc" as const }];
      case "created_desc":
      default:
        return { createdAt: "desc" as const };
    }
  })();

  const results = await prisma.application.findMany({
    where,
    orderBy: orderBy as Prisma.ApplicationOrderByWithRelationInput,
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
      gender: (a as unknown as { gender?: string }).gender,
      profileImage: a.profileImage,
      currentStatus: a.currentStatus,
      country: a.country,
      totalScore: a.totalScore,
      createdAt: a.createdAt.toISOString(),
      skills: Array.isArray(a.skills) ? (a.skills as string[]) : [],
    }))
  );
}
