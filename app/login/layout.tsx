import { authConfig } from "@/api/auth/config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function LoginLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authConfig);
  if (session?.user) return redirect("/");

  return children;
}
