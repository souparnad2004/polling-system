"use client";

import { useRouter } from "next/navigation";

import { toast } from "@/components/ui/toast";

import { CreatePollForm } from "../components/create-poll-form";

export function CreatePollPage() {
  const router = useRouter();

  function handleSuccess(_pollId: string, status: "draft" | "published") {
    toast.add({
      title: "Success",
      description:
        status === "published"
          ? "Poll published successfully"
          : "Poll saved as draft",
      type: "success",
    });

    router.push("/polls/mine");
  }

  return (
    <main className="px-4 py-12">
      <CreatePollForm onSuccess={handleSuccess} />
    </main>
  );
}
