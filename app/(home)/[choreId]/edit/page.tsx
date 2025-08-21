import ChoreEditor from "@/components/chore-view/chore-edit";
import MobileDialogTransformer from "@/components/chore-view/mobile-dialog-transformer";

export default async function EditChore({
  params
}: {
  params: Promise<{ choreId: string }>;
}) {
  const { choreId } = await params;

  return (
    <MobileDialogTransformer>
      <ChoreEditor choreId={choreId} />
    </MobileDialogTransformer>
  );
}
