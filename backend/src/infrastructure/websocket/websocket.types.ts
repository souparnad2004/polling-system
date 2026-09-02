export type ClientMessage = 
| {
    type: "SUBSCRIBE_POLL",
    pollId: string,
    }
| {
    type: "UNSUBSCRIBE_POLL",
    pollId: string,
    }



export interface PollResultOption {
  optionId: string;
  option: string;
  voteCount: number;
}

export interface PollResultsPayload {
  pollId: string;
  totalVotes: number;
  options: PollResultOption[];
}


export type ServerMessage =
  | {
      type: "POLL_RESULTS_UPDATED";
      pollId: string;
      results: PollResultsPayload;
    }
  | {
      type: "ERROR";
      code: string;
      message: string;
    };