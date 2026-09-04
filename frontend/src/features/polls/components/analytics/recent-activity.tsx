"use client";

import { format } from "date-fns";
import { ActivityIcon, ClockIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { PollAnalyticsRecentVote } from "../../types/poll.types";

function formatVoteTime(iso: string) {
  const date = new Date(iso);
  const isToday =
    format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  return isToday ? format(date, "HH:mm") : format(date, "MMM d, HH:mm");
}

interface RecentActivityProps {
  votes: PollAnalyticsRecentVote[];
}

export function RecentActivity({ votes }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>Latest votes received on this poll.</CardDescription>
      </CardHeader>
      <CardContent>
        {votes.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No votes yet.
          </p>
        ) : (
          <ul className="flex flex-col">
            {votes.map((vote, index) => (
              <li
                key={`${vote.createdAt}-${index}`}
                className="flex items-center gap-3 border-b py-2.5 last:border-b-0"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <ActivityIcon className="size-4" />
                </span>
                <span className="text-sm">
                  {vote.isAnonymous ? "Someone voted anonymously" : "Someone voted"}
                </span>
                <span className="ml-auto flex items-center gap-1.5 text-xs tabular-nums text-muted-foreground">
                  <ClockIcon className="size-3.5" />
                  {formatVoteTime(vote.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}