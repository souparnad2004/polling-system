"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { updatePoll } from "../api/poll.api";
import { pollKeys } from "./use-polls";
import type { UpdatePollInput } from "../types/poll.types";

export function useUpdatePoll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pollId,
      input,
    }: {
      pollId: string;
      input: UpdatePollInput;
    }) => updatePoll(pollId, input),
    onSuccess: () => {
      toast.add({
        title: "Success",
        description: "Poll updated successfully",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: pollKeys.all });
    },
    onError: (error) => {
      toast.add({
        title: "Error",
        description: error.message || "Unable to update poll",
        type: "error",
      });
    },
  });
}