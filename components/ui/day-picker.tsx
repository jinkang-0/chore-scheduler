import { cn, formatDate } from "@/lib/utils";
import { DropdownMenu } from "radix-ui";
import { DayPickerProps, DayPicker as LibDayPicker } from "react-day-picker";
import { LuCalendar } from "react-icons/lu";
import defaultClassNames from "react-day-picker/style.module.css";
import styles from "@/lib/day-picker.module.css";

export function DayPicker({
  fixedWeeks = true,
  showOutsideDays = true,
  classNames,
  ...props
}: DayPickerProps) {
  return (
    <LibDayPicker
      showOutsideDays={showOutsideDays}
      fixedWeeks={fixedWeeks}
      classNames={{
        ...defaultClassNames,
        root: cn(defaultClassNames.root, styles.root),
        selected: cn(styles.selected),
        ...classNames
      }}
      {...props}
    />
  );
}

export function DayPickerDropdown({
  value,
  children
}: {
  value?: Date;
  children: React.ReactNode;
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div className="min-w-40 p-2 rounded-lg bg-white/5 flex items-center gap-2 cursor-pointer">
          {value && <p>{formatDate(value)}</p>}
          <LuCalendar size={24} className="text-w11 ml-auto" />
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="p-4 rounded-lg bg-neutral-900 z-40">
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
