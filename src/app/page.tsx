import Link from "next/link";
import type { Metadata } from "next";
import type { Job } from "@prisma/client";
import { apiFetch } from "@/lib/api";
import { ArrowRight, VideoIcon } from "lucide-react";
import JobList from "@/components/job-list";

export const metadata: Metadata = {
  title: "Find Tech Jobs and Internships",
  description:
    "Browse AI-powered listings for software jobs and free internships at CyberDude.",
  openGraph: {
    title: "Find Tech Jobs and Internships | CyberDude Jobs",
    description:
      "Browse AI-powered listings for software jobs and free internships at CyberDude.",
    url: "/",
    type: "website",
    images: [
      {
        url: "/cyberdude-jobs-banner.png",
        width: 1200,
        height: 630,
        alt: "CyberDude Jobs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Tech Jobs and Internships | CyberDude Jobs",
    description:
      "Browse AI-powered listings for software jobs and free internships at CyberDude.",
    images: ["/cyberdude-jobs-banner.png"],
  },
};

export default async function JobsPage() {
  const [allJobs] = await Promise.all([
    apiFetch(`/api/jobs`, { cache: "no-store" }).then((r) => r.json()),
  ]);

  const jobs = (allJobs as Job[]) ?? [];
  const fulltime = jobs.filter((j) => j.type === "fulltime");
  const internships = jobs.filter((j) => j.type === "internship");

  return (
    <main className="">
      <section className="mb-10 text-center bg-gradient-to-tr from-zinc-800 to-zinc-950 text-white py-10 px-4">
        <h1 className="text-3xl font-bold">Join CyberDude Jobs</h1>
        <p className="text-gray-400 mt-2">
          Explore full-time positions and our free, hands-on internship program.
        </p>
        <Link
          href="https://bit.ly/cyberdudeYT"
          target="_blank"
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md flex items-center justify-center w-fit mx-auto gap-2 mt-4"
        >
          <VideoIcon className="w-4 h-4" />
          <span>Learn Technology In Tamil</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      <div className="container mx-auto ">
        <section className="sm:pb-10 px-4 mb-12">
          <h2 className="text-2xl font-semibold mb-4">Full-time Roles</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {fulltime.map((job) => (
              <JobList key={job.id} job={job} />
            ))}
          </ul>
        </section>

        <section className="sm:pb-10 px-4 mb-12">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">Free Internship Program</h2>
            <p className="text-gray-700 mt-1">
              6 months hybrid, full-time. Mentorship by senior engineers.
              Certificate and LoR on completion.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {internships.map((job) => (
              <JobList key={job.id} job={job} />
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
