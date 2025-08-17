import { useChoreState } from "@/context/chore-state";
import { formatDate } from "@/lib/utils";
import { useMemo } from "react";

export default function ChoreCard({ choreId }: { choreId: string }) {
  const { choreMap } = useChoreState();
  const chore = useMemo(() => choreMap?.[choreId], [choreMap, choreId]);

  if (!chore) {
    return <div className="animate-pulse bg-w11 rounded-lg w-full h-10" />;
  }

  return (
    <div className="flex gap-2 items-center p-4 rounded-lg w-full cursor-pointer hover:bg-white/5 transition-colors">
      <div>
        <p className="text-xl">{chore.emoji}</p>
      </div>
      <div>
        <p className="text-lg text-w11">Due {formatDate(chore.due_date)}</p>
        <h3 className="text-xl font-medium">{chore.title}</h3>
        <p className="text-lg text-w11">Assigned to {chore.queue[0]}</p>
      </div>
    </div>
  );
}
