"use client";

import {
  ActivityIcon,
  BarChart3Icon,
  BellIcon,
  MousePointerClickIcon,
  SearchIcon,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

const chartConfig = {
  count: {
    label: "Votes",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const activityData = [
  { day: "Aug 23", count: 42 },
  { day: "Aug 24", count: 58 },
  { day: "Aug 25", count: 45 },
  { day: "Aug 26", count: 82 },
  { day: "Aug 27", count: 74 },
  { day: "Aug 28", count: 96 },
  { day: "Aug 29", count: 118 },
  { day: "Aug 30", count: 104 },
  { day: "Aug 31", count: 132 },
  { day: "Sep 1", count: 149 },
  { day: "Sep 2", count: 128 },
  { day: "Sep 3", count: 164 },
  { day: "Sep 4", count: 151 },
  { day: "Sep 5", count: 186 },
];

const recentPolls = [
  { title: "Which feature should we build next?", votes: 1240, status: "published" },
  { title: "Is Go worth adopting for our services?", votes: 486, status: "published" },
  { title: "Best day for the community meetup", votes: 214, status: "closed" },
] as const;

const STATUS_VARIANT = {
  published: "default",
  closed: "outline",
} as const;

const metrics = [
  { label: "Total Polls", value: "12", description: "Polls you have created", icon: <BarChart3Icon /> },
  { label: "Total Votes", value: "8,421", description: "Votes across all polls", icon: <ActivityIcon /> },
  { label: "Active Polls", value: "3", description: "Open and accepting votes", icon: <MousePointerClickIcon /> },
  { label: "Engagement", value: "68%", description: "Polls that received votes", icon: <BarChart3Icon /> },
];

export function DashboardPreview() {
  return (
    <div className="overflow-hidden rounded-4xl border bg-card shadow-xl ring-1 ring-foreground/5 dark:ring-foreground/10">
      {/* Browser chrome */}
      <div className="flex items-center gap-3 border-b bg-muted/40 px-4 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
        </div>
        <div className="mx-auto flex h-6 w-full max-w-xs items-center justify-center rounded-full bg-background px-3 text-[11px] text-muted-foreground ring-1 ring-border/60">
          app.pollly.dev/dashboard
        </div>
      </div>

      {/* App shell */}
      <div className="flex flex-col gap-5 p-4 sm:p-6">
        {/* Mini app header */}
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BarChart3Icon className="size-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Pollly</span>

          <div className="ml-auto flex items-center gap-1.5">
            <span className="flex size-8 items-center justify-center rounded-full text-muted-foreground">
              <SearchIcon className="size-4" />
            </span>
            <span className="relative flex size-8 items-center justify-center rounded-full text-muted-foreground">
              <BellIcon className="size-4" />
              <span className="absolute top-1 right-1 size-2 rounded-full bg-primary ring-2 ring-card" />
            </span>
            <Avatar size="sm">
              <AvatarFallback>AK</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Page heading */}
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold tracking-tight sm:text-lg">
            Good morning, Alex
          </p>
          <p className="text-xs text-muted-foreground">
            Here&apos;s what&apos;s happening with your polls.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.label} size="sm" className="gap-2">
              <CardHeader className="grid grid-cols-[auto_1fr] items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:size-3.5">
                  {metric.icon}
                </div>
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-0.5">
                <p className="text-xl font-semibold tracking-tight sm:text-2xl">
                  {metric.value}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart + recent polls */}
        <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
          <Card size="sm" className="gap-2">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-sm">Response activity</CardTitle>
                <CardDescription className="text-xs">
                  Votes received over the last 14 days
                </CardDescription>
              </div>
              <Badge variant="secondary" className="gap-1.5 rounded-full">
                <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                Live
              </Badge>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-44 w-full sm:h-48">
                <AreaChart data={activityData} margin={{ left: 4, right: 4, top: 4 }}>
                  <defs>
                    <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="4 6" />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={6}
                    tick={{ fontSize: 10 }}
                    minTickGap={28}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10 }}
                    width={28}
                    allowDecimals={false}
                  />
                  <ChartTooltip
                    cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="count"
                    type="monotone"
                    fill="url(#heroFill)"
                    stroke="var(--color-count)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card size="sm" className="gap-2">
            <CardHeader>
              <CardTitle className="text-sm">Recent polls</CardTitle>
              <CardDescription className="text-xs">
                Latest activity from your polls
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {recentPolls.map((poll) => (
                <div
                  key={poll.title}
                  className="flex items-center gap-3 rounded-2xl px-2 py-2 transition-colors hover:bg-muted/60"
                >
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-xs font-medium">
                      {poll.title}
                    </p>
                    <p className="mt-0.5 text-[11px] tabular-nums text-muted-foreground">
                      {poll.votes.toLocaleString()} votes
                    </p>
                  </div>
                  <Badge variant={STATUS_VARIANT[poll.status]} className="capitalize">
                    {poll.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}