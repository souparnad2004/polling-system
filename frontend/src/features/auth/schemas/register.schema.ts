import {z} from "zod";

export const registerSchema = z.object({
    displayName: z
        .string()
        .trim()
        .max(100, "Name is too long")
        .optional(),
    email: z
        .string()
        .trim()
        .toLowerCase()
        .pipe(
            z
                .email("Enter a valid email")
                .max(320, "Email is too long"),
        ),
    password: z
        .string()
        .min(8, "Password is too short")
        .max(100, "Password is too long"),
});

export type RegisterInput = z.infer<typeof registerSchema>;