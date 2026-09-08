"use client";

import { PollForm } from "./poll-form";

interface CreatePollFormProps {
  onSuccess: (pollId: string, status: "draft" | "published") => void;
}

export function CreatePollForm(props: CreatePollFormProps) {
  return <PollForm {...props} />;
}
