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
