import { createHash, randomBytes } from "node:crypto";
import { db } from "../../database/client.js";
import { sessions } from "../../database/schema/sessions.js";
import { users } from "../../database/schema/users.js";
import type { User } from "../../database/schema/users.js";
import { and, eq, gt, isNull, lt } from "drizzle-orm";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export class SessionService {
  async create(userId: string): Promise<{ token: string; expiresAt: Date }> {
    const token = randomBytes(32).toString("base64url");

    const tokenHash = this.hashToken(token);

    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    await db.insert(sessions).values({
      userId,
      tokenHash,
      expiresAt,
    });

    return {
      token,
      expiresAt,
    };
  }

  async getUserByToken(token: string): Promise<User | null> {
    const tokenHash = this.hashToken(token);

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

  async revoke(token: string): Promise<void> {
    const tokenHash = this.hashToken(token);

    await db.update(sessions).set({
      revokedAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(sessions.tokenHash, tokenHash));
  }

  async cleanupExpired(): Promise<void> {
    await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
  }

  private hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }
}