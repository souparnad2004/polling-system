import { z } from "zod";

export const updateUserProfileSchema = z.object({
    displayName: z.string()
    .trim()
    .min(1)
    .max(100),
})

export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
