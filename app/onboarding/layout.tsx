import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/config/auth";

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
