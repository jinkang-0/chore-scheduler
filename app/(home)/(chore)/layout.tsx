import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getChores } from "@/actions";
import { ChoreStateProvider } from "@/context/chore-state";
import { authConfig } from "@/lib/config/auth";
import type { ChoreWithQueue, ChoreWithQueueEx } from "@/types/types";

export default async function ChoreLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authConfig);
  if (!session?.user.whitelist_id) redirect("/login");

  const chores = (await getChores()) as unknown as ChoreWithQueue[];
  const map: Record<string, ChoreWithQueueEx> = {};

  chores.forEach((chore) => {
    const choreEx: ChoreWithQueueEx = {
      ...chore,
      includesUser: !!chore.queue.find(
        (user) => user.id === session.user.whitelist_id
      )
    };
    map[chore.id] = choreEx;
  });

  return <ChoreStateProvider choreMap={map}>{children}</ChoreStateProvider>;
}
