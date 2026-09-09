import {z} from "zod";

export const createPollSchema = z.object({
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().min(1).max(2000).optional(),
    options: z.array(z.string().trim().min(1).max(200)).min(2).max(10),
    allowAnonymous: z.boolean().optional(),
    allowVoteChange: z.boolean().optional(),
    // "draft" (default) saves without publishing; "published" creates the poll
    // live immediately so voters can react to the shared link right away.
    publishedAt: z.coerce.date().optional(),
    closedAt: z.coerce.date().optional(),
    status: z.enum(["draft", "published"]).optional(),
})

export type CreatePollInput = z.infer<typeof createPollSchema>;

export const pollIdParamsSchema = z.object({
    pollId: z.uuid(),
});

export const updatePollSchema = z.object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().min(1).max(2000).nullable().optional(),
    options: z.array(z.string().trim().min(1).max(200)).min(2).max(10).optional(),
    allowAnonymous: z.boolean().optional(),
    allowVoteChange: z.boolean().optional(),
})

export type UpdatePollInput = z.infer<typeof updatePollSchema>;

export const publishPollSchema = z.object({
    closedAt: z.coerce.date().refine((date) => date > new Date(), "closedAt must be in the future").optional(),
});

export type PublishPollInput = z.infer<typeof publishPollSchema>;

