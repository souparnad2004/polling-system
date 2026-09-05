"use client";

import {
  ActivityIcon,
  BarChart3Icon,
  CircleCheckIcon,
  MousePointerClickIcon,
  RadioIcon,
  UserRoundIcon,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { FadeIn } from "./fade-in";
import { SectionHeading } from "./section-heading";

const chartConfig = {
  responses: {
    label: "Responses",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const timeline = [
  { day: "Aug 23", responses: 42 },
  { day: "Aug 24", responses: 58 },
  { day: "Aug 25", responses: 45 },
  { day: "Aug 26", responses: 82 },
  { day: "Aug 27", responses: 74 },
  { day: "Aug 28", responses: 96 },
  { day: "Aug 29", responses: 118 },
  { day: "Aug 30", responses: 104 },
  { day: "Aug 31", responses: 132 },
  { day: "Sep 1", responses: 149 },
  { day: "Sep 2", responses: 128 },
  { day: "Sep 3", responses: 164 },
  { day: "Sep 4", responses: 151 },
  { day: "Sep 5", responses: 186 },
];

const metrics = [
  { label: "Total Responses", value: "2,481", icon: <BarChart3Icon /> },
  { label: "Engagement Rate", value: "68%", icon: <MousePointerClickIcon /> },
  { label: "Active Polls", value: "3", icon: <RadioIcon /> },
  { label: "Completion Rate", value: "81%", icon: <CircleCheckIcon /> },
];

const distribution = [
  { label: "Node.js", pct: 42, votes: 1042 },
  { label: "Go", pct: 24, votes: 595 },
  { label: "Python", pct: 20, votes: 496 },
  { label: "Java", pct: 14, votes: 348 },
];

const activity = [
  { text: "Ana voted for Node.js", time: "2m ago", anonymous: false },
  { text: "Someone voted anonymously", time: "9m ago", anonymous: true },
  { text: "Rohan changed his vote to Go", time: "24m ago", anonymous: false },
  { text: "Someone voted anonymously", time: "1h ago", anonymous: true },
];

export function AnalyticsSection() {
  return (
    <section
      id="analytics"
      className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <SectionHeading
            eyebrow="Analytics"
            title="Understand every response."
            description="Go beyond vote counts. See when responses arrive, how engagement builds, and how participants engage with each poll."
          />
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="mt-12 flex flex-col gap-4">
            {/* Metric cards */}
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
                  <CardContent>
                    <p className="text-2xl font-semibold tracking-tight">
                      {metric.value}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
              {/* Response activity chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Response activity</CardTitle>
                  <CardDescription>
                    Responses per day for the last 14 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-56 w-full">
                    <AreaChart data={timeline} margin={{ left: 4, right: 4, top: 4 }}>
                      <defs>
                        <linearGradient id="analyticsFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-responses)" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="var(--color-responses)" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} strokeDasharray="4 6" />
                      <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fontSize: 11 }}
                        minTickGap={24}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11 }}
                        width={32}
                        allowDecimals={false}
                      />
                      <ChartTooltip
                        cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                        content={<ChartTooltipContent indicator="dot" />}
                      />
                      <Area
                        dataKey="responses"
                        type="monotone"
                        fill="url(#analyticsFill)"
                        stroke="var(--color-responses)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-4">
                {/* Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Result distribution</CardTitle>
                    <CardDescription>Share of total responses</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    {distribution.map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <span className="w-16 shrink-0 text-sm text-muted-foreground">
                          {item.label}
                        </span>
                        <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="absolute inset-y-0 left-0 rounded-full bg-primary/80"
                            style={{ width: `${item.pct}%` }}
                          />
                        </div>
                        <span className="w-14 shrink-0 text-right font-mono text-sm font-semibold tabular-nums">
                          {item.pct}%
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recent activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="flex flex-col">
                      {activity.map((item) => (
                        <li
                          key={`${item.text}-${item.time}`}
                          className="flex items-center gap-3 border-b py-2.5 text-sm last:border-b-0"
                        >
                          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-3.5">
                            {item.anonymous ? <UserRoundIcon /> : <ActivityIcon />}
                          </span>
                          <span className="line-clamp-1">{item.text}</span>
                          <span className="ml-auto shrink-0 text-xs tabular-nums text-muted-foreground">
                            {item.time}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Poll analytics help creators understand how people interact with
              their polls — total responses, unique voters, anonymous share, and
              the pace of engagement over time.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}