import { Server } from "node:http";
import app from "./app.js";
import { env } from "./config/env.js";
import { db } from "./database/client.js";
import { dependencies } from "./container.js";

const SESSION_CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

export async function startupApplication(): Promise<Server> {
  await db.execute("SELECT 1");

  const cleanupInterval = setInterval(() => {
    dependencies.sessionService.cleanupExpired().catch((error) => {
      console.error("[SessionCleanup]", error);
    });
  }, SESSION_CLEANUP_INTERVAL_MS);


  cleanupInterval.unref();

  return new Promise((resolve) => {
    const server = app.listen(env.PORT, () => {
      console.log(`Polling API listening on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

    resolve(server);
  });
}
