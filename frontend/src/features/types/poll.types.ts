import { PollResults } from "../api/poll.api";

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
