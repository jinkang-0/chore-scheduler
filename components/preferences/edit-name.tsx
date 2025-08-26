"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Dialog, VisuallyHidden } from "radix-ui";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { LuCheck } from "react-icons/lu";
import z from "zod";
import { updateUsername } from "@/actions";
import { Button, ButtonLink } from "../ui/button";
import CustomDialog from "../ui/dialog";
import Input from "../ui/input";

const schema = z.object({
  name: z.string().min(1, "Name is required")
});

export default function EditNameForm() {
  const { data: session, update: updateSession } = useSession();
  if (!session?.user) redirect("/login");

  const searchParams = useSearchParams();
  const edit = searchParams.get("edit");
  const router = useRouter();

  const { register, handleSubmit, reset, formState } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: session.user.name || ""
    }
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof schema>) => {
      await updateUsername(data.name);
      await updateSession();
      router.replace("/preferences");
    },
    [router, updateSession]
  );

  useEffect(() => {
    if (edit !== "name") {
      reset();
    }
  }, [edit, reset]);

  return (
    <CustomDialog
      open={edit === "name"}
      onOpenChange={(open) => {
        if (!open) {
          router.replace("/preferences");
        }
      }}
      trigger={null}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 min-w-75"
      >
        <Dialog.Title className="text-xl font-semibold">Edit name</Dialog.Title>
        <VisuallyHidden.Root>
          <Dialog.Description>Edit dialog for name</Dialog.Description>
        </VisuallyHidden.Root>
        <Input variant="textbox" {...register("name")} />
        <div className="flex items-center justify-between gap-2 mt-4">
          <ButtonLink href="?" replace variant="ghost">
            <p className="text-w11">cancel</p>
          </ButtonLink>
          <Button
            variant="primary"
            type="submit"
            disabled={formState.isSubmitting}
          >
            <LuCheck size={20} />
            <p>Done</p>
          </Button>
        </div>
      </form>
    </CustomDialog>
  );
}
