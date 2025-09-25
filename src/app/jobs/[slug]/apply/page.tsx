"use client";

import { useMemo, useState, useEffect, use as usePromise } from "react";
import { track } from "@vercel/analytics/react";
import { useForm, FormProvider, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const basicSchema = z
  .object({
    // fullName: z.string().min(2, "Enter your full name"),
    // email: z.string().email("Enter a valid email"),
    gender: z.enum(["male", "female", "other"] as const, {
      message: "Select Gender",
    }),
    dateOfBirth: z.string().min(1, "Select date of birth"),
    mobileNo: z
      .string()
      .trim()
      .min(10, "Enter correct mobile number")
      .max(14, "Enter correct mobile number"),
    currentStatus: z.string().min(2, "Select status"),
    country: z.string().min(2, "Select country"),
    state: z.string().min(2, "Select state"),
    city: z.string().min(2, "Select city"),
    linkedin: z.string().url("Enter a valid LinkedIn URL"),
    portfolio: z.string().url("Enter a valid URL").optional().or(z.literal("")),
    // imageUrl: z.string().url("Invalid image URL").optional(),
  })
  .superRefine((data, ctx) => {
    const digits = (data.mobileNo || "").replace(/[\s-]/g, "");
    if (data.country === "India") {
      const india = /^(?:\+?91)?[6-9]\d{9}$/;
      if (!india.test(digits)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["mobileNo"],
          message: "Enter a valid Indian mobile number",
        });
      }
    } else if (data.country === "Malaysia") {
      const malaysia = /^(?:\+?60)?1\d{8,9}$/;
      if (!malaysia.test(digits)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["mobileNo"],
          message: "Enter a valid Malaysian mobile number",
        });
      }
    } else if (data.country === "Sri Lanka") {
      // Accepts 07XXXXXXXX (10 digits) or +947XXXXXXXX (international format)
      const srilanka = /^(?:\+?94|0)7\d{8}$/;
      if (!srilanka.test(digits)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["mobileNo"],
          message: "Enter a valid Sri Lankan mobile number",
        });
      }
    }
  });

const skillsSchema = z
  .object({
    educationSchool: z
      .string()
      .min(10, "Enter correct school name")
      .max(100, "Enter correct school name"),
    educationSchoolPercentage: z.preprocess((v) => {
      if (v === "" || v === null || v === undefined) return undefined;
      const n = typeof v === "string" ? Number(v) : v;
      return Number.isNaN(n as number) ? undefined : n;
    }, z.number({ message: "Enter school percentage %" }).min(0, "Minimum 0%").max(100, "Maximum 100%")),
    educationCollege: z
      .string()
      .min(10, "Enter correct college name")
      .max(100, "Enter correct college name"),
    educationCollegePercentage: z.preprocess((v) => {
      if (v === "" || v === null || v === undefined) return undefined;
      const n = typeof v === "string" ? Number(v) : v;
      return Number.isNaN(n as number) ? undefined : n;
    }, z.number({ message: "Enter college percentage %" }).min(0, "Minimum 0%").max(100, "Maximum 100%")),
    workedAlready: z.boolean().default(false),
    companyName: z.string().optional().or(z.literal("")),
    skills: z.array(z.string()).min(1, "Select at least one skill"),
    resumeFile: z
      .instanceof(File, { message: "Upload your resume" })
      .refine(
        (f) => f.size <= 5 * 1024 * 1024,
        "Upload resume under 5MB size."
      ),
  })
  .superRefine((data, ctx) => {
    if (data.workedAlready && !data.companyName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["companyName"],
        message: "Enter company name, which you have worked.",
      });
    }
  });

