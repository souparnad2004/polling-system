"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

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

import type { PollResults } from "../../types/poll.types";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

interface ResultsChartProps {
  results?: PollResults;
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function ResultsChart({ results, isPending, isError, onRetry }: ResultsChartProps) {
  const options = results?.options ?? [];
  const data = options.map((option) => ({
    optionId: option.optionId,
    name: option.option,
    votes: option.voteCount,
  }));
  const totalVotes = results?.totalVotes ?? 0;

  const chartConfig = Object.fromEntries(
    data.map((entry, index) => [
      entry.optionId,
      { label: entry.name, color: CHART_COLORS[index % CHART_COLORS.length] },
    ]),
  ) satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Results</CardTitle>
        <CardDescription>
          {totalVotes > 0
            ? `Votes per option · ${totalVotes.toLocaleString()} total.`
            : "Votes per option."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-6 w-full animate-pulse rounded-md bg-muted" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <p className="text-sm text-muted-foreground">Could not load results.</p>
            <Button variant="outline" size="sm" onClick={onRetry}>
              Try again
            </Button>
          </div>
        ) : data.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            This poll has no options yet.
          </p>
        ) : (
          <div style={{ height: Math.max(160, data.length * 56 + 48) }}>
            <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
              <BarChart layout="vertical" data={data} margin={{ left: 4, right: 40, top: 4 }}>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  width={130}
                  tickFormatter={(value: string) =>
                    value.length > 16 ? `${value.slice(0, 15)}…` : value
                  }
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="votes" radius={[0, 4, 4, 0]} barSize={26}>
                  {data.map((entry, index) => (
                    <Cell key={entry.optionId} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                  <LabelList
                    dataKey="votes"
                    position="right"
                    className="fill-foreground text-xs"
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}