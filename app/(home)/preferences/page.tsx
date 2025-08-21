"use client";

import { Button, ButtonAsync } from "@/components/ui/button";
import CustomCheckbox from "@/components/ui/checkbox";
import TabsGroup from "@/components/ui/tabs-group";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useCallback } from "react";
import { LuMail, LuPencil } from "react-icons/lu";

export default function PreferencesPage() {
  const { data: session } = useSession();
  if (!session) return redirect("/login");

  const handleLogout = useCallback(async () => {
    await signOut({ redirect: true });
  }, []);

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
              <Button variant="ghost">
                <LuPencil size={24} className="text-w11" />
              </Button>
            </div>
          </div>

          {/* email */}
          <div className="flex gap-3 items-center">
            <LuMail size={20} className="text-w11" />
            <p className="text-w11 text-xl">{session.user.email}</p>
          </div>

          {/* notification preferences */}
          <div className="mt-12">
            <h4 className="font-medium">Notifications</h4>
            <label
              htmlFor="email"
              className="select-none flex items-center gap-2 mt-2"
            >
              <CustomCheckbox id="email" name="email" />
              <span className="text-lg">receive email chore reminders</span>
            </label>
          </div>

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
