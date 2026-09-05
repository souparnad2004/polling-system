"use client";

import { useQuery } from "@tanstack/react-query";
import { getPollAnalytics, getPolls, getTrendingPolls } from "../api/poll.api";

export const pollKeys = {
  all: ["polls"] as const,
  trending: ["polls", "trending"] as const,
  detail: (pollId: string) => [...pollKeys.all, pollId] as const,
  results: (pollId: string) => [...pollKeys.all, pollId, "results"] as const,
  analytics: (pollId: string) => [...pollKeys.all, pollId, "analytics"] as const,
};

export function usePolls() {
  return useQuery({
    queryKey: pollKeys.all,
    queryFn: getPolls,
  });
}

export function useTrendingPolls() {
  return useQuery({
    queryKey: pollKeys.trending,
    queryFn: getTrendingPolls,
  });
}

export function usePollAnalytics(pollId: string) {
  return useQuery({
    queryKey: pollKeys.analytics(pollId),
    queryFn: () => getPollAnalytics(pollId),
  });
}