"use client";

import TabsGroup from "@/components/ui/tabs-group";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function PreferencesPage() {
  const { data: session } = useSession();
  if (!session) return redirect("/login");

  return (
    <main className="grid grid-cols-10 p-6 sm:p-16 h-full w-full max-w-[1200px] mx-auto">
      <div className="col-span-10 md:col-span-4 flex flex-col h-full gap-4">
        <TabsGroup />
        <div className="flex-1 pb-40 flex flex-col gap-2">
          <div className="flex flex-col gap-2 mb-4">
            <h2 className="text-xl font-semibold">{session.user.name}</h2>
          </div>
        </div>
      </div>
    </main>
  );
}
