"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { formatDistanceToNow } from "date-fns";
import {
  GlobeIcon,
  LockIcon,
  MoreHorizontalIcon,
  PencilLineIcon,
  SendIcon,
  Trash2Icon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";

import {
  useClosePoll,
  useDeletePoll,
  usePublishPoll,
} from "../hooks/use-poll-management";
import type { Poll } from "../types/poll.types";
import { DeletePollDialog } from "./delete-poll-dialog";
import { PublishPollDialog } from "./publish-poll-dialog";

const STATUS_VARIANT = {
  published: "default",
  draft: "secondary",
  closed: "outline",
} as const;

interface MyPollRowProps {
  poll: Poll;
}

export function MyPollRow({ poll }: MyPollRowProps) {
  return (
    <Card className="h-full">
      <CardHeader className=" grid-cols-[1fr_auto] items-start gap-4">
        <div className="flex flex-col gap-1.5">
          <CardTitle className="line-clamp-1 text-base">
            {poll.title}
          </CardTitle>
          {poll.description ? (
            <CardDescription className="line-clamp-1">
              {poll.description}
            </CardDescription>
          ) : null}
        </div>

        <PollRowActions poll={poll} />
      </CardHeader>

      <CardContent className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <span className="font-medium tabular-nums text-foreground">
          {(poll.voteCount ?? 0).toLocaleString()} votes
        </span>
        <Badge variant={STATUS_VARIANT[poll.status]}>{poll.status}</Badge>
        <span className="ml-auto text-xs">
          {poll.createdAt
            ? `Created ${formatDistanceToNow(new Date(poll.createdAt), { addSuffix: true })}`
            : null}
        </span>
      </CardContent>

      <CardFooter className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href={`/polls/${poll.id}`} />}
        >
          View
        </Button>
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href={`/polls/${poll.id}/analytics`} />}
        >
          Analytics
        </Button>
      </CardFooter>
    </Card>
  );
}

function PollRowActions({ poll }: { poll: Poll }) {
  const router = useRouter();
  const publishMutation = usePublishPoll();
  const closeMutation = useClosePoll();
  const deleteMutation = useDeletePoll();

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isPublishDialogOpen, setPublishDialogOpen] = useState(false);

  const isPending =
    publishMutation.isPending ||
    closeMutation.isPending ||
    deleteMutation.isPending;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className={buttonVariants({ variant: "ghost", size: "icon" })}
              disabled={isPending}
              aria-label="Poll actions"
            />
          }
        >
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-fit">
        {poll.status === "draft" && (
          <DropdownMenuItem
            disabled={isPending}
            onClick={() => router.push(`/polls/${poll.id}/edit`)}
          >
            <PencilLineIcon />
            Edit poll
          </DropdownMenuItem>
        )}

        {poll.status === "draft" && (
          <DropdownMenuItem
            disabled={isPending}
            onClick={() => setPublishDialogOpen(true)}
          >
            <SendIcon />
            Publish poll
          </DropdownMenuItem>
        )}

        {poll.status === "published" && (
          <DropdownMenuItem
            disabled={isPending}
            onClick={() => closeMutation.mutate(poll.id)}
          >
            <LockIcon />
            Close poll
          </DropdownMenuItem>
        )}

        {poll.status === "published" && (
          <DropdownMenuItem
            onClick={() => {
              void navigator.clipboard
                .writeText(`${window.location.origin}/poll/${poll.id}`)
                .then(() =>
                  toast.add({
                    title: "Link copied",
                    description: "Poll link copied to your clipboard.",
                    type: "success",
                  }),
                );
            }}
          >
            <GlobeIcon />
            Copy link
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={isPending}
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Trash2Icon />
          Delete poll
        </DropdownMenuItem>
      </DropdownMenuContent>
      </DropdownMenu>

      <DeletePollDialog
        poll={poll}
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => deleteMutation.mutate(poll.id)}
      />
      <PublishPollDialog
        open={isPublishDialogOpen}
        pending={publishMutation.isPending}
        onOpenChange={setPublishDialogOpen}
        onConfirm={(closedAt) => {
          publishMutation.mutate({ pollId: poll.id, closedAt }, {
            onSuccess: () => setPublishDialogOpen(false),
          });
        }}
      />
    </>
  );
}