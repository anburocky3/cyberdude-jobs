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
  const jobType = searchParams.get("jobType") || undefined;
  const jobIdParam = searchParams.get("jobId");
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;

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

  type Result = Prisma.ApplicationGetPayload<{
    include: {
      job: { select: { id: true; title: true; type: true; slug: true } };
    };
  }>;

  const results: Result[] = await prisma.application.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      job: { select: { id: true, title: true, type: true, slug: true } },
    },
  });

  const filtered = q
    ? results.filter((a) => {
        const hay = [a.userEmail, a.userName || "", a.job.title]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      })
    : results;

  const headers = [
    // Application meta
    "id",
    "created_at",
    "updated_at",
    // Job
    "job_id",
    "job_title",
    "job_type",
    "job_slug",
    // Applicant basics
    "user_email",
    "user_name",
    "profile_image",
    "gender",
    "date_of_birth",
    "mobile_no",
    // Location & status
    "country",
    "state",
    "city",
    "current_status",
    // Links
    "linkedin",
    "portfolio",
    // Education
    "education_school",
    "education_school_percentage",
    "education_college",
    "education_college_percentage",
    // Experience
    "worked_already",
    "company_name",
    // Skills & resume
    "skills",
    "resume_url",
    // Motivation
    "reason_to_join",
    "excited_about_startup",
    "came_from",
    // Consent
    "accept_condition",
  ];

  const rows = filtered.map((a) => [
    // Application meta
    a.id,
    a.createdAt.toISOString(),
    a.updatedAt.toISOString(),
    // Job
    a.jobId,
    a.job.title,
    a.job.type,
    a.job.slug,
    // Applicant basics
    a.userEmail,
    a.userName || "",
    a.profileImage || "",
    a.gender,
    a.dateOfBirth,
    a.mobileNo,
    // Location & status
    a.country,
    a.state,
    a.city,
    a.currentStatus,
    // Links
    a.linkedin,
    a.portfolio || "",
    // Education
    a.educationSchool,
    a.educationSchoolPercentage,
    a.educationCollege,
    a.educationCollegePercentage,
    // Experience
    a.workedAlready,
    a.companyName || "",
    // Skills & resume
    Array.isArray(a.skills) ? (a.skills as string[]).join("|") : "",
    a.resumeUrl || "",
    // Motivation
    a.reasonToJoin,
    a.excitedAboutStartup,
    a.cameFrom,
    // Consent
    a.acceptCondition,
  ]);
  const csv = [
    headers.join(","),
    ...rows.map((r) => r.map(escapeCsv).join(",")),
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename=applications.csv`,
    },
  });
}

function escapeCsv(val: unknown): string {
  const s = String(val ?? "");
  if (s.includes(",") || s.includes("\n") || s.includes('"')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}
