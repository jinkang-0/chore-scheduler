"use client";

import { DropdownMenu } from "radix-ui";
import { useCallback, useState } from "react";
import { Button, ButtonAsync } from "../ui/button";
import CustomEmojiPicker from "../ui/emoji-picker";
import { Emoji } from "frimousse";
import Input from "../ui/input";
import {
  getPeoplePoolOptions,
  intervalOptions,
  monthdayOptions,
  weekdayOptions
} from "@/data/dropdown";
import { CustomSelect, CustomSelectAsync } from "../ui/select";
import { LuCalendar, LuClock, LuPlus } from "react-icons/lu";
import { ChoreInterval, DropdownOption } from "@/types/types";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { DayPicker, DayPickerDropdown } from "../ui/day-picker";
import { createChore } from "@/api/db";

const schema = z
  .object({
    title: z.string().min(1, "Title is required"),
    interval: z.enum(
      intervalOptions.map((opt) => opt.value),
      "Interval is required"
    ),
    dueDate: z.date(),
    peoplePool: z.array(z.string()).min(1, "At least one person is required"),
    assignTo: z.string().min(1, "One person must be assigned at the start"),
    emoji: z.string().regex(/^[\p{Extended_Pictographic}]{1}$/u),
    weekday: z
      .enum(
        weekdayOptions.map((opt) => opt.value).filter((opt) => opt !== null)
      )
      .nullable()
      .optional(),
    monthday: z
      .enum(
        monthdayOptions.map((opt) => opt.value).filter((opt) => opt !== null)
      )
      .nullable()
      .optional()
  })
  .superRefine((data, ctx) => {
    if (data.assignTo && !data.peoplePool.includes(data.assignTo))
      ctx.addIssue({
        code: "custom",
        message: "Assigned person must be in the people pool",
        path: ["assignTo"]
      });
  });

export default function CreateForm() {
  // states
  const [emoji, setEmoji] = useState("🚀");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [interval, setInterval] = useState<ChoreInterval | undefined>(
    intervalOptions[0].value
  );
  const [selectedPeople, setSelectedPeople] = useState<
    readonly DropdownOption[]
  >([]);

  // lib
  const router = useRouter();
  const { register, control, handleSubmit, formState } = useForm({
    defaultValues: {
      title: "Untitled chore",
      peoplePool: [],
      dueDate: new Date(),
      emoji: "🚀"
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

  const handleCancel = useCallback(() => {
    router.replace("/");
  }, [router]);

  const handleCreate = useCallback(
    async (values: z.infer<typeof schema>) => {
      await createChore({
        title: values.title,
        interval: values.interval,
        dueDate: values.dueDate,
        peoplePool: values.peoplePool,
        assignTo: values.assignTo,
        emoji: values.emoji,
        weekday: values.weekday || null,
        monthday: values.monthday || null
      }).then(() => {
        router.replace("/", { scroll: false });
      });
    },
    [router]
  );

  return (
    <form
      className="flex flex-col p-6 lg:p-8 rounded-lg bg-w4 w-full h-full gap-6 overflow-y-auto"
      onSubmit={handleSubmit(handleCreate)}
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
            variant="contentEditable"
            className="text-2xl font-semibold w-full"
            placeholder="Chore title"
            defaultValue="Untitled chore"
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
          <div className="ml-auto flex gap-2 md:gap-4 items-center flex-wrap">
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
            <div className="ml-auto flex gap-2 md:gap-4 items-center flex-wrap">
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
                  loadOptions={getPeoplePoolOptions}
                  onChange={(options) => {
                    field.onChange(options.map((opt) => opt.value));
                    setSelectedPeople(options);
                  }}
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

        {/* assign to */}
        <div className="space-y-2">
          <p className="font-medium">Assign first to</p>
          <Controller
            name="assignTo"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <CustomSelect
                  instanceId="assignTo"
                  isSearchable={false}
                  options={selectedPeople}
                  onChange={(v) => field.onChange(v?.value || "")}
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

        {/* buttons */}
        <div className="flex justify-between items-center mt-auto pt-12">
          <Button variant="ghost" onClick={handleCancel} type="button">
            <p className="text-w11">cancel</p>
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={formState.isSubmitting}
          >
            <LuPlus size={24} />
            Create
          </Button>
        </div>
      </div>
    </form>
  );
}
