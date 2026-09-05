"use client";

import { useRouter } from "next/navigation";

import { toast } from "@/components/ui/toast";

import { RegisterForm } from "../components/register-form";
import { GuestOnlyRoute } from "../components/guest-only-route";

export function RegisterPage() {
  const router = useRouter();

  function handleSuccess() {
    toast.add({
      title: "Success",
      description: "Account created successfully",
      type: "success",
    });

    router.push("/");
  }

  return (
    <GuestOnlyRoute>
      <main className="flex min-h-svh items-center justify-center px-4 py-12">
        <RegisterForm onSuccess={handleSuccess} />
      </main>
    </GuestOnlyRoute>
  );
}
