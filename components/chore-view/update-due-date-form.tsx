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

const schema = z.object({
  dueDate: z.date().min(new Date(), "Due date must be in the future")
});

export default function UpdateDueDateForm({ choreId }: { choreId: string }) {
  const { choreMap } = useChoreState();
  const chore = choreMap[choreId];
  if (!chore) throw new Error("Chore not found");

  const [isOpen, setIsOpen] = useState(false);

  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      dueDate: chore.due_date || new Date()
    }
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof schema>) => {
      await updateChoreDueDate(choreId, data.dueDate);
      setIsOpen(false);
    },
    [choreId]
  );

  return (
    <CustomDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) {
          reset({ dueDate: chore.due_date || new Date() });
        }
        setIsOpen(open);
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
        <Button variant="primary" className="mt-4">
          Save Changes
        </Button>
      </form>
    </CustomDialog>
  );
}
