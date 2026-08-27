import { eq } from "drizzle-orm";
import { db } from "../../database/client.js";
import { users } from "../../database/schema/users.js";

export class UserRepository {
  async findById(userId: string) {
    const result = await db
      .select({
        id: users.id,
        email: users.email,
        displayName: users.displayName,
        status: users.status,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return result[0] ?? null;
  }

  async updateProfile(userId: string, displayName: string) {
    const result = await db
      .update(users)
      .set({ displayName: displayName })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
        displayName: users.displayName,
        status: users.status,
        createdAt: users.createdAt,
      });

    return result[0] ?? null;
  }
}
