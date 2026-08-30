import { WebSocketServer, WebSocket } from "ws";
import { WebSocketManager } from "./websocket-manager.js";
import { Server as HTTpserver } from "node:http";
import { ClientMessage, ServerMessage, isClientMessage } from "./websocket.types.js";

export class PollWebSocketServer {
  private readonly wss: WebSocketServer;

  constructor(
    private readonly manager: WebSocketManager,
    server: HTTpserver,
  ) {
    this.wss = new WebSocketServer({
      server,
      path: "/ws",
    });

    this.wss.on("connection", (socket) => {
      this.handleConnection(socket);
    });

    const heartBeatIntervar = setInterval(() => {
      this.manager.heartBeat();
    }, 30000);

    this.wss.close(() => {
      clearInterval(heartBeatIntervar);
    })
  }

  private handleConnection(socket: WebSocket) {
    // At the moment the socket connects, there is no authenticated user on the
    // websocket handshake; subscribe/unsubscribe are authorized per-message in
    // the app/service layer instead. Use a placeholder so the connection can be
    // tracked in the manager (userId is not required for anonymous poll watching).
    const client = this.manager.addClient(socket, "");

    socket.on("pong", () => {
        client.isAlive = true;
    })

    socket.on("message", (rawMessage) => {
      this.handleMessage(client, rawMessage.toString());
    });

    socket.on("close", () => {
      this.manager.removeClient(client);
    });
  }

  private handleMessage(
    client: Parameters<WebSocketManager["removeClient"]>[0],
    rawMessage: string,
  ): void {
    let message: ClientMessage;

    try {
      message = JSON.parse(rawMessage) as ClientMessage;
    } catch {
      this.sendError(
        client.socket,
        "INVALID_JSON",
        "Message must contain valid JSON.",
      );

      return;
    }

    if (!isClientMessage(message)) {
      this.sendError(
        client.socket,
        "INVALID_MESSAGE",
        "Unsupported WebSocket message.",
      );

      return;
    }

    switch (message.type) {
      case "SUBSCRIBE_POLL":
        this.manager.subscribe(client, message.pollId);
        break;

      case "UNSUBSCRIBE_POLL":
        this.manager.unsubscribe(client, message.pollId);
        break;
    }
  }

  private sendError(socket: WebSocket, code: string, message: string): void {
    const response: ServerMessage = {
      type: "ERROR",
      code,
      message,
    };

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(response));
    }
  }
}
