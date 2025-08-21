import { Dialog } from "radix-ui";
import React, { useCallback, useEffect, useState } from "react";
import { DayPicker } from "../ui/day-picker";
import { Button } from "../ui/button";
import { useChoreState } from "@/context/chore-state";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateChoreDueDate } from "@/api/db";
import CustomDialog from "../ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";

const schema = z.object({
  dueDate: z.date().min(new Date(), "Due date must be in the future")
});

export default function UpdateDueDateForm({ choreId }: { choreId: string }) {
  const { choreMap } = useChoreState();
  const chore = choreMap[choreId];
  if (!chore) throw new Error("Chore not found");

  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  const { handleSubmit, control, reset, formState } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      dueDate: chore.due_date || new Date()
    }
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof schema>) => {
      await updateChoreDueDate(choreId, data.dueDate);
      setIsOpen(false);
      router.replace("?", { scroll: false });
    },
    [choreId]
  );

  useEffect(() => {
    if (params.get("edit") === "due-date") {
      setIsOpen(true);
      reset({ dueDate: chore.due_date || new Date() });
    } else {
      setIsOpen(false);
    }
  }, [params]);

  return (
    <CustomDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) {
          router.push("?edit=due-date", { scroll: false });
        } else {
          router.replace("?", { scroll: false });
        }
      }}
      trigger={
        <Button variant="ghost" className="justify-start w-fit text-left">
          change due date
        </Button>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Dialog.Title className="text-2xl font-semibold">
          Change Due Date
        </Dialog.Title>
        <Dialog.Description className="text-w11">
          Select a new due date for this chore.
        </Dialog.Description>
        <Controller
          control={control}
          name="dueDate"
          render={({ field }) => (
            <DayPicker
              mode="single"
              selected={field.value}
              onSelect={field.onChange}
              disabled={{ before: new Date() }}
            />
          )}
        />
        <Button
          variant="primary"
          className="mt-4"
          type="submit"
          disabled={formState.isSubmitting || !formState.isValid}
        >
          Save Changes
        </Button>
      </form>
    </CustomDialog>
  );
}
