"use client";

import Link from "next/link";

import { formatDistanceToNow } from "date-fns";
import {
  GlobeIcon,
  LockIcon,
  MoreHorizontalIcon,
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
  const publishMutation = usePublishPoll();
  const closeMutation = useClosePoll();
  const deleteMutation = useDeletePoll();

  const isPending =
    publishMutation.isPending ||
    closeMutation.isPending ||
    deleteMutation.isPending;

  return (
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
            onClick={() => publishMutation.mutate(poll.id)}
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

        {poll.status === "draft" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              disabled={isPending}
              onClick={() => deleteMutation.mutate(poll.id)}
            >
              <Trash2Icon />
              Delete poll
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}