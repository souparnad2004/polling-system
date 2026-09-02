"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useCurrentUser } from "../hooks/use-current-user";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { data, isPending, isError } = useCurrentUser();

  useEffect(() => {
    if (!isPending && (isError || !data)) {
      router.replace("/login");
    }
  }, [isPending, isError, data, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (isError || !data) return null;

  return children;
}
