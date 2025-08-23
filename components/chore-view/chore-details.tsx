"use client";

import { useChoreState } from "@/context/chore-state";
import { redirect } from "next/navigation";
import {
  LuCalendar,
  LuCheck,
  LuPencil,
  LuRepeat,
  LuThumbsUp,
  LuUser,
  LuUsers
} from "react-icons/lu";
import { ButtonAsync, ButtonLink } from "../ui/button";
import { useCallback, useMemo } from "react";
import {
  incrementChorePassIndex,
  markChoreAsDone
} from "@/api/db/update-functions";
import { weekdays } from "@/data/datetime";
import { useSession } from "next-auth/react";

export default function ChoreDetails({ choreId }: { choreId: string }) {
  const { data: session } = useSession();
  if (!session || !session.user) redirect("/login");

  const user = session.user;

  const { choreMap } = useChoreState();
  const chore = choreMap[choreId || ""];
  if (!chore) redirect("/");

  const assignedIndex = chore.passIndex % chore.queue.length;

  const handleMarkDone = useCallback(async () => {
    if (!choreId) return;
    await markChoreAsDone(choreId);
  }, [choreId]);

  const reoccurrence = useMemo(() => {
    if (!chore) return null;

    if (chore.interval === "WEEKLY")
      return chore.weekday && chore.weekday >= 0 && chore.weekday <= 6
        ? weekdays[chore.weekday]
        : null;

    if (chore.interval === "MONTHLY")
      return chore.monthday ? `day ${chore.monthday}` : null;

    return null;
  }, [chore]);

  if (!choreId || !chore) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col p-6 lg:p-8 rounded-lg bg-w4 w-full h-full gap-2">
      <header className="flex items-center justify-between">
        <div className="flex gap-2">
          <p className="text-2xl">{chore.emoji}</p>
          <h3 className="text-2xl font-semibold">{chore.title}</h3>
        </div>
        <ButtonLink href={`/${choreId}/edit`} variant="ghost">
          <LuPencil className="text-w11" size={20} />
        </ButtonLink>
      </header>

      <div className="text-w11 flex gap-2 items-center">
        <LuRepeat size={20} />
        <p>Repeats {chore.interval.toLowerCase()}</p>
      </div>
      {reoccurrence && (
        <div className="text-w11 flex gap-2 items-center">
          <LuCalendar size={20} />
          <p>Reoccurs on {reoccurrence}</p>
        </div>
      )}
      <div className="text-w11 flex gap-2 items-center">
        <LuUser size={20} />
        <p>Assigned to {chore.queue[assignedIndex].name}</p>
      </div>

      <div className="flex flex-col gap-2 mt-8">
        <div className="flex gap-2 items-center">
          <LuUsers size={16} className="mt-1" />
          <b>Queue</b>
        </div>
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2 bg-w2 ring ring-blue-400 px-4 py-1 rounded-lg">
            <p>{chore.queue[assignedIndex].name}</p>
          </div>
          {chore.queue
            .slice(0, assignedIndex)
            .concat(chore.queue.slice(assignedIndex + 1))
            .map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-2 bg-w5 px-4 py-1 rounded-lg"
              >
                <p>{user.name}</p>
              </div>
            ))}
        </div>
      </div>

      <div className="mt-auto flex flex-col md:flex-row gap-4 w-full pt-20">
        <div className="flex flex-col justify-end flex-1 text-w11">
          {user.whitelist_id === chore.queue[assignedIndex].id && (
            <ButtonAsync
              variant="ghost"
              className="justify-start w-fit text-left"
              onClick={() => incrementChorePassIndex(choreId)}
            >
              come back to me
            </ButtonAsync>
          )}
        </div>
        <div className="flex flex-col justify-end flex-1">
          {user.whitelist_id === chore.queue[assignedIndex].id && (
            <ButtonAsync
              variant="primary"
              onClick={handleMarkDone}
              className="text-left"
            >
              <LuCheck size={20} />
              <p>Mark as Done</p>
            </ButtonAsync>
          )}
          {user.whitelist_id !== chore.queue[assignedIndex].id &&
            chore.queue.find((u) => u.id === user.whitelist_id) && (
              <ButtonAsync
                variant="primary"
                className="text-left"
                onClick={handleMarkDone}
              >
                <LuThumbsUp size={20} />
                <p>I did it myself</p>
              </ButtonAsync>
            )}
        </div>
      </div>
    </div>
  );
}
