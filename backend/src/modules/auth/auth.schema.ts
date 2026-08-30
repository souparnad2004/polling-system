import { z } from "zod";
import type { User } from "../../infrastructure/database/schema/users.js";

export const registerSchema = z.object({
    email: z.email().max(320).trim().toLowerCase(),
    password: z.string().min(8).max(128),

    displayName: z.string().trim().min(1).max(100).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.email().max(320).trim().toLowerCase(),
    password: z.string().min(1).max(128),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * The user shape exposed to clients.
 * `updatedAt` is a server-internal timestamp and is intentionally omitted.
 */
export type PublicUser = Omit<User, "updatedAt">;