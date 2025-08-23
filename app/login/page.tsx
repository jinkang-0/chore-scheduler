"use client";

import IconGoogle from "@/components/icons/google";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

function getErrorMessage(error: string | null): string {
  switch (error) {
    case "OAuthAccountNotLinked":
      return "This account is already linked to another user. Please use a different account.";
    case "AccessDenied":
      return "Access denied. Your email is not whitelisted.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
}

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <main className="w-full h-svh grid place-items-center">
      <div className="w-full px-4 flex flex-col items-center gap-2">
        <h3 className="text-2xl font-semibold">Welcome back!</h3>
        <p className="text-w11 text-center">
          Please use your berkeley.edu account to continue
        </p>
        {error && <p className="text-red-400">{getErrorMessage(error)}</p>}
        <Button
          variant="secondary"
          className="mt-10"
          onClick={() => signIn("google")}
        >
          <IconGoogle />
          <p>Continue with Google</p>
        </Button>
      </div>
    </main>
  );
}
