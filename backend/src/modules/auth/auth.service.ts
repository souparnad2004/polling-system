import { randomBytes } from "node:crypto";
import { PasswordService } from "./password.service.js";
import { db } from "../../database/client.js";
import type { LoginInput, PublicUser, RegisterInput } from "./auth.schema.js";
import { type User, users } from "../../database/schema/users.js";
import { credentials } from "../../database/schema/credentials.js";
import { ConflictError } from "../../shared/errors/conflict-error.js";
import { eq } from "drizzle-orm";
import { AuthenticationError } from "../../shared/errors/authentication-error.js";

function isUniqueViolation(error: unknown, constraintName?: string): boolean {
  const pgError = error as { code?: string; constraint?: string };
  if (pgError?.code !== "23505") return false;
  return constraintName ? pgError.constraint === constraintName : true;
}

let dummyHash: string | null = null;

// Returns a valid argon2id hash of a random string, used to equalize
// response timing when the email doesn't exist (prevents user enumeration).
async function getDummyHash(passwordService: PasswordService): Promise<string> {
  if (!dummyHash) {
    dummyHash = await passwordService.hash(randomBytes(32).toString("hex"));
  }
  return dummyHash;
}

export class AuthService {
  constructor(private readonly passwordService: PasswordService) {}

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
        const [user] = await tx
          .insert(users)
          .values({
            email: input.email,
            displayName: input.displayName,
          })
          .returning({
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
    const user = await db.query.users.findFirst({
      where: eq(users.email, input.email),
    });

    const credential = user
      ? await db.query.credentials.findFirst({
          where: eq(credentials.userId, user.id),
        })
      : null;

    // Always run argon2.verify() (against the real hash, or a dummy hash for
    // unknown emails) so response timing doesn't reveal whether an email is
    // registered.
    const passwordHash =
      credential?.passwordHash ?? (await getDummyHash(this.passwordService));

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
