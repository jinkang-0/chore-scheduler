"use client";

import ChoreCard from "@/components/chore-view/chore-card";
import Tab from "@/components/ui/tab";
import { useChoreState } from "@/context/chore-state";
import { LuClipboardList, LuPlus, LuUser } from "react-icons/lu";
import { useSearchParams } from "next/navigation";
import CreateForm from "@/components/chore-view/create-form";
import MobileDialogTransformer from "@/components/chore-view/mobile-dialog-transformer";
import CreateHint from "@/components/chore-view/create-hint";
import { ButtonLink } from "@/components/ui/button";
import { useHomeDialog } from "@/context/home-dialog";

function ViewDecider() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  if (mode === "create") {
    return (
      <MobileDialogTransformer>
        <CreateForm />
      </MobileDialogTransformer>
    );
  } else if (mode === "update") {
    return <div>Update existing chore</div>;
  } else if (mode === "view") {
    return <div>View chore details</div>;
  }

  return null;
}

export default function Home() {
  const { choreMap } = useChoreState();
  const { setModalNaturallyOpened } = useHomeDialog();

  return (
    <>
      <div className="static md:fixed md:left-4/10 md:w-6/10 lg:left-1/2 md:h-full lg:w-1/2 md:p-16 z-2">
        <ViewDecider />
      </div>
      <main className="grid grid-cols-10 p-6 sm:p-16 h-full w-full max-w-[1200px] mx-auto">
        <div className="col-span-10 md:col-span-4 flex flex-col h-full gap-4">
          <div className="flex items-center gap-11">
            <Tab href="/" icon={<LuClipboardList size={24} />} />
            <Tab href="/preferences" icon={<LuUser size={24} />} />
          </div>
          <div className="flex-1 pb-40">
            <h2 className="text-foreground text-3xl font-semibold mb-1">
              This week
            </h2>
            {Object.keys(choreMap || {}).map((choreId) => (
              <ChoreCard key={choreId} choreId={choreId} />
            ))}
          </div>
          <div className="fixed bottom-6 pr-12 sm:pr-32 md:bottom-16 pt-4 w-full md:w-4/10 md:pr-16 z-1 bg-background">
            <ButtonLink
              variant="glass"
              prefetch={false}
              className="w-full"
              href="?mode=create"
              onNavigate={() => setModalNaturallyOpened(true)}
            >
              <LuPlus size={24} />
              Create a chore
            </ButtonLink>
          </div>
        </div>
      </main>
    </>
  );
}
