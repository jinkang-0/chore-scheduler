"use client";

import ChoreCard from "@/components/chore-view/chore-card";
import Tab from "@/components/ui/tab";
import { useChoreState } from "@/context/chore-state";
import { LuClipboardList, LuPlus, LuUser } from "react-icons/lu";
import { useSearchParams } from "next/navigation";
import CreateForm from "@/components/chore-view/create-form";
import MobileDialogTransformer from "@/components/chore-view/mobile-dialog-transformer";
import { ButtonLink } from "@/components/ui/button";
import ChoreDetails from "@/components/chore-view/chore-details";

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
    return <div>Update</div>;
  } else if (mode === "view") {
    return (
      <MobileDialogTransformer>
        <ChoreDetails />
      </MobileDialogTransformer>
    );
  }

  return null;
}

export default function Home() {
  const { choreMap } = useChoreState();

  return (
    <>
      <div className="static md:fixed md:left-1/2 md:w-1/2 md:h-full md:p-16 md:pl-0 z-2 md:max-w-[600px]">
        <ViewDecider />
      </div>
      <main className="grid grid-cols-10 p-6 sm:p-16 h-full w-full max-w-[1200px] mx-auto">
        <div className="col-span-10 md:col-span-4 flex flex-col h-full gap-4">
          <div className="flex items-center gap-11">
            <Tab href="/" icon={<LuClipboardList size={24} />} />
            <Tab href="/preferences" icon={<LuUser size={24} />} />
          </div>
          <div className="flex-1 pb-40 flex flex-col gap-2">
            <h2 className="text-foreground text-3xl font-semibold mb-1">
              This week
            </h2>
            {Object.keys(choreMap || {}).map((choreId) => (
              <ChoreCard key={choreId} choreId={choreId} />
            ))}
          </div>
          <div className="fixed grid grid-cols-10 left-1/2 -translate-x-1/2 bottom-6 md:bottom-16 pt-4 w-full px-6 sm:px-16 z-1 bg-background md:max-w-[1200px]">
            <div className="col-span-10 md:col-span-4">
              <ButtonLink
                variant="glass"
                prefetch={false}
                className="w-full"
                href="?mode=create"
              >
                <LuPlus size={24} />
                Create a chore
              </ButtonLink>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
