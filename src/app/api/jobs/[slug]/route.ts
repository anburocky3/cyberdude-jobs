import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { slug } = await params;

  const job = await prisma.job.findUnique({ where: { slug: slug } });
  if (!job) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(job);
}
