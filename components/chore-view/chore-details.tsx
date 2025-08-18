"use client";

import { useChoreState } from "@/context/chore-state";
import { redirect, useSearchParams } from "next/navigation";
import { LuCalendar, LuCheck, LuRepeat, LuUser } from "react-icons/lu";
import { Button } from "../ui/button";
import { useCallback, useMemo } from "react";
import { markChoreAsDone } from "@/api/db/update-functions";
import { capitalize } from "@/lib/utils";
import { weekdays } from "@/data/datetime";

export default function ChoreDetails() {
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
    <div className="flex flex-col p-6 lg:p-8 rounded-lg bg-w4 w-full h-full gap-2">
      <div className="flex gap-2">
        <p className="text-2xl">{chore.emoji}</p>
        <h3 className="text-2xl font-semibold">{chore.title}</h3>
      </div>
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
        <p>Assigned to {chore.queue[0]}</p>
      </div>

      <div className="flex flex-col gap-2 mt-8">
        <b>Up next</b>
        <div className="flex gap-4 flex-wrap">
          {chore.queue.slice(1).map((user) => (
            <div
              key={user}
              className="flex items-center gap-2 bg-w5 px-4 py-1 rounded-lg"
            >
              <p>{user}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto flex flex-col md:flex-row gap-4 w-full pt-20">
        <div className="flex flex-col justify-end flex-1 text-w11">
          <Button variant="ghost" className="justify-start w-fit text-left">
            skip to
          </Button>
          <Button variant="ghost" className="justify-start w-fit text-left">
            come back to me
          </Button>
        </div>
        <div className="flex flex-col justify-end flex-1">
          <Button
            variant="primary"
            onClick={handleMarkDone}
            className="text-left"
          >
            <LuCheck size={20} />
            <p>Mark as Done</p>
          </Button>
        </div>
      </div>
    </div>
  );
}
