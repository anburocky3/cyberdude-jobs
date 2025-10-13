import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { join } from "path";
import { writeFile, mkdir } from "fs/promises";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") || "";
  let fields: Record<string, unknown> = {};
  let resumeUrl: string | undefined;

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    form.forEach((value, key) => {
      if (value instanceof File) return; // handled separately
      try {
        const maybeParsed = JSON.parse(String(value));
        fields[key] = maybeParsed;
      } catch {
        fields[key] = String(value);
      }
    });

    const resume = form.get("resume") as File | null;
    if (resume && typeof resume.stream === "function") {
      const ext = (resume.name.split(".").pop() || "pdf").toLowerCase();
      const filename = `${randomUUID()}.${ext}`;
      const arrayBuffer = await resume.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      if (process.env.VERCEL) {
        const uploaded = await put(`resumes/${filename}`, buffer, {
          access: "public",
          contentType: resume.type || "application/pdf",
        });
        resumeUrl = uploaded.url;
      } else {
        const uploadsDir = join(process.cwd(), "public", "uploads");
        await mkdir(uploadsDir, { recursive: true });
        const filePath = join(uploadsDir, filename);
        await writeFile(filePath, buffer);
        resumeUrl = `/uploads/${filename}`;
      }
    }
  } else {
    // Fallback JSON body (older clients)
    try {
      fields = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
  }

  const jobId = Number(fields.jobId);
  if (!jobId || Number.isNaN(jobId)) {
    return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
  }

  try {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    const isExpired = job.status === "expired";
    const deadlinePassed = job.applicationDeadline
      ? new Date(job.applicationDeadline) < new Date()
      : false;
    if (isExpired || deadlinePassed) {
      return NextResponse.json(
        {
          error:
            "Application has closed. Please check the CyberDude website for future recruitment.",
        },
        { status: 400 }
      );
    }

    const created = await prisma.application.create({
      data: {
        jobId,
        userEmail: session.user.email!,
        userName: session.user.name ?? null,
        profileImage:
          (session.user as { image?: string; picture?: string } | undefined)
            ?.image ||
          (session.user as { image?: string; picture?: string } | undefined)
            ?.picture ||
          null,
        gender: String(fields.gender),
        dateOfBirth: String(fields.dateOfBirth),
        mobileNo: String(fields.mobileNo),
        currentStatus: String(fields.currentStatus),
        country: String(fields.country),
        state: String(fields.state),
        city: String(fields.city),
        linkedin: String(fields.linkedin),
        portfolio: fields.portfolio ? String(fields.portfolio) : null,
        educationSchool: String(fields.educationSchool),
        educationSchoolPercentage: Number(fields.educationSchoolPercentage),
        educationCollege: String(fields.educationCollege),
        educationCollegePercentage: Number(fields.educationCollegePercentage),
        workedAlready:
          String(fields.workedAlready) === "true" ||
          fields.workedAlready === true,
        companyName: fields.companyName ? String(fields.companyName) : null,
        skills: Array.isArray(fields.skills)
          ? fields.skills
          : (() => {
              try {
                const parsed = JSON.parse(String(fields.skills ?? "[]"));
                return Array.isArray(parsed) ? parsed : [];
              } catch {
                return [];
              }
            })(),
        resumeUrl:
          resumeUrl ?? (fields.resumeUrl ? String(fields.resumeUrl) : null),
        reasonToJoin: String(fields.reasonToJoin),
        excitedAboutStartup: String(fields.excitedAboutStartup),
        cameFrom: String(fields.cameFrom),
        acceptCondition:
          String(fields.acceptCondition) === "true" ||
          fields.acceptCondition === true,
        updatedAt: new Date(),
        createdAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true, id: created.id });
  } catch (err: unknown) {
    console.error("Failed to save application", err);
    return NextResponse.json(
      { error: "Failed to save application" },
      { status: 500 }
    );
  }
}
