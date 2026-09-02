import type {
  PollResults,
} from "../../api/poll.api";
import { PollWebSocketMessage } from "../../types/poll.types";

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL;

if (!WS_URL) {
  throw new Error(
    "NEXT_PUBLIC_WS_URL is not configured.",
  );
}

interface PollWebSocketOptions {
  pollId: string;

  onResultsUpdated: (
    results: PollResults,
  ) => void;

  onReconnect: () => void;
}

export class PollWebSocketConnection {
  private socket: WebSocket | null = null;

  private reconnectTimer:
    | ReturnType<typeof setTimeout>
    | null = null;

  private reconnectAttempts = 0;

  private closedByClient = false;

  constructor(
    private readonly options: PollWebSocketOptions,
  ) {}

  connect(): void {
    this.closedByClient = false;

    this.socket = new WebSocket(WS_URL!);

    this.socket.addEventListener(
      "open",
      this.handleOpen,
    );

    this.socket.addEventListener(
      "message",
      this.handleMessage,
    );

    this.socket.addEventListener(
      "close",
      this.handleClose,
    );
  }

  close(): void {
    this.closedByClient = true;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.socket?.close();

    this.socket = null;
  }

  private readonly handleOpen = (): void => {
    const wasReconnect =
      this.reconnectAttempts > 0;

    this.reconnectAttempts = 0;

    this.subscribe();

    if (wasReconnect) {
      this.options.onReconnect();
    }
  };

  private readonly handleMessage = (
    event: MessageEvent<string>,
  ): void => {
    let message: PollWebSocketMessage;

    try {
      message = JSON.parse(
        event.data,
      ) as PollWebSocketMessage;
    } catch {
      return;
    }

    if (
      message.type ===
        "POLL_RESULTS_UPDATED" &&
      message.pollId ===
        this.options.pollId
    ) {
      this.options.onResultsUpdated(
        message.results,
      );
    }
  };

  private readonly handleClose = (): void => {
    this.socket = null;

    if (this.closedByClient) {
      return;
    }

    this.scheduleReconnect();
  };

  private subscribe(): void {
    if (
      this.socket?.readyState !==
      WebSocket.OPEN
    ) {
      return;
    }

    this.socket.send(
      JSON.stringify({
        type: "SUBSCRIBE_POLL",
        pollId: this.options.pollId,
      }),
    );
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts += 1;

    const delay = Math.min(
      1000 * 2 ** (this.reconnectAttempts - 1),
      30_000,
    );

    this.reconnectTimer = setTimeout(
      () => {
        this.connect();
      },
      delay,
    );
  }
}