"use client";

import { use } from "react";
import { EditPollPage } from "@/src/features/polls/pages/edit-poll-page";

interface EditPollPageRouteProps {
  params: Promise<{
    pollId: string;
  }>;
}

export default function EditPollPageRoute({ params }: EditPollPageRouteProps) {
  const { pollId } = use(params);
  return <EditPollPage pollId={pollId} />;
}