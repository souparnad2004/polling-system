import { createHash, randomBytes } from "node:crypto";
import { SessionRepository } from "./session.repository.js";
import type { User } from "../../database/schema/users.js";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export class SessionService {
    constructor(private readonly sessionRepository: SessionRepository) {}

    async create(userId: string): Promise<{ token: string; expiresAt: Date }> {
        const token = randomBytes(32).toString("base64url");

        const tokenHash = this.hashToken(token);

        const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

        await this.sessionRepository.create(userId, tokenHash, expiresAt);

        return {
            token,
            expiresAt,
        };
    }

    async getUserByToken(token: string): Promise<User | null> {
        const tokenHash = this.hashToken(token);

        return this.sessionRepository.findActiveUserByTokenHash(tokenHash);
    }

    async revoke(token: string): Promise<void> {
        const tokenHash = this.hashToken(token);

        await this.sessionRepository.revokeByTokenHash(tokenHash);
    }

    async cleanupExpired(): Promise<void> {
        await this.sessionRepository.deleteExpired();
    }

    private hashToken(token: string): string {
        return createHash("sha256").update(token).digest("hex");
    }
}