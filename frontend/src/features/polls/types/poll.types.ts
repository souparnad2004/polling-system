export interface PollOption {
  id: string;
  text: string;
}

export interface Poll {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: "published" | "draft" | "closed";
  options: PollOption[];
  voteCount?: number;
  authorName?: string | null;
  createdAt?: string;
}

export interface PollAnalyticsTotals {
  responses: number;
  uniqueVoters: number;
  anonymousVotes: number;
  anonymousShare: number;
}

export interface PollAnalyticsTimelinePoint {
  date: string;
  count: number;
  cumulative: number;
}

export interface PollAnalyticsRecentVote {
  createdAt: string;
  isAnonymous: boolean;
}

export interface PollAnalytics {
  poll: {
    id: string;
    title: string;
    status: Poll["status"];
    createdAt?: string;
  };
  totals: PollAnalyticsTotals;
  timeline: PollAnalyticsTimelinePoint[];
  recentVotes: PollAnalyticsRecentVote[];
}

export interface PollResultOption {
  optionId: string;
  option: string;
  voteCount: number;
}

export interface PollResults {
  pollId: string;
  totalVotes: number;
  options: PollResultOption[];
}

export interface CreatePollInput {
  title: string;
  description?: string;
  options: string[];
  allowAnonymous?: boolean;
}

export interface UpdatePollInput {
  title?: string;
  description?: string;
}

export type PollWebSocketMessage =
  | {
      type: "POLL_RESULTS_UPDATED";
      pollId: string;
      results: PollResults;
    }
  | {
      type: "ERROR";
      code: string;
      message: string;
    };
