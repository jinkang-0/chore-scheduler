"use client";

import ChoreCard from "@/components/chore-card";
import Tab from "@/components/tab";
import { useAppState } from "@/context/app-state";
import { LuClipboardList, LuUser } from "react-icons/lu";

export default function Home() {
  const { choreMap } = useAppState();

  return (
    <main className="grid grid-cols-10 p-16 h-full">
      <div className="col-span-4 flex flex-col">
        <div className="flex items-center gap-11 mb-4">
          <Tab href="/" icon={<LuClipboardList size={24} />} />
          <Tab href="/preferences" icon={<LuUser size={24} />} />
        </div>
        <h2 className="text-foreground text-3xl font-semibold">This week</h2>
        {Object.keys(choreMap || {}).map((choreId) => (
          <ChoreCard key={choreId} choreId={choreId} />
        ))}
      </div>
      <div className="col-span-6"></div>
    </main>
  );
}
