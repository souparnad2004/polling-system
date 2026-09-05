"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";

import { createVote, getPoll, getPollResults } from "../api/poll.api";
import { pollKeys } from "./use-polls";
import { usePollLiveResults } from "./use-poll-live-results";

export function usePollDetail(pollId: string) {
  const queryClient = useQueryClient();

  const pollQuery = useQuery({
    queryKey: pollKeys.detail(pollId),
    queryFn: () => getPoll(pollId),
  });

  const resultsQuery = useQuery({
    queryKey: pollKeys.results(pollId),
    queryFn: () => getPollResults(pollId),
  });

  usePollLiveResults(pollId);

  const voteMutation = useMutation({
    mutationFn: (optionId: string) => createVote(pollId, optionId),
    onSuccess: () => {
      toast.add({
        title: "Success",
        description: "Vote cast successfully",
        type: "success",
      });

      queryClient.invalidateQueries({
        queryKey: pollKeys.results(pollId),
      });

      queryClient.invalidateQueries({
        queryKey: pollKeys.detail(pollId),
      });

      queryClient.invalidateQueries({
        queryKey: pollKeys.analytics(pollId),
      })
    },
    onError: (error) => {
      toast.add({
        title: "Error",
        description: error.message || "Failed to cast vote",
        type: "error",
      });
    },
  });

  return {
    pollQuery,
    resultsQuery,
    vote: async (optionId: string) => {
      await voteMutation.mutateAsync(optionId);
    },
  };
}
