"use client";

import { ButtonLink } from "@/components/ui/button";
import ChoreCard from "@/components/chore-view/chore-card";
import Tab from "@/components/ui/tab";
import { useAppState } from "@/context/app-state";
import { LuClipboardList, LuPlus, LuUser } from "react-icons/lu";
import { useSearchParams } from "next/navigation";
import CreateForm from "@/components/chore-view/create-form";
import { HomeDialogProvider, useHomeDialog } from "@/context/home-dialog";

function ViewDecider() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  if (mode === "create") {
    return <CreateForm />;
  } else if (mode === "update") {
    return <div>Update existing chore</div>;
  } else if (mode === "view") {
    return <div>View chore details</div>;
  }

  return null;
}

export default function Home() {
  const { choreMap } = useAppState();
  const { setModalNaturallyOpened } = useHomeDialog();

  return (
    <main className="grid grid-cols-10 p-6 sm:p-16 h-full w-full max-w-[1200px] mx-auto">
      <div className="col-span-10 md:col-span-4 flex flex-col h-full gap-4">
        <div className="flex items-center gap-11 mb-4">
          <Tab href="/" icon={<LuClipboardList size={24} />} />
          <Tab href="/preferences" icon={<LuUser size={24} />} />
        </div>
        <div className="flex-1">
          <h2 className="text-foreground text-3xl font-semibold mb-1">
            This week
          </h2>
          {Object.keys(choreMap || {}).map((choreId) => (
            <ChoreCard key={choreId} choreId={choreId} />
          ))}
        </div>
        <ButtonLink
          variant="glass"
          prefetch={false}
          className="w-full"
          href="?mode=create"
          onNavigate={() => setModalNaturallyOpened(true)}
        >
          <LuPlus size={24} />
        </ButtonLink>
      </div>
      <div className="hidden md:block md:col-span-1" />
      <div className="hidden md:block md:col-span-5">
        <ViewDecider />
      </div>
    </main>
  );
}
