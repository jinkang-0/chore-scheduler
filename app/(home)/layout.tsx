import { authConfig } from "@/api/auth/config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function HomeLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // ensure user is authenticated
  const session = await getServerSession(authConfig);
  if (!session) return redirect("/login");

  return children;
}
