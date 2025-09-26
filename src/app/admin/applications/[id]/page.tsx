import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ScreeningClient from "./screening-client";

export default async function ApplicationScreeningPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!(session && session.user && session.user.isAdmin))
    redirect("/admin/login");
  const { id } = await params;
  return <ScreeningClient appId={Number(id)} />;
}
