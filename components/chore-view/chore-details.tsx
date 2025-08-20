"use client";

import { useChoreState } from "@/context/chore-state";
import { redirect, useSearchParams } from "next/navigation";
import {
  LuCalendar,
  LuCheck,
  LuPen,
  LuPencil,
  LuRepeat,
  LuUser,
  LuUsers
} from "react-icons/lu";
import { Button } from "../ui/button";
import { useCallback, useMemo } from "react";
import { markChoreAsDone } from "@/api/db/update-functions";
import { weekdays } from "@/data/datetime";
import { useSession } from "next-auth/react";

export default function ChoreDetails() {
  const { data: session } = useSession();
  if (!session || !session.user) return redirect("/login");

  const user = session.user;

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { choreMap } = useChoreState();
  const chore = choreMap[id || ""];

  const handleMarkDone = useCallback(() => {
    if (!id) return;
    markChoreAsDone(id);
  }, []);

  const reoccurrence = useMemo(() => {
    if (!chore) return null;

    if (chore.interval === "WEEKLY")
      return chore.weekday && chore.weekday >= 0 && chore.weekday <= 6
        ? weekdays[chore.weekday]
        : null;

    if (chore.interval === "MONTHLY")
      return chore.monthday ? `day ${chore.monthday}` : null;

    return null;
  }, []);

  if (!id || !chore) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col p-6 lg:p-8 rounded-lg bg-w4 w-full h-full gap-2 overflow-y-auto">
      <header className="flex items-center justify-between">
        <div className="flex gap-2">
          <p className="text-2xl">{chore.emoji}</p>
          <h3 className="text-2xl font-semibold">{chore.title}</h3>
        </div>
        <Button variant="ghost">
          <LuPencil className="text-w11" size={20} />
        </Button>
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
        <p>Assigned to {chore.queue[0].name}</p>
      </div>

      <div className="flex flex-col gap-2 mt-8">
        <div className="flex gap-2 items-center">
          <LuUsers size={16} className="mt-1" />
          <b>Queue</b>
        </div>
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2 bg-w2 ring ring-blue-400 px-4 py-1 rounded-lg">
            <p>{chore.queue[0].name}</p>
          </div>
          {chore.queue.slice(1).map((user) => (
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
          <Button variant="ghost" className="justify-start w-fit text-left">
            change due date
          </Button>
          {user.whitelist_id === chore.queue[0].id && (
            <Button variant="ghost" className="justify-start w-fit text-left">
              come back to me
            </Button>
          )}
        </div>
        <div className="flex flex-col justify-end flex-1">
          {user.whitelist_id === chore.queue[0].id && (
            <Button
              variant="primary"
              onClick={handleMarkDone}
              className="text-left"
            >
              <LuCheck size={20} />
              <p>Mark as Done</p>
            </Button>
          )}
          {user.whitelist_id !== chore.queue[0].id &&
            chore.queue.find((u) => u.id === user.whitelist_id) && (
              <Button
                variant="primary"
                className="text-left"
                onClick={handleMarkDone}
              >
                <LuCheck size={20} />
                <p>Complete for {chore.queue[0].name}</p>
              </Button>
            )}
        </div>
      </div>
    </div>
  );
}
