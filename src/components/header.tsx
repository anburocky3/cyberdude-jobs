"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LogOutIcon,
  LucideCalendar,
  LucideLayoutDashboard,
  UserIcon,
} from "lucide-react";
import { useSession, signOut, signIn } from "next-auth/react";
import { LinkedinIcon } from "@/components/icons/linkedin";
import { usePathname } from "next/navigation";

export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isApplicationsPage = pathname === "/applications";
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

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile: compact, solid button */}
          {session?.user?.isAdmin ? (
            <div className="md:hidden flex items-center space-x-2">
              <span className="truncate max-w-[120px]">
                {session.user.name || "Admin"}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="md:hidden"
                title="Logout"
                onClick={() => {
                  if (window.confirm("Are you sure you want to log out?")) {
                    signOut({ callbackUrl: "/" });
                  }
                }}
              >
                <LogOutIcon className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="md:hidden flex items-center space-x-2">
              {status === "unauthenticated" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="md:hidden bg-gradient-to-r from-blue-500 to-indigo-600 text-white cursor-pointer hover:from-blue-600 hover:to-indigo-700 hover:text-white"
                  title="Sign in with LinkedIn"
                  onClick={() =>
                    signIn("linkedin", { callbackUrl: "/applications" })
                  }
                >
                  <LinkedinIcon className="mr-1 h-4 w-4" />
                  Sign in with LinkedIn
                </Button>
              )}
            </div>
          )}
          {status === "authenticated" && !session?.user?.isAdmin && (
            <div className="flex items-center space-x-2">
              <Link
                href="/applications"
                className="md:hidden bg-orange-600 text-white rounded-md px-3 py-2 flex items-center"
                title="Your applications"
              >
                <UserIcon className="h-4 w-4" />
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="md:hidden"
                title="Logout"
                onClick={() => {
                  if (window.confirm("Are you sure you want to log out?")) {
                    signOut({ callbackUrl: "/" });
                  }
                }}
              >
                <LogOutIcon className="w-4 h-4" />
              </Button>
            </div>
          )}
          {/* Desktop: outline button with full label */}
          {session?.user?.isAdmin ? (
            <div className="flex items-center space-x-2">
              <Link
                href="/admin"
                className="rounded-md px-4 py-2 sm:py-1 flex items-center hover:text-orange-600"
              >
                <LucideLayoutDashboard className="sm:mr-2 h-4 w-4" />
                <span className="hidden md:inline-flex">Dashboard</span>
              </Link>
              <Link
                href="/admin/interviews"
                className="rounded-md px-4 py-2 sm:py-1 flex items-center hover:text-orange-600"
              >
                <LucideCalendar className="sm:mr-2 h-4 w-4" />
                <span className="hidden md:inline-flex">Interviews</span>
              </Link>
              <span className="hidden md:inline-flex">
                Hello {session.user.name || "Admin"}
              </span>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              {status === "unauthenticated" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="inline-flex bg-gradient-to-r from-blue-500 to-indigo-600 text-white cursor-pointer hover:from-blue-600 hover:to-indigo-700 hover:text-white"
                  title="Sign in with LinkedIn"
                  onClick={() =>
                    signIn("linkedin", { callbackUrl: "/applications" })
                  }
                >
                  <LinkedinIcon className="mr-2 h-4 w-4" />
                  <span>Sign in with LinkedIn</span>
                </Button>
              )}
            </div>
          )}
          {status === "authenticated" && !session?.user?.isAdmin && (
            <Link
              href="/applications"
              className={`hidden md:inline-flex font-semibold rounded-md px-4 py-2 sm:py-1 items-center text-sm ${
                isApplicationsPage
                  ? "text-orange-600"
                  : "bg-transparent text-zinc-900"
              }`}
              title="Your applications"
            >
              <UserIcon className="sm:mr-1 h-4 w-4" />
              <span className="hidden sm:inline">My Applications</span>
            </Link>
          )}
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
              className="cursor-pointer hidden md:inline-flex"
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
