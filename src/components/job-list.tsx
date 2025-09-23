import Link from "next/link";
import { Job } from "@prisma/client";
import { MapPin } from "lucide-react";
import { fromNow } from "@/lib/date";

function asStringArray(value: unknown): string[] | undefined {
  if (Array.isArray(value)) return value as string[];
  return undefined;
}

export default function JobList({ job }: { job: Job }) {
  return (
    <li key={job.id} className="border rounded p-5 hover:bg-gray-50">
      <Link href={`/jobs/${job.slug}`} className="block">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-x-4">
          <div>
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <div className="flex items-center space-x-2 text-sm mt-2">
              <MapPin
                className={`h-4 w-4 ${
                  job.type === "fulltime" ? "text-green-700" : "text-indigo-700"
                }`}
              />
              <span>
                {job.location} · {job.workMode}
              </span>
            </div>
            {/* <p className="text-sm text-gray-500 mt-1">
          {job.workSchedule} · {job.workMode}
        </p> */}

            {/* {job.whoCanApply && (
          <p className="text-xs text-gray-600 mt-1">
            Who can apply: {job.whoCanApply}
          </p>
        )} */}
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mt-1">
              Posted {fromNow(job.postedDate)}
            </p>
            {/* {typeof job.openings === "number" && (
          <span className="block text-xs text-gray-500 mt-1">
            Openings: {job.openings}
          </span>
        )} */}
            {/* {job.applicationDeadline && (
          <span className="block text-xs text-gray-500 mt-1">
            Apply {fromNow(job.applicationDeadline)}
          </span>
        )} */}
          </div>
        </div>
        {asStringArray(job.skills) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {asStringArray(job.skills)!
              .slice(0, 4)
              .map((skill: string) => (
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
  );
}
