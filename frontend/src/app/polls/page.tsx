"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PollCard } from "@/src/features/polls/components/poll-card";
import { getPolls } from "@/src/features/polls/poll.api";
import { useQuery } from "@tanstack/react-query";

export default function POllsPage() {
  const pollsQuery = useQuery({
    queryKey: ["polls"],
    queryFn: () => getPolls(),
  });

  if (pollsQuery.isLoading)
    return (
      <main>
        <PollListSkeleton />
      </main>
    );

  if (pollsQuery.isError) {
    return (
      <main>
        <div>
          <h1>could not load polls</h1>
          <p>Please try again</p>
          <Button onClick={() => pollsQuery.refetch()}>Try again</Button>
        </div>
      </main>
    );
  }

  const polls = pollsQuery.data ?? [];

  return (
    <main>
      <div>
        <h1>Explore Polls</h1>
        <p>Discover questions and share your opinions</p>
      </div>
      {polls.length === 0 ? (
          <div>
            <h2>
                No polls yet
            </h2>
            <p>
                Be the first to create a poll
            </p>
          </div>
      ): (
        <div>
            {polls.map((poll) => (
                <PollCard key={poll.id} poll={poll} />
            ))}
        </div>
      )}
    </main>
  );
}

function PollListSkeleton() {
  return (
    <div>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index}>
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}
