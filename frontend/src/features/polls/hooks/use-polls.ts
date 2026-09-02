"use client";

import { useQuery } from "@tanstack/react-query";
import { getPolls } from "../api/poll.api";

export const pollKeys = {
  all: ["polls"] as const,
  detail: (pollId: string) => [...pollKeys.all, pollId] as const,
  results: (pollId: string) => [...pollKeys.all, pollId, "results"] as const,
};

export function usePolls() {
  return useQuery({
    queryKey: pollKeys.all,
    queryFn: getPolls,
  });
}