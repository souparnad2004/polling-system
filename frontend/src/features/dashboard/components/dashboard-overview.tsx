"use client";

import Link from "next/link";

import { format } from "date-fns";
import {
  ActivityIcon,
  BarChart3Icon,
  MousePointerClickIcon,
  UsersIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { PollOverview } from "../types/stats.types";

const chartConfig = {
  count: {
    label: "Votes",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const STATUS_VARIANT = {
  published: "default",
  draft: "secondary",
  closed: "outline",
} as const;

interface DashboardOverviewProps {
  userName?: string;
  overview?: PollOverview;
  overviewIsPending: boolean;
  overviewIsError: boolean;
  onRetry: () => void;
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatCount(value: number) {
  return value.toLocaleString();
}

export function DashboardOverview({
  userName,
  overview,
  overviewIsPending,
  overviewIsError,
  onRetry,
}: DashboardOverviewProps) {
  const metrics = overview?.metrics;
  const recentPolls = overview?.recentPolls ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {getGreeting()}
          {userName ? `, ${userName}` : ""} 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your polls.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Polls"
          icon={<BarChart3Icon />}
          value={metrics ? String(metrics.totalPolls) : "—"}
          description="Polls you have created"
          isPending={overviewIsPending}
        />
        <MetricCard
          label="Total Votes"
          icon={<ActivityIcon />}
          value={metrics ? formatCount(metrics.totalVotes) : "—"}
          description="Votes across all polls"
          isPending={overviewIsPending}
        />
        <MetricCard
          label="Responses"
          icon={<UsersIcon />}
          value={metrics ? formatCount(metrics.responses) : "—"}
          description="Unique voters counted"
          isPending={overviewIsPending}
        />
        <MetricCard
          label="Engagement"
          icon={<MousePointerClickIcon />}
          value={metrics ? `${metrics.engagementRate.toFixed(1)}%` : "—"}
          description="Polls that received votes"
          isPending={overviewIsPending}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Response Activity</CardTitle>
          <CardDescription>
            Votes received per day over the last 14 days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {overviewIsPending ? (
            <ChartSkeleton />
          ) : overviewIsError ? (
            <OverviewErrorState onRetry={onRetry} />
          ) : (
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <AreaChart
                data={overview?.activity ?? []}
                margin={{ left: 12, right: 12, top: 8 }}
              >
                <defs>
                  <linearGradient id="fillVotes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value: string) => format(new Date(value), "MMM d")}
                  minTickGap={24}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Area dataKey="count" type="monotone" fill="url(#fillVotes)" stroke="var(--color-count)" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Polls</CardTitle>
          <CardDescription>Your latest polls and how they are performing.</CardDescription>
        </CardHeader>
        <CardContent>
          {overviewIsPending ? (
            <TableSkeleton />
          ) : overviewIsError ? (
            <OverviewErrorState onRetry={onRetry} />
          ) : recentPolls.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <p className="text-sm text-muted-foreground">No polls yet.</p>
              <Link href="/polls/create">
                <Button variant="outline" size="sm">
                  Create your first poll
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Poll</TableHead>
                  <TableHead className="text-right">Votes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPolls.map((poll) => (
                  <TableRow key={poll.id}>
                    <TableCell>
                      <Link
                        href={`/polls/${poll.id}`}
                        className="line-clamp-1 font-medium hover:underline"
                      >
                        {poll.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCount(poll.voteCount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[poll.status]}>{poll.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {format(new Date(poll.createdAt), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  label,
  icon,
  value,
  description,
  isPending = false,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  description?: string;
  isPending?: boolean;
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

function ChartSkeleton() {
  return (
    <div className="flex h-64 items-end gap-2 p-4">
      {Array.from({ length: 14 }).map((_, index) => (
        <Skeleton
          key={index}
          className="flex-1 rounded-t-xl"
          style={{ height: `${30 + ((index * 17) % 55)}%` }}
        />
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <Skeleton className="h-4 w-full max-w-60" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function OverviewErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      <p className="font-semibold">Could not load your stats</p>
      <p className="text-sm text-muted-foreground">
        Something went wrong while fetching the data.
      </p>
      <Button variant="outline" className="mt-2" onClick={onRetry}>Try again</Button>
    </div>
  );
}
