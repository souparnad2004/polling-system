"use client";

import { Button } from "@/components/ui/button";

import {
  useClosePoll,
  useDeletePoll,
  usePublishPoll,
} from "../hooks/use-poll-management";
import type { Poll } from "../types/poll.types";

interface PollManagementActionsProps {
  poll: Poll;
  onDeleted: () => void;
}

export function PollManagementActions({
  poll,
  onDeleted,
}: PollManagementActionsProps) {
  const publishMutation = usePublishPoll();
  const closeMutation = useClosePoll();
  const deleteMutation = useDeletePoll(onDeleted);

  const isPending =
    publishMutation.isPending ||
    closeMutation.isPending ||
    deleteMutation.isPending;

  return (
    <div className="flex flex-wrap gap-2">
      {poll.status === "draft" && (
        <Button
          disabled={isPending}
          onClick={() => publishMutation.mutate(poll.id)}
        >
          Publish
        </Button>
      )}{" "}

      {poll.status === "published" && (
        <Button
          variant="outline"
          disabled={isPending}
          onClick={() => closeMutation.mutate(poll.id)}
        >
          Close poll
        </Button>
      )}{" "}

      {poll.status === "draft" && (
        <Button
          variant="destructive"
          disabled={isPending}
          onClick={() => deleteMutation.mutate(poll.id)}
        >
          Delete
        </Button>
      )}
    </div>
  );
}
