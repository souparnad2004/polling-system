"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { closePoll, deletePoll, publishPoll } from "../api/poll.api";
import { pollKeys } from "./use-polls";

export function usePublishPoll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishPoll,
    onSuccess: () => {
      toast.add({
        title: "Success",
        description: "Poll published successfully",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: pollKeys.all });
    },
    onError: () => {
      toast.add({
        title: "Error",
        description: "Unable to publish poll",
        type: "error",
      });
    },
  });
}

export function useClosePoll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: closePoll,
    onSuccess: () => {
      toast.add({
        title: "Success",
        description: "Poll closed successfully",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: pollKeys.all });
    },
    onError: () => {
      toast.add({
        title: "Error",
        description: "Unable to close poll",
        type: "error",
      });
    },
  });
}

export function useDeletePoll(onDeleted?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePoll,
    onSuccess: () => {
      toast.add({
        title: "Success",
        description: "Poll deleted successfully",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: pollKeys.all });
      onDeleted?.();
    },
    onError: () => {
      toast.add({
        title: "Error",
        description: "Unable to delete poll",
        type: "error",
      });
    },
  });
}
