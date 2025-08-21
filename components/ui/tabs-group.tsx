"use client";

import { LuClipboardList, LuUser } from "react-icons/lu";
import Tab from "./tab";
import { usePathname } from "next/navigation";

export default function TabsGroup() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-11">
      <Tab
        href="/"
        active={pathname !== "/preferences"}
        icon={<LuClipboardList size={24} />}
      />
      <Tab
        href="/preferences"
        active={pathname === "preferences"}
        icon={<LuUser size={24} />}
      />
    </div>
  );
}
