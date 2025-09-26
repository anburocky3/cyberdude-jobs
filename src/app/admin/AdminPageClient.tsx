"use client";

import { useEffect, useMemo, useState } from "react";
import { track } from "@vercel/analytics/react";
import {
  ChevronDown,
  ChevronRight,
  Download,
  Search,
  User,
  Mail,
  MapPin,
  Briefcase,
  Award,
  Clock,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/date";

// Response type from /api/admin/applications (list)
type ListApplication = {
  id: number;
  jobId: number;
  job: { id: number; title: string; type: string; slug: string };
  userEmail: string;
  userName?: string | null;
  currentStatus: string;
  country: string;
  totalScore?: number | null;
  createdAt: string;
  skills: string[];
  profileImage?: string | null;
};

// Response type from /api/admin/applications/[id] (details)
type FullApplication = ListApplication & {
  gender: string;
  dateOfBirth: string;
  mobileNo: string;
  state: string;
  city: string;
  linkedin: string;
  portfolio?: string | null;
  educationSchool: string;
  educationSchoolPercentage: number;
  educationCollege: string;
  educationCollegePercentage: number;
  workedAlready: boolean;
  companyName?: string | null;
  reasonToJoin: string;
  excitedAboutStartup: string;
  cameFrom: string;
  acceptCondition: boolean;
  resumeUrl?: string | null;
};

type ScreeningNote = {
  id: number;
  applicationId: number;
  stage: string;
  verdict: string | null;
  score: number | null;
  notes: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function AdminPageClient() {
  const [apps, setApps] = useState<ListApplication[]>([]);
  const [overview, setOverview] = useState<
    {
      jobId: number;
      count: number;
      job: { id: number; title: string; type: string; slug: string } | null;
    }[]
  >([]);
  const [fullApps, setFullApps] = useState<Map<number, FullApplication>>(
    new Map()
  );
  const [expandedApp, setExpandedApp] = useState<number | null>(null);
  const [q, setQ] = useState("");
  const [jobType, setJobType] = useState<string>("");
  const [jobId, setJobId] = useState<string>("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [evaluated, setEvaluated] = useState<string>(""); // '', 'yes', 'no'
  const [loading, setLoading] = useState(false);
  const [screeningNotes, setScreeningNotes] = useState<
    Record<number, ScreeningNote[]>
  >({});
  const [newNote, setNewNote] = useState<{
    stage: string;
    verdict: string;
    score: string;
    notes: string;
  }>({ stage: "hr", verdict: "", score: "", notes: "" });

  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (jobType) params.set("jobType", jobType);
    if (jobId) params.set("jobId", jobId);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (evaluated) params.set("evaluated", evaluated);
    fetch(`/api/admin/applications?${params.toString()}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: ListApplication[]) => setApps(data))
      .catch(() => setApps([]));
  }, [q, jobType, jobId, from, to, evaluated]);

  useEffect(() => {
    fetch(`/api/admin/overview`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setOverview(data))
      .catch(() => setOverview([]));
  }, []);

  const filtered = useMemo(() => apps, [apps]);

  const fetchFullApplication = async (appId: number) => {
    if (fullApps.has(appId)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/applications/${appId}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const fullApp: FullApplication = await res.json();
        setFullApps((prev) => new Map(prev).set(appId, fullApp));
      }
    } catch (error) {
      console.error("Failed to fetch full application:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchScreeningNotes = async (appId: number) => {
    try {
      const res = await fetch(`/api/admin/applications/${appId}/screening`, {
        cache: "no-store",
      });
      if (res.ok) {
        const notes: ScreeningNote[] = await res.json();
        setScreeningNotes((prev) => ({ ...prev, [appId]: notes }));
      }
    } catch {}
  };

  const toggleExpanded = (appId: number) => {
    if (expandedApp === appId) {
      setExpandedApp(null);
    } else {
      setExpandedApp(appId);
      fetchFullApplication(appId);
      fetchScreeningNotes(appId);
    }
  };

  const exportCsv = async () => {
    try {
      track("admin_export_csv");
    } catch {}
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (jobType) params.set("jobType", jobType);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const res = await fetch(`/api/admin/applications.csv?${params.toString()}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `applications.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="">
      <div className="bg-orange-50 p-5 sm:p-10">
        <div className="container mx-auto">
          <div className="flex items-start sm:items-center justify-between mb-4 sm:mb-2 gap-3">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
              Overview{" "}
              <span className="text-sm font-medium text-orange-900">
                ({filtered.length} total applications)
              </span>
            </h2>
            <button
              onClick={exportCsv}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg hover:from-orange-600 hover:to-pink-700 transition-all duration-200 shadow-sm text-sm font-semibold"
            >
              <Download className="w-4 h-4" />
              <span className="hidden xs:inline">Export CSV</span>
              <span className="xs:hidden">Export</span>
            </button>
          </div>

          {/* Overview by Job */}
          <div className="mb-4 sm:mb-6 ">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {overview.map((o) => (
                <div
                  key={o.jobId}
                  className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4 shadow-sm"
                >
                  <div className="text-xs text-orange-600 uppercase font-semibold tracking-wider truncate mb-1">
                    {o.job?.type || ""}
                  </div>
                  <div className="font-medium text-gray-900 truncate">
                    {o.job?.title || `Job #${o.jobId}`}
                  </div>
                  <div className="mt-2 text-2xl font-bold text-gray-900">
                    {o.count}
                  </div>
                </div>
              ))}
              {overview.length === 0 && (
                <div className="col-span-2 sm:col-span-3 lg:col-span-4 text-sm text-gray-500">
                  No data
                </div>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg  text-sm"
                  placeholder="Search applications..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg  text-sm"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                <option value="">All Job Types</option>
                <option value="fulltime">Full-time</option>
                <option value="internship">Internship</option>
              </select>
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg  text-sm"
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
              >
                <option value="">All Positions</option>
                {overview.map((o) => (
                  <option key={o.jobId} value={o.jobId}>
                    {o.job?.title || `Job #${o.jobId}`}
                  </option>
                ))}
              </select>
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="From date"
              />
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="To date"
              />
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                value={evaluated}
                onChange={(e) => setEvaluated(e.target.value)}
                title="Filter by evaluation status"
              >
                <option value="">All Candidates</option>
                <option value="yes">Evaluated</option>
                <option value="no">Not Evaluated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-6 px-3 sm:py-8 sm:px-4 max-w-7xl">
        {/* Applications List */}
        <div className="space-y-3">
          {filtered.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Compact Card View */}
              <div
                className="p-3 sm:p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                onClick={() => toggleExpanded(app.id)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      {expandedApp === app.id ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                      {app.profileImage ? (
                        <Image
                          src={app.profileImage}
                          alt={app.userName || "No name provided"}
                          className="rounded-full object-cover"
                          width={36}
                          height={36}
                          sizes="(max-width: 640px) 36px, 40px"
                        />
                      ) : (
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                          {(app.userName || app.userEmail)
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 sm:space-x-3 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                          {app.userName || "No name provided"}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-semibold ${
                            app.job.type === "fulltime"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {app.job.type === "fulltime"
                            ? "Full-time"
                            : "Internship"}
                        </span>

                        <div className="text-[11px] sm:text-xs font-semibold">
                          {app.currentStatus}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-600">
                        <div className="hidden xs:flex items-center space-x-1 min-w-0">
                          <Mail className="w-4 h-4 text-green-700" />
                          <span className="truncate max-w-[40vw] sm:max-w-none">
                            {app.userEmail}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 text-green-700" />
                          <span>{app.country}</span>
                        </div>
                        <div className="hidden sm:flex items-center space-x-1 min-w-0">
                          <Briefcase className="w-4 h-4 text-indigo-600" />
                          <span className="truncate">{app.job.title}</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-yellow-700" />
                          <span>
                            Applied{" "}
                            {formatDate(app.createdAt, "DD MMM, YYYY hh:mm A")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right text-xs sm:text-sm text-gray-500">
                      <div className="hidden xs:block">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex flex-col items-center space-y-2">
                        <Link
                          href={`/admin/applications/${app.id}`}
                          className="flex items-center justify-center w-full xs:w-auto space-x-2 px-2 py-2 rounded text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
                          onClick={(e) => e.stopPropagation()}
                          title="Open evaluation page"
                        >
                          <Trophy className="w-4 h-4" />
                          <span>Evaluate</span>
                        </Link>
                        {app.totalScore !== null &&
                          app.totalScore !== undefined && (
                            <div className="flex items-center space-x-1">
                              <div
                                className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                                  app.totalScore >= 80
                                    ? "bg-green-100 text-green-800"
                                    : app.totalScore >= 60
                                    ? "bg-blue-100 text-blue-800"
                                    : app.totalScore >= 40
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {app.totalScore}/100
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Expanded Details */}
              {expandedApp === app.id && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    </div>
                  ) : (
                    <div>
                      {fullApps.has(app.id) ? (
                        <>
                          <ApplicationDetails app={fullApps.get(app.id)!} />
                          <div className="mt-6">
                            <h4 className="font-semibold text-gray-900 mb-3">
                              HR Screening
                            </h4>
                            <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                <select
                                  className="border rounded px-3 py-2 text-sm"
                                  value={newNote.stage}
                                  onChange={(e) =>
                                    setNewNote((s) => ({
                                      ...s,
                                      stage: e.target.value,
                                    }))
                                  }
                                >
                                  <option value="hr">HR</option>
                                  <option value="technical">Technical</option>
                                  <option value="manager">Manager</option>
                                  <option value="team">Team</option>
                                </select>
                                <select
                                  className="border rounded px-3 py-2 text-sm"
                                  value={newNote.verdict}
                                  onChange={(e) =>
                                    setNewNote((s) => ({
                                      ...s,
                                      verdict: e.target.value,
                                    }))
                                  }
                                >
                                  <option value="">No verdict</option>
                                  <option value="shortlist">Shortlist</option>
                                  <option value="hold">Hold</option>
                                  <option value="reject">Reject</option>
                                </select>
                                <input
                                  className="border rounded px-3 py-2 text-sm"
                                  placeholder="Score (0-100)"
                                  value={newNote.score}
                                  onChange={(e) =>
                                    setNewNote((s) => ({
                                      ...s,
                                      score: e.target.value,
                                    }))
                                  }
                                />
                                <button
                                  className="px-3 py-2 rounded text-white bg-gradient-to-r from-orange-500 to-pink-600 text-sm"
                                  onClick={async () => {
                                    const payload = {
                                      stage: newNote.stage || "hr",
                                      verdict: newNote.verdict || null,
                                      score: newNote.score
                                        ? Number(newNote.score)
                                        : null,
                                      notes: newNote.notes || null,
                                    };
                                    const res = await fetch(
                                      `/api/admin/applications/${app.id}/screening`,
                                      {
                                        method: "POST",
                                        headers: {
                                          "content-type": "application/json",
                                        },
                                        body: JSON.stringify(payload),
                                      }
                                    );
                                    if (res.ok) {
                                      setNewNote({
                                        stage: "hr",
                                        verdict: "",
                                        score: "",
                                        notes: "",
                                      });
                                      fetchScreeningNotes(app.id);
                                    }
                                  }}
                                >
                                  Save Note
                                </button>
                              </div>
                              <textarea
                                className="w-full border rounded px-3 py-2 text-sm"
                                placeholder="Notes"
                                value={newNote.notes}
                                onChange={(e) =>
                                  setNewNote((s) => ({
                                    ...s,
                                    notes: e.target.value,
                                  }))
                                }
                              />
                              <div className="pt-3 border-t border-gray-200">
                                <h5 className="font-medium text-gray-800 mb-2">
                                  History
                                </h5>
                                <div className="space-y-2">
                                  {(screeningNotes[app.id] || []).map((n) => (
                                    <div
                                      key={n.id}
                                      className="text-sm p-3 rounded border bg-white"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="font-medium text-gray-900">
                                          {n.stage.toUpperCase()}{" "}
                                          {n.verdict ? `• ${n.verdict}` : ""}{" "}
                                          {n.score != null
                                            ? `• ${n.score}`
                                            : ""}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {new Date(
                                            n.createdAt
                                          ).toLocaleString()}
                                        </div>
                                      </div>
                                      {n.notes && (
                                        <div className="text-gray-700 mt-1 whitespace-pre-wrap">
                                          {n.notes}
                                        </div>
                                      )}
                                      {n.createdBy && (
                                        <div className="text-xs text-gray-500 mt-1">
                                          by {n.createdBy}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                  {(screeningNotes[app.id] || []).length ===
                                    0 && (
                                    <div className="text-sm text-gray-500">
                                      No notes yet.
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          Failed to load application details
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No applications found
              </h3>
              <p className="text-gray-600">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function ApplicationDetails({ app }: { app: FullApplication }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Personal Information</span>
        </h4>
        <div className="bg-white rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Name:</span>
              <div className="text-gray-900">
                {app.userName || "Not provided"}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-600">Email:</span>
              <div className="text-gray-900">{app.userEmail}</div>
            </div>
            <div>
              <span className="font-medium text-gray-600">Mobile:</span>
              <div className="text-gray-900">{app.mobileNo}</div>
            </div>
            <div>
              <span className="font-medium text-gray-600">Gender:</span>
              <div className="text-gray-900">{app.gender}</div>
            </div>
            <div>
              <span className="font-medium text-gray-600">Date of Birth:</span>
              <div className="text-gray-900">
                {formatDate(app.dateOfBirth, "DD MMM, YYYY")}
              </div>
            </div>
            <div>
              <span className="font-medium text-gray-600">Location:</span>
              <div className="text-gray-900">
                {app.city}, {app.state}, {app.country}
              </div>
            </div>
          </div>
          {(app.linkedin || app.portfolio) && (
            <div className="pt-3 border-t border-gray-200">
              <div className="flex space-x-4">
                {app.linkedin && (
                  <a
                    href={app.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    LinkedIn Profile
                  </a>
                )}
                {app.portfolio && (
                  <a
                    href={app.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Portfolio
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Education & Experience */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
          <Award className="w-5 h-5" />
          <span>Education & Experience</span>
        </h4>
        <div className="bg-white rounded-lg p-4 space-y-4">
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Education</h5>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-600">School:</span>
                <div className="text-gray-900">
                  {app.educationSchool} ({app.educationSchoolPercentage}%)
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-600">College:</span>
                <div className="text-gray-900">
                  {app.educationCollege} ({app.educationCollegePercentage}%)
                </div>
              </div>
            </div>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Work Experience</h5>
            <div className="text-sm">
              <span className="font-medium text-gray-600">
                Previously worked:
              </span>
              <span
                className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  app.workedAlready
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {app.workedAlready ? "Yes" : "No"}
              </span>
              {app.workedAlready && app.companyName && (
                <div className="mt-1 text-gray-900">at {app.companyName}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Skills</h4>
        <div className="bg-white rounded-lg p-4">
          <div className="flex flex-wrap gap-2">
            {app.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Motivation */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Motivation</h4>
        <div className="bg-white rounded-lg p-4 space-y-4">
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Reason to Join</h5>
            <p className="text-sm text-gray-600 leading-relaxed">
              {app.reasonToJoin}
            </p>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-2">
              Excited About Startup
            </h5>
            <p className="text-sm text-gray-600 leading-relaxed">
              {app.excitedAboutStartup}
            </p>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-2">
              How did you hear about us?
            </h5>
            <p className="text-sm text-gray-600">{app.cameFrom}</p>
          </div>
        </div>
      </div>

      {/* Resume */}
      {app.resumeUrl && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Resume</h4>
          <div className="bg-white rounded-lg p-4">
            <a
              href={app.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <Download className="w-4 h-4" />
              <span>Download Resume</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
