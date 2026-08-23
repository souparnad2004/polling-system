import { Server } from "node:http";
import app from "./app.js";
import { env } from "./config/env.js";
import { db } from "./database/client.js";


export async function startupApplication():Promise<Server> {

    await db.execute("SELECT 1");

    return new Promise((resolve) => {
        const server = app.listen(env.PORT, () => {
            console.log(`Polling API listening on port ${env.PORT} in ${env.NODE_ENV} mode`);
        });

        resolve(server);
    });
}

