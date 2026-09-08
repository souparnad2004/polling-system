"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

import { getPoll } from "../api/poll.api";
import { PollForm } from "../components/poll-form";
import { pollKeys } from "../hooks/use-polls";

interface EditPollPageProps {
  pollId: string;
}

export function EditPollPage({ pollId }: EditPollPageProps) {
  const router = useRouter();

  const pollQuery = useQuery({
    queryKey: pollKeys.detail(pollId),
    queryFn: () => getPoll(pollId),
  });

  if (pollQuery.isLoading) {
    return <div className="mx-auto max-w-2xl p-6">Loading...</div>;
  }

  // Drafts return 404 to non-owners, so an unauthorized or unknown poll both
  // land here safely.
  if (pollQuery.isError || !pollQuery.data) {
    return (
      <main className="mx-auto flex max-w-2xl flex-col items-center gap-2 py-12">
        <h2 className="font-semibold">Poll not found</h2>
        <p className="text-sm text-muted-foreground">
          This poll may not exist or you may not have access to it.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => router.push("/polls/mine")}
        >
          Back to My Polls
        </Button>
      </main>
    );
  }

  const poll = pollQuery.data;

  if (poll.status !== "draft") {
    return (
      <main className="mx-auto flex max-w-2xl flex-col items-center gap-2 py-12">
        <h2 className="font-semibold">Only draft polls can be edited</h2>
        <p className="text-sm text-muted-foreground">
          This poll is {poll.status} and can no longer be modified.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => router.push(`/polls/${poll.id}`)}
        >
          View poll
        </Button>
      </main>
    );
  }

  function handleSuccess() {
    toast.add({
      title: "Success",
      description: "Poll updated successfully",
      type: "success",
    });

    router.push("/polls/mine");
  }

  return (
    <main className="px-4 py-12">
      <PollForm poll={poll} onSuccess={handleSuccess} />
    </main>
  );
}