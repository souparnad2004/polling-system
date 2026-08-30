import { eq } from "drizzle-orm";
import { db } from "../../infrastructure/database/client.js";
import { credentials } from "../../infrastructure/database/schema/credentials.js";
import { type User, users } from "../../infrastructure/database/schema/users.js";

export type DatabaseTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export class AuthRepository {
    async createUser(tx: DatabaseTransaction, input: { email: string; displayName?: string }) {
        const [result] = await tx.insert(users).values({
            email: input.email,
            displayName: input.displayName,
        }).returning();

        return result;
    }

    async createCredential(tx: DatabaseTransaction, input: { userId: string; passwordHash: string }) {
        await tx.insert(credentials).values({
            userId: input.userId,
            passwordHash: input.passwordHash,
        });
    }

    async findUserByEmail(email: string): Promise<User | null> {
        const result = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        return result ?? null;
    }

    async findCredentialByUserId(userId: string) {
        const result = await db.query.credentials.findFirst({
            where: eq(credentials.userId, userId),
        });

        return result ?? null;
    }
}