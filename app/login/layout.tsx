import { getServerAuthSession } from "@/api/auth/config";
import { redirect } from "next/navigation";

export default async function LoginLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (session?.user) return redirect("/");

  return children;
}
