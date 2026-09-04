"use client";

import { EyeIcon, UsersIcon, VoteIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import type { PollAnalyticsTotals } from "../../types/poll.types";

function formatCount(value: number) {
  return value.toLocaleString();
}

interface AnalyticsStatCardsProps {
  totals?: PollAnalyticsTotals;
  isPending: boolean;
}

export function AnalyticsStatCards({ totals, isPending }: AnalyticsStatCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        label="Responses"
        icon={<VoteIcon />}
        value={totals ? formatCount(totals.responses) : "—"}
        description="Total votes cast on this poll"
        isPending={isPending}
      />
      <StatCard
        label="Unique voters"
        icon={<UsersIcon />}
        value={totals ? formatCount(totals.uniqueVoters) : "—"}
        description="Accounts and anonymous voters"
        isPending={isPending}
      />
      <StatCard
        label="Anonymous"
        icon={<EyeIcon />}
        value={totals ? `${totals.anonymousShare.toFixed(1)}%` : "—"}
        description={
          totals
            ? `${formatCount(totals.anonymousVotes)} of ${formatCount(totals.responses)} votes`
            : undefined
        }
        isPending={isPending}
      />
    </div>
  );
}

function StatCard({
  label,
  icon,
  value,
  description,
  isPending,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  description?: string;
  isPending: boolean;
}) {
  return (
    <Card>
      <CardHeader className="grid grid-cols-[auto_1fr] items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:size-4">
          {icon}
        </div>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-1">
        {isPending ? (
          <Skeleton className="h-9 w-20" />
        ) : (
          <p className="text-3xl font-semibold tracking-tight">{value}</p>
        )}
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}