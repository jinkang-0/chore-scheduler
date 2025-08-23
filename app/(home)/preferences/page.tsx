"use client";

import EditNameForm from "@/components/preferences/edit-name";
import EditNotification from "@/components/preferences/edit-notification";
import { ButtonAsync, ButtonLink } from "@/components/ui/button";
import TabsGroup from "@/components/ui/tabs-group";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useCallback } from "react";
import { LuMail, LuPencil } from "react-icons/lu";

export default function PreferencesPage() {
  const { data: session } = useSession();

  const handleLogout = useCallback(async () => {
    await signOut({ redirect: true });
    redirect("/login");
  }, []);

  if (!session) return redirect("/login");

  return (
    <main className="grid grid-cols-10 p-6 sm:p-16 h-full w-full max-w-[1200px] mx-auto">
      <div className="col-span-10 md:col-span-4 flex flex-col h-full gap-4">
        <TabsGroup />
        <div className="flex-1 flex flex-col gap-2">
          {/* header */}
          <div className="flex flex-col mb-4">
            <p className="text-w10">Logged in as</p>
            <div className="flex w-full items-center justify-between gap-2">
              <h2 className="text-2xl font-semibold">{session.user.name}</h2>
              <ButtonLink href="?edit=name" variant="ghost">
                <LuPencil size={20} className="text-w11" />
              </ButtonLink>
              <EditNameForm />
            </div>
          </div>

          {/* email */}
          <div className="flex gap-3 items-center">
            <LuMail size={20} className="text-w11" />
            <p className="text-w11 text-xl">{session.user.email}</p>
          </div>

          {/* notification preferences */}
          <EditNotification />

          {/* logout */}
          <div className="flex items-center justify-center mt-auto">
            <ButtonAsync variant="danger" onClick={handleLogout}>
              <p>Log out</p>
            </ButtonAsync>
          </div>
        </div>
      </div>
    </main>
  );
}
