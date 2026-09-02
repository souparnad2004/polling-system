import {IncomingMessage, Server, ServerResponse} from "node:http";

import { startupApplication } from "./startup.js";
import { pool } from "./infrastructure/database/client.js";

let server: Server<typeof IncomingMessage, typeof ServerResponse>;
let isShuttingDown = false;

async function bootstrap(): Promise<void> {
    server = await startupApplication();
}

async function shutdown(signal: string): Promise<void> {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log(`Received ${signal}, shutting down...`);

    if(server) {
        await new Promise<void>((resolve) => {
            server.close(() => resolve());
        });
    }

    await pool.end();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

bootstrap()
.catch((error: unknown) => {
    if(error instanceof Error) {
        console.error(error.message);
    }
    process.exit(1);
});