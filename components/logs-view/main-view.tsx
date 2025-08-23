"use client";

import TabsGroup from "../ui/tabs-group";
import { useLogState } from "@/context/log-state";
import LogCard from "./log-card";
import { useSearchParams } from "next/navigation";
import MobileDialogTransformer from "../ui/mobile-dialog-transformer";
import LogDetails from "./log-details";

export default function LogHome() {
  const { logMap } = useLogState();
  const allChores = Object.keys(logMap || {});

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <>
      <div className="static md:fixed md:left-1/2 md:w-1/2 md:h-full md:p-16 md:pl-0 z-2 md:max-w-[600px]">
        {id && (
          <MobileDialogTransformer returnHref="?">
            <LogDetails choreId={id} />
          </MobileDialogTransformer>
        )}
      </div>
      <main className="grid grid-cols-10 p-6 sm:p-16 h-full w-full max-w-[1200px] mx-auto">
        <div className="col-span-10 md:col-span-4 flex flex-col h-full gap-4">
          <TabsGroup />
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex flex-col gap-2 mb-4">
              <h2 className="text-xl font-semibold">History</h2>
              {allChores.map((choreId) => (
                <LogCard key={choreId} choreId={choreId} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
