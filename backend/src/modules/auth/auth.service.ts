import { PasswordService } from "./password.service.js";
import { db } from "../../database/client.js";
import type { RegisterInput } from "./auth.schema.js";
import { users } from "../../database/schema/users.js";
import type { User } from "../../database/schema/users.js";
import { credentials } from "../../database/schema/credentials.js";
import { ConflictError } from "../../shared/errors/conflict-error.js";

function isUniqueViolation(error: unknown, constraintName?: string): boolean {
    const pgError = error as { code?: string; constraint?: string };
    if (pgError?.code !== "23505") return false;
    return constraintName ? pgError.constraint === constraintName : true;
}

export class AuthService {
    constructor(private readonly passwordService: PasswordService) {}

    async register(input: RegisterInput): Promise<User> {
        const passwordHash = await this.passwordService.hash(input.password);

        try {
            return await db.transaction(async (tx) => {
                const [user] = await tx.insert(users).values({
                    email: input.email,
                    displayName: input.displayName,
                }).returning({
                    id: users.id,
                    email: users.email,
                    displayName: users.displayName,
                    status: users.status,
                    createdAt: users.createdAt,
                    updatedAt: users.updatedAt,
                });

                await tx.insert(credentials).values({
                    userId: user.id,
                    passwordHash,
                })
                
                return user;
            });
        } catch (error) {
            if (isUniqueViolation(error, "users_email_unique")) {
                throw new ConflictError("An account with this email already exists");
            }
            throw error;
        }
    }
}