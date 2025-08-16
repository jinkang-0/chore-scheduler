"use client";

import { DropdownMenu } from "radix-ui";
import { useCallback, useState } from "react";
import { Button } from "../ui/button";
import CustomEmojiPicker from "../ui/emoji-picker";
import { Emoji } from "frimousse";
import Input from "../ui/input";
import {
  intervalOptions,
  monthdayOptions,
  weekdayOptions
} from "@/data/dropdown";
import CustomSelect from "../ui/select";
import { LuClock } from "react-icons/lu";

export default function CreateForm() {
  const [emoji, setEmoji] = useState("🚀");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [intervalOption, setIntervalOption] = useState<string | null>(null);

  const handleEmojiPick = useCallback((e: Emoji) => {
    setEmoji(e.emoji);
    setPickerOpen(false);
  }, []);

  const togglePicker = useCallback(() => {
    setPickerOpen((prev) => !prev);
  }, []);

  return (
    <form className="flex flex-col p-4 rounded-lg bg-w4 w-full h-full gap-6">
      {/* title and emoji */}
      <div className="mt-4 flex gap-2">
        <DropdownMenu.Root open={pickerOpen} onOpenChange={setPickerOpen}>
          <DropdownMenu.Trigger asChild>
            <Button variant="ghost" onClick={togglePicker}>
              <p className="text-2xl">{emoji}</p>
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <CustomEmojiPicker onEmojiSelect={handleEmojiPick} />
          </DropdownMenu.Content>
        </DropdownMenu.Root>
        <Input
          variant="contentEditable"
          className="text-2xl font-semibold w-full"
          placeholder="Chore title"
          defaultValue="New chore"
        />
      </div>

      {/* form body */}
      <div className="flex flex-col gap-2">
        <p className="font-medium">Interval</p>
        <CustomSelect
          options={intervalOptions}
          placeholder="Daily"
          onChange={(v) => setIntervalOption(v?.value || null)}
        />

        {/* weekday select */}
        {intervalOption === "weekly" && (
          <div className="ml-auto flex gap-4 items-center">
            <div className="flex gap-2 items-center text-w10">
              <LuClock size={24} />
              <p>due on</p>
            </div>
            <CustomSelect options={weekdayOptions} placeholder={"Weekday"} />
          </div>
        )}

        {/* month day select */}
        {intervalOption === "monthly" && (
          <div className="ml-auto flex gap-4 items-center">
            <div className="flex gap-2 items-center text-w10">
              <LuClock size={24} />
              <p>due on</p>
            </div>
            <CustomSelect
              options={monthdayOptions}
              placeholder={"Day of month"}
            />
          </div>
        )}
      </div>
    </form>
  );
}
