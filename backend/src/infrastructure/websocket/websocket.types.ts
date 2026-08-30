export type ClientMessage = 
| {
    type: "SUBSCRIBE_POLL",
    pollId: string,
    }
| {
    type: "UNSUBSCRIBE_POLL",
    pollId: string,
    }


export interface PollResult {
  optionId: string;
  option: string;
  voteCount: number;
}
export type ServerMessage = 
| {
    type: "POLL_RESULT_UPDATED",
    pollId: string,
    results: PollResult[]
}
| {
    type: "ERROR",
    code: string,
    message: string
}
/**
 * Type guard for validating inbound WebSocket messages.
 * Returns `true` only for a well-formed `ClientMessage`
 * (a known message type with a non-empty `pollId`).
 */
export function isClientMessage(value: unknown): value is ClientMessage {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const message = value as Record<string, unknown>;

  if (
    message.type !== "SUBSCRIBE_POLL" &&
    message.type !== "UNSUBSCRIBE_POLL"
  ) {
    return false;
  }

  return typeof message.pollId === "string" && message.pollId.length > 0;
}