"use client";

import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { RegisterForm } from "@/src/features/auth/components/register-form";

export default function RegisterPage() {
  const router = useRouter();

  function handleSuccess() {
    toast.add({
      title: "Success",
      description: "Account created successfully",
      type: "success",
    });

    router.push("/polls");
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-12">
      <RegisterForm onSuccess={handleSuccess} />
    </main>
  );
}
