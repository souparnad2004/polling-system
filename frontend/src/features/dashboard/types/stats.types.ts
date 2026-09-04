import type { Poll } from "@/src/features/polls/types/poll.types";

export interface OverviewMetrics {
  totalPolls: number;
  totalVotes: number;
  responses: number;
  respondedPolls: number;
  engagementRate: number;
}

export interface ActivityPoint {
  date: string;
  count: number;
}

export interface RecentPollStats {
  id: string;
  title: string;
  status: Poll["status"];
  createdAt: string;
  voteCount: number;
}

export interface PollOverview {
  metrics: OverviewMetrics;
  activity: ActivityPoint[];
  recentPolls: RecentPollStats[];
}