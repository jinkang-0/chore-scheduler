"use client";

import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { useCallback, useEffect, useState } from "react";
import { LuX } from "react-icons/lu";
import { Button } from "./button";

/**
 * Uses media queries to transform children to a dialog
 * for mobile devices.
 */
export default function MobileDialogTransformer({
  children,
  returnHref = "/"
}: {
  children: React.ReactNode;
  returnHref?: string;
}) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMdBreakpoint = (e: MediaQueryListEvent) => {
      setDialogOpen(e.matches);
    };

    const mdBreakpoint = window.matchMedia("(max-width: 48rem)");
    mdBreakpoint.addEventListener("change", handleMdBreakpoint);

    // initial check
    if (mdBreakpoint.matches) {
      setDialogOpen(true);
    }

    return () => {
      mdBreakpoint.removeEventListener("change", handleMdBreakpoint);
    };
  }, []);

  const handleCancel = useCallback(() => {
    router.replace(returnHref, { scroll: false });
  }, [router, returnHref]);

  if (dialogOpen) {
    return (
      <Dialog.Root open={true} onOpenChange={handleCancel}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black/50 z-10 p-4 py-16 grid place-items-center overflow-y-auto">
            <Dialog.Content className="w-full md:h-full flex flex-col">
              <Dialog.Title className="sr-only">Dialog</Dialog.Title>
              <Dialog.Description className="sr-only">
                Dialog
              </Dialog.Description>
              <Dialog.Close asChild>
                <div className="flex justify-end items-center mb-2">
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
              </Dialog.Close>
              {children}
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  return (
    <div className="w-full h-full grid place-items-center overflow-y-auto">
      <div className="w-full h-full flex flex-col">{children}</div>
    </div>
  );
}
