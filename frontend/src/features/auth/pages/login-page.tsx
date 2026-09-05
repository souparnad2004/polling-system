"use client";

import { toast } from "@/components/ui/toast";

import { LoginForm } from "../components/login-form";
import { GuestOnlyRoute } from "../components/guest-only-route";

export function LoginPage() {
  function handleSuccess() {
    toast.add({
      title: "Success",
      description: "Signed in successfully",
      type: "success",
    });
  }

  return (
    <GuestOnlyRoute>
      <main className="flex min-h-svh items-center justify-center px-4 py-12">
        <LoginForm onSuccess={handleSuccess} />
      </main>
    </GuestOnlyRoute>
  );
}
