import ChoreDetails from "@/components/chore-view/chore-details";
import MobileDialogTransformer from "@/components/chore-view/mobile-dialog-transformer";

export default async function ViewChoreDetails({
  params
}: {
  params: Promise<{ choreId: string }>;
}) {
  const { choreId } = await params;

  return (
    <MobileDialogTransformer>
      <ChoreDetails choreId={choreId} />
    </MobileDialogTransformer>
  );
}
