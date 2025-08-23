import { getChores } from "@/api/actions";
import { ChoreStateProvider } from "@/context/chore-state";
import { ChoreWithQueue } from "@/types/types";

export default async function ChoreLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const chores = (await getChores()) as unknown as ChoreWithQueue[];
  const map: Record<string, ChoreWithQueue> = {};
  chores.forEach((chore) => {
    map[chore.id] = chore;
  });

  return <ChoreStateProvider choreMap={map}>{children}</ChoreStateProvider>;
}
