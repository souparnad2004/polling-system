"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { ApiError } from "@/lib/api/client";

import {
  changeVote,
  createVote,
  getPoll,
  getPollResults,
  removeVote,
} from "../api/poll.api";
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
    mutationFn: async ({
      optionId,
      isChange,
    }: {
      optionId: string;
      isChange: boolean;
    }) => {
      if (!isChange) {
        return createVote(pollId, optionId);
      }

      try {
        return await changeVote(pollId, optionId);
      } catch (error) {
        // sessionStorage can outlive the anonymous voter cookie or an older
        // server-side vote. Reconcile that stale client state by trying a
        // normal first vote when the server cannot find the existing vote.
        if (
          error instanceof ApiError &&
          error.status === 404 &&
          error.message === "vote not found"
        ) {
          return createVote(pollId, optionId);
        }

        throw error;
      }
    },
    onSuccess: () => {
      toast.add({
        title: "Success",
        description: "Vote saved successfully",
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

  const removeVoteMutation = useMutation({
    mutationFn: () => removeVote(pollId),
    onSuccess: () => {
      toast.add({
        title: "Success",
        description: "Vote removed",
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
      });
    },
    onError: (error) => {
      toast.add({
        title: "Error",
        description: error.message || "Failed to remove vote",
        type: "error",
      });
    },
  });

  return {
    pollQuery,
    resultsQuery,
    vote: async (optionId: string, isChange = false) => {
      await voteMutation.mutateAsync({ optionId, isChange });
    },
    removeVote: async () => {
      await removeVoteMutation.mutateAsync();
    },
  };
}
