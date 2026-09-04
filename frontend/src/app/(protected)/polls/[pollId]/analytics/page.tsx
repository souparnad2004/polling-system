"use client";

import { use } from "react";

import { PollAnalyticsPage } from "@/src/features/polls/pages/poll-analytics-page";

interface PollAnalyticsRouteProps {
  params: Promise<{
    pollId: string;
  }>;
}

export default function PollAnalyticsRoute({ params }: PollAnalyticsRouteProps) {
  const { pollId } = use(params);
  return <PollAnalyticsPage pollId={pollId} />;
}