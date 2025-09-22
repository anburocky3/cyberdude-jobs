import { notFound } from "next/navigation";
import { SignInButton } from "../../session/SignInButton";
import { getJobBySlug } from "@/data/jobs";
import Link from "next/link";
import Row from "./Row";
import ShareJob from "@/components/ShareJob";
import { Button } from "@/components/ui/button";
import { Briefcase, Building2Icon, ChevronLeft, MapPin } from "lucide-react";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) return notFound();

  const isExpired = job.status === "expired";

  return (
    <main className="container mx-auto py-5 sm:py-10 px-4">
      <Link href="/" className="text-sm text-orange-600">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 cursor-pointer"
          title="Return to jobs"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>
      </Link>

      {/* Hero */}
      <section className="mt-2 rounded-lg bg-gradient-to-r from-gray-50 to-white border p-6">
        <div className="flex flex-col sm:flex-row sm:items-center items-start justify-center sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-1 mt-2 text-gray-600 space-y-1 sm:space-y-0">
              <div className="flex items-center space-x-1 ">
                <Building2Icon className="h-4 w-4 text-green-700" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center space-x-1 ">
                <MapPin className="h-4 w-4 text-yellow-700" />
                <span>
                  {job.location} ({job.workMode})
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-3 ">
              <div
                className={`flex items-center space-x-1 px-2 py-1 rounded  
                ${job.type === "fulltime" ? "bg-green-100 text-green-700" : ""}
                ${
                  job.type === "internship"
                    ? "bg-indigo-100 text-indigo-700"
                    : ""
                }
            `}
              >
                <Briefcase className="h-4 w-4" />
                {job.type === "fulltime" && (
                  <span className="bg-green-100 text-green-700 font-semibold px-2 py-1 rounded">
                    Full Time
                  </span>
                )}
                {job.type === "internship" && (
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                    Internship
                  </span>
                )}
              </div>
              {job.postedDate && (
                <span className="text-gray-600">
                  Posted on {job.postedDate}
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
          <div className="shrink-0  ">
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
            <SignInButton jobId={job.id} />
          </div>
        </div>
      </section>

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
              {(job.responsibilities || [job.description]).map((item, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {job.minQualifications && (
            <section>
              <h2 className="text-xl font-semibold mb-2">
                Minimum Qualifications
              </h2>
              <ul className="space-y-2 text-gray-700">
                {job.minQualifications.map((q) => (
                  <li key={q} className="flex gap-2">
                    <span className="text-gray-400">•</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {job.preferredQualifications && (
            <section>
              <h2 className="text-xl font-semibold mb-2">
                Preferred Qualifications
              </h2>
              <ul className="space-y-2 text-gray-700">
                {job.preferredQualifications.map((q) => (
                  <li key={q} className="flex gap-2">
                    <span className="text-gray-400">•</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {job.perks && (
            <section>
              <h2 className="text-xl font-semibold mb-2">Job Perks</h2>
              <ul className="space-y-2 text-gray-700">
                {job.perks.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-gray-400">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {job.skills && job.skills.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
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
                  value={new Date(job.applicationDeadline).toDateString()}
                />
              )}
              <Row
                label="Job Status"
                value={isExpired ? "Expired" : "Open"}
                badge
                status={isExpired ? "expired" : "open"}
              />
            </div>
          </div>

          <div className="border rounded-lg mt-5 p-5">
            <ShareJob title={job.title} />
          </div>
        </aside>
      </div>
    </main>
  );
}
