import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type {
  Prisma,
  JobType,
  InterviewProcessStatus,
  ApplicationResult,
} from "@prisma/client";

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
  const genderParam = (searchParams.get("gender") || "").toLowerCase();
  const interiewProcessParam = (
    searchParams.get("interiewProcess") || ""
  ).toLowerCase();
  const resultParam = (searchParams.get("interviewResult") || "").toLowerCase();

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
    where.interviewProcess = interiewProcessParam as InterviewProcessStatus;
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

  const results = await prisma.application.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      job: { select: { id: true, title: true, type: true, slug: true } },
    },
  });

  const filtered = q
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

  // Build Excel
  const ExcelJS = await import("exceljs");
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Applications", {
    views: [{ state: "frozen", xSplit: 0, ySplit: 1 }],
  });

  const columns = [
    { header: "ID", key: "id" },
    { header: "CREATED_AT", key: "createdAt" },
    { header: "UPDATED_AT", key: "updatedAt" },
    { header: "JOB_ID", key: "jobId" },
    { header: "JOB_TITLE", key: "jobTitle" },
    { header: "JOB_TYPE", key: "jobType" },
    { header: "JOB_SLUG", key: "jobSlug" },
    { header: "USER_EMAIL", key: "userEmail" },
    { header: "USER_NAME", key: "userName" },
    { header: "IMAGE", key: "profileImage" },
    { header: "GENDER", key: "gender" },
    { header: "DATE_OF_BIRTH", key: "dateOfBirth" },
    { header: "MOBILE_NO", key: "mobileNo" },
    { header: "COUNTRY", key: "country" },
    { header: "STATE", key: "state" },
    { header: "CITY", key: "city" },
    { header: "CURRENT_STATUS", key: "currentStatus" },
    { header: "LINKEDIN", key: "linkedin" },
    { header: "PORTFOLIO", key: "portfolio" },
    { header: "EDUCATION_SCHOOL", key: "educationSchool" },
    { header: "EDUCATION_SCHOOL_PERCENTAGE", key: "educationSchoolPercentage" },
    { header: "EDUCATION_COLLEGE", key: "educationCollege" },
    {
      header: "EDUCATION_COLLEGE_PERCENTAGE",
      key: "educationCollegePercentage",
    },
    { header: "WORKED_ALREADY", key: "workedAlready" },
    { header: "COMPANY_NAME", key: "companyName" },
    { header: "SKILLS", key: "skills" },
    { header: "RESUME_URL", key: "resumeUrl" },
    { header: "REASON_TO_JOIN", key: "reasonToJoin" },
    { header: "EXCITED_ABOUT_STARTUP", key: "excitedAboutStartup" },
    { header: "CAME_FROM", key: "cameFrom" },
    { header: "ACCEPT_CONDITION", key: "acceptCondition" },
    { header: "TOTAL_SCORE", key: "totalScore" },
    { header: "INTERVIEW_PROCESS", key: "interviewProcess" },
    { header: "INTERVIEW_RESULT", key: "result" },
  ] as const;

  ws.columns = columns.map((c) => ({
    header: c.header,
    key: c.key,
    width: 20,
  }));

  // Header styling
  const header = ws.getRow(1);
  header.font = { bold: true };
  header.alignment = { vertical: "middle", horizontal: "center" };

  // Add rows
  filtered.forEach((a) => {
    ws.addRow({
      id: a.id,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
      jobId: a.jobId,
      jobTitle: a.job.title,
      jobType: a.job.type,
      jobSlug: a.job.slug,
      userEmail: a.userEmail,
      userName: a.userName || "",
      // Keep the cell text empty to avoid displaying long image URLs
      profileImage: "",
      gender: a.gender,
      dateOfBirth: a.dateOfBirth,
      mobileNo: a.mobileNo,
      country: a.country,
      state: a.state,
      city: a.city,
      currentStatus: a.currentStatus,
      linkedin: a.linkedin,
      portfolio: a.portfolio || "",
      educationSchool: a.educationSchool,
      educationSchoolPercentage: a.educationSchoolPercentage,
      educationCollege: a.educationCollege,
      educationCollegePercentage: a.educationCollegePercentage,
      workedAlready: a.workedAlready ? "Yes" : "No",
      companyName: a.companyName || "",
      skills: Array.isArray(a.skills) ? (a.skills as string[]).join(" | ") : "",
      resumeUrl: a.resumeUrl || "",
      reasonToJoin: a.reasonToJoin,
      excitedAboutStartup: a.excitedAboutStartup,
      cameFrom: a.cameFrom,
      acceptCondition: a.acceptCondition ? "Yes" : "No",
      totalScore: a.totalScore ?? "",
      interviewProcess: a.interviewProcess ?? "",
      result: a.result ?? "",
    });
  });

  // Wrap text and auto-fit-ish column widths
  ws.eachRow({ includeEmpty: false }, (row) => {
    row.alignment = { wrapText: true, vertical: "middle" };
  });
  type ColumnLike = {
    eachCell: (
      opts: { includeEmpty?: boolean },
      cb: (cell: { value?: unknown }) => void
    ) => void;
    width: number;
  };
  const cols = (ws as unknown as { columns?: ColumnLike[] }).columns || [];
  cols.forEach((column: ColumnLike) => {
    let max = 10;
    column.eachCell({ includeEmpty: false }, (cell: { value?: unknown }) => {
      const len = String(cell.value ?? "").length;
      if (len > max) max = Math.min(len, 60);
    });
    column.width = Math.max(12, Math.min(max + 2, 60));
  });

  // Attempt to embed profile images (small thumbnails)
  const imageColIndex = columns.findIndex((c) => c.key === "profileImage") + 1; // 1-based
  for (let i = 0; i < filtered.length; i++) {
    const rowIdx = i + 2; // header is row 1
    const url = filtered[i].profileImage;
    if (!url) continue;
    try {
      const resp = await fetch(url);
      if (!resp.ok) continue;
      const arr = await resp.arrayBuffer();
      const ext = (url.toLowerCase().endsWith(".png") ? "png" : "jpeg") as
        | "png"
        | "jpeg";
      const base64 = Buffer.from(new Uint8Array(arr as ArrayBuffer)).toString(
        "base64"
      );
      const imageId = wb.addImage({ base64, extension: ext });
      // Small avatar: 24x24 px anchored at cell top-left
      ws.addImage(imageId, {
        tl: { col: imageColIndex - 1, row: rowIdx - 1 },
        ext: { width: 24, height: 24 },
        editAs: "oneCell",
      } as unknown as import("exceljs").ImageRange);
      // Tweak cell size to comfortably show avatar and center-ish
      const row = ws.getRow(rowIdx);
      row.height = Math.max(row.height || 18, 28);
      const col = ws.getColumn(imageColIndex);
      col.width = Math.max(col.width || 6, 6);
    } catch {}
  }

  const buffer: ArrayBuffer = await wb.xlsx.writeBuffer();
  return new NextResponse(Buffer.from(buffer), {
    headers: {
      "content-type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "content-disposition": `attachment; filename=applications.xlsx`,
    },
  });
}
