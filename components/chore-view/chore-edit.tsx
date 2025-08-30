"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Emoji } from "frimousse";
import { redirect, useRouter } from "next/navigation";
import { Dialog, DropdownMenu } from "radix-ui";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LuCalendar, LuClock, LuSave } from "react-icons/lu";
import z from "zod";
import { updateChore } from "@/actions";
import { deleteChore } from "@/actions/delete";
import { useChoreState } from "@/context/chore-state";
import {
  intervalMap,
  intervalOptions,
  monthdayMap,
  monthdayOptions,
  weekdayMap,
  weekdayOptions
} from "@/data/dropdown";
import { usePeoplePoolOptions } from "@/hooks/usePeoplePoolOptions";
import type { ChoreInterval } from "@/types/types";
import { Button } from "../ui/button";
import { DayPicker, DayPickerDropdown } from "../ui/day-picker";
import CustomDialog from "../ui/dialog";
import CustomEmojiPicker from "../ui/emoji-picker";
import Input from "../ui/input";
import { CustomSelect, CustomSelectAsync } from "../ui/select";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  interval: z.enum(
    intervalOptions.map((opt) => opt.value),
    "Interval is required"
  ),
  dueDate: z.date(),
  peoplePool: z.array(z.string()).min(1, "At least one person is required"),
  emoji: z.string(),
  weekday: z
    .enum(
      weekdayOptions.map((opt) => opt.value).filter((opt) => opt !== null),
      "Invalid weekday"
    )
    .nullable()
    .optional(),
  monthday: z
    .enum(
      monthdayOptions.map((opt) => opt.value).filter((opt) => opt !== null),
      "Invalid monthday"
    )
    .nullable()
    .optional()
});

type FormValues = z.infer<typeof schema>;

