"use client";

import { Trash2Icon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { Poll } from "../types/poll.types";

interface DeletePollDialogProps {
  poll: Poll;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

// Confirmation dialog shown before a poll is permanently deleted. Deleting a
// poll removes its options AND cascades to all votes + analytics, so the copy
// warns about the irreversible nature — including vote count when present.
export function DeletePollDialog({
  poll,
  open,
  onOpenChange,
  onConfirm,
}: DeletePollDialogProps) {
  const voteCount = poll.voteCount ?? 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Trash2Icon />
          </AlertDialogMedia>

          <AlertDialogTitle>Delete this poll?</AlertDialogTitle>

          <AlertDialogDescription>
            {voteCount > 0 ? (
              <>
                <span className="font-semibold text-foreground">
                  {voteCount.toLocaleString()} vote
                  {voteCount === 1 ? "" : "s"}
                </span>{" "}
                will be permanently removed along with this poll and its
                analytics. This action cannot be undone.
              </>
            ) : (
              <>
                This will permanently delete the poll, its options, and any
                analytics. This action cannot be undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              onOpenChange(false);
              onConfirm();
            }}
          >
            <Trash2Icon />
            Delete poll
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}