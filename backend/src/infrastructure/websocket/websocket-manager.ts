import { WebSocket } from "ws";
import type { PollResult, ServerMessage } from "./websocket.types.js";

export interface ClientConnection {
  socket: WebSocket;
  userId: string;
  subscribedPolls: Set<string>;
  isAlive: boolean;
}

export class WebSocketManager {
  private readonly clients = new Set<ClientConnection>();

  addClient(socket: WebSocket, userId: string) {
    const client: ClientConnection = {
      socket,
      subscribedPolls: new Set(),
      userId,
      isAlive: true,
    };

    this.clients.add(client);

    return client;
  }

  removeClient(client: ClientConnection) {
    this.clients.delete(client);
  }

  subscribe(client: ClientConnection, pollId: string) {
    client.subscribedPolls.add(pollId);
  }

  unsubscribe(client: ClientConnection, pollId: string) {
    client.subscribedPolls.delete(pollId);
  }

  broadcastPollResult(pollId: string, results: PollResult[]) {
    const message: ServerMessage = {
      type: "POLL_RESULT_UPDATED",
      pollId,
      results,
    };

    const payload = JSON.stringify(message);

    for (const client of this.clients) {
      if (!client.subscribedPolls.has(pollId)) {
        continue;
      }

      if(client.socket.readyState !== WebSocket.OPEN) {
        continue;
      }

      client.socket.send(payload);
    }
  }

  getClientCount() {
    return this.clients.size;
  }

  heartBeat(): void {
    for (const client of this.clients) {
        if(!client.isAlive) {
            client.socket.terminate();
            this.clients.delete(client);
            continue;
        }

        client.isAlive = false;
        client.socket.ping();
    }
  }
}
