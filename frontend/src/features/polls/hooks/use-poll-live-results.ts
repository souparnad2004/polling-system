"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { PollWebSocketConnection } from "../utils/poll-websocket";
import type { PollResults } from "../types/poll.types";
import { pollKeys } from "./use-polls";

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
            pollKeys.results(pollId),
            results,
          );
        },

        onReconnect: () => {
          void queryClient.invalidateQueries({
            queryKey:
              pollKeys.results(
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
