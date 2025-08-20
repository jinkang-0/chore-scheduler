import { authConfig } from "@/api/auth/config";
import { getChores } from "@/api/db";
import { ChoreStateProvider } from "@/context/chore-state";
import { HomeDialogProvider } from "@/context/home-dialog";
import { ChoreWithQueue } from "@/types/types";
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

  // ensure user has onboarded
  if (!session.user.is_onboarded) return redirect("/onboarding");

  const chores = (await getChores()) as unknown as ChoreWithQueue[];
  const map: Record<string, ChoreWithQueue> = {};
  chores.forEach((chore) => {
    map[chore.id] = chore;
  });

  return (
    <ChoreStateProvider choreMap={map}>
      <HomeDialogProvider>{children}</HomeDialogProvider>
    </ChoreStateProvider>
  );
}
