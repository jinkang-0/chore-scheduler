"use client";

import { DropdownMenu } from "radix-ui";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import CustomEmojiPicker from "../ui/emoji-picker";
import { Emoji } from "frimousse";
import Input from "../ui/input";
import { getPeoplePoolOptions, intervalOptions } from "@/data/dropdown";
import { CustomSelect, CustomSelectAsync } from "../ui/select";
import { LuClock, LuPlus } from "react-icons/lu";
import { DropdownOption } from "@/lib/types";
import { useHomeDialog } from "@/context/home-dialog";
import { useRouter } from "next/navigation";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { DayPicker, DayPickerDropdown } from "../ui/day-picker";

const schema = z
  .object({
    title: z.string().min(1, "Title is required"),
    interval: z.enum(intervalOptions.map((opt) => opt.value)),
    dueDate: z.date(),
    peoplePool: z.array(z.string()).min(1, "At least one person is required"),
    assignTo: z.string().min(1, "One person must be assigned at the start"),
    emoji: z.string().regex(/^[\p{Extended_Pictographic}]{1}$/u)
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
  // context
  const { modalNaturallyOpened, setModalNaturallyOpened } = useHomeDialog();

  // states
  const [emoji, setEmoji] = useState("🚀");
  const [pickerOpen, setPickerOpen] = useState(false);
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

  const closeModal = useCallback(() => {
    if (modalNaturallyOpened) {
      router.back();
      setModalNaturallyOpened(false);
    } else {
      router.replace("/");
    }
  }, [router, modalNaturallyOpened, setModalNaturallyOpened]);

  const handleCancel = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const handleCreate = useCallback(
    (values: FieldValues) => {
      console.log(values);
      closeModal();
    },
    [closeModal]
  );

  return (
    <form
      className="flex flex-col p-6 lg:p-8 rounded-lg bg-w4 w-full h-full gap-6"
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
          <div className="ml-auto flex gap-4 items-center">
            <div className="flex gap-2 items-center text-w10">
              <LuClock size={24} />
              <p>due on</p>
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
        <div className="flex justify-between items-center mt-auto">
          <Button variant="ghost" onClick={handleCancel} type="button">
            <p className="text-w11">cancel</p>
          </Button>
          <Button variant="primary" type="submit">
            <LuPlus size={24} />
            Create
          </Button>
        </div>
      </div>
    </form>
  );
}
