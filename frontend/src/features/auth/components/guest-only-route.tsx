"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useCurrentUser } from "../hooks/use-current-user";

export function GuestOnlyRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: user, isPending } = useCurrentUser();

  useEffect(() => {
    if (!isPending && user) {
      router.replace("/dashboard");
    }
  }, [isPending, router, user]);

  if (isPending || user) {
    return (
      <main className="flex min-h-svh items-center justify-center px-4 py-12">
        <p className="text-sm text-muted-foreground">Checking your session...</p>
      </main>
    );
  }

  return children;
}
