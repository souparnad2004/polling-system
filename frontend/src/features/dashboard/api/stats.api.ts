import { apiClient } from "@/lib/api/client";

import type { PollOverview } from "../types/stats.types";

export async function getPollOverview(): Promise<PollOverview> {
  const response = await apiClient<{ overview: PollOverview }>(
    "/api/stats/overview",
  );

  return response.overview;
}