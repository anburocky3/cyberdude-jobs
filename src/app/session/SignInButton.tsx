"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function SignInButton({ jobId }: { jobId?: string }) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user;

  const handleApply = async () => {
    if (!isAuthenticated) {
      await signIn("linkedin");
      return;
    }
    const response = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    });
    if (!response.ok) {
      alert("Failed to apply. Please try again.");
      return;
    }
    alert("Application submitted successfully!");
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleApply}
        className="inline-flex items-center rounded  bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 cursor-pointer"
      >
        {isAuthenticated ? (
          "Apply Now"
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
