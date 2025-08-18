"use client";

import { LuX } from "react-icons/lu";
import { Button } from "../ui/button";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

/**
 * Uses media queries to transform children to a dialog
 * for mobile devices.
 */
export default function MobileDialogTransformer({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleCancel = useCallback(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="fixed md:static inset-0 w-full h-svh md:h-full bg-black/50 md:bg-transparent grid place-items-center p-4 md:p-0 z-10 md:z-0">
      <div className="w-full md:h-full flex flex-col">
        <div className="md:hidden flex justify-end items-center mb-2">
          <div className="rounded-full bg-w4">
            <Button
              variant="ghost"
              className="text-w11 rounded-full!"
              onClick={handleCancel}
            >
              <LuX size={24} />
            </Button>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
