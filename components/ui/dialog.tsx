import { Dialog as RadixDialog } from "radix-ui";

interface CustomDialogProps
  extends React.ComponentProps<typeof RadixDialog.Root> {
  trigger: React.ReactNode;
}

export default function CustomDialog({
  trigger,
  children,
  ...props
}: CustomDialogProps) {
  return (
    <RadixDialog.Root {...props}>
      <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="bg-black/50 fixed inset-0 z-20 grid place-items-center overflow-y-auto animate-fade-in">
          <RadixDialog.Content asChild>
            <div className="bg-w4 p-6 rounded-lg flex flex-col gap-4 animate-fade-in-drop opacity-0">
              {children}
            </div>
          </RadixDialog.Content>
        </RadixDialog.Overlay>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
