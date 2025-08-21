import CreateForm from "@/components/chore-view/create-form";
import MobileDialogTransformer from "@/components/chore-view/mobile-dialog-transformer";

export default function CreateChore() {
  return (
    <MobileDialogTransformer>
      <CreateForm />
    </MobileDialogTransformer>
  );
}