const motivationSchema = z.object({
  reasonToJoin: z
    .string()
    .min(30, "Please write at least 30 characters")
    .max(1000, "Keep it under 1000 characters"),
  excitedAboutStartup: z
    .string()
    .min(30, "Please write at least 30 characters")
    .max(1000, "Keep it under 1000 characters"),
  cameFrom: z.enum(
    [
      "LinkedIn",
      "YouTube",
      "Instagram",
      "Facebook",
      "GitHub",
      "Discord",
      "Friend/Referral",
      "Other",
    ] as const,
    { message: "Select anyone" }
  ),
  acceptCondition: z
    .boolean()
    .refine((v) => v === true, "You must confirm you can handle the role"),
});

const formSchema = basicSchema
  .and(skillsSchema)
  .and(motivationSchema)
  .and(
    z.object({
      jobId: z.number(),
    })
  );
// What user information can i get from "Login with Linkedin OpenID" OAuth?

type FormData = z.infer<typeof formSchema>;

export default function ApplyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = usePromise(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [countryOptions] = useState<string[]>([
    "India",
    "Malaysia",
    "Sri Lanka",
  ]);
  const [stateOptions, setStateOptions] = useState<string[]>([]);
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [job, setJob] = useState<Job>();

  // get job slug from params and fetch job details
  useEffect(() => {
    apiFetch(`/api/jobs/${slug}`, { cache: "no-store" })
      .then(async (r) => (r.ok ? ((await r.json()) as Job) : ({} as Job)))
      .then((data) => {
        if (!data || !data.slug || data.slug !== slug) {
          router.replace("/404");
          return;
        }
        setJob(data);
      })
      .catch(() => {
        router.replace("/404");
      });
  }, [slug, router]);

  const defaultValues = useMemo(
    () => ({
      fullName: session?.user?.name || "",
      email: session?.user?.email || "",
      imageUrl:
        (session?.user as { image?: string; picture?: string } | undefined)
          ?.image ||
        (session?.user as { image?: string; picture?: string } | undefined)
          ?.picture ||
        "",
      gender: undefined,
      mobileNo: "",
      currentStatus: "",
      country: "",
      state: "",
      city: "",
      linkedin: "",
      portfolio: "",
      educationSchool: "",
      educationSchoolPercentage: undefined as unknown as number,
      educationCollege: "",
      educationCollegePercentage: undefined as unknown as number,
      workedAlready: false,
      companyName: "",
      skills: [] as string[],
      resumeFile: undefined as unknown as File,
      reasonToJoin: "",
      excitedAboutStartup: "",
      cameFrom: undefined as unknown as FormData["cameFrom"],
      dateOfBirth: "",
      acceptCondition: false,
      jobId: 0,
    }),
    [session]
  );

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormData>,
    defaultValues,
    mode: "onBlur",
  });
  // const fullName = methods.watch("fullName");
  // const email = methods.watch("email");
  const country = methods.watch("country");
  const stateVal = methods.watch("state");
  const workedAlready = methods.watch("workedAlready");

  // Simple datasets for cascading selects (can be replaced with a package later)
  const COUNTRY_TO_STATES: Record<string, string[]> = useMemo(
    () => ({
      India: [
        "Tamil Nadu",
        "Kerala",
        "Karnataka",
        "Telengana",
        "Andhra Pradesh",
        "Other",
      ],
      Malaysia: ["Kuala Lumpur", "Selangor", "Johor", "Penang", "Other"],
      "Sri Lanka": ["Columbo", "Other"],
    }),
    []
  );
  const STATE_TO_CITIES: Record<string, string[]> = useMemo(
    () => ({
      "Tamil Nadu": [
        "Chennai",
        "Cuddalore",
        "Coimbatore",
        "Madurai",
        "Trichy",
        "Other",
      ],
      Karnataka: ["Bengaluru", "Mysuru", "Mangaluru", "Other"],
      Kerala: ["Bengaluru", "Mysuru", "Mangaluru"],
      Telengana: ["Hyderabad", "Other"],
      "Andhra Pradesh": ["Hyderabad", "Other"],
      Other: ["Other"],
      "Kuala Lumpur": ["Kuala Lumpur", "Other"],
      Selangor: ["Selangor", "Other"],
      Johor: ["Johor", "Other"],
      Penang: ["Penang", "Other"],
      Columbo: ["Columbo", "Other"],
    }),
    []
  );

  // Redirect unauthorized users back to the job page
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/jobs/${slug}`);
    }
  }, [status, router, slug]);

  // Update dependent selects when country/state changes
  useEffect(() => {
    const states = COUNTRY_TO_STATES[country] || [];
    setStateOptions(states);
    if (!states.includes(methods.getValues("state"))) {
      methods.setValue("state", "");
      setCityOptions([]);
      methods.setValue("city", "");
    }
  }, [country, COUNTRY_TO_STATES, methods]);

  useEffect(() => {
    const cities = STATE_TO_CITIES[stateVal] || [];
    setCityOptions(cities);
    if (!cities.includes(methods.getValues("city"))) {
      methods.setValue("city", "");
    }
  }, [stateVal, STATE_TO_CITIES, methods]);

  // Loading skeleton while session resolves
  if (status === "loading") {
    return (
      <main className="container mx-auto py-8 px-4 max-w-3xl">
        <div className="bg-gradient-to-r from-orange-50 via-white to-orange-50 border rounded-xl shadow-sm p-6 animate-pulse">
          <div className="h-6 w-64 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-80 bg-gray-200 rounded mb-6" />
          <div className="space-y-6">
            <div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-2 bg-gray-300 w-1/3" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div className="h-5 bg-gray-200 rounded" />
                <div className="h-5 bg-gray-200 rounded" />
                <div className="h-5 bg-gray-200 rounded" />
              </div>
            </div>
            <section className="space-y-4">
              <div className="flex items-center gap-5 p-4 bg-white/80 border rounded-xl shadow-sm">
                <div className="h-20 w-20 bg-gray-200 rounded-full" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                  <div className="h-10 bg-gray-200 rounded" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            </section>
          </div>
        </div>
      </main>
    );
  }

  // Prevent any UI from rendering for unauthorized
  if (status !== "authenticated") return null;

  const onNext = async () => {
    setError(null);
    const fieldsForStep: import("react-hook-form").Path<FormData>[] =
      step === 1
        ? [
            "gender",
            "dateOfBirth",
            "mobileNo",
            "currentStatus",
            "country",
            "state",
            "city",
            "linkedin",
            "portfolio",
          ]
        : step === 2
        ? [
            "educationSchool",
            "educationSchoolPercentage",
            "educationCollege",
            "educationCollegePercentage",
            "workedAlready",
            "companyName",
            "skills",
            "resumeFile",
          ]
        : [
            "reasonToJoin",
            "excitedAboutStartup",
            "cameFrom",
            "acceptCondition",
          ];
    const valid = await methods.trigger(fieldsForStep, {
      shouldFocus: true,
    });
    if (!valid) {
      setError("Please fix validation errors");
      try {
        track("apply_validation_error", { step, slug });
      } catch {}
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStep((s) => {
      const next = Math.min(3, s + 1);
      try {
        track("apply_next_step", { from: s, to: next, slug });
      } catch {}
      return next;
    });
  };

  const onPrev = () =>
    setStep((s) => {
      const prev = Math.max(1, s - 1);
      try {
        track("apply_prev_step", { from: s, to: prev, slug });
      } catch {}
      return prev;
    });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      try {
        track("apply_submit_attempt", { slug });
      } catch {}
      const allValid = await methods.trigger(undefined, { shouldFocus: true });
      if (!allValid) {
        setError("Please fix validation errors");
        setSubmitting(false);
        try {
          track("apply_validation_error", { step: "final", slug });
        } catch {}
        return;
      }
      const jobRes = await fetch(`/api/jobs/${slug}`, {
        cache: "no-store",
      });
      const job = jobRes.ok ? await jobRes.json() : null;
      if (!job?.id) throw new Error("Job not found");
      methods.setValue("jobId", job.id);

      const data = methods.getValues();

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "resumeFile" && value instanceof File) {
          formData.append("resume", value);
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      const res = await fetch("/api/apply", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to submit application");
      setSuccess("Application submitted successfully");
      try {
        track("apply_submit_success", { slug, jobId: job.id });
      } catch {}
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      try {
        track("apply_submit_failure", { slug, message });
      } catch {}
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <main className="container mx-auto py-14 px-4 max-w-3xl">
        <SuccessCelebration
          title="Application submitted!"
          subtitle="We received your application. We'll get back to you soon."
        />
      </main>
    );
  }

  return (
    <main className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="bg-gradient-to-r from-orange-50 via-white to-orange-50 border rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-2">
          Applying for{" "}
          <span className="ml-1 capitalize bg-orange-100 text-orange-800 rounded-full px-3 py-1 text-sm shadow-sm animate-in fade-in">
            {job?.title || "this job"}
          </span>
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Complete the 3 steps to submit your application.
        </p>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Stepper */}
            <div className="relative">
              <div className="mb-4 flex items-center justify-around gap-6 text-xs font-medium text-gray-700">
                <StepBadge index={1} active={step === 1} label="Basic" />
                <StepBadge index={2} active={step === 2} label="Skills" />
                <StepBadge index={3} active={step === 3} label="Motivation" />
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-gradient-to-r from-orange-500 to-pink-600 transition-all duration-500"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>

            {step === 1 && (
              <section className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-5 p-4 bg-white/80 border rounded-xl shadow-sm">
                  <Image
                    src={
                      (
                        session?.user as
                          | { image?: string; picture?: string }
                          | undefined
                      )?.image || ""
                    }
                    alt={session?.user?.name || "Profile"}
                    width={80}
                    height={80}
                    priority
                    className="h-20 w-20 rounded-full object-cover ring-2 ring-orange-200"
                  />
                  <div className="flex-1">
                    <h4 className="text-base font-semibold">
                      Hello {session?.user ? session?.user?.name : "there"}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {session?.user ? session?.user?.email : ""}
                    </p>
                    {/* <Field
                      name="fullName"
                      label="Full name"
                      placeholder="Your full name"
                      readOnly
                    />
                    <Field
                      name="email"
                      label="Email"
                      type="email"
                      placeholder="you@example.com"
                      readOnly
                    /> */}
                  </div>
                </div>
                {/* <Field
                  name="fullName"
                  label="Full name"
                  placeholder="Your full name"
                  readOnly
                />
                <Field
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                /> */}
                {/* <Field
                  name="imageUrl"
                  label="Profile image URL"
                  placeholder="https://..."
                /> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Select
                    name="gender"
                    label="Gender"
                    options={["male", "female", "other"]}
                    required
                  />
                  <DateField
                    name="dateOfBirth"
                    label="Date of Birth"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field
                    name="mobileNo"
                    label="Mobile number"
                    placeholder="e.g. +91 9xxxx xxxxx"
                    required
                  />
                  <Select
                    name="currentStatus"
                    label="Current status?"
                    options={[
                      "Studying",
                      "Job Seeker",
                      "Career Gap",
                      "Working Professional",
                    ]}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Select
                    name="country"
                    label="Country"
                    options={[...countryOptions]}
                    required
                  />
                  <Select
                    name="state"
                    label="State"
                    options={[...stateOptions]}
                    required
                  />
                  <Select
                    name="city"
                    label="City"
                    options={[...cityOptions]}
                    required
                  />
                </div>
                <Field
                  name="linkedin"
                  label="LinkedIn profile URL"
                  placeholder="https://linkedin.com/in/..."
                  required
                />
                <Field
                  name="portfolio"
                  label="Portfolio URL (optional)"
                  placeholder="https://..."
                />
              </section>
            )}

            {step === 2 && (
              <section className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <Field
                      name="educationSchool"
                      label="School"
                      placeholder="Enter your School name"
                      required
                    />
                  </div>
                  <Field
                    name="educationSchoolPercentage"
                    label="School Percentage"
                    type="number"
                    placeholder="e.g. 85"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <Field
                      name="educationCollege"
                      label="College"
                      placeholder="Enter your College name"
                      required
                    />
                  </div>
                  <Field
                    name="educationCollegePercentage"
                    label="College Percentage"
                    type="number"
                    placeholder="e.g. 78"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <YesNoBooleanSelect
                    name="workedAlready"
                    label="Have you worked before?"
                    yesLabel="Yes"
                    noLabel="No, I'm Fresher"
                  />
                  <Field
                    name="companyName"
                    label="Company name"
                    placeholder="If yes, your company"
                    readOnly={!workedAlready}
                  />
                </div>
                <MultiInput
                  name="skills"
                  label="Skills (press Enter to add)"
                  placeholder="e.g. React, Node, SQL"
                  required
                />
                <FileInput
                  name="resumeFile"
                  label="Upload Resume (PDF, max 5MB)"
                  accept="application/pdf"
                  required
                />
              </section>
            )}

            {step === 3 && (
              <section className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <TextArea
                  name="reasonToJoin"
                  label="Why do you want to join this position?"
                  placeholder="Tell us why this role fits you..."
                  rows={5}
                />
                <TextArea
                  name="excitedAboutStartup"
                  label="What excites you about working on a startup product?"
                  placeholder="Share what motivates you..."
                  rows={5}
                />
                <Select
                  name="cameFrom"
                  label="How do you hear about us?"
                  options={[
                    "LinkedIn",
                    "YouTube",
                    "Instagram",
                    "Facebook",
                    "GitHub",
                    "Discord",
                    "Friend/Referral",
                    "Other",
                  ]}
                  required
                />
                <Alert
                  variant="info"
                  title="This is a startup role. You will act as a full‑stack engineer with high responsibility."
                />
                <CheckboxField
                  name="acceptCondition"
                  label=" I confirm I can handle this."
                  required
                />
              </section>
            )}

            {error && (
              <Alert variant="error" title={error} />
              // <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded">
              //   {error}
              // </p>
            )}
            {success && (
              <Alert variant="success" title={success} />
              // <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded">
              //   {success}
              // </p>
            )}

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onPrev}
                disabled={step === 1}
                className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors inline-flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4 text-gray-700"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M15.53 4.47a.75.75 0 010 1.06L9.06 12l6.47 6.47a.75.75 0 11-1.06 1.06l-7-7a.75.75 0 010-1.06l7-7a.75.75 0 011.06 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Back
              </button>
              {step < 3 ? (
                <button
                  type="button"
                  onClick={onNext}
                  className="px-5 py-2.5 rounded-lg text-white bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 shadow-sm transition-all inline-flex items-center gap-2"
                >
                  Next
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4 text-white"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.47 19.53a.75.75 0 010-1.06L14.94 12 8.47 5.53a.75.75 0 111.06-1.06l7 7a.75.75 0 010 1.06l-7 7a.75.75 0 01-1.06 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              ) : methods.watch("acceptCondition") ? (
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-lg text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-sm transition-all disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              ) : (
                <span className="text-sm text-gray-600">
                  Please confirm you can handle the role to submit.
                </span>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </main>
  );
}

import { Controller, useFormContext } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { Job } from "@prisma/client";
import Alert from "@/components/ui/alert";
import { useRef } from "react";
import confetti from "canvas-confetti";

function StepBadge({
  index,
  label,
  active,
}: {
  index: number;
  label: string;
  active?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-w-20">
      <span
        className={[
          "inline-flex h-7 w-7 items-center justify-center rounded-full text-white text-xs font-semibold shadow-sm transition-all",
          active
            ? "bg-gradient-to-r from-orange-500 to-pink-600 scale-105 ring-2 ring-orange-200"
            : "bg-gray-300",
        ].join(" ")}
      >
        {index}
      </span>
      <span
        className={[
          "mt-1 text-[11px] font-medium",
          active ? "text-orange-700" : "text-gray-500",
        ].join(" ")}
      >
        {label}
      </span>
    </div>
  );
}

function InputError({ name }: { name: keyof FormData & string }) {
  const {
    formState: { errors },
  } = useFormContext<FormData>();
  const message = (errors as unknown as Record<string, { message?: string }>)[
    name
  ]?.message;
  if (!message) return null;
  return <p className="text-xs text-red-700 mt-1.5">{message}</p>;
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  readOnly = false,
  required = false,
}: {
  name: keyof FormData & string;
  label: string;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
}) {
  const { register } = useFormContext<FormData>();
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-600 ml-0.5">*</span>}
      </label>
      <input
        className="w-full border rounded-lg px-3 py-2 bg-white/90 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
        {...register(
          name as unknown as import("react-hook-form").Path<FormData>,
          type === "number" ? { valueAsNumber: true } : undefined
        )}
        type={type}
        placeholder={placeholder}
        readOnly={readOnly}
      />
      <InputError name={name} />
    </div>
  );
}

function TextArea({
  name,
  label,
  rows = 4,
  placeholder,
  required = false,
}: {
  name: keyof FormData & string;
  label: string;
  rows?: number;
  placeholder?: string;
  required?: boolean;
}) {
  const { register } = useFormContext<FormData>();
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-600 ml-0.5">*</span>}
      </label>
      <textarea
        className="w-full border rounded-lg px-3 py-2 bg-white/90 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
        rows={rows}
        placeholder={placeholder}
        {...register(
          name as unknown as import("react-hook-form").Path<FormData>
        )}
      />
      <InputError name={name} />
    </div>
  );
}

function Select({
  name,
  label,
  options,
  required = false,
}: {
  name: keyof FormData & string;
  label: string;
  options: string[];
  required?: boolean;
}) {
  const { control } = useFormContext<FormData>();
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-600 ml-0.5">*</span>}
      </label>
      <Controller
        control={control}
        name={name as unknown as import("react-hook-form").Path<FormData>}
        render={({ field }) => (
          <select
            className="w-full border rounded-lg px-3 py-2 bg-white/90 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            name={field.name}
            value={(field.value as string) ?? ""}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            ref={field.ref}
          >
            <option value="">Select</option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        )}
      />
      <InputError name={name} />
    </div>
  );
}

function DateField({
  name,
  label,
  required = false,
}: {
  name: keyof FormData & string;
  label: string;
  required?: boolean;
}) {
  const { register } = useFormContext<FormData>();
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-600 ml-0.5">*</span>}
      </label>
      <input
        type="date"
        className="w-full border rounded-lg px-3 py-2 bg-white/90 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
        {...register(
          name as unknown as import("react-hook-form").Path<FormData>
        )}
      />
      <InputError name={name} />
    </div>
  );
}

function YesNoBooleanSelect({
  name,
  label,
  yesLabel = "Yes",
  noLabel = "No",
  required = false,
}: {
  name: keyof FormData & string;
  label: string;
  yesLabel?: string;
  noLabel?: string;
  required?: boolean;
}) {
  const { control } = useFormContext<FormData>();
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-600 ml-0.5">*</span>}
      </label>
      <Controller
        control={control}
        name={name as unknown as import("react-hook-form").Path<FormData>}
        render={({ field }) => (
          <select
            className="w-full border rounded-lg px-3 py-2 bg-white/90 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            value={
              field.value === true ? "yes" : field.value === false ? "no" : ""
            }
            onChange={(e) => field.onChange(e.target.value === "yes")}
          >
            <option value="">Select</option>
            <option value="yes">{yesLabel}</option>
            <option value="no">{noLabel}</option>
          </select>
        )}
      />
      <InputError name={name} />
    </div>
  );
}

function CheckboxField({
  name,
  label,
  required = false,
}: {
  name: keyof FormData & string;
  label: string;
  required?: boolean;
}) {
  const { control } = useFormContext<FormData>();
  return (
    <div className="inline-flex flex-row-reverse">
      <label htmlFor={name} className="block text-sm font-medium mb-1 ml-2">
        {label}
        {required && <span className="text-red-600 ml-0.5">*</span>}
      </label>
      <Controller
        control={control}
        name={name as unknown as import("react-hook-form").Path<FormData>}
        render={({ field }) => (
          <input
            id={name}
            type="checkbox"
            className="h-4 w-4 align-middle border-gray-300 rounded text-orange-600 focus:ring-orange-400"
            checked={Boolean(field.value)}
            onChange={(e) => field.onChange(e.target.checked)}
          />
        )}
      />
      <InputError name={name} />
    </div>
  );
}

function MultiInput({
  name,
  label,
  placeholder,
  required = false,
}: {
  name: keyof FormData & string;
  label: string;
  placeholder?: string;
  required?: boolean;
}) {
  const { control } = useFormContext<FormData>();
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-600 ml-0.5">*</span>}
      </label>
      <Controller
        control={control}
        name={name as unknown as import("react-hook-form").Path<FormData>}
        render={({ field }) => {
          const value = Array.isArray(field.value)
            ? (field.value as string[])
            : [];
          return (
            <TagInput
              value={value}
              onChange={(v) => field.onChange(v)}
              placeholder={placeholder}
            />
          );
        }}
      />
      <InputError name={name} />
    </div>
  );
}

function FileInput({
  name,
  label,
  accept,
  required = false,
}: {
  name: keyof FormData & string;
  label: string;
  accept?: string;
  required?: boolean;
}) {
  const { setValue } = useFormContext<FormData>();
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-600 ml-0.5">*</span>}
      </label>
      <input
        type="file"
        accept={accept}
        className="w-full border rounded-lg px-3 py-2 bg-white/90 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
        onChange={(e) => {
          const file = e.target.files?.[0] as File | undefined;
          setValue(
            name as unknown as import("react-hook-form").Path<FormData>,
            file as unknown as FormData[typeof name],
            { shouldValidate: true }
          );
        }}
      />
      <InputError name={name} />
    </div>
  );
}

function TagInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (val: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");
  const add = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (value.includes(trimmed)) return;
    onChange([...(value || []), trimmed]);
    setInput("");
  };
  const remove = (idx: number) => {
    const next = [...value];
    next.splice(idx, 1);
    onChange(next);
  };
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value?.map((tag, idx) => (
          <span
            key={tag}
            className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 rounded-full px-3 py-1 text-sm shadow-sm animate-in fade-in"
          >
            {tag}
            <button
              type="button"
              className="text-orange-700 hover:text-orange-900"
              onClick={() => remove(idx)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          className="flex-1 border rounded-lg px-3 py-2 bg-white/90 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="px-3 py-2 border rounded-lg bg-white hover:bg-gray-50 transition"
          onClick={add}
        >
          Add
        </button>
      </div>
    </div>
  );
}

function SuccessCelebration({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    const shoot = (particleRatio: number, opts: Record<string, unknown>) => {
      confetti({
        particleCount: Math.floor(120 * particleRatio),
        spread: 70,
        origin: { y: 0.6 },
        decay: 0.94,
        ...opts,
      });
    };
    shoot(0.25, { startVelocity: 55, ticks: 120 });
    shoot(0.2, { spread: 120 });
    shoot(0.35, { gravity: 0.9, scalar: 0.9 });
    shoot(0.1, { startVelocity: 45, scalar: 1.2 });
    shoot(0.1, { startVelocity: 25, scalar: 1.4 });
  }, []);

  return (
    <div className="bg-white/90 border rounded-2xl shadow-md p-10 text-center animate-in fade-in slide-in-from-bottom-2">
      <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center text-white text-3xl">
        ✓
      </div>
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
      <div className="mt-8 flex items-center justify-center gap-3">
        <Link
          href="/"
          className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
        >
          Go home
        </Link>
        <a
          href="https://cyberdudenetworks.com"
          target="_blank"
          className="px-5 py-2.5 rounded-lg text-white bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 shadow-sm"
        >
          Know about us
        </a>
      </div>
    </div>
  );
}
