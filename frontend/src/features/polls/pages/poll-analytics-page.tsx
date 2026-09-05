"use client";

import Link from "next/link";

import { format } from "date-fns";
import { ArrowLeftIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { AnalyticsStatCards } from "../components/analytics/analytics-stat-cards";
import { RecentActivity } from "../components/analytics/recent-activity";
import { ResponsesOverTime } from "../components/analytics/responses-over-time";
import { ResultsChart } from "../components/analytics/results-chart";
import { PollsShell } from "../components/polls-layout";
import { usePollAnalytics } from "../hooks/use-polls";
import { usePollDetail } from "../hooks/use-poll-detail";

const STATUS_VARIANT = {
  published: "default",
  draft: "secondary",
  closed: "outline",
} as const;

interface PollAnalyticsPageProps {
  pollId: string;
}

export function PollAnalyticsPage({ pollId }: PollAnalyticsPageProps) {
  const analyticsQuery = usePollAnalytics(pollId);
  // Reuse the shared results query so the breakdown stays in sync with the
  // live results feed (and any votes cast elsewhere).
  const { resultsQuery } = usePollDetail(pollId);

  const analytics = analyticsQuery.data;

  return (
    <PollsShell>
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-4 md:p-8">
          <Link
            href="/polls/mine"
            className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon className="size-4" />
            Back to My Polls
          </Link>

          {analyticsQuery.isPending ? (
            <PollAnalyticsSkeleton />
          ) : analyticsQuery.isError ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                <h2 className="font-semibold">Could not load analytics</h2>
                <p className="text-sm text-muted-foreground">
                  This poll may not exist or you may not have access to it.
                </p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => analyticsQuery.refetch()}
                >
                  Try again
                </Button>
              </CardContent>
            </Card>
          ) : analytics ? (
            <>
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-medium text-muted-foreground">
                  Poll Analytics
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    {analytics.poll.title}
                  </h1>
                  <Badge variant={STATUS_VARIANT[analytics.poll.status]}>
                    {analytics.poll.status}
                  </Badge>
                </div>
                {analytics.poll.createdAt ? (
                  <p className="text-sm text-muted-foreground">
                    Created {format(new Date(analytics.poll.createdAt), "MMM d, yyyy")}
                  </p>
                ) : null}
              </div>

              <AnalyticsStatCards
                totals={analytics.totals}
                isPending={analyticsQuery.isPending}
              />

              <ResponsesOverTime timeline={analytics.timeline} />

              <ResultsChart
                results={resultsQuery.data}
                isPending={resultsQuery.isPending}
                isError={resultsQuery.isError}
                onRetry={() => resultsQuery.refetch()}
              />

              <RecentActivity votes={analytics.recentVotes} />
            </>
          ) : null}
      </main>
    </PollsShell>
  );
}

function PollAnalyticsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full" />
        ))}
      </div>
      <Skeleton className="h-80 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}