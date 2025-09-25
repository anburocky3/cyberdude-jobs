import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminPageClient from "@/app/admin/AdminPageClient";

export default async function AdminPage() {
  const session = await auth();
  if (!(session && session.user && session.user.isAdmin)) {
    redirect("/admin/login");
  }
  return <AdminPageClient />;
}
