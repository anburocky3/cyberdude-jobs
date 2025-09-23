import Link from "next/link";
import { getJobsByType } from "@/data/jobs";

export default function JobsPage() {
  const fulltime = getJobsByType("fulltime");
  const internships = getJobsByType("internship");

  return (
    <main className="">
      <section className="mb-10 text-center bg-orange-50 py-10 px-4">
        <h1 className="text-3xl font-bold">Join CyberDude Jobs</h1>
        <p className="text-gray-700 mt-2">
          Explore full-time positions and our free, hands-on internship program.
        </p>
      </section>

      <div className="container mx-auto ">
        <section className="pb-10 px-4 mb-12">
          <h2 className="text-2xl font-semibold mb-4">Full-time Roles</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {fulltime.map((job) => (
              <li key={job.id} className="border rounded p-5 hover:bg-gray-50">
                <Link href={`/jobs/${job.slug}`} className="block">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <p className="text-gray-700">{job.company}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {job.workSchedule} · {job.workMode}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Posted{" "}
                        {job.postedDate
                          ? new Date(job.postedDate).toDateString()
                          : "—"}
                      </p>
                      {job.whoCanApply && (
                        <p className="text-xs text-gray-600 mt-1">
                          Who can apply: {job.whoCanApply}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="block text-sm text-gray-600">
                        {job.location}
                      </span>
                      {typeof job.openings === "number" && (
                        <span className="block text-xs text-gray-500 mt-1">
                          Openings: {job.openings}
                        </span>
                      )}
                      {job.applicationDeadline && (
                        <span className="block text-xs text-gray-500 mt-1">
                          Apply by{" "}
                          {new Date(job.applicationDeadline).toDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  {job.skills && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {job.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="text-xs bg-gray-100 rounded px-2 py-1"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="pb-10 px-4 mb-12">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">Free Internship Program</h2>
            <p className="text-gray-700 mt-1">
              6 months hybrid, full-time. Mentorship by senior engineers.
              Certificate and LoR on completion.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {internships.map((job) => (
              <li key={job.id} className="border rounded p-5 hover:bg-gray-50">
                <Link href={`/jobs/${job.slug}`} className="block">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <p className="text-gray-700">{job.company}</p>
                      {typeof job.openings === "number" && (
                        <p className="text-sm text-gray-500 mt-1">
                          Openings: {job.openings}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Posted{" "}
                        {job.postedDate
                          ? new Date(job.postedDate).toDateString()
                          : "—"}
                      </p>
                      {job.whoCanApply && (
                        <p className="text-xs text-gray-600 mt-1">
                          Who can apply: {job.whoCanApply}
                        </p>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">
                      {job.location}
                    </span>
                  </div>
                  {job.skills && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {job.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="text-xs bg-gray-100 rounded px-2 py-1"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
