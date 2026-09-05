"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LockIcon, SendIcon, Trash2Icon } from "lucide-react";

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
    <Card className="border-primary/15 bg-card/80 shadow-sm">
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0">
          <p className="text-sm font-semibold">Manage poll</p>
          <p className="text-sm text-muted-foreground">
            Update the poll status or remove this poll.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {poll.status === "draft" && (
            <Button
              className="w-full sm:w-auto cursor-pointer"
              disabled={isPending}
              onClick={() => publishMutation.mutate(poll.id)}
            >
              <SendIcon />
              Publish
            </Button>
          )}

          {poll.status === "published" && (
            <Button
              variant="outline"
              className="w-full sm:w-auto cursor-pointer"
              disabled={isPending}
              onClick={() => closeMutation.mutate(poll.id)}
            >
              <LockIcon />
              Close poll
            </Button>
          )}

          {poll.status === "draft" && (
            <Button
              variant="destructive"
              className="w-full sm:w-auto cursor-pointer"
              disabled={isPending}
              onClick={() => deleteMutation.mutate(poll.id)}
            >
              <Trash2Icon />
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
