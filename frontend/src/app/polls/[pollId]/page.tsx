"use client";

import { use } from "react";
import {
  createVote,
  getPoll,
  getPollResults,
} from "@/src/features/polls/poll.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PollDetail } from "../../../features/polls/components/poll-detail";
import { toast } from "@/components/ui/toast";

interface PollPageProps {
  params: Promise<{
    pollId: string;
  }>;
}

export default function PollPage({ params }: PollPageProps) {
  const { pollId } = use(params);

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
        queryKey: ["poll-results", pollId],
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
    return <div>Loading...</div>;
  }

  if (pollQuery.isError || resultsQuery.isError) {
    return <div>Error</div>;
  }

  if (!pollQuery.data || !resultsQuery.data) {
    return <div>Not found</div>;
  }

  return (
    <main>
      {pollQuery.data.options.map((option) => (
        <PollDetail
          key={option.id}
          poll={pollQuery.data}
          results={resultsQuery.data}
          onVote={async () => {await voteMutation.mutateAsync(option.id)}}
        />
      ))}
    </main>
  );
}
