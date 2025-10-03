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
  const appId = parseInt(id);
  if (isNaN(appId)) {
    return NextResponse.json(
      { error: "Invalid application ID" },
      { status: 400 }
    );
  }

  try {
    const application = await prisma.application.findUnique({
      where: { id: appId },
      include: {
        job: { select: { id: true, title: true, type: true, slug: true } },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: application.id,
      jobId: application.jobId,
      job: application.job,
      userEmail: application.userEmail,
      userName: application.userName,
      profileImage: application.profileImage,
      gender: application.gender,
      dateOfBirth: application.dateOfBirth,
      mobileNo: application.mobileNo,
      currentStatus: application.currentStatus,
      country: application.country,
      state: application.state,
      city: application.city,
      linkedin: application.linkedin,
      portfolio: application.portfolio,
      educationSchool: application.educationSchool,
      educationSchoolPercentage: application.educationSchoolPercentage,
      educationCollege: application.educationCollege,
      educationCollegePercentage: application.educationCollegePercentage,
      workedAlready: application.workedAlready,
      companyName: application.companyName,
      skills: Array.isArray(application.skills)
        ? (application.skills as string[])
        : [],
      resumeUrl: application.resumeUrl,
      reasonToJoin: application.reasonToJoin,
      excitedAboutStartup: application.excitedAboutStartup,
      cameFrom: application.cameFrom,
      acceptCondition: application.acceptCondition,
      interviewProcess: application.interviewProcess,
      result: application.result,
      createdAt: application.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
