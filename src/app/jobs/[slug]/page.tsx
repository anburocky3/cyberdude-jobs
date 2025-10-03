import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SignInButton } from "../../session/SignInButton";
import { apiFetch } from "@/lib/api";
import { formatDate, fromNow } from "@/lib/date";
import Link from "next/link";
import Row from "./Row";
import ShareJob from "@/components/ShareJob";
import { Button } from "@/components/ui/button";
import { Briefcase, Building2Icon, ChevronLeft, MapPin } from "lucide-react";
import { Job } from "@prisma/client";
import Alert from "@/components/ui/alert";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await apiFetch(`/api/jobs/${slug}`, {
    cache: "no-store",
  }).then((r) => (r.ok ? r.json() : null));

  if (!job) return notFound();

  const isExpired = job.status === "expired";
  const deadlineCrossed = job.applicationDeadline
    ? new Date(job.applicationDeadline) < new Date()
    : false;
  const isClosed = isExpired || deadlineCrossed;
  const responsibilities = Array.isArray(job.responsibilities)
    ? (job.responsibilities as string[])
    : [job.description];
  const minQualifications = Array.isArray(job.minQualifications)
    ? (job.minQualifications as string[])
    : undefined;
  const preferredQualifications = Array.isArray(job.preferredQualifications)
    ? (job.preferredQualifications as string[])
    : undefined;
  const perks = Array.isArray(job.perks) ? (job.perks as string[]) : undefined;
  const skills = Array.isArray(job.skills)
    ? (job.skills as string[])
    : undefined;

  return (
    <main className="">
      <div className="bg-gradient-to-r from-orange-100 to-orange-200 border-b border-orange-200">
        <div className="container mx-auto py-3 sm:py-5 px-4">
          <Link href="/" className="text-sm text-orange-600">
            <Button
              variant="ghost"
              size="sm"
              className="mb-1 cursor-pointer"
              title="Return to jobs"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>

          {/* Hero */}
          <section className="mt-2 rounded-lg bg-gradient-to-r from-gray-50 to-white border p-6">
            <div className="flex flex-col sm:flex-row sm:items-center items-start  sm:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold">{job.title}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2  mt-2 text-gray-600 space-y-1 sm:space-y-0">
                  <div className="flex items-center space-x-2">
                    <Building2Icon className="h-4 w-4 text-green-700" />
                    <span>{job.company}</span>
                  </div>
                  <div className="hidden sm:block">|</div>
                  <div className="flex items-center space-x-2 ">
                    <MapPin className="h-4 w-4 text-yellow-700" />
                    <span>
                      {job.location} ({job.workMode})
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-3 ">
                  <div className="flex items-center px-4 bg-green-700 text-white rounded">
                    <Briefcase className="h-4 w-4" />
                    <span className="px-2 py-1 rounded font-semibold">
                      Full Time
                    </span>
                  </div>
                  {job.postedDate && (
                    <span className="text-gray-600">
                      Posted {fromNow(job.postedDate)}
                    </span>
                  )}
                </div>
                {/* <p className="text-gray-700 mt-1">
              {job.company} · {job.location}
            </p> */}
                {/* <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {job.type === "fulltime" && (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                  Full Time
                </span>
              )}
              {job.type === "internship" && (
                <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                  Internship
                </span>
              )}
              {job.workMode && (
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {job.workMode}
                </span>
              )}
              {isExpired && (
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
                  Expired
                </span>
              )}
            </div> */}
              </div>
              <div className="shrink-0  text-center">
                {/* <div className="flex items-center justify-center space-x-2"> */}
                {/* <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button> */}
                {/* <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button> */}
                {/* </div> */}
                {!isClosed ? <SignInButton job={job} /> : null}
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="container mx-auto py-3 sm:py-5 px-4">
        {isClosed && (
          <Alert
            variant="error"
            title="Application has closed. Please check the CyberDude website for future recruitment."
          ></Alert>
        )}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {job.overview && (
              <section>
                <h2 className="text-xl font-semibold mb-2">Overview</h2>
                <p className="text-gray-700">{job.overview}</p>
              </section>
            )}

            <section>
              <h2 className="text-xl font-semibold mb-2">
                Roles & Responsibilities
              </h2>
              <ul className="space-y-2 text-gray-700">
                {responsibilities.map((item: string, idx: number) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-gray-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {minQualifications && (
              <section>
                <h2 className="text-xl font-semibold mb-2">
                  Minimum Qualifications
                </h2>
                <ul className="space-y-2 text-gray-700">
                  {minQualifications.map((q: string) => (
                    <li key={q} className="flex gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {preferredQualifications && (
              <section>
                <h2 className="text-xl font-semibold mb-2">
                  Preferred Qualifications
                </h2>
                <ul className="space-y-2 text-gray-700">
                  {preferredQualifications.map((q: string) => (
                    <li key={q} className="flex gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {perks && (
              <section>
                <h2 className="text-xl font-semibold mb-2">Job Perks</h2>
                <ul className="space-y-2 text-gray-700">
                  {perks.map((p: string) => (
                    <li key={p} className="flex gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {skills && skills.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-2">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="text-xs bg-gray-100 rounded px-2 py-1"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <section className="text-sm text-gray-700 bg-gray-50 border rounded p-4">
              <div className="flex flex-col sm:flex-row">
                <strong>Note:</strong>
                <p className="sm:pl-2 flex-1">
                  Selections are based on skills, attitude, and merit — never on
                  recommendations, religion, caste, color, or personal
                  affiliations.
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside>
            <div className="border rounded-lg overflow-hidden">
              <div className="from-gray-50 to-white text-gray-800 px-4 py-3  font-medium">
                Job details
              </div>
              <div className="divide-y">
                <Row label="Company" value={job.company} />
                {job.team && <Row label="Team" value={job.team} />}
                {job.startingDate && (
                  <Row label="Starting date" value={job.startingDate} />
                )}
                {job.workMode && (
                  <Row
                    label="Work Type"
                    value={job.workMode.toUpperCase()}
                    badge
                  />
                )}
                {job.minDuration && (
                  <Row label="Min. Duration" value={job.minDuration} />
                )}
                {job.expectedStipend && (
                  <Row label="Expected Stipend" value={job.expectedStipend} />
                )}
                {typeof job.openings === "number" && (
                  <Row label="No. of Openings" value={String(job.openings)} />
                )}
                {job.applicationDeadline && (
                  <Row
                    label="Last date for applying"
                    value={formatDate(job.applicationDeadline, "DD MMM, YY")}
                  />
                )}
                <Row
                  label="Job Status"
                  value={isClosed ? "Closed" : "Open"}
                  badge
                  status={isClosed ? "expired" : "open"}
                />
              </div>
            </div>

            <div className="border rounded-lg mt-5 p-5">
              <ShareJob title={job.title} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job: Job | null = await apiFetch(`/api/jobs/${slug}`, {
    cache: "no-store",
  }).then((r) => (r.ok ? r.json() : null));

  if (!job) {
    return {
      title: "Job not found",
      description: "The requested job could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const title = `${job.title} at ${job.company}`;
  const description =
    job.overview ||
    job.description ||
    `${job.company} is hiring for ${job.title}.`;
  const ogImage = "/cyberdude-jobs-banner.png";
  const canonical = `/jobs/${job.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
