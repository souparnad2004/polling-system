"use client";

import { useQuery } from "@tanstack/react-query";

import { getPollOverview } from "../api/stats.api";

export const statsKeys = {
  all: ["stats"] as const,

  overview: () => [...statsKeys.all, "overview"] as const,
};

export function usePollOverview() {
  return useQuery({
    queryKey: statsKeys.overview(),
    queryFn: getPollOverview,

    retry: false,
    staleTime: 30 * 1000,
  });
}