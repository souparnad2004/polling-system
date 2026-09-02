"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useCurrentUser } from "@/src/features/auth/hooks/use-current-user";

import { PollDetail } from "../components/poll-detail";
import { PollManagementActions } from "../components/poll-management-actions";
import { usePollDetail } from "../hooks/use-poll-detail";
import { pollKeys } from "../hooks/use-polls";

interface ProtectedPollPageProps {
  pollId: string;
}

export function ProtectedPollPage({ pollId }: ProtectedPollPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const { pollQuery, resultsQuery, vote } = usePollDetail(pollId);

  if (pollQuery.isLoading || resultsQuery.isLoading) {
    return <div className="mx-auto max-w-2xl p-6">Loading...</div>;
  }

  if (pollQuery.isError || resultsQuery.isError) {
    return <div className="mx-auto max-w-2xl p-6">Failed to load poll</div>;
  }

  if (!pollQuery.data || !resultsQuery.data) {
    return <div>Not found</div>;
  }

  return (
    <main>
      {pollQuery.data.userId === currentUser?.id && (
        <div className="mx-auto max-w-2xl px-6 pt-6">
          <PollManagementActions
            poll={pollQuery.data}
            onDeleted={() => {
              queryClient.invalidateQueries({
                queryKey: pollKeys.all,
              });

              router.push("/polls");
            }}
          />
        </div>
      )}

      <PollDetail
        poll={pollQuery.data}
        results={resultsQuery.data}
        onVote={vote}
      />
    </main>
  );
}
