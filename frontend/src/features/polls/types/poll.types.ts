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
  allowAnonymous?: boolean;
  allowVoteChange?: boolean;
  options: PollOption[];
  voteCount?: number;
  authorName?: string | null;
  createdAt?: string;
  publishedAt?: string;
  closedAt?: string;
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
  // displayName of the authenticated voter; null/undefined when the vote was
  // anonymous or the voter has not set a display name.
  username?: string | null;
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
  allowVoteChange?: boolean;
  status?: "draft" | "published";
  closedAt?: string;
}

export interface UpdatePollInput {
  title?: string;
  description?: string | null;
  options?: string[];
  allowAnonymous?: boolean;
  allowVoteChange?: boolean;
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
