import {z} from "zod";

export const createPollSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Question is required")
    .max(200, "Question is too long"),

  description: z
    .string()
    .trim()
    .max(1000, "Description is too long")
    .optional(),

  options: z
    .array(
      z.object({
        text: z
          .string()
          .trim()
          .min(1, "Option cannot be empty")
          .max(100, "Option is too long"),
      }),
    )
    .min(2, "At least two options are required")
    .max(10, "Maximum 10 options allowed"),

  allowAnonymous: z.boolean().optional(),
});
