"use client";

import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { LoginForm } from "@/src/features/auth/components/login-form";

export default function LoginPage() {
  const router = useRouter();

  function handleSuccess() {
    toast.add({
      title: "Success",
      description: "Signed in successfully",
      type: "success",
    });

    router.push("/polls");
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-12">
      <LoginForm onSuccess={handleSuccess} />
    </main>
  );
}
