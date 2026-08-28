"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import {
  Button,
} from "@/components/ui/button";
import {
  publishPoll,
  closePoll,
  deletePoll,
  type Poll,
} from "../poll.api";

interface PollManagementActionsProps {
  poll: Poll;
  onDeleted: () => void;
}

export function PollManagementActions({
  poll,
  onDeleted,
}: PollManagementActionsProps) {
  const queryClient = useQueryClient();

  const publishMutation = useMutation({
    mutationFn: () =>
      publishPoll(poll.id),

    onSuccess: () => {
      toast.add({
        title: "Success",
        description: "Poll published successfully",
        type: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["poll", poll.id],
      });
    },

    onError: () => {
      toast.add(
        {
          title: "Error",
          description: "Unable to publish poll",
          type: "error",
        },
      );
    },
  });

  const closeMutation = useMutation({
    mutationFn: () =>
      closePoll(poll.id),

    onSuccess: () => {
      toast.add({
        title: "Success",
        description: "Poll closed successfully",
        type: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["poll", poll.id],
      });
    },

    onError: () => {
      toast.add(
        {
          title: "Error",
          description: "Unable to close poll",
          type: "error",
        },
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () =>
      deletePoll(poll.id),

    onSuccess: () => {
      toast.add({
        title: "Success",
        description: "Poll deleted successfully",
        type: "success",
      });
      onDeleted();
    },

    onError: () => {
      toast.add(
        {
          title: "Error",
          description: "Unable to delete poll",
          type: "error",
        },
      );
    },
  });

  const isPending =
    publishMutation.isPending ||
    closeMutation.isPending ||
    deleteMutation.isPending;

  return (
    <div className="flex flex-wrap gap-2">
      {poll.status === "draft" && (
        <Button
          disabled={isPending}
          onClick={() =>
            publishMutation.mutate()
          }
        >
          Publish
        </Button>
      )}

      {poll.status === "published" && (
        <Button
          variant="outline"
          disabled={isPending}
          onClick={() =>
            closeMutation.mutate()
          }
        >
          Close poll
        </Button>
      )}

      {poll.status === "draft" && (
        <Button
          variant="destructive"
          disabled={isPending}
          onClick={() =>
            deleteMutation.mutate()
          }
        >
          Delete
        </Button>
      )}
    </div>
  );
}