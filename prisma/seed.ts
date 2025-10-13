import { Prisma, JobStatus, JobType } from "@prisma/client";
import { prisma } from "../src/lib/prisma";
import { jobs } from "../src/data/jobs";

async function main() {
  for (const job of jobs) {
    await prisma.job.upsert({
      where: { slug: job.slug },
      update: {
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type as JobType,
        workSchedule: job.workSchedule ?? null,
        workMode: job.workMode,
        compensation: job.compensation ?? null,
        description: job.description,
        overview: job.overview ?? null,
        responsibilities: job.responsibilities ?? Prisma.JsonNull,
        minQualifications: job.minQualifications ?? Prisma.JsonNull,
        preferredQualifications: job.preferredQualifications ?? Prisma.JsonNull,
        perks: job.perks ?? Prisma.JsonNull,
        team: job.team ?? null,
        startingDate: job.startingDate ?? null,
        minDuration: job.minDuration ?? null,
        expectedStipend: job.expectedStipend ?? null,
        lastDate: job.lastDate ?? null,
        applicationDeadline: job.applicationDeadline ?? null,
        status: (job.status as JobStatus | undefined) ?? null,
        postedDate: job.postedDate ?? null,
        whoCanApply: job.whoCanApply ?? null,
        skills: job.skills ?? Prisma.JsonNull,
        openings: job.openings ?? null,
        slug: job.slug,
      },
      create: {
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type as JobType,
        workSchedule: job.workSchedule ?? null,
        workMode: job.workMode,
        compensation: job.compensation ?? null,
        description: job.description,
        overview: job.overview ?? null,
        responsibilities: job.responsibilities ?? Prisma.JsonNull,
        minQualifications: job.minQualifications ?? Prisma.JsonNull,
        preferredQualifications: job.preferredQualifications ?? Prisma.JsonNull,
        perks: job.perks ?? Prisma.JsonNull,
        team: job.team ?? null,
        startingDate: job.startingDate ?? null,
        minDuration: job.minDuration ?? null,
        expectedStipend: job.expectedStipend ?? null,
        lastDate: job.lastDate ?? null,
        applicationDeadline: job.applicationDeadline ?? null,
        status: (job.status as JobStatus | undefined) ?? null,
        postedDate: job.postedDate ?? null,
        whoCanApply: job.whoCanApply ?? null,
        skills: job.skills ?? Prisma.JsonNull,
        openings: job.openings ?? null,
        slug: job.slug,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
