import { authConfig } from "@/api/auth/config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // check if user is authenticated
  const session = await getServerSession(authConfig);
  if (!session) return redirect("/login");

  // check if user has onboarded
  if (session.user.is_onboarded) return redirect("/");

  return children;
}
