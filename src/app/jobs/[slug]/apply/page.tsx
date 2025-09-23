// "use client";

import { Job } from "@prisma/client";

// import { useState, useTransition } from "react";
// import { useRouter } from "next/navigation";
// import { signIn, useSession } from "next-auth/react";

export default function ApplyPage({ job }: { job: Job }) {
  console.log("job", job);
  //   const { data: session, status } = useSession();
  //   const router = useRouter();
  //   const [isPending, startTransition] = useTransition();
  //   const [message, setMessage] = useState<string>("");

  //   if (status === "unauthenticated") {
  //     signIn("linkedin", { callbackUrl: `/jobs/${params.slug}/terms` });
  //     return null;
  //   }

  //   const [fullName, setFullName] = useState("");
  //   const [email, setEmail] = useState("");
  //   const [note, setNote] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //     setMessage("");
    //     startTransition(async () => {
    //       try {
    //         const res = await fetch("/api/jobs/" + params.slug, {
    //           cache: "no-store",
    //         });
    //         const job = res.ok ? await res.json() : null;
    //         const applyRes = await fetch("/api/apply", {
    //           method: "POST",
    //           headers: { "Content-Type": "application/json" },
    //           body: JSON.stringify({ jobId: job?.id, fullName, email, note }),
    //         });
    //         if (!applyRes.ok) {
    //           const data = await applyRes.json().catch(() => ({}));
    //           setMessage(data.error || "Failed to apply. Please try again.");
    //           return;
    //         }
    //         setMessage("Application submitted successfully!");
    //       } catch {
    //         setMessage("Something went wrong. Please try again.");
    //       }
    //     });
  };

  return (
    <main className="container mx-auto py-6 px-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Apply</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full name</label>
          {/* <input
            className="w-full border rounded px-3 py-2"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          /> */}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          {/* <input
            className="w-full border rounded px-3 py-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          /> */}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Note</label>
          {/* <textarea
            className="w-full border rounded px-3 py-2"
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          /> */}
        </div>
        <button
          type="submit"
          //   disabled={isPending}
          className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-800 text-white cursor-pointer disabled:opacity-60"
        >
          {/* {isPending ? "Submitting..." : "Submit Application"} */}
          Submit Application
        </button>
      </form>
      {/* {message && <p className="mt-4 text-sm">{message}</p>} */}
    </main>
  );
}
