"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "@/components/ui/toast";
import { createPoll } from "../api/poll.api";
import { pollKeys } from "./use-polls";

export function useCreatePoll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPoll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pollKeys.all });
    },
    onError: (error) => {
      toast.add({
        title: "Error",
        description: error.message,
        type: "error",
      });
    },
  });
}

