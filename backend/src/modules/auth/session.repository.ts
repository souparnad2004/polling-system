import { and, eq, gt, isNull, lt } from "drizzle-orm";
import { db } from "../../infrastructure/database/client.js";
import { sessions } from "../../infrastructure/database/schema/sessions.js";
import { type User, users } from "../../infrastructure/database/schema/users.js";

export class SessionRepository {
    async create(userId: string, tokenHash: string, expiresAt: Date) {
        const [result] = await db.insert(sessions).values({
            userId,
            tokenHash,
            expiresAt,
        }).returning();

        return result;
    }

    async findActiveUserByTokenHash(tokenHash: string): Promise<User | null> {
        const result = await db
            .select({
                id: users.id,
                email: users.email,
                displayName: users.displayName,
                status: users.status,
                createdAt: users.createdAt,
                updatedAt: users.updatedAt,
            })
            .from(sessions)
            .innerJoin(users, eq(users.id, sessions.userId))
            .where(
                and(
                    eq(sessions.tokenHash, tokenHash),
                    isNull(sessions.revokedAt),
                    gt(sessions.expiresAt, new Date()),
                ),
            )
            .limit(1);

        return result[0] ?? null;
    }

    async revokeByTokenHash(tokenHash: string): Promise<void> {
        await db.update(sessions).set({
            revokedAt: new Date(),
            updatedAt: new Date(),
        }).where(eq(sessions.tokenHash, tokenHash));
    }

    async deleteExpired(): Promise<void> {
        await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
    }
}