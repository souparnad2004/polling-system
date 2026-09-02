"use client";

import { use } from "react";
import { ProtectedPollPage } from "@/src/features/polls/pages/protected-poll-page";

interface PollPageProps {
  params: Promise<{
    pollId: string;
  }>;
}

export default function PollPage({ params }: PollPageProps) {
  const { pollId } = use(params);
  return <ProtectedPollPage pollId={pollId} />;
}
