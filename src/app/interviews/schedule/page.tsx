"use client";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { InterviewSlot } from "@prisma/client";
import { formatDate } from "@/lib/date";

const meetLink = "https://meet.google.com/add-iwqc-peo";

export default function ScheduleInterviewPage() {
  const { data: session, status } = useSession();
  const [slots, setSlots] = useState<
    (InterviewSlot & { interviewavailability?: { date: string | Date } })[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [applications, setApplications] = useState<
    {
      id: number;
      job: { title: string; slug: string; company?: string | null };
    }[]
  >([]);
  const [selectedAppId, setSelectedAppId] = useState<number | "">("");
  const [agreed, setAgreed] = useState(false);
  const [bookedSlot, setBookedSlot] = useState<InterviewSlot | null>(null);
  const [appHasBooking, setAppHasBooking] = useState(false);
  const [appBookedSlot, setAppBookedSlot] = useState<InterviewSlot | null>(
    null
  );
  const [checkingBooking, setCheckingBooking] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    // load user's applications
    fetch("/api/applications", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((apps) => setApplications(apps))
      .catch(() => setApplications([]));
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated") return;
    setLoading(true);
    fetch(`/api/interviews/slots`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setSlots)
      .catch(() => setError("Failed to load slots"))
      .finally(() => setLoading(false));
  }, [status]);

  // On application selection, check if already booked and show alert UI
  useEffect(() => {
    (async () => {
      if (!selectedAppId) {
        setAppHasBooking(false);
        setAppBookedSlot(null);
        setCheckingBooking(false);
        return;
      }
      setCheckingBooking(true);
      const res = await fetch(
        `/api/interviews/check-booked?applicationId=${selectedAppId}`,
        {
          cache: "no-store",
        }
      );
      if (res.ok) {
        const data = await res.json();
        setAppHasBooking(!!data.booked);
        setAppBookedSlot(data.booked ? (data.slot as InterviewSlot) : null);
      }
      setCheckingBooking(false);
    })();
  }, [selectedAppId]);

  if (status === "loading")
    return <main className="container mx-auto p-6">Loading…</main>;
  if (status !== "authenticated")
    return (
      <main className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-2">Schedule your interview</h1>
        <p className="mb-4 text-gray-700">
          Please login with LinkedIn to continue.
        </p>
        <button
          className="px-4 py-2 bg-blue-700 text-white rounded"
          onClick={() => signIn("linkedin")}
        >
          Login with LinkedIn
        </button>
      </main>
    );

  // Success view after booking
  if (bookedSlot) {
    const title = encodeURIComponent("CyberDude Interview");
    const details = encodeURIComponent(
      `Your interview has been scheduled. Join via Google Meet: ${meetLink}`
    );
    const location = encodeURIComponent("Google Meet");
    const toICS = (d: Date) =>
      d.toISOString().replace(/[-:]/g, "").replace(".000", "");
    const start = toICS(new Date(bookedSlot.startsAt));
    const end = toICS(new Date(bookedSlot.endsAt));
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}%2F${end}&details=${details}&location=${location}`;

    return (
      <main className="container mx-auto p-6">
        <div className="max-w-xl mx-auto bg-gradient-to-br from-green-50 to-emerald-100 border border-emerald-200 rounded-lg p-5 shadow-sm">
          <h1 className="text-xl font-semibold text-emerald-900 mb-2">
            Interview scheduled successfully 🎉
          </h1>
          <p className="text-emerald-900 mb-4">
            Time:{" "}
            {new Date(bookedSlot.startsAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
              hour12: true,
            })}
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <a
              className="px-4 py-2 rounded bg-emerald-700 text-white text-center"
              href={meetLink}
              target="_blank"
              rel="noreferrer"
            >
              Join Google Meet
            </a>
            <a
              className="px-4 py-2 rounded border border-emerald-700 text-emerald-800 text-center"
              href={calendarUrl}
              target="_blank"
              rel="noreferrer"
            >
              Add to Calendar
            </a>
          </div>
        </div>
      </main>
    );
  }

  // Group slots by date
  const groups = slots.reduce<Record<string, InterviewSlot[]>>((acc, s) => {
    const dateKey = new Date(s.interviewavailability?.date ?? s.startsAt)
      .toISOString()
      .slice(0, 10);
    (acc[dateKey] = acc[dateKey] || []).push(s);
    return acc;
  }, {});
  const orderedDates = Object.keys(groups).sort();

  // Selected application meta
  const selectedApp =
    selectedAppId !== ""
      ? applications.find((a) => a.id === Number(selectedAppId)) || null
      : null;

  return (
    <main className="container mx-auto p-6">
      {!agreed ? (
        <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur border rounded-xl shadow  mb-6">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex  items-center justify-center gap-2 bg-green-50 w-full p-5">
              <div className="p-2 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                ℹ️
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">
                  Acknowledge before you schedule
                </h2>
                <p className="text-sm text-gray-700">
                  Please read the following terms and conditions before you
                  schedule your interview.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 p-5">
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1 mb-3">
                <li>
                  All interviews will be conducted online via Google Meet. The
                  meeting link will be provided at the end of slot submission.
                </li>
                <li>
                  Please ensure you have a functional webcam, a clear
                  microphone, and a stable internet connection in a quiet,
                  distraction-free environment.
                </li>
                <li>
                  A working webcam is mandatory. Your video must be enabled for
                  the entire duration of the interview.
                </li>
                <li>
                  Please choose your slot carefully. Once booked, interview
                  slots cannot be rescheduled or changed.
                </li>
                <li>
                  Punctuality is critical. Please join the meeting at your
                  scheduled time. Late arrivals may lead to rejection of your
                  application.
                </li>
                <li>
                  Be prepared to discuss your experience. Have your resume,
                  portfolio, and any relevant project links readily accessible
                  to share upon request.
                </li>
                <li>
                  The interview will be strictly limited to 10 minutes. Please
                  be prepared to concisely present your skills and
                  qualifications within this timeframe.
                </li>
                <li>
                  Professional attire is expected, just as it would be for an
                  in-person interview.
                </li>
                <li>
                  Please have a government-issued photo ID (e.g., Aadhaar,
                  Driving License, Passport) available for verification at the
                  beginning of the call.
                </li>
                <li>
                  Please be advised that this interview may be recorded for
                  internal evaluation and quality assurance purposes. Your
                  participation signifies your consent to be recorded.
                </li>
                <li>
                  All candidates will be evaluated based on their performance
                  during the interview. The final decision will be made by the
                  team based on the interview and the candidate&apos;s
                  application.
                </li>
                <li>
                  By booking a slot, you acknowledge that you have read,
                  understood, and agree to all the terms and conditions listed
                  above.
                </li>
              </ul>
              <label className="flex items-start gap-2  text-gray-800 mb-4 font-semibold">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span>
                  I understand the interview process and agree to proceed.
                </span>
              </label>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-semibold mb-4">
            Schedule your interview
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700">Application</label>
              <select
                className="border rounded px-3 py-2 min-w-64"
                value={selectedAppId}
                onChange={(e) =>
                  setSelectedAppId(e.target.value ? Number(e.target.value) : "")
                }
              >
                <option value="">Select an application…</option>
                {applications.map((a) => (
                  <option key={a.id} value={a.id}>{`${a.job.title}`}</option>
                ))}
              </select>
            </div>

            {selectedApp && (
              <div className="text-sm text-gray-700 flex flex-col sm:flex-row sm:items-center gap-2 sm:ml-2">
                <a
                  href={`/jobs/${selectedApp.job.slug}`}
                  target="_blank"
                  className="underline underline-offset-2"
                >
                  View job
                </a>
                <span className="hidden sm:inline">·</span>
                <a
                  href="/applications"
                  target="_blank"
                  className="underline underline-offset-2"
                >
                  View your application
                </a>
              </div>
            )}
          </div>
        </>
      )}

      {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

      {/* Hide slots entirely until terms are accepted */}
      {!agreed ? null : loading ? (
        <div>Loading slots…</div>
      ) : orderedDates.length === 0 ? (
        <div className="text-sm text-gray-600">No upcoming slots.</div>
      ) : (
        <div className="space-y-6">
          {selectedAppId === "" && (
            <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
              Please select an application to continue.
            </div>
          )}
          {selectedAppId !== "" && appHasBooking && appBookedSlot && (
            <div className="flex items-start gap-2 text-sm text-emerald-900 bg-emerald-50 border border-emerald-200 rounded p-3">
              <div className="mt-0.5">✅</div>
              <div className="flex-1">
                <div className="font-medium">Interview already scheduled</div>
                <div>
                  {formatDate(
                    appBookedSlot.startsAt as unknown as string,
                    "DD MMM YYYY, hh:mm:a"
                  )}{" "}
                  · Google Meet -{" "}
                  <a href={meetLink} target="_blank" className="font-semibold">
                    {meetLink}
                  </a>
                </div>
                {selectedApp && (
                  <div className="mt-1 text-gray-700">
                    <a
                      href={`/jobs/${selectedApp.job.slug}`}
                      target="_blank"
                      className="underline underline-offset-2"
                    >
                      View job
                    </a>
                    <span className="mx-1">·</span>
                    <a
                      href="/applications"
                      target="_blank"
                      className="underline underline-offset-2"
                    >
                      View your application
                    </a>
                  </div>
                )}
              </div>
              <button
                className="text-emerald-800/80 hover:text-emerald-900"
                onClick={() => setAppHasBooking(false)}
                aria-label="Dismiss"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          )}
          {orderedDates.map((d) => (
            <div key={d}>
              <div className="font-semibold mb-2">
                {new Date(d).toDateString()}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {groups[d].map((s: InterviewSlot) => (
                  <button
                    key={s.id}
                    disabled={
                      !!s.bookedByEmail ||
                      selectedAppId === "" ||
                      appHasBooking ||
                      checkingBooking
                    }
                    onClick={async () => {
                      if (selectedAppId === "") {
                        // show a small inline message instead of alert would require extra state; keep disabled state above
                        return;
                      }
                      if (appHasBooking) {
                        return;
                      }
                      const ok = window.confirm(
                        `Are you sure you want to book this slot on ${formatDate(
                          s.startsAt,
                          "MMM DD - YYYY @ hh:mm:a"
                        )}? This can't be changed in future.`
                      );
                      if (ok) {
                        const res = await fetch("/api/interviews/slots", {
                          method: "POST",
                          headers: { "content-type": "application/json" },
                          body: JSON.stringify({
                            slotId: s.id,
                            applicationId: selectedAppId,
                          }),
                        });
                        if (res.ok) {
                          setBookedSlot(s);
                          setSlots((prev) =>
                            prev.map((x) =>
                              x.id === s.id
                                ? {
                                    ...x,
                                    bookedByEmail: session?.user?.email ?? null,
                                  }
                                : x
                            )
                          );
                          setAppHasBooking(true);
                          setAppBookedSlot(s);
                        } else if (res.status === 409) {
                          setAppHasBooking(true);
                          // avoid alert; banner above will show
                        } else {
                          alert(
                            "Sorry, that slot was just taken. Please choose another."
                          );
                        }
                      }
                    }}
                    className={`text-xs px-2 py-2 rounded border text-center ${
                      s.bookedByEmail ||
                      selectedAppId === "" ||
                      appHasBooking ||
                      checkingBooking
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-green-50 border-green-300 hover:bg-green-100"
                    }`}
                  >
                    <div
                      className="font-semibold"
                      title={`Book slot on ${formatDate(
                        s.startsAt,
                        "DD MMM YYYY, hh:mm:a"
                      )}`}
                    >
                      {new Date(s.startsAt).toLocaleTimeString(undefined, {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
