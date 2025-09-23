"use client";

import { Job } from "@prisma/client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function SignInButton({ job }: { job?: Job }) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user;
  const router = useRouter();

  const handleApply = async () => {
    const termsUrl = `/jobs/${job?.slug}/terms`;
    if (!isAuthenticated) {
      await signIn("linkedin", { callbackUrl: termsUrl });
      return;
    }
    if (job?.type === "fulltime") {
      router.push(`/jobs/${job?.slug}/apply`);
      return;
    }

    router.push(termsUrl);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-col items-center w-full">
        <button
          onClick={handleApply}
          className="inline-flex items-center rounded  bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 cursor-pointer"
          title={
            job?.type === "fulltime"
              ? "Apply now!"
              : "Accept Terms & Continue to continue"
          }
        >
          {isAuthenticated ? (
            job?.type === "fulltime" ? (
              "Apply now!"
            ) : (
              "Accept Terms & Continue"
            )
          ) : (
            <span className="flex items-center flex-row-reverse">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                className="h-5 w-5 ml-2"
              >
                <path
                  fill="currentColor"
                  d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
                />
              </svg>{" "}
              Apply with LinkedIn
            </span>
          )}
        </button>
        {!isAuthenticated && job?.type === "internship" && (
          <Link
            href={`/jobs/${job.slug}/terms`}
            className="text-gray-600 text-sm mt-2 hover:underline cursor-pointer"
            title="Read before applying for this program."
          >
            Terms & Conditions
          </Link>
        )}
      </div>

      {isAuthenticated && (
        <button
          onClick={() => signOut()}
          className="text-sm text-gray-600 underline cursor-pointer"
        >
          Sign out
        </button>
      )}
    </div>
  );
}
