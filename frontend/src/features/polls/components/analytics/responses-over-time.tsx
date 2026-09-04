"use client";

import { format } from "date-fns";
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

import type { PollAnalyticsTimelinePoint } from "../../types/poll.types";

const chartConfig = {
  cumulative: {
    label: "Responses",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface ResponsesOverTimeProps {
  timeline: PollAnalyticsTimelinePoint[];
}

export function ResponsesOverTime({ timeline }: ResponsesOverTimeProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Responses over time</CardTitle>
        <CardDescription>
          Cumulative votes received since the poll was created.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {timeline.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No responses yet. Share your poll to start collecting votes.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <AreaChart
              data={timeline}
              margin={{ left: 12, right: 12, top: 8 }}
            >
              <defs>
                <linearGradient id="fillResponses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-cumulative)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-cumulative)" stopOpacity={0.1} />
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
              <Area
                dataKey="cumulative"
                type="monotone"
                fill="url(#fillResponses)"
                stroke="var(--color-cumulative)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}