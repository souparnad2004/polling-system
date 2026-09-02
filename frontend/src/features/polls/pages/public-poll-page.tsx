"use client";

import Link from "next/link";

import { PollDetail } from "../components/poll-detail";
import { usePollDetail } from "../hooks/use-poll-detail";

interface PublicPollPageProps {
  pollId: string;
}

export function PublicPollPage({ pollId }: PublicPollPageProps) {
  const { pollQuery, resultsQuery, vote } = usePollDetail(pollId);

  if (pollQuery.isLoading || resultsQuery.isLoading) {
    return <div className="mx-auto max-w-2xl p-6">Loading...</div>;
  }

  if (pollQuery.isError || resultsQuery.isError) {
    return <div className="mx-auto max-w-2xl p-6">Failed to load poll</div>;
  }

  if (!pollQuery.data || !resultsQuery.data) {
    return <div className="mx-auto max-w-2xl p-6">Not found</div>;
  }

  return (
    <main className="min-h-svh">
      <header className="mx-auto flex h-16 w-full max-w-2xl items-center justify-between px-6">
        <Link href="/" className="text-sm font-semibold">
          Polling System
        </Link>

        <Link
          href="/login"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Sign in
        </Link>
      </header>

      <PollDetail
        poll={pollQuery.data}
        results={resultsQuery.data}
        onVote={vote}
      />
    </main>
  );
}
