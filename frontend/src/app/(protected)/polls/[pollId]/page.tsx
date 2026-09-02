"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
  createVote,
  getPoll,
  getPollResults,
} from "@/src/features/api/poll.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PollDetail } from "@/src/features/polls/components/poll-detail";
import { PollManagementActions } from "@/src/features/polls/components/poll-management-actions";
import { useCurrentUser } from "@/src/features/auth/hooks/useAuth";
import { toast } from "@/components/ui/toast";

interface PollPageProps {
  params: Promise<{
    pollId: string;
  }>;
}

export default function PollPage({ params }: PollPageProps) {
  const { pollId } = use(params);
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();

  const pollQuery = useQuery({
    queryKey: ["poll", pollId],
    queryFn: () => getPoll(pollId),
  });

  const resultsQuery = useQuery({
    queryKey: ["results", pollId],
    queryFn: () => getPollResults(pollId),
  });

  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: (optionId: string) => createVote(pollId, optionId),
    onSuccess: () => {
      toast.add({
        title: "Success",
        description: "Vote cast successfully",
        type: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["results", pollId],
      });
    },
    onError: () => {
      toast.add({
        title: "Error",
        description: "Failed to cast vote",
        type: "error",
      });
    },
  });

  if (pollQuery.isLoading || resultsQuery.isLoading) {
    return <div className="mx-auto max-w-2xl p-6">Loading...</div>;
  }

  if (pollQuery.isError || resultsQuery.isError) {
    return <div className="mx-auto max-w-2xl p-6">Failed to load poll</div>;
  }

  if (!pollQuery.data || !resultsQuery.data) {
    return <div >Not found</div>;
  }

  return (
    <main>
      {pollQuery.data.userId === currentUser?.id && (
        <div className="mx-auto max-w-2xl px-6 pt-6">
          <PollManagementActions
            poll={pollQuery.data}
            onDeleted={() => {
              queryClient.invalidateQueries({
                queryKey: ["polls"],
              });

              router.push("/polls");
            }}
          />
        </div>
      )}

      <PollDetail
          poll={pollQuery.data}
          results={resultsQuery.data}
          onVote={async (optionId) => {
            await voteMutation.mutateAsync(optionId);
          }}
        />
    </main>
  );
}
