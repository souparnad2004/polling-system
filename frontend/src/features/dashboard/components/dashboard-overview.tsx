"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Poll } from "@/src/features/polls/types/poll.types";

interface DashboardOverviewProps {
  polls: Poll[];
  isPending: boolean;
}

export function DashboardOverview({
  polls,
  isPending,
}: DashboardOverviewProps) {
  const totalPolls = polls.length;
  const activePolls = polls.filter((poll) => poll.status === "published").length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your polling activity.
        </p>
      </div>

      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <MetricCard label="Total polls" isPending={isPending} value={totalPolls} />
        <MetricCard label="Active polls" isPending={isPending} value={activePolls} />
        <MetricCard label="Total votes" value="-" />
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  isPending = false,
}: {
  label: string;
  value: number | string;
  isPending?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isPending ? (
          <Skeleton className="h-9 w-12" />
        ) : (
          <p className="text-3xl font-semibold tracking-tight">{value}</p>
        )}
      </CardContent>
    </Card>
  );
}
