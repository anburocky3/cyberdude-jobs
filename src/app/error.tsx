"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="container mx-auto py-24 px-4 max-w-3xl">
      <div className="bg-gradient-to-r from-orange-50 via-white to-orange-50 border rounded-xl shadow-sm p-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-foreground">
          Something went wrong
        </h1>
        <p className="text-muted-foreground mb-6">
          An unexpected error occurred. Please try again. ({error.message})
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button asChild variant="outline">
            <Link href="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
