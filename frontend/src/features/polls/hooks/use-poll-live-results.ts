"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { PollWebSocketConnection } from "../utils/poll-websocket";
import { PollResults } from "../../api/poll.api";

export const pollQueryKeys = {
    all: ["polls"] as const,

    results: (pollId: string) =>
        [...pollQueryKeys.all, pollId, "results"] as const,
};
;

export function usePollLiveResults(
  pollId: string,
): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    const connection =
      new PollWebSocketConnection({
        pollId,

        onResultsUpdated: (
          results: PollResults,
        ) => {
          queryClient.setQueryData(
            pollQueryKeys.results(pollId),
            results,
          );
        },

        onReconnect: () => {
          void queryClient.invalidateQueries({
            queryKey:
              pollQueryKeys.results(
                pollId,
              ),
          });
        },
      });

    connection.connect();

    return () => {
      connection.close();
    };
  }, [
    pollId,
    queryClient,
  ]);
}