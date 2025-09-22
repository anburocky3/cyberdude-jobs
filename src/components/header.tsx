import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LinkIcon } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-12 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">
              CDN
            </span>
          </div>
          <span className="font-bold text-xl text-foreground">Jobs</span>
        </Link>

        {/* <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/jobs"
            className="text-foreground hover:text-primary transition-colors"
          >
            Jobs
          </Link>
          <Link
            href="/applications"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            My Applications
          </Link>
          <Link
            href="/companies"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Companies
          </Link>
          <Link
            href="/about"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            About
          </Link>
        </nav> */}

        <div className="flex items-center space-x-4">
          {/* <Button variant="outline" size="sm">
            Sign In
          </Button> */}
          <Button asChild size="sm" title="Navigate to cyberdudenetworks.com">
            <Link href="https://cyberdudenetworks.com" target="_blank">
              <LinkIcon className="" />
              Visit Website
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
