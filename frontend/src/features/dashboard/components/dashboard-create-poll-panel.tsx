"use client";

import { CreatePollForm } from "@/src/features/polls/components/create-poll-form";

interface DashboardCreatePollPanelProps {
  onCreated: (pollId: string) => void;
}

export function DashboardCreatePollPanel({
  onCreated,
}: DashboardCreatePollPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Create poll</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ask a question, add options, and publish.
        </p>
      </div>

      <CreatePollForm onSuccess={onCreated} />
    </div>
  );
}
