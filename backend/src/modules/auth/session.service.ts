import { createHash, randomBytes } from "node:crypto";
import { db } from "../../database/client.js";
import { sessions } from "../../database/schema/sessions.js";

const SESSSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days


export class SessionService {
    async create(userId: string): Promise<{token: string; expiresAt: Date}> {
        const token = randomBytes(32).toString("base64url");

        const tokenHash = this.hashToken(token);

        const expiresAt = new Date(Date.now() + SESSSION_TTL_MS);
        
        await db.insert(sessions).values({
            userId,
            tokenHash,
            expiresAt,
        });

        return {
            token,
            expiresAt
        }
    }


    private hashToken(token: string): string {
        return createHash("sha256").update(token).digest("hex");
    }
}