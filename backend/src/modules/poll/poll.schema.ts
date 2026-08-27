import {z} from "zod";

export const createPollSchema = z.object({
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().min(1).max(2000).optional(),
    options: z.array(z.string().trim().min(1).max(200)).min(2).max(10),
})

export type CreatePollInput = z.infer<typeof createPollSchema>;

export const pollIdParamsSchema = z.object({
    pollId: z.uuid(),
});

export const updatePollSchema = z.object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().min(1).max(2000).nullable().optional(),
    options: z.array(z.string().trim().min(1).max(200)).min(2).max(10).optional(),
})

export type UpdatePollInput = z.infer<typeof updatePollSchema>;