"use client";

import { Job } from "@prisma/client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LinkedinIcon } from "@/components/icons/linkedin";

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
              <LinkedinIcon className="h-5 w-5 ml-2" /> Apply with LinkedIn
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
