"use client";

import { useChoreState } from "@/context/chore-state";
import { formatDate } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

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

export default function ChoreCard({ choreId }: { choreId: string }) {
  const { choreMap } = useChoreState();
  const chore = useMemo(() => choreMap?.[choreId], [choreMap, choreId]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const handleClick = useCallback(() => {
    if (id === choreId) router.replace("/");
    else router.push(`/?mode=view&id=${choreId}`);
  }, [router, id, choreId]);

  if (!chore) {
    return <div className="animate-pulse bg-w11 rounded-lg w-full h-10" />;
  }

  return (
    <button
      onClick={handleClick}
      className={cardStyles({ selected: choreId === id })}
    >
      <div>
        <p className="text-xl">{chore.emoji}</p>
      </div>
      <div>
        <p className="text-lg text-w11">Due {formatDate(chore.due_date)}</p>
        <h3 className="text-xl font-medium">{chore.title}</h3>
        <p className="text-lg text-w11">Assigned to {chore.queue[0]}</p>
      </div>
    </button>
  );
}
