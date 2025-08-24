"use client";

import { useChoreState } from "@/context/chore-state";
import { formatDate } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const cardStyles = cva(
  "flex gap-2 items-center p-4 rounded-lg w-full cursor-pointer hover:bg-white/5 transition-colors text-left",
  {
    variants: {
      selected: {
        true: "bg-white/6 hover:bg-white/6",
        false: ""
      }
    }
  }
);

export default function ChoreCard({
  choreId,
  overdue
}: {
  choreId: string;
  overdue?: boolean;
}) {
  const { choreMap } = useChoreState();
  const chore = choreMap[choreId];
  if (!chore) redirect("/");

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const handleClick = useCallback(() => {
    if (id === choreId) router.replace("/", { scroll: false });
    else router.push(`/?mode=view&id=${choreId}`, { scroll: false });
  }, [router, id, choreId]);

  return (
    <button
      onClick={handleClick}
      className={cardStyles({ selected: choreId === id })}
    >
      <div>
        <p className="text-xl">{chore.emoji}</p>
      </div>
      <div>
        {overdue && (
          <p className="text-lg text-w11">Due {formatDate(chore.due_date)}</p>
        )}
        <h3 className="text-xl font-medium">{chore.title}</h3>
        <div className="flex gap-2 items-center">
          <p className="text-lg text-w11">
            Assigned to {chore.queue[chore.passIndex % chore.queue.length].name}
          </p>
          {overdue && (
            <div className="rounded-full px-2 py-0.5 border border-danger text-danger text-md">
              <p>overdue</p>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
