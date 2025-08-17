import { getChores } from "@/api/db";
import { ChoreStateProvider } from "@/context/chore-state";
import { HomeDialogProvider } from "@/context/home-dialog";
import { ChoreWithQueue } from "@/lib/types";

export default async function HomeLayout({
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
      <HomeDialogProvider>{children}</HomeDialogProvider>
    </ChoreStateProvider>
  );
}
