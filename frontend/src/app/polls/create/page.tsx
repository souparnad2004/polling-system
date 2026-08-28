"use client";

import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { CreatePollForm } from "@/src/features/polls/components/create-poll-form";

export default function CreatePollPage() {
  const router = useRouter();

  function handleSuccess(pollId: string) {
    toast.add({
      title: "Success",
      description: "Poll created successfully",
      type: "success",
    });

    router.push(`/polls/${pollId}`);
  }

  return (
    <main className="px-4 py-12">
      <CreatePollForm
        onSuccess={handleSuccess}
      />
    </main>
  );
}