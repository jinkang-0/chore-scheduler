"use client";

import { LuClipboardList, LuScroll, LuUser } from "react-icons/lu";
import Tab from "./tab";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export default function TabsGroup() {
  const pathname = usePathname();

  const highlightedTab = useMemo(() => {
    if (pathname === "/preferences") return "preferences";

    if (pathname.startsWith("/logs")) return "logs";

    return "home";
  }, [pathname]);

  return (
    <div className="flex items-center gap-11">
      <Tab
        href="/"
        active={highlightedTab === "home"}
        icon={<LuClipboardList size={24} />}
      />
      <Tab
        href="/preferences"
        active={highlightedTab === "preferences"}
        icon={<LuUser size={24} />}
      />
      <Tab
        href="/logs"
        active={highlightedTab === "logs"}
        icon={<LuScroll size={24} />}
      />
    </div>
  );
}
