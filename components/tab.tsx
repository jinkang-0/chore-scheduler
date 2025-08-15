"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TabsProps {
  href: string;
  icon: React.ReactNode;
}

export default function Tab({ href, icon }: TabsProps) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        pathname !== href && "text-gray-400"
      )}
    >
      {icon}
      <div
        className={cn(
          "h-[1px] w-full rounded-full bg-foreground",
          pathname !== href && "invisible"
        )}
      />
    </Link>
  );
}
