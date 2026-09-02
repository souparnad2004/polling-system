"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PollCard } from "@/src/features/polls/components/poll-card";
import type { Poll } from "@/src/features/polls/types/poll.types";

interface DashboardPollsPanelProps {
  polls: Poll[];
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function DashboardPollsPanel({
  polls,
  isPending,
  isError,
  onRetry,
}: DashboardPollsPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Polls</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage every poll you have created.
        </p>
      </div>

      {isPending ? (
        <PollGridSkeleton />
      ) : isError ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <h2 className="font-semibold">Could not load polls</h2>
            <p className="text-sm text-muted-foreground">
              Something went wrong while fetching your polls.
            </p>
            <Button variant="outline" className="mt-2" onClick={onRetry}>
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : polls.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <h2 className="font-semibold">No polls yet</h2>
            <p className="text-sm text-muted-foreground">
              Be the first to create a poll.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      )}
    </div>
  );
}

function PollGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}
