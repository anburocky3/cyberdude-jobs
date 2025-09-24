import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container mx-auto py-24 px-4 max-w-3xl">
      <div className="bg-gradient-to-r from-orange-50 via-white to-orange-50 border rounded-xl shadow-sm p-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-foreground">
          Page not found
        </h1>
        <p className="text-muted-foreground mb-6">
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/">Go to Home</Link>
          </Button>
          <Button asChild variant="outline">
            <a href="https://cyberdudenetworks.com" target="_blank">
              Visit Company
            </a>
          </Button>
        </div>
      </div>
    </main>
  );
}
