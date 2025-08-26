import Link from "next/link";
import { cn } from "@/lib/utils";

interface TabsProps {
  href: string;
  icon: React.ReactNode;
  active?: boolean;
}

export default function Tab({ href, icon, active }: TabsProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        !active && "text-gray-400"
      )}
    >
      {icon}
      <div
        className={cn(
          "h-[1px] w-full rounded-full bg-foreground",
          !active && "invisible"
        )}
      />
    </Link>
  );
}
