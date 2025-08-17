/**
 * Uses media queries to transform children to a dialog
 * for mobile devices.
 */
export default function MobileDialogTransformer({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed md:static inset-0 w-full h-svh md:h-full bg-black/50 md:bg-transparent grid place-items-center p-4 md:p-0 z-10 md:z-0">
      <div className="w-full md:h-full flex">{children}</div>
    </div>
  );
}
