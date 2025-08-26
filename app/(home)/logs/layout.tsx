import { getAllLogs } from "@/actions";
import { LogStateProvider } from "@/context/log-state";
import type { ChoreWithLogs } from "@/types/types";

export default async function LogsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const logs = await getAllLogs();
  const logMap: Record<string, ChoreWithLogs> = {};
  logs.forEach((chore: ChoreWithLogs) => {
    logMap[chore.id] = chore;
  });

  return <LogStateProvider logMap={logMap}>{children}</LogStateProvider>;
}
