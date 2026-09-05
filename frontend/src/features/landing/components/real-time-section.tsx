import {
  ActivityIcon,
  CheckCircle2Icon,
  ClockIcon,
  RadioIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FadeIn } from "./fade-in";
import { SectionHeading } from "./section-heading";

const liveOptions = [
  { label: "Node.js", pct: 42, votes: "1,042" },
  { label: "Go", pct: 24, votes: "595" },
  { label: "Python", pct: 20, votes: "496" },
  { label: "Java", pct: 14, votes: "348" },
];

const recentVotes = [
  { text: "Someone voted anonymously", time: "just now" },
  { text: "Alex voted for Go", time: "12s ago" },
  { text: "Someone voted anonymously", time: "1m ago" },
];

const principle = [
  {
    title: "Pushed over WebSockets",
    description:
      "Vote results stream over a WebSocket connection the moment the server receives them.",
  },
  {
    title: "No page refresh",
    description:
      "Every connected viewer sees the same updated numbers at the same time.",
  },
  {
    title: "Anonymous and account votes",
    description:
      "Live updates work the same whether voters use accounts or vote anonymously.",
  },
];

export function RealTimeSection() {
  return (
    <section
      id="live-results"
      className="scroll-mt-20 border-y bg-muted/35 px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <FadeIn>
          <SectionHeading
            eyebrow="Real-time results"
            title="Watch opinions change in real time."
            description="As soon as a vote lands, results update everywhere — on the poll page, the shared link, and the creator's dashboard."
          />

          <ul className="mt-8 flex flex-col gap-5">
            {principle.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <CheckCircle2Icon className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Card className="shadow-lg">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-base">
                  Which technology would you choose for your next backend project?
                </CardTitle>
                <Badge className="gap-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/10">
                  <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                  Live
                </Badge>
              </div>
              <CardDescription>
                2,481 responses · +148 in the last hour
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 pt-5">
              <div className="flex flex-col gap-3">
                {liveOptions.map((option) => (
                  <div key={option.label} className="flex items-center gap-3">
                    <span className="w-16 shrink-0 text-sm text-muted-foreground">
                      {option.label}
                    </span>
                    <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-primary/80"
                        style={{ width: `${option.pct}%` }}
                      />
                    </div>
                    <span className="w-16 shrink-0 text-right font-mono text-sm font-semibold tabular-nums">
                      {option.pct}%
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col rounded-2xl border bg-muted/30 p-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <ActivityIcon className="size-3.5" />
                  Recent votes
                </p>
                <ul className="mt-2 flex flex-col">
                  {recentVotes.map((vote) => (
                    <li
                      key={`${vote.text}-${vote.time}`}
                      className="flex items-center gap-3 border-b py-2 text-sm last:border-b-0"
                    >
                      <RadioIcon className="size-3.5 shrink-0 text-muted-foreground" />
                      {vote.text}
                      <span className="ml-auto inline-flex items-center gap-1.5 text-xs tabular-nums text-muted-foreground">
                        <ClockIcon className="size-3.5" />
                        {vote.time}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-50" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
                WebSocket connected — new votes appear without a refresh.
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </section>
  );
}