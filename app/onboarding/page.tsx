"use client";

import { setOnboarded, updateUsername } from "@/api/db";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required")
});

export default function OnboardingPage() {
  const { data: session } = useSession();
  if (!session || !session.user)
    throw new Error(
      "User not found in onboarding page, should've been redirected"
    );

  const router = useRouter();

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: session.user.name || ""
    }
  });

  const onSubmit = useCallback(async (data: z.infer<typeof schema>) => {
    await updateUsername(data.name);
    await setOnboarded();

    router.replace("/");
  }, []);

  return (
    <main className="w-full h-svh grid place-items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-100 px-4 flex flex-col items-center gap-8"
      >
        {/* header */}
        <header className="flex flex-col items-center gap-2">
          <h3 className="text-2xl font-semibold text-center">Profile Setup</h3>
          <p className="text-w11 text-center">Add any customizations here</p>
        </header>

        {/* name */}
        <div className="w-full flex flex-col">
          <p className="font-medium">Name</p>
          <p className="text-w11">
            Recommendation: use your first/preferred name
          </p>
          <Input variant="textbox" className="mt-2" {...register("name")} />
          {formState.errors.name && (
            <p className="text-red-500 mt-1">{formState.errors.name.message}</p>
          )}
        </div>

        {/* button group */}
        <Button variant="primary" className="mt-8" type="submit">
          <p>Continue</p>
        </Button>
      </form>
    </main>
  );
}
