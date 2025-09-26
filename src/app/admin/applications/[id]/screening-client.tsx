"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Download,
  Mail,
  MapPin,
  Briefcase,
  ChevronLeft,
  BarChart3,
  FileText,
} from "lucide-react";
import { formatDate } from "@/lib/date";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LinkedinIcon } from "@/components/icons/linkedin";
import Image from "next/image";
import { calculateAge } from "@/lib/utils";

type StageKey = "hr" | "technical" | "manager" | "team" | "reference";

// Verdict badge component
const VerdictBadge = ({ verdict }: { verdict: string }) => {
  const getBadgeStyle = (verdict: string) => {
    switch (verdict) {
      case "shortlist":
        return "bg-green-100 text-green-800 border-green-200";
      case "hold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "reject":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getBadgeText = (verdict: string) => {
    switch (verdict) {
      case "shortlist":
        return "✓ Shortlisted";
      case "hold":
        return "⏸ Hold";
      case "reject":
        return "✗ Rejected";
      default:
        return "No verdict";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyle(
        verdict
      )}`}
    >
      {getBadgeText(verdict)}
    </span>
  );
};

type ScreeningNote = {
  id: number;
  applicationId: number;
  stage: StageKey;
  verdict: string | null;
  score: number | null;
  notes: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

const stageLabels: Record<StageKey, string> = {
  hr: "HR Screening",
  technical: "Technical Interview",
  manager: "Manager Interview",
  team: "Team Interview",
  reference: "Reference Check",
};

const stagePrompts: Record<StageKey, string[]> = {
  hr: [
    "Tell me about yourself",
    "Why are you interested in this role?",
    "What are your salary expectations?",
    "When can you start?",
    "Any questions about the company?",
  ],
  technical: [
    "Role-specific technical questions",
    "Case study or project discussion",
    "How do you stay updated with industry trends?",
    "Describe a challenging project you worked on",
  ],
  manager: [
    "How do you handle conflicts in a team?",
    "Describe your leadership style",
    "How do you prioritize tasks?",
    "Where do you see yourself in 5 years?",
  ],
  team: [
    "How do you prefer to communicate?",
    "What motivates you at work?",
    "How do you handle feedback?",
  ],
  reference: [
    "Performance, work ethic, team dynamics",
    "Skills, reliability, growth potential",
    "Education and employment history verification",
  ],
};

export default function ScreeningClient({ appId }: { appId: number }) {
  type FullApplication = {
    id: number;
    jobId: number;
    job: { id: number; title: string; type: string; slug: string };
    userEmail: string;
    userName: string | null;
    profileImage?: string | null;
    gender: string;
    dateOfBirth: string;
    mobileNo: string;
    currentStatus: string;
    country: string;
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
    skills: string[];
    resumeUrl?: string | null;
    reasonToJoin: string;
    excitedAboutStartup: string;
    cameFrom: string;
    acceptCondition: boolean;
    createdAt: string;
  };

  const [notes, setNotes] = useState<ScreeningNote[]>([]);
  const [app, setApp] = useState<FullApplication | null>(null);
  const [appLoading, setAppLoading] = useState<boolean>(true);
  const [stage, setStage] = useState<StageKey>("hr");
  const [verdict, setVerdict] = useState("");
  const [score, setScore] = useState("");
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string>("");
  const [suggestionInfo, setSuggestionInfo] = useState<string>("");
  const [checkboxes, setCheckboxes] = useState<Record<string, boolean>>({});

  // Stage accent colors (Tailwind classes) used across the UI
  const getStageAccent = (s: StageKey) => {
    switch (s) {
      case "hr":
        return {
          dotBg: "bg-orange-500",
          lightBg: "bg-orange-100",
          text: "text-orange-600",
        };
      case "technical":
        return {
          dotBg: "bg-blue-500",
          lightBg: "bg-blue-100",
          text: "text-blue-600",
        };
      case "manager":
        return {
          dotBg: "bg-purple-500",
          lightBg: "bg-purple-100",
          text: "text-purple-600",
        };
      case "team":
        return {
          dotBg: "bg-emerald-500",
          lightBg: "bg-emerald-100",
          text: "text-emerald-600",
        };
      case "reference":
        return {
          dotBg: "bg-amber-500",
          lightBg: "bg-amber-100",
          text: "text-amber-600",
        };
      default:
        return {
          dotBg: "bg-gray-500",
          lightBg: "bg-gray-100",
          text: "text-gray-600",
        };
    }
  };

  const grouped = useMemo(() => {
    const map: Record<StageKey, ScreeningNote[]> = {
      hr: [],
      technical: [],
      manager: [],
      team: [],
      reference: [],
    };
    for (const n of notes) map[n.stage].push(n);
    return map;
  }, [notes]);

  const overallScore = useMemo(() => {
    const s = notes
      .map((n) => n.score)
      .filter((n): n is number => typeof n === "number");
    if (s.length === 0) return 0;
    const avg = Math.round(s.reduce((a, b) => a + b, 0) / s.length);
    return avg;
  }, [notes]);

  const grade = useMemo(() => {
    const v = overallScore;
    if (v >= 90) return "A+";
    if (v >= 80) return "A";
    if (v >= 70) return "B+";
    if (v >= 60) return "B";
    return "C";
  }, [overallScore]);

  const recommendation = useMemo(() => {
    switch (grade) {
      case "A+":
        return "Immediate interview";
      case "A":
        return "Priority interview";
      case "B+":
        return "Standard interview";
      case "B":
        return "Backup candidate";
      default:
        return "Reject";
    }
  }, [grade]);

  useEffect(() => {
    fetch(`/api/admin/applications/${appId}/screening`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: ScreeningNote[]) => setNotes(data))
      .catch(() => setNotes([]));
  }, [appId]);

  useEffect(() => {
    setAppLoading(true);
    fetch(`/api/admin/applications/${appId}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: FullApplication) => setApp(data))
      .catch(() => setApp(null))
      .finally(() => setAppLoading(false));
  }, [appId]);

  const save = async () => {
    setFormError("");
    const trimmedNotes = (text || "").trim();
    const hasScore = score.trim().length > 0;
    const parsedScore = hasScore ? Number(score) : null;
    if (
      hasScore &&
      (Number.isNaN(parsedScore) || parsedScore! < 0 || parsedScore! > 100)
    ) {
      setFormError("Score must be a number between 0 and 100.");
      return;
    }
    if (!stage) {
      setFormError("Stage is required.");
      return;
    }
    if (trimmedNotes.length === 0) {
      setFormError("Notes are required.");
      return;
    }
    if (trimmedNotes.length > 3000) {
      setFormError("Notes are too long (max 3000 characters).");
      return;
    }
    setSaving(true);
    const payload = {
      stage,
      verdict: verdict || null,
      score: parsedScore,
      notes: trimmedNotes,
    };
    const res = await fetch(`/api/admin/applications/${appId}/screening`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      setStage("hr");
      setVerdict("");
      setScore("");
      setText("");
      const created: ScreeningNote = await res.json();
      setNotes((prev) => [created, ...prev]);
    }
  };

  // Heuristic auto-scoring per stage (0..100). Simple, explainable, overridable.
  const suggestScore = () => {
    if (!app) return;

    // Stage-specific checkbox criteria
    const criteria: Record<
      StageKey,
      Array<{ key: string; label: string; weight: number }>
    > = {
      hr: [
        {
          key: "clear_communication",
          label: "Clear communication skills",
          weight: 20,
        },
        {
          key: "motivation_aligned",
          label: "Motivation aligned with role",
          weight: 25,
        },
        { key: "cultural_fit", label: "Good cultural fit", weight: 20 },
        { key: "availability", label: "Available for interview", weight: 15 },
        {
          key: "salary_expectations",
          label: "Salary expectations reasonable",
          weight: 20,
        },
      ],
      technical: [
        {
          key: "technical_knowledge",
          label: "Strong technical knowledge",
          weight: 30,
        },
        {
          key: "problem_solving",
          label: "Good problem-solving approach",
          weight: 25,
        },
        { key: "code_quality", label: "Code quality demonstrated", weight: 20 },
        {
          key: "learning_ability",
          label: "Shows learning ability",
          weight: 15,
        },
        {
          key: "technical_communication",
          label: "Can explain technical concepts",
          weight: 10,
        },
      ],
      manager: [
        {
          key: "leadership_potential",
          label: "Leadership potential",
          weight: 25,
        },
        {
          key: "strategic_thinking",
          label: "Strategic thinking ability",
          weight: 20,
        },
        { key: "team_management", label: "Team management skills", weight: 20 },
        { key: "decision_making", label: "Good decision-making", weight: 15 },
        { key: "vision_alignment", label: "Vision alignment", weight: 20 },
      ],
      team: [
        {
          key: "collaboration",
          label: "Good collaboration skills",
          weight: 25,
        },
        { key: "communication", label: "Effective communication", weight: 20 },
        {
          key: "adaptability",
          label: "Adaptable to team dynamics",
          weight: 20,
        },
        {
          key: "contribution",
          label: "Would contribute positively",
          weight: 20,
        },
        { key: "personality_fit", label: "Personality fits team", weight: 15 },
      ],
      reference: [
        { key: "work_quality", label: "High work quality", weight: 25 },
        { key: "reliability", label: "Reliable and punctual", weight: 20 },
        { key: "teamwork", label: "Good team player", weight: 20 },
        { key: "growth_potential", label: "Growth potential", weight: 20 },
        { key: "recommendation", label: "Would recommend hiring", weight: 15 },
      ],
    };

    const stageCriteria = criteria[stage];
    let totalScore = 0;
    let maxScore = 0;
    const breakdown: string[] = [];

    stageCriteria.forEach((criterion) => {
      const isChecked = checkboxes[criterion.key] || false;
      const criterionScore = isChecked ? criterion.weight : 0;
      totalScore += criterionScore;
      maxScore += criterion.weight;
      breakdown.push(
        `${criterion.label}: ${criterionScore}/${criterion.weight}`
      );
    });

    // Calculate percentage and round to nearest 5
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    const suggested = Math.max(
      0,
      Math.min(100, Math.round(percentage / 5) * 5)
    );

    setScore(String(suggested));
    setSuggestionInfo(
      `Suggested: ${suggested} (${totalScore}/${maxScore} points)`
    );
  };

  // Auto-calculate score when criteria change or stage switches
  useEffect(() => {
    suggestScore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkboxes, stage]);

  return (
    <main className="">
      <div className="bg-orange-50 p-5 sm:p-10">
        <div className="container mx-auto flex items-center">
          <Link href="/admin" className="text-sm text-orange-600 ">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-orange-100 rounded-full mr-2"
              title="Back to Applications"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          {app ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
              <div className="flex items-center gap-2">
                {app.profileImage ? (
                  <Image
                    src={app.profileImage}
                    alt={app.userName || "No name provided"}
                    className="rounded-full object-cover hidden sm:block"
                    width={80}
                    height={80}
                    sizes="(max-width: 640px) 80px, 100px"
                  />
                ) : (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                    {(app.userName || app.userEmail).charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Briefcase className="w-4 h-4" />
                    <span className="truncate w-44 sm:w-auto">
                      {app.job.title}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                        app.job.type === "fulltime"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {app.job.type === "fulltime" ? "Full-time" : "Internship"}
                    </span>
                  </div>
                  <div className="text-xl font-bold text-gray-900 truncate">
                    {app.userName || "No name provided"}
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 mt-1">
                    <span className="inline-flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {app.userEmail}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {app.city}, {app.country}
                    </span>
                    <span className="hidden sm:inline bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                      Applied on{" "}
                      {formatDate(app.createdAt, "DD MMM, YYYY hh:mm A")}
                    </span>
                  </div>
                </div>
              </div>

              {app.resumeUrl && (
                <div className="flex flex-row gap-2 items-center">
                  {app.linkedin && (
                    <a
                      className="text-blue-600 hover:underline"
                      href={app.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      title="LinkedIn Profile"
                    >
                      <LinkedinIcon className="w-10 h-10" />
                    </a>
                  )}
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded border bg-blue-500 text-white font-semibold hover:bg-blue-600 text-sm"
                    title="Download Resume"
                  >
                    <Download className="w-4 h-4" /> Download Resume
                  </a>
                </div>
              )}
            </div>
          ) : appLoading ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full animate-pulse">
              <div className="flex items-center gap-2 w-full">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-200 rounded-full"></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-16 bg-gray-200 rounded-full" />
                  </div>
                  <div className="h-5 w-40 bg-gray-200 rounded mb-1" />
                  <div className="flex items-center gap-3 mt-1">
                    <div className="h-3 w-28 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                    <div className="h-3 w-32 bg-gray-200 rounded hidden sm:block" />
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <div className="w-10 h-10 bg-gray-200 rounded" />
                <div className="h-9 w-36 bg-gray-200 rounded" />
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="container mx-auto py-4 px-3 sm:py-8 sm:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="space-y-4">
            {app ? (
              <div className="rounded-lg border p-4 bg-white">
                <div className="mt-3 text-sm text-gray-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="text-gray-500">Gender</div>
                      <div className="text-gray-900">{app.gender}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Date of Birth</div>
                      <div className="text-gray-900">
                        {formatDate(app.dateOfBirth, "DD MMM, YYYY")} (
                        <span className="font-medium">
                          {calculateAge(app.dateOfBirth)})
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Mobile</div>
                      <div className="text-gray-900">
                        <a
                          className="text-blue-600 hover:underline"
                          href={`tel:${app.mobileNo}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Call"
                        >
                          {app.mobileNo}
                        </a>
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Location</div>
                      <div>
                        {app.city}, {app.state}, {app.country}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Motivation */}
                <div className="mt-4 border-t font-medium">Motivation</div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-gray-500">Reason to Join</div>
                    <div className="whitespace-pre-wrap">
                      {app.reasonToJoin}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Excited About Startup</div>
                    <div className="whitespace-pre-wrap">
                      {app.excitedAboutStartup}
                    </div>
                  </div>
                </div>

                {/* Education & Experience */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-gray-500">Schooling</div>
                    <div>
                      {app.educationSchool} ({app.educationSchoolPercentage}%)
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Higher Studies</div>
                    <div>
                      {app.educationCollege} ({app.educationCollegePercentage}%)
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Links</div>
                    <div className="text-gray-900 space-x-3 truncate">
                      {app.portfolio ? (
                        <a
                          className="text-blue-600 hover:underline"
                          href={app.portfolio}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Portfolio
                        </a>
                      ) : (
                        "No portfolio"
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Experience</div>
                    <div>
                      {app.workedAlready
                        ? `Yes${app.companyName ? `, ${app.companyName}` : ""}`
                        : "No"}
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-4">
                  <div className="text-gray-500 text-sm mb-1">Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {app.skills.map((s, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : appLoading ? (
              <div className="rounded-lg border p-4 bg-white animate-pulse">
                <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="h-3 w-28 bg-gray-200 rounded" />
                    <div className="h-12 w-full bg-gray-200 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-40 bg-gray-200 rounded" />
                    <div className="h-12 w-full bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="space-y-2">
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-28 bg-gray-200 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-3 w-12 bg-gray-200 rounded mb-2" />
                  <div className="flex flex-wrap gap-2">
                    <div className="h-6 w-16 bg-gray-200 rounded-full" />
                    <div className="h-6 w-20 bg-gray-200 rounded-full" />
                    <div className="h-6 w-14 bg-gray-200 rounded-full" />
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Overall Score Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium text-blue-700">
                    Overall Score
                  </div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-900 mb-2">
                  {overallScore}
                </div>
                {notes.length === 0 ? (
                  <div className="text-sm font-medium text-blue-700">
                    Need to evaluate
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        grade === "A+"
                          ? "bg-green-100 text-green-800"
                          : grade === "A"
                          ? "bg-green-100 text-green-800"
                          : grade === "B+"
                          ? "bg-blue-100 text-blue-800"
                          : grade === "B"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {grade}
                    </div>
                    <div className="text-sm text-blue-700">
                      {recommendation}
                    </div>
                  </div>
                )}
              </div>

              {/* Evaluations Card */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl border border-orange-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-medium text-orange-700">
                    Evaluations
                  </div>
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-orange-900 mb-2">
                  {notes.length}
                </div>
                <div className="text-sm text-orange-700">
                  evaluation{notes.length !== 1 ? "s" : ""} recorded
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4 bg-white space-y-3">
              {/* Stage-specific evaluation checkboxes */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Evaluation Criteria:
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {(() => {
                    const criteria: Record<
                      StageKey,
                      Array<{ key: string; label: string; weight: number }>
                    > = {
                      hr: [
                        {
                          key: "clear_communication",
                          label: "Clear communication skills",
                          weight: 20,
                        },
                        {
                          key: "motivation_aligned",
                          label: "Motivation aligned with role",
                          weight: 25,
                        },
                        {
                          key: "cultural_fit",
                          label: "Good cultural fit",
                          weight: 20,
                        },
                        {
                          key: "availability",
                          label: "Available for interview",
                          weight: 15,
                        },
                        {
                          key: "salary_expectations",
                          label: "Salary expectations reasonable",
                          weight: 20,
                        },
                      ],
                      technical: [
                        {
                          key: "technical_knowledge",
                          label: "Strong technical knowledge",
                          weight: 30,
                        },
                        {
                          key: "problem_solving",
                          label: "Good problem-solving approach",
                          weight: 25,
                        },
                        {
                          key: "code_quality",
                          label: "Code quality demonstrated",
                          weight: 20,
                        },
                        {
                          key: "learning_ability",
                          label: "Shows learning ability",
                          weight: 15,
                        },
                        {
                          key: "technical_communication",
                          label: "Can explain technical concepts",
                          weight: 10,
                        },
                      ],
                      manager: [
                        {
                          key: "leadership_potential",
                          label: "Leadership potential",
                          weight: 25,
                        },
                        {
                          key: "strategic_thinking",
                          label: "Strategic thinking ability",
                          weight: 20,
                        },
                        {
                          key: "team_management",
                          label: "Team management skills",
                          weight: 20,
                        },
                        {
                          key: "decision_making",
                          label: "Good decision-making",
                          weight: 15,
                        },
                        {
                          key: "vision_alignment",
                          label: "Vision alignment",
                          weight: 20,
                        },
                      ],
                      team: [
                        {
                          key: "collaboration",
                          label: "Good collaboration skills",
                          weight: 25,
                        },
                        {
                          key: "communication",
                          label: "Effective communication",
                          weight: 20,
                        },
                        {
                          key: "adaptability",
                          label: "Adaptable to team dynamics",
                          weight: 20,
                        },
                        {
                          key: "contribution",
                          label: "Would contribute positively",
                          weight: 20,
                        },
                        {
                          key: "personality_fit",
                          label: "Personality fits team",
                          weight: 15,
                        },
                      ],
                      reference: [
                        {
                          key: "work_quality",
                          label: "High work quality",
                          weight: 25,
                        },
                        {
                          key: "reliability",
                          label: "Reliable and punctual",
                          weight: 20,
                        },
                        {
                          key: "teamwork",
                          label: "Good team player",
                          weight: 20,
                        },
                        {
                          key: "growth_potential",
                          label: "Growth potential",
                          weight: 20,
                        },
                        {
                          key: "recommendation",
                          label: "Would recommend hiring",
                          weight: 15,
                        },
                      ],
                    };

                    return criteria[stage].map((criterion) => (
                      <label
                        key={criterion.key}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={checkboxes[criterion.key] || false}
                          onChange={(e) => {
                            setCheckboxes((prev) => ({
                              ...prev,
                              [criterion.key]: e.target.checked,
                            }));
                          }}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="flex-1">{criterion.label}</span>
                        <span className="text-xs text-gray-500">
                          ({criterion.weight}pts)
                        </span>
                      </label>
                    ));
                  })()}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <select
                  className="border rounded px-3 py-2 text-sm"
                  value={stage}
                  onChange={(e) => setStage(e.target.value as StageKey)}
                >
                  <option value="hr">HR Screening</option>
                  <option value="technical">Technical Interview</option>
                  <option value="manager">Manager Interview</option>
                  <option value="team">Team Interview</option>
                  <option value="reference">Reference Check</option>
                </select>
                <select
                  className="border rounded px-3 py-2 text-sm"
                  value={verdict}
                  onChange={(e) => setVerdict(e.target.value)}
                >
                  <option value="">No verdict</option>
                  <option value="shortlist">Shortlist</option>
                  <option value="hold">Hold</option>
                  <option value="reject">Reject</option>
                </select>
                <input
                  className="border rounded px-3 py-2 text-sm"
                  placeholder="Score (0-100)"
                  value={score}
                  onChange={(e) =>
                    setScore(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  inputMode="numeric"
                />
                <button
                  className="px-3 py-2 rounded text-white bg-gradient-to-r from-orange-500 to-pink-600 text-sm"
                  onClick={save}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
              <textarea
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="Notes"
                rows={6}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              {formError && (
                <div className="text-xs text-red-600">{formError}</div>
              )}
              {suggestionInfo && (
                <div className="text-xs text-gray-500">{suggestionInfo}</div>
              )}

              <div className="text-xs text-gray-600">
                <div className="font-medium mb-1">Stage prompts</div>
                <ul className="list-disc ml-5 space-y-1">
                  {stagePrompts[stage].map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
                <div className="mt-2 text-[11px] text-gray-500">
                  Note: Only one evaluation per stage. Saving again will update
                  the existing evaluation.
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-6 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Screening History
                </h3>
                <div className="text-sm text-gray-500">
                  {notes.length} total evaluation{notes.length !== 1 ? "s" : ""}
                </div>
              </div>
              <div className="space-y-6">
                {(Object.keys(grouped) as StageKey[]).map((k) => (
                  <div key={k} className="relative">
                    <div className="flex flex-col sm:flex-row sm:items-center mb-3 sm:mb-4 gap-2">
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-3 ${
                            getStageAccent(k).dotBg
                          }`}
                        ></div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800">
                          {stageLabels[k]}
                        </h4>
                      </div>
                      <div className="sm:ml-auto flex items-center">
                        <span className="text-xs sm:text-sm text-gray-500">
                          {grouped[k].length} evaluation
                          {grouped[k].length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    {grouped[k].length === 0 ? (
                      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                        <div className="text-gray-400 text-sm">
                          No evaluations yet for this stage
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 sm:space-y-3">
                        {grouped[k].map((n, idx) => (
                          <div
                            key={`${n.id}-${n.updatedAt}-${idx}`}
                            className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 sm:mb-3 gap-2">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <div
                                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                                    getStageAccent(k).lightBg
                                  }`}
                                >
                                  <span
                                    className={`${
                                      getStageAccent(k).text
                                    } text-xs sm:text-sm font-semibold`}
                                  >
                                    {n.createdBy?.charAt(0)?.toUpperCase() ||
                                      "?"}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 text-sm sm:text-base">
                                    {n.createdBy || "Unknown Evaluator"}
                                  </div>
                                  <div className="text-xs sm:text-sm text-gray-500">
                                    {formatDate(
                                      n.createdAt,
                                      "DD MMM, YYYY hh:mm A"
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {n.score != null && (
                                  <div className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
                                    {n.score}/100
                                  </div>
                                )}
                                {n.verdict && (
                                  <VerdictBadge verdict={n.verdict} />
                                )}
                              </div>
                            </div>
                            {n.notes && (
                              <div className="bg-white border border-gray-100 rounded-lg p-2 sm:p-3">
                                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap break-words">
                                  {n.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
