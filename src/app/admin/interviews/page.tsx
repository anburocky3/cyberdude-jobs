"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { InterviewAvailability, InterviewSlot } from "@prisma/client";

export default function AdminInterviewsPage() {
  const { data } = useSession();
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [slotMinutes, setSlotMinutes] = useState(20);
  const [items, setItems] = useState<
    (InterviewAvailability & {
      interviewslot: (InterviewSlot & {
        application?: {
          id: number;
          job: { id: number; slug: string; title: string };
        } | null;
      })[];
    })[]
  >([]);

  const [error, setError] = useState<string | null>(null);

  const load = () =>
    fetch("/api/admin/interviews/availability", { cache: "no-store" })
      .then((r) => r.json())
      .then(setItems);
  useEffect(() => {
    load();
  }, []);

  const startDateTime = date && start ? new Date(`${date}T${start}`) : null;
  const endDateTime = date && end ? new Date(`${date}T${end}`) : null;
  const isValid = !!(
    date &&
    startDateTime &&
    endDateTime &&
    slotMinutes > 0 &&
    startDateTime < endDateTime
  );

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-5">Interview Availability</h1>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-2">
        <div className="flex flex-col  gap-3">
          <label htmlFor="date" className="text-sm font-medium">
            Date
          </label>
          <input
            id="date"
            type="date"
            className="border rounded px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col  gap-3">
          <label htmlFor="start" className="text-sm font-medium">
            Start time
          </label>
          <input
            id="start"
            type="time"
            className="border rounded px-3 py-2"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>
        <div className="flex flex-col  gap-3">
          <label htmlFor="end" className="text-sm font-medium">
            End time
          </label>
          <input
            id="end"
            type="time"
            className="border rounded px-3 py-2"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>
        <div className="flex flex-col  gap-3">
          <label htmlFor="slotMinutes" className="text-sm font-medium">
            Slot minutes
          </label>
          <input
            id="slotMinutes"
            type="number"
            min={5}
            step={5}
            className="border rounded px-3 py-2"
            value={slotMinutes}
            onChange={(e) => setSlotMinutes(Number(e.target.value))}
          />
        </div>
        <div className="flex items-end">
          <button
            className="px-3 py-2 bg-zinc-900 text-white rounded disabled:opacity-50"
            disabled={!isValid}
            onClick={async () => {
              if (!isValid) {
                setError(
                  "Please enter a valid date/time range and slot minutes."
                );
                return;
              }
              setError(null);
              await fetch("/api/admin/interviews/availability", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                  date,
                  startTime: `${date}T${start}`,
                  endTime: `${date}T${end}`,
                  slotMinutes,
                }),
              });
              setDate("");
              setStart("");
              setEnd("");
              load();
            }}
          >
            Create Slots
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-600 flex items-center gap-3">
        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 border border-green-300">
          Available
        </span>
        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300">
          Booked
        </span>
        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
          Lunch 1–2 PM (skipped)
        </span>
      </div>

      <div className="space-y-4">
        {items.map((it) => (
          <div key={it.id} className="border rounded p-3">
            <div className="font-medium">
              {new Date(it.date).toDateString()} •{" "}
              <span className="bg-indigo-500 px-2 py-1 rounded-full text-white text-sm mr-2">
                {new Date(it.startTime).toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}{" "}
                -{" "}
                {new Date(it.endTime).toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}{" "}
              </span>
              ({it.slotMinutes}m)
            </div>
            <div className="text-sm text-gray-600">
              {it.interviewslot.length} slots
            </div>
            <div className="mt-2 grid grid-cols-2  gap-2">
              {it.interviewslot.map((s) => (
                <div
                  key={s.id}
                  className={`text-xs px-2 py-1 rounded border font-medium ${
                    s.bookedByEmail
                      ? "bg-red-50 border-red-300 text-red-900"
                      : "bg-green-50 border-green-300 text-green-900"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      {new Date(s.startsAt).toLocaleTimeString(undefined, {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}{" "}
                      -{" "}
                      {new Date(s.endsAt).toLocaleTimeString(undefined, {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}{" "}
                      {s.bookedByEmail && (
                        <span className="block truncate">
                          ({s.bookedByEmail})
                        </span>
                      )}
                      {/** Reference links when application/job present */}
                      {s.application?.job?.title && (
                        <div className="mt-1 text-[11px] text-gray-700">
                          Applied for:{" "}
                          <span className="font-medium">
                            {s.application.job.title}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="space-x-1">
                        <button
                          disabled={!!s.bookedByEmail}
                          className="px-2 py-0.5 rounded border text-xs disabled:opacity-50"
                          onClick={async () => {
                            const dateStr = new Date(s.startsAt)
                              .toISOString()
                              .slice(0, 10);
                            const newStart = prompt(
                              "New start time (HH:MM)",
                              new Date(s.startsAt)
                                .toLocaleTimeString(undefined, {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })
                                .slice(0, 5)
                            );
                            if (!newStart) return;
                            const newEnd = prompt(
                              "New end time (HH:MM)",
                              new Date(s.endsAt)
                                .toLocaleTimeString(undefined, {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })
                                .slice(0, 5)
                            );
                            if (!newEnd) return;
                            const startsAt = `${dateStr}T${newStart}`;
                            const endsAt = `${dateStr}T${newEnd}`;
                            await fetch(`/api/admin/interviews/slots/${s.id}`, {
                              method: "PATCH",
                              headers: { "content-type": "application/json" },
                              body: JSON.stringify({ startsAt, endsAt }),
                            });
                            load();
                          }}
                        >
                          Edit
                        </button>
                        <button
                          disabled={!!s.bookedByEmail}
                          className="px-2 py-0.5 rounded border text-xs disabled:opacity-50"
                          onClick={async () => {
                            if (!confirm("Delete this slot?")) return;
                            await fetch(`/api/admin/interviews/slots/${s.id}`, {
                              method: "DELETE",
                            });
                            load();
                          }}
                        >
                          Delete
                        </button>
                      </div>
                      <div className="w-full ">
                        <a
                          href={`/admin/applications/${s.applicationId}`}
                          target="_blank"
                          className="px-9 py-0.5 rounded border hover:bg-indigo-400 hover:text-white text-xs w-full"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
