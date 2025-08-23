"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLogState } from "@/context/log-state";
import { cn, formatLogTimestamp } from "@/lib/utils";

export default function LogDetails({ choreId }: { choreId: string }) {
  const { data: session } = useSession();
  if (!session || !session.user) redirect("/login");

  const user = session.user;

  const { logMap } = useLogState();
  const chore = logMap[choreId || ""];

  if (!choreId || !chore) {
    return redirect("/logs");
  }

  return (
    <div className="flex flex-col p-6 lg:p-8 rounded-lg bg-w4 w-full h-full gap-2 overflow-y-auto">
      <header className="flex items-center justify-between">
        <div className="flex gap-2">
          <p className="text-2xl">{chore.emoji}</p>
          <h3 className="text-2xl font-semibold">{chore.title}</h3>
        </div>
      </header>

      <div className="flex flex-col gap-6 mt-8">
        {chore.logs.map((log) => (
          <div key={log.id} className="flex flex-col">
            <p className="uppercase font-semibold text-w10">
              {formatLogTimestamp(log.timestamp)}
            </p>
            <p
              className={cn(
                "text-xl",
                log.user_id === user.whitelist_id && "text-green-300",
                log.type === "ERROR" && "text-red-300",
                log.type === "WARNING" && "text-yellow-300"
              )}
            >
              {log.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
