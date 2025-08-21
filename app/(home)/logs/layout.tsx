import { getAllLogs } from "@/api/db";
import LogHome from "@/components/logs-view/main-view";
import { LogStateProvider } from "@/context/log-state";
import { ChoreWithLogs, LogEntry } from "@/types/types";

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

  return (
    <LogStateProvider logMap={logMap}>
      <LogHome>{children}</LogHome>
    </LogStateProvider>
  );
}