export default function ChoreEditForm({ choreId }: { choreId: string }) {
  // get defaults
  const { choreMap } = useChoreState();
  const chore = choreMap[choreId];
  if (!chore) redirect("/");

  const defaultPeoplePool = useMemo(
    () => chore.queue.map((p) => ({ value: p.id, label: p.name })),
    [chore.queue]
  );

  // states
  const [emoji, setEmoji] = useState(chore.emoji);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [interval, setInterval] = useState<ChoreInterval | undefined>(
    chore.interval
  );

  const { loadOptions, peoplePoolMap, peoplePoolOptions } =
    usePeoplePoolOptions();

  // lib
  const router = useRouter();
  const { register, control, handleSubmit, formState, setValue } = useForm({
    defaultValues: {
      title: chore.title || "Untitled chore",
      peoplePool: defaultPeoplePool.map((p) => p.value),
      dueDate: new Date(chore.due_date),
      emoji: chore.emoji,
      interval: chore.interval,
      weekday: (chore.weekday
        ? chore.weekday.toString()
        : null) as FormValues["weekday"],
      monthday: (chore.monthday
        ? chore.monthday.toString()
        : null) as FormValues["monthday"]
    },
    resolver: zodResolver(schema)
  });

  const handleEmojiPick = useCallback((e: Emoji) => {
    setEmoji(e.emoji);
    setPickerOpen(false);
  }, []);

  const togglePicker = useCallback(() => {
    setPickerOpen((prev) => !prev);
  }, []);

  const handleDelete = useCallback(async () => {
    await deleteChore(choreId);
    router.replace("/", { scroll: false });
  }, [choreId, router]);

  const handleCancel = useCallback(() => {
    router.replace(`/?mode=view&id=${choreId}`, { scroll: false });
  }, [router, choreId]);

  const handleAddAll = useCallback(() => {
    setValue("peoplePool", peoplePoolOptions?.map((p) => p.value) ?? []);
  }, [peoplePoolOptions, setValue]);

  const handleEdit = useCallback(
    async (values: FormValues) => {
      await updateChore({
        id: choreId,
        title: values.title,
        emoji: values.emoji,
        interval: values.interval,
        weekday: values.weekday ? Number(values.weekday) : null,
        monthday: values.monthday ? Number(values.monthday) : null,
        dueDate: values.dueDate,
        peoplePool: values.peoplePool
      });

      router.replace(`/?mode=view&id=${choreId}`, { scroll: false });
    },
    [router, choreId]
  );

  return (
    <form
      className="flex flex-col p-6 lg:p-8 rounded-lg bg-w4 w-full h-full gap-6 overflow-y-auto"
      onSubmit={handleSubmit(handleEdit)}
    >
      {/* title and emoji */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <DropdownMenu.Root open={pickerOpen} onOpenChange={setPickerOpen}>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost" onClick={togglePicker}>
                <p className="text-2xl">{emoji}</p>
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="z-50">
              <Controller
                name="emoji"
                control={control}
                render={({ field }) => (
                  <CustomEmojiPicker
                    onEmojiSelect={(emoji) => {
                      handleEmojiPick(emoji);
                      field.onChange(emoji.emoji);
                    }}
                  />
                )}
              />
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <Input
            variant="textbox"
            className="text-2xl font-semibold w-full"
            placeholder="Chore title"
            defaultValue={chore.title || "Untitled chore"}
            {...register("title")}
          />
        </div>

        {formState.errors.title && (
          <p className="text-red-500 text-sm">
            {formState.errors.title.message}
          </p>
        )}

        {formState.errors.emoji && (
          <p className="text-red-500 text-sm">
            {formState.errors.emoji.message}
          </p>
        )}
      </div>

      {/* form body */}
      <div className="flex flex-col gap-6 flex-1">
        <div className="flex flex-col gap-2">
          <div className="space-y-2">
            <p className="font-medium">Interval</p>
            <Controller
              name="interval"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <CustomSelect
                    instanceId="interval"
                    isSearchable={false}
                    options={intervalOptions}
                    onChange={(v) => {
                      setInterval(v?.value);
                      field.onChange(v?.value || null);
                    }}
                    defaultValue={{
                      label: intervalMap[chore.interval],
                      value: chore.interval
                    }}
                    isMulti={false}
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          {/* due date select */}
          <div className="ml-auto flex gap-2 md:gap-4 items-center flex-wrap mt-4 md:mt-0">
            <div className="flex gap-2 items-center text-w10">
              <LuClock size={24} />
              <p>first due on</p>
            </div>
            <Controller
              control={control}
              name="dueDate"
              render={({ field, fieldState }) => (
                <>
                  <DayPickerDropdown value={field.value}>
                    <DayPicker
                      mode="single"
                      selected={field.value}
                      onSelect={(value) => field.onChange(value)}
                      disabled={{ before: new Date() }}
                      required
                    />
                  </DayPickerDropdown>
                  {fieldState.error && (
                    <p className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          {/* reoccurrence select for weekly */}
          {interval === "WEEKLY" && (
            <div className="ml-auto flex gap-2 md:gap-4 items-center flex-wrap mt-4 md:mt-0">
              <div className="flex gap-2 items-center text-w10">
                <LuCalendar size={24} />
                <p>reoccur on</p>
              </div>
              <Controller
                control={control}
                name="weekday"
                render={({ field, fieldState }) => (
                  <>
                    <CustomSelect
                      instanceId="weekday"
                      isSearchable={false}
                      options={weekdayOptions}
                      className="min-w-40"
                      onChange={(v) => {
                        field.onChange(v?.value || null);
                      }}
                      defaultValue={{
                        label:
                          weekdayMap[
                            new String(chore.weekday) as keyof typeof weekdayMap
                          ],
                        value: new String(chore.weekday) as typeof field.value
                      }}
                      isMulti={false}
                    />
                    {fieldState.error && (
                      <p className="text-red-500 text-sm">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          )}

          {/* reoccurrence select for monthly */}
          {interval === "MONTHLY" && (
            <div className="ml-auto flex gap-2 md:gap-4 items-center flex-wrap">
              <div className="flex gap-2 items-center text-w10">
                <LuCalendar size={24} />
                <p>reoccur on</p>
              </div>
              <Controller
                control={control}
                name="monthday"
                render={({ field, fieldState }) => (
                  <>
                    <CustomSelect
                      instanceId="monthday"
                      isSearchable={false}
                      options={monthdayOptions}
                      className="min-w-40"
                      onChange={(v) => {
                        field.onChange(v?.value || null);
                      }}
                      defaultValue={{
                        label:
                          monthdayMap[
                            new String(
                              chore.monthday
                            ) as keyof typeof monthdayMap
                          ],
                        value: new String(chore.monthday) as typeof field.value
                      }}
                      isMulti={false}
                    />
                    {fieldState.error && (
                      <p className="text-red-500 text-sm">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          )}
        </div>

        {/* people pool */}
        <div className="space-y-2">
          <p className="font-medium">People pool</p>
          <Controller
            name="peoplePool"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <CustomSelectAsync
                  instanceId="peoplePool"
                  isSearchable={false}
                  isMulti
                  cacheOptions
                  defaultOptions
                  closeMenuOnSelect={false}
                  loadOptions={loadOptions}
                  value={field.value.map((v) => ({
                    value: v,
                    label: peoplePoolMap[v]
                  }))}
                  onChange={(options) => {
                    field.onChange(options.map((opt) => opt.value));
                  }}
                  defaultValue={defaultPeoplePool}
                />
                {fieldState.error && (
                  <p className="text-red-500 text-sm">
                    {fieldState.error.message}
                  </p>
                )}
                <div className="flex justify-end items-center">
                  <Button variant="ghost" onClick={handleAddAll} type="button">
                    <p className="text-w11">add all</p>
                  </Button>
                </div>
              </>
            )}
          />
        </div>

        {/* buttons */}
        <div className="flex not-md:flex-col md:justify-between md:items-end mt-auto gap-4 pt-12">
          <div className="flex flex-col gap-2 items-baseline">
            <CustomDialog
              trigger={
                <Button
                  variant="ghost"
                  className="text-danger justify-start"
                  type="button"
                >
                  <p className="text-danger">delete chore</p>
                </Button>
              }
            >
              <Dialog.Title className="font-medium text-xl">
                Are you sure you want to delete this chore?
              </Dialog.Title>
              <Dialog.Description className="text-w11">
                This action cannot be undone.
              </Dialog.Description>
              <div className="mt-4 flex justify-end gap-4">
                <Dialog.Close asChild>
                  <Button variant="ghost" type="button">
                    <p className="text-w11">Cancel</p>
                  </Button>
                </Dialog.Close>
                <Button
                  variant="danger"
                  onClick={() => {
                    handleDelete();
                  }}
                  type="button"
                >
                  Delete
                </Button>
              </div>
            </CustomDialog>
            <Button
              variant="ghost"
              className="justify-start"
              onClick={handleCancel}
              type="button"
            >
              <p className="text-w11">cancel</p>
            </Button>
          </div>
          <Button
            variant="primary"
            type="submit"
            disabled={formState.isSubmitting}
          >
            <LuSave size={24} />
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}
