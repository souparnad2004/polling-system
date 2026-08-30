import { randomBytes } from "node:crypto";
import { PasswordService } from "./password.service.js";
import { AuthRepository } from "./auth.repository.js";
import { db } from "../../infrastructure/database/client.js";
import type { LoginInput, PublicUser, RegisterInput } from "./auth.schema.js";
import type { User } from "../../infrastructure/database/schema/users.js";
import { ConflictError } from "../../shared/errors/conflict-error.js";
import { AuthenticationError } from "../../shared/errors/authentication-error.js";
import { isUniqueViolation } from "../../shared/errors/db-error.js";

export class AuthService {
    private dummyHash: string | null = null;

    constructor(
        private readonly passwordService: PasswordService,
        private readonly authRepository: AuthRepository,
    ) {}

    // Response timing when the email doesn't exist (prevents user enumeration).
    // Cached per-instance so the argon2 cost is paid only once.
    private async getDummyHash(): Promise<string> {
        if (!this.dummyHash) {
            this.dummyHash = await this.passwordService.hash(
                randomBytes(32).toString("hex"),
            );
        }
        return this.dummyHash;
    }

    private toPublicUser(user: User): PublicUser {
        return {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            status: user.status,
            createdAt: user.createdAt,
        };
    }

    async register(input: RegisterInput): Promise<PublicUser> {
        const passwordHash = await this.passwordService.hash(input.password);

        try {
            return await db.transaction(async (tx) => {
                const user = await this.authRepository.createUser(tx, {
                    email: input.email,
                    displayName: input.displayName,
                });

                await this.authRepository.createCredential(tx, {
                    userId: user.id,
                    passwordHash,
                });

                return this.toPublicUser(user);
            });
        } catch (error) {
            if (isUniqueViolation(error, "users_email_unique")) {
                throw new ConflictError("An account with this email already exists");
            }
            throw error;
        }
    }

    async login(input: LoginInput): Promise<PublicUser> {
        const user = await this.authRepository.findUserByEmail(input.email);

        const credential = user
            ? await this.authRepository.findCredentialByUserId(user.id)
            : null;

        // Always run argon2.verify() (against the real hash, or a dummy hash for
        // unknown emails) so response timing doesn't reveal whether an email is
        // registered.
        const passwordHash = credential?.passwordHash ?? (await this.getDummyHash());

        const passwordMatches = await this.passwordService.verify(
            input.password,
            passwordHash,
        );

        if (
            !user ||
            user.status !== "active" ||
            !credential ||
            !passwordMatches
        ) {
            throw new AuthenticationError();
        }

        return this.toPublicUser(user);
    }
}
