import { z } from "zod";

export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "Display name is required")
    .max(100, "Display name is too long"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;