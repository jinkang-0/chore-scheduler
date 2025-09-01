"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { LuGlobe, LuPlus, LuUser } from "react-icons/lu";
import { setViewModeCookie } from "@/actions";
import ChoreCard from "@/components/chore-view/chore-card";
import ChoreDetails from "@/components/chore-view/chore-details";
import ChoreEditForm from "@/components/chore-view/chore-edit";
import ChoreCreateForm from "@/components/chore-view/create-form";
import { Button, ButtonLink } from "@/components/ui/button";
import MobileDialogTransformer from "@/components/ui/mobile-dialog-transformer";
import TabsGroup from "@/components/ui/tabs-group";
import { useChoreState } from "@/context/chore-state";
import { formatDateShort, getRelativeDay } from "@/lib/utils";
import type { ViewMode } from "@/types/types";

export default function ChoreHome({
  defaultViewMode
}: {
  defaultViewMode?: ViewMode;
}) {
  const { choreMap } = useChoreState();
  const [viewMode, setViewMode] = useState<ViewMode>(
    defaultViewMode ?? "private"
  );

  const { overdueChores, todayChores, futureChores } = useMemo(() => {
    const overdueChores: string[] = [];
    const todayChores: string[] = [];
    const futureChores: string[] = [];

    // filter chores by user relevance
    const allChores = Object.keys(choreMap || {}).filter((choreId) => {
      const chore = choreMap[choreId];
      return viewMode === "global" || chore.includesUser;
    });

    // group chores by due date
    allChores.forEach((choreId) => {
      const chore = choreMap[choreId];
      if (!chore) return;

      const isOverdue = new Date(chore.due_date) < new Date();
      const isToday =
        new Date(chore.due_date).toDateString() === new Date().toDateString();

      if (isToday) {
        todayChores.push(choreId);
      } else if (isOverdue) {
        overdueChores.push(choreId);
      } else {
        futureChores.push(choreId);
      }
    });

    return { overdueChores, todayChores, futureChores };
  }, [choreMap, viewMode]);

  // group future chores
  const groupedChores: Record<string, string[]> = useMemo(
    () =>
      futureChores.reduce((acc, choreId) => {
        const chore = choreMap[choreId];
        const dueDate = new Date(chore.due_date).toLocaleDateString();
        if (!acc[dueDate]) {
          acc[dueDate] = [];
        }
        acc[dueDate].push(choreId);
        return acc;
      }, {} as Record<string, string[]>),
    [choreMap, futureChores]
  );

  const sortedDates = useMemo(
    () =>
      Object.keys(groupedChores).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      ),
    [groupedChores]
  );

  // handlers
  const handleViewToggle = useCallback(async () => {
    const newMode = viewMode === "global" ? "private" : "global";
    setViewMode(newMode);
    await setViewModeCookie(newMode);
  }, [viewMode]);

  return (
    <>
      <div className="static md:fixed md:left-1/2 md:w-1/2 md:h-full md:p-16 md:pl-0 z-2 md:max-w-[600px]">
        <ViewDecider />
      </div>
      <main className="grid grid-cols-10 p-6 sm:p-16 h-full w-full max-w-[1200px] mx-auto">
        <div className="col-span-10 md:col-span-4 flex flex-col h-full gap-4">
          <TabsGroup />
          <div className="not-md:absolute not-md:top-4 not-md:right-4 text-w10">
            <Button variant="ghost" onClick={handleViewToggle}>
              {viewMode === "global" ? (
                <>
                  <LuGlobe size={24} />
                  <p className="not-md:hidden text-lg">Global</p>
                </>
              ) : (
                <>
                  <LuUser size={24} />
                  <p className="not-md:hidden text-lg">Personal</p>
                </>
              )}
            </Button>
          </div>
          <div className="flex-1 pb-40 flex flex-col gap-2">
            {overdueChores.length > 0 && (
              <div className="flex flex-col gap-2 mb-4">
                <h2 className="text-xl font-semibold">Past due</h2>
                {overdueChores.map((choreId) => (
                  <ChoreCard key={choreId} choreId={choreId} overdue />
                ))}
              </div>
            )}
            {todayChores.length > 0 && (
              <div className="flex flex-col gap-2 mb-4">
                <h2 className="text-xl font-semibold">Today</h2>
                {todayChores.map((choreId) => (
                  <ChoreCard key={choreId} choreId={choreId} />
                ))}
              </div>
            )}
            {sortedDates.length > 0 &&
              sortedDates.map((date) => (
                <div key={date} className="flex flex-col gap-2 mb-4">
                  <h2 className="text-xl font-semibold">
                    {formatDateShort(date)}{" "}
                    <span className="text-lg text-w10">
                      ({getRelativeDay(date)})
                    </span>
                  </h2>
                  {groupedChores[date].map((choreId) => (
                    <ChoreCard key={choreId} choreId={choreId} />
                  ))}
                </div>
              ))}
          </div>
          <div className="fixed grid grid-cols-10 left-1/2 -translate-x-1/2 bottom-0 pb-6 md:pb-16 pt-4 w-full px-6 sm:px-16 z-1 bg-background md:max-w-[1200px]">
            <div className="col-span-10 md:col-span-4">
              <ButtonLink
                variant="glass"
                prefetch={false}
                className="w-full"
                href="/?mode=create"
                scroll={false}
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

/**
 * A helper component to decide which view to show based on the "mode" search param.
 */
function ViewDecider() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  if (mode === "create") {
    return (
      <MobileDialogTransformer>
        <ChoreCreateForm />
      </MobileDialogTransformer>
    );
  }

  if (mode === "edit") {
    const choreId = searchParams.get("id");
    if (!choreId) return null;
    return (
      <MobileDialogTransformer>
        <ChoreEditForm choreId={choreId} />
      </MobileDialogTransformer>
    );
  }

  if (mode === "view") {
    const choreId = searchParams.get("id");
    if (!choreId) return null;
    return (
      <MobileDialogTransformer>
        <ChoreDetails choreId={choreId} />
      </MobileDialogTransformer>
    );
  }

  return null;
}
