"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LinkIcon, LogOutIcon } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export function Header() {
  const { status } = useSession();
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile: compact, solid button */}
          <Button
            variant="outline"
            asChild
            size="sm"
            className="md:hidden"
            title="Navigate to cyberdudenetworks.com"
          >
            <Link href="https://cyberdudenetworks.com" target="_blank">
              <LinkIcon className="mr-1 h-4 w-4" />
            </Link>
          </Button>
          {/* Desktop: outline button with full label */}
          <Button
            asChild
            size="sm"
            className="hidden md:inline-flex"
            title="Navigate to cyberdudenetworks.com"
          >
            <Link href="https://cyberdudenetworks.com" target="_blank">
              <LinkIcon className="mr-2 h-4 w-4" />
              <span>Visit Website</span>
            </Link>
          </Button>
          {status === "authenticated" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (window.confirm("Are you sure you want to log out?")) {
                  signOut({ callbackUrl: "/" });
                }
              }}
              title={`Logout`}
              className="cursor-pointer"
            >
              <LogOutIcon className="w-4 h-4" />
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
