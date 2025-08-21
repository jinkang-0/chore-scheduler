import MobileDialogTransformer from "@/components/chore-view/mobile-dialog-transformer";
import LogDetails from "@/components/logs-view/log-details";

export default async function ViewChoreDetails({
  params
}: {
  params: Promise<{ choreId: string }>;
}) {
  const { choreId } = await params;

  return (
    <MobileDialogTransformer returnHref="/logs">
      <LogDetails choreId={choreId} />
    </MobileDialogTransformer>
  );
}
