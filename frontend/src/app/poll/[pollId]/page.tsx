"use client";

import { use } from "react";
import { PublicPollPage as PublicPollFeaturePage } from "@/src/features/polls/pages/public-poll-page";

interface PublicPollPageProps {
  params: Promise<{
    pollId: string;
  }>;
}

export default function PublicPollRoute({ params }: PublicPollPageProps) {
  const { pollId } = use(params);
  return <PublicPollFeaturePage pollId={pollId} />;
}
