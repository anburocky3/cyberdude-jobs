"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2Icon, LucideCalendar, Timer } from "lucide-react";

type Note = {
  id: number;
  stage: string;
  verdict?: string | null;
  score?: number | null;
  notes?: string | null;
  createdAt: string;
  createdBy?: string | null;
};

type AppItem = {
  id: number;
  createdAt: string;
  currentStatus: string;
  interviewProcess?: "started" | "in_progress" | "completed";
  result?: "hired" | "hold" | "reject" | null;
  job: {
    id: number;
    title: string;
    slug: string;
    type: string;
    company: string;
  };
  notes: Note[];
};

export default function ApplicationsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<AppItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/");
  }, [status, router]);

  useEffect(() => {
    let cancelled = false;
    if (status !== "authenticated") return;
    setIsLoading(true);
    setError(null);
    fetch("/api/applications")
      .then(async (r) => {
        if (!r.ok) throw new Error("Failed to load applications");
        const json = (await r.json()) as AppItem[];
        if (!cancelled) setData(json);
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setError(
            e instanceof Error ? e.message : "Failed to load applications"
          );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [status]);

  if (status === "loading") {
    return (
      <main className="container mx-auto py-8 px-4">
        <div className="h-6 w-40 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-100 border rounded animate-pulse"
            />
          ))}
        </div>
      </main>
    );
  }

  if (status !== "authenticated") return null;

  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4">Your Applications</h1>
        <Link
          href="/interviews/schedule"
          className="px-4 py-2 bg-blue-700 text-white rounded flex items-center gap-2 hover:bg-blue-800 font-medium"
        >
          <LucideCalendar className="h-4 w-4 inline-block" />
          <span className="hidden md:inline">Schedule Interview</span>
        </Link>
      </div>
      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">
          Failed to load applications
        </div>
      )}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-100 border rounded animate-pulse"
            />
          ))}
        </div>
      )}
      {!isLoading && Array.isArray(data) && data.length === 0 && (
        <div className="bg-white border rounded-lg p-6 text-center">
          <p className="text-gray-700">
            You have not applied to any roles yet.
          </p>
          <Link href="/" className="text-blue-700 underline mt-2 inline-block">
            Browse jobs
          </Link>
        </div>
      )}
      <div className="">
        {data?.map((app) => (
          <article
            key={app.id}
            className="bg-white border rounded-lg p-4 shadow-sm"
          >
            <header className="flex flex-col sm:flex-row items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">
                  <a
                    href={`/jobs/${app.job.slug}`}
                    target="_blank"
                    className="hover:underline"
                  >
                    {app.job.title}
                  </a>
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 my-1">
                    <Building2Icon className="h-4 w-4 text-green-700" />
                    <span>{app.job.company}</span>
                  </div>
                  <div
                    className="flex items-center space-x-2 text-sm text-gray-600 my-1"
                    title={`Applied on ${new Date(
                      app.createdAt
                    ).toLocaleDateString()}`}
                  >
                    <Timer className="h-4 w-4 text-yellow-700" />
                    <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <span className="text-xs px-2 py-1 rounded font-semibold bg-gray-100 text-gray-700 capitalize">
                {app.interviewProcess != "completed"
                  ? app.interviewProcess?.replace("_", " ") || "Pending"
                  : app.result?.replace("_", " ") || "Pending"}
              </span>
            </header>
            <div className="mt-3 text-sm my-5">
              <div className="flex justify-center items-center gap-2">
                <span className="text-gray-500">
                  {app.interviewProcess != "completed"
                    ? "Interview process:"
                    : "Final decision:"}
                </span>
                <span className="font-medium capitalize bg-gray-100 px-2 py-1 rounded">
                  {app.interviewProcess != "completed"
                    ? app.interviewProcess?.replace("_", " ") || "Pending"
                    : app.result?.replace("_", " ") || "Pending"}
                </span>
              </div>
            </div>

            {/* Screening timeline */}
            <div className="mt-3">
              {(() => {
                const stages = [
                  "hr",
                  "technical",
                  "manager",
                  "team",
                  "reference",
                ] as const;
                const latestByStage: Record<string, Note | undefined> =
                  stages.reduce((acc, s) => {
                    acc[s] = [...(app.notes || [])]
                      .filter((n) => n.stage === s)
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      )[0];
                    return acc;
                  }, {} as Record<string, Note | undefined>);

                const getStatus = (s: (typeof stages)[number]) => {
                  const note = latestByStage[s];
                  if (!note || !note.verdict) return "pending" as const;
                  return note.verdict === "shortlist"
                    ? ("passed" as const)
                    : note.verdict === "reject"
                    ? ("failed" as const)
                    : ("pending" as const);
                };

                const statusPerStage = stages.map((s) => ({
                  stage: s,
                  status: getStatus(s),
                }));

                const passedUntilIndex = (() => {
                  let idx = -1;
                  for (let i = 0; i < statusPerStage.length; i++) {
                    if (statusPerStage[i].status === "passed") idx = i;
                    else if (statusPerStage[i].status === "failed")
                      return i - 1;
                    else break;
                  }
                  return idx;
                })();

                return (
                  <div className="w-full">
                    <div className="w-full flex justify-around items-center">
                      {statusPerStage.map(({ stage, status }, i) => {
                        const isLast = i === statusPerStage.length - 1;
                        const circleBase =
                          "flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 rounded-full text-[10px] sm:text-xs font-bold border";
                        const circleClass =
                          status === "passed"
                            ? "bg-green-600 text-white border-green-600"
                            : status === "failed"
                            ? "bg-red-600 text-white border-red-600"
                            : "bg-gray-200 text-gray-600 border-gray-300";
                        const connectorBase = "h-0.5 sm:h-1 flex-1 mx-2";
                        const connectorClass =
                          i <= passedUntilIndex
                            ? "bg-green-600"
                            : status === "failed" ||
                              (passedUntilIndex >= 0 &&
                                i <= passedUntilIndex + 1 &&
                                status === "pending")
                            ? "bg-red-400"
                            : "bg-gray-300";
                        return (
                          <div
                            key={stage}
                            className={`flex items-center min-w-0 ${
                              i === statusPerStage.length - 1 ? "" : "flex-1"
                            }`}
                          >
                            <div className="flex flex-col items-center flex-none">
                              <div
                                className={`${circleBase} ${circleClass}`}
                                title={`${
                                  status === "passed"
                                    ? "You have passed this stage"
                                    : status === "failed"
                                    ? "You have failed this stage"
                                    : "You have not completed this stage"
                                }`}
                              >
                                {status === "passed"
                                  ? "✓"
                                  : status === "failed"
                                  ? "✕"
                                  : i + 1}
                              </div>
                              <span className="mt-2 text-[10px] sm:text-[11px] text-gray-600 capitalize text-center w-16 sm:w-20 truncate">
                                {stage}
                              </span>
                            </div>
                            {!isLast && (
                              <div
                                className={`${connectorBase} ${connectorClass}`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
