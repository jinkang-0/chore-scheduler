import { getChores } from "@/api/db";
import ChoreHome from "@/components/chore-view/main-view";
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

  return (
    <ChoreStateProvider choreMap={map}>
      <ChoreHome>{children}</ChoreHome>
    </ChoreStateProvider>
  );
}
