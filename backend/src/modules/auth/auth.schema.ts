import {z} from "zod";

export const registerSchema = z.object({
    email: z.email().max(320),
    password: z.string().min(8).max(128),

    displayName: z.string().trim().min(1).max(100).optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>;