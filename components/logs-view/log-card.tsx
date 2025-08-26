"use client";

import { cva } from "class-variance-authority";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useLogState } from "@/context/log-state";

const cardStyles = cva(
  "flex gap-2 items-center p-4 py-6 rounded-lg w-full cursor-pointer hover:bg-white/5 transition-colors text-left",
  {
    variants: {
      selected: {
        true: "bg-white/6 hover:bg-white/6",
        false: ""
      }
    }
  }
);

export default function LogCard({ choreId }: { choreId: string }) {
  const { logMap } = useLogState();
  const chore = useMemo(() => logMap?.[choreId], [logMap, choreId]);
  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const handleClick = useCallback(() => {
    if (id === choreId) router.replace("?", { scroll: false });
    else router.push(`?id=${choreId}`, { scroll: false });
  }, [router, id, choreId]);

  if (!chore) {
    return <div className="animate-pulse bg-w11 rounded-lg w-full h-10" />;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cardStyles({ selected: choreId === id })}
    >
      <p className="text-xl">{chore.emoji}</p>
      <h3 className="text-xl">{chore.title}</h3>
    </button>
  );
}
