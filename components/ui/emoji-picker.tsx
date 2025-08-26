import type {
  EmojiPickerListCategoryHeaderProps,
  EmojiPickerListEmojiProps,
  EmojiPickerListRowProps
} from "frimousse";
import { EmojiPicker } from "frimousse";
import { cn } from "@/lib/utils";

const CategoryHeader = ({
  category,
  ...props
}: EmojiPickerListCategoryHeaderProps) => (
  <div
    className="bg-white px-3 pt-3 pb-1.5 font-medium text-neutral-600 text-xs dark:bg-neutral-900 dark:text-neutral-400"
    {...props}
  >
    {category.label}
  </div>
);

const Row = ({ children, ...props }: EmojiPickerListRowProps) => (
  <div className="scroll-my-1.5 px-1.5" {...props}>
    {children}
  </div>
);

const Emoji = ({ emoji, ...props }: EmojiPickerListEmojiProps) => (
  <button
    className="flex size-10 text-xl items-center justify-center rounded-md data-[active]:bg-neutral-100 dark:data-[active]:bg-neutral-800"
    {...props}
  >
    {emoji.emoji}
  </button>
);

export default function CustomEmojiPicker({
  className,
  ...props
}: React.ComponentProps<typeof EmojiPicker.Root>) {
  return (
    <EmojiPicker.Root
      className={cn(
        "isolate flex h-[368px] w-fit flex-col bg-white dark:bg-neutral-900 rounded-lg",
        className
      )}
      {...props}
    >
      <EmojiPicker.Search className="z-10 mx-2 mt-2 appearance-none rounded-md bg-neutral-100 px-2.5 py-2 text-sm dark:bg-neutral-800" />
      <EmojiPicker.Viewport className="relative flex-1 outline-hidden">
        <EmojiPicker.Loading className="absolute inset-0 flex items-center justify-center text-neutral-400 text-sm dark:text-neutral-500">
          Loading…
        </EmojiPicker.Loading>
        <EmojiPicker.Empty className="absolute inset-0 flex items-center justify-center text-neutral-400 text-sm dark:text-neutral-500">
          No emoji found.
        </EmojiPicker.Empty>
        <EmojiPicker.List
          className="select-none pb-1.5"
          components={{
            CategoryHeader,
            Row,
            Emoji
          }}
        />
      </EmojiPicker.Viewport>
    </EmojiPicker.Root>
  );
}
