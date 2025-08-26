import { Checkbox as RadixCheckbox } from "radix-ui";
import { LuCheck } from "react-icons/lu";
import { cn } from "@/lib/utils";

export default function CustomCheckbox({
  className,
  ...props
}: Omit<RadixCheckbox.CheckboxProps, "children">) {
  return (
    <RadixCheckbox.Root
      className={cn(
        "w-5 h-5 rounded bg-w5 transition-colors data-[state='checked']:bg-primary",
        className
      )}
      {...props}
    >
      <RadixCheckbox.Indicator className="grid place-items-center">
        <LuCheck size={12} />
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  );
}
